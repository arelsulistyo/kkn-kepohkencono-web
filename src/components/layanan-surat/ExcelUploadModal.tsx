"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { authFetch } from "@/lib/auth-fetch";
import ModalShell from "./ModalShell";

interface SheetInfo {
  name: string;
  rowCount: number;
  columnCount: number;
  headers: string[];
  hasData: boolean;
}

interface UploadResponse {
  message: string;
  summary: {
    totalRowsProcessed: number;
    successfulUploads: number;
    newRecords: number;
    updatedRecords: number;
    errorCount: number;
    sheetName: string;
    uploadedRecords: Array<{
      id: string;
      rowIndex: number;
      isUpdate?: boolean;
    }>;
    errors: Array<{ rowIndex: number; error: string }>;
  };
}

/** An error whose message is already written for the user. */
class UploadProblem extends Error {}

/** Plain-language message for a failed /api/sheets or /api/upload response. */
async function describeFailure(response: Response): Promise<UploadProblem> {
  const data = await response.json().catch(() => ({}));
  const serverError: string = data.error ?? "";
  const message = (() => {
    switch (response.status) {
      case 401:
        return "Sesi login berakhir. Silakan login kembali.";
      case 403:
        return "Akun ini tidak memiliki izin untuk memperbarui data penduduk.";
      case 413:
        return "Ukuran file terlalu besar.";
      case 400:
        if (serverError.includes("Invalid file type")) return "File harus berformat Excel (.xlsx atau .xls).";
        if (serverError.includes("not found")) return "Sheet yang dipilih tidak ditemukan di dalam file.";
        if (serverError.includes("empty")) return "Sheet yang dipilih kosong.";
        if (serverError.includes("headers")) return "Baris pertama sheet harus berisi judul kolom.";
        if (serverError.includes("exceeds")) return "Baris awal melebihi jumlah data di sheet.";
        if (serverError.includes("Row")) return "Nomor baris awal atau akhir tidak valid.";
        return "File atau pengaturan upload tidak lengkap. Periksa kembali file Excel Anda.";
      default:
        return "Terjadi kesalahan di server. Silakan coba lagi nanti.";
    }
  })();
  console.error("Excel upload gagal:", response.status, serverError);
  return new UploadProblem(message);
}

const userMessage = (err: unknown, fallback: string) =>
  err instanceof UploadProblem
    ? err.message
    : err instanceof TypeError
      ? "Tidak dapat terhubung ke server. Periksa koneksi internet Anda."
      : fallback;

interface ExcelUploadModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ExcelUploadModal({
  isOpen,
  onOpenChange,
}: ExcelUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [sheets, setSheets] = useState<SheetInfo[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>("");
  const [rowStart, setRowStart] = useState<string>("2");
  const [rowEnd, setRowEnd] = useState<string>("100");
  const [isLoadingSheets, setIsLoadingSheets] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
  const [error, setError] = useState<string>("");
  const [uploadStep, setUploadStep] = useState(1);
  const { toast } = useToast();
  const { user, loading } = useAuth();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setSheets([]);
    setSelectedSheet("");
    setUploadResult(null);
    setError("");

    // Get sheet information
    setIsLoadingSheets(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await authFetch("/api/sheets", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw await describeFailure(response);
      }
      const data = await response.json();

      setSheets(data.sheets);
      setUploadStep(2); // Move to step 2 after successful file load
      toast({
        title: "File berhasil dimuat",
        description: `Ditemukan ${data.totalSheets} sheet dalam file.`,
      });
    } catch (err) {
      const errorMessage = userMessage(err, "File tidak dapat dibaca. Pastikan file Excel tidak rusak.");
      setError(errorMessage);
      toast({
        title: "Gagal membaca file",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoadingSheets(false);
    }
  };

  const handleUpload = async () => {
    if (!file || !selectedSheet || !rowStart || !rowEnd) {
      setError("Harap lengkapi semua field yang diperlukan");
      return;
    }

    const startRow = parseInt(rowStart);
    const endRow = parseInt(rowEnd);

    if (startRow < 1 || endRow < startRow) {
      setError("Baris awal minimal 1, dan baris akhir tidak boleh lebih kecil dari baris awal.");
      return;
    }

    setIsUploading(true);
    setError("");
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("sheetName", selectedSheet);
      formData.append("rowStart", rowStart);
      formData.append("rowEnd", rowEnd);

      const response = await authFetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw await describeFailure(response);
      }
      const data = await response.json();

      setUploadResult(data);
      const { newRecords, updatedRecords } = data.summary;
      let description = `Berhasil memproses ${data.summary.successfulUploads} data dari sheet "${selectedSheet}".`;
      if (newRecords > 0 && updatedRecords > 0) {
        description += ` (${newRecords} baru, ${updatedRecords} diperbarui)`;
      } else if (newRecords > 0) {
        description += ` (${newRecords} data baru)`;
      } else if (updatedRecords > 0) {
        description += ` (${updatedRecords} data diperbarui)`;
      }
      toast({
        title: "Upload berhasil",
        description: description,
      });
    } catch (err) {
      const errorMessage = userMessage(err, "Upload gagal. Silakan coba lagi.");
      setError(errorMessage);
      toast({
        title: "Upload gagal",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const selectedSheetInfo = sheets.find(
    (sheet) => sheet.name === selectedSheet
  );

  const resetUploadProcess = () => {
    setFile(null);
    setSheets([]);
    setSelectedSheet("");
    setRowStart("2");
    setRowEnd("100");
    setUploadResult(null);
    setError("");
    setUploadStep(1);
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      resetUploadProcess();
    }
    onOpenChange(open);
  };

  // Hide modal if user is not authenticated or still loading
  if (loading || !user) {
    return null;
  }

  return (
    <ModalShell
      open={isOpen}
      onOpenChange={handleDialogClose}
      title="Upload Data Excel"
      description="Upload file Excel untuk memperbarui data warga secara massal"
      size="wide"
    >

        <div className="space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                    step <= uploadStep
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  } ${step === uploadStep ? "ring-4 ring-green-200" : ""}`}
                >
                  {step < uploadStep ? (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    step
                  )}
                </div>
                {step < 4 && (
                  <div
                    className={`h-1 w-8 transition-all duration-300 ${
                      step < uploadStep ? "bg-green-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="text-center mb-6">
            <h4 className="text-lg font-semibold text-gray-900">
              {uploadStep === 1 && "Pilih File Excel"}
              {uploadStep === 2 && "Pilih Sheet"}
              {uploadStep === 3 && "Atur Rentang Baris"}
              {uploadStep === 4 && "Upload & Proses"}
            </h4>
            <p className="text-gray-600 text-sm">
              {uploadStep === 1 &&
                "Upload file Excel yang berisi data penerima"}
              {uploadStep === 2 && "Pilih sheet mana yang berisi data Anda"}
              {uploadStep === 3 && "Tentukan baris mana yang akan diproses"}
              {uploadStep === 4 && "Tinjau dan mulai pembuatan massal"}
            </p>
          </div>

          {/* Step 1: File Selection */}
          {uploadStep === 1 && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-green-300 rounded-xl p-8 text-center hover:border-green-400 transition-colors duration-300">
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="excel-upload-modal"
                />
                <label htmlFor="excel-upload-modal" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-green-100 rounded-full">
                      <Upload className="h-12 w-12 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Choose Excel File
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Klik untuk browse atau seret dan lepas file .xlsx atau
                        .xls Anda
                      </p>
                    </div>
                  </div>
                </label>
              </div>

              {isLoadingSheets && (
                <div className="flex justify-center">
                  <Alert className="border-green-200 bg-green-50 w-fit">
                    <FileSpreadsheet className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-gray-900">
                      Membaca file dan menganalisis sheet...
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Sheet Selection */}
          {uploadStep === 2 && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-900">
                    File berhasil diupload: {file?.name}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Sheet yang Tersedia:
                </h4>
                <div className="grid gap-3">
                  {sheets.map((sheet) => (
                    <button
                      key={sheet.name}
                      onClick={() => {
                        setSelectedSheet(sheet.name);
                        setUploadStep(3);
                      }}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded">
                          <FileSpreadsheet className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="font-medium text-gray-900">
                          {sheet.name}
                        </span>
                      </div>
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex mt-6">
                <Button
                  onClick={() => setUploadStep(1)}
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 py-3"
                >
                  Kembali ke Pilihan File
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Row Range Selection */}
          {uploadStep === 3 && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="h-6 w-6 text-green-600" />
                  <span className="font-semibold text-green-900">
                    Sheet Terpilih: {selectedSheet}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="block text-sm font-semibold text-gray-700">
                    Baris Awal
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    value={rowStart}
                    onChange={(e) => setRowStart(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="2"
                  />
                  <p className="text-xs text-gray-500">
                    Biasanya baris 2 (setelah header)
                  </p>
                </div>

                <div className="space-y-3">
                  <Label className="block text-sm font-semibold text-gray-700">
                    Baris Akhir
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    value={rowEnd}
                    onChange={(e) => setRowEnd(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="100"
                  />
                  <p className="text-xs text-gray-500">
                    Baris terakhir yang akan diproses
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={() => setUploadStep(2)}
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 py-3"
                >
                  Kembali ke Pilihan Sheet
                </Button>
                <Button
                  onClick={() => setUploadStep(4)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3"
                >
                  Lanjut ke Review
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Review and Upload */}
          {uploadStep === 4 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Review Pengaturan Upload</CardTitle>
                  <CardDescription>
                    Pastikan pengaturan berikut sudah benar sebelum memulai
                    upload
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>File:</strong> {file?.name}
                      </div>
                      <div>
                        <strong>Sheet:</strong> {selectedSheet}
                      </div>
                      <div>
                        <strong>Baris Awal:</strong> {rowStart}
                      </div>
                      <div>
                        <strong>Baris Akhir:</strong> {rowEnd}
                      </div>
                    </div>
                    {selectedSheetInfo && (
                      <div className="text-sm text-gray-600">
                        <strong>Info Sheet:</strong>{" "}
                        {selectedSheetInfo.rowCount} baris,{" "}
                        {selectedSheetInfo.columnCount} kolom
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button
                  onClick={() => setUploadStep(3)}
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 py-3"
                >
                  Kembali ke Pengaturan
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3"
                >
                  {isUploading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Mengupload...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Mulai Upload
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mt-6">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}

          {/* Upload Result */}
          {uploadResult && (
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Upload Selesai
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid gap-2 text-sm">
                      <div>
                        Sheet yang diproses:{" "}
                        <strong>{uploadResult.summary.sheetName}</strong>
                      </div>
                      <div>
                        Total baris diproses:{" "}
                        <strong>
                          {uploadResult.summary.totalRowsProcessed}
                        </strong>
                      </div>
                      <div>
                        Upload berhasil:{" "}
                        <strong className="text-green-600">
                          {uploadResult.summary.successfulUploads}
                        </strong>
                      </div>
                      {uploadResult.summary.newRecords > 0 && (
                        <div>
                          Data baru:{" "}
                          <strong className="text-blue-600">
                            {uploadResult.summary.newRecords}
                          </strong>
                        </div>
                      )}
                      {uploadResult.summary.updatedRecords > 0 && (
                        <div>
                          Data diperbarui:{" "}
                          <strong className="text-orange-600">
                            {uploadResult.summary.updatedRecords}
                          </strong>
                        </div>
                      )}
                      {uploadResult.summary.errorCount > 0 && (
                        <div>
                          Error:{" "}
                          <strong className="text-red-600">
                            {uploadResult.summary.errorCount}
                          </strong>
                        </div>
                      )}
                    </div>

                    {uploadResult.summary.errorCount > 0 &&
                      uploadResult.summary.errors.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Contoh Error:</h4>
                          <div className="space-y-1 text-sm">
                            {uploadResult.summary.errors.map((error, index) => (
                              <div key={index} className="text-red-600">
                                Baris {error.rowIndex}: {error.error}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    <div className="flex justify-center mt-6">
                      <Button
                        onClick={resetUploadProcess}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
                      >
                        Upload File Lain
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
    </ModalShell>
  );
}
