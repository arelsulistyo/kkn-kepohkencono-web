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

class UploadProblem extends Error {}

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
      setUploadStep(2);
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

  if (loading || !user) {
    return null;
  }

  return (
    <ModalShell
      open={isOpen}
      onOpenChange={handleDialogClose}
      kicker="database warga"
      title="Upload Data Excel"
      description="Upload file Excel untuk memperbarui data warga secara massal"
      size="wide"
    >

        <div className="space-y-6">
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                    step <= uploadStep
                      ? "bg-[var(--brand)] text-white"
                      : "bg-[var(--brand-wash)] text-[var(--muted)]"
                  } ${step === uploadStep ? "ring-4 ring-[var(--brand-wash)]" : ""}`}
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
                      step < uploadStep ? "bg-[var(--brand)]" : "bg-[var(--brand-wash)]"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="text-center mb-6">
            <h4 className="text-lg font-semibold text-[var(--ink)]">
              {uploadStep === 1 && "Pilih File Excel"}
              {uploadStep === 2 && "Pilih Sheet"}
              {uploadStep === 3 && "Atur Rentang Baris"}
              {uploadStep === 4 && "Upload & Proses"}
            </h4>
            <p className="text-[var(--muted)] text-sm">
              {uploadStep === 1 &&
                "Upload file Excel yang berisi data penerima"}
              {uploadStep === 2 && "Pilih sheet mana yang berisi data Anda"}
              {uploadStep === 3 && "Tentukan baris mana yang akan diproses"}
              {uploadStep === 4 && "Tinjau dan mulai pembuatan massal"}
            </p>
          </div>

          {uploadStep === 1 && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-[var(--input-border)] rounded-[16px] bg-[var(--card)] p-8 text-center hover:border-[var(--brand)] transition-colors duration-300">
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="excel-upload-modal"
                />
                <label htmlFor="excel-upload-modal" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-[var(--brand-wash)] rounded-full">
                      <Upload className="h-12 w-12 text-[var(--brand)]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--ink)] mb-2">
                        Choose Excel File
                      </h3>
                      <p className="text-[var(--muted)] text-sm">
                        Klik untuk browse atau seret dan lepas file .xlsx atau
                        .xls Anda
                      </p>
                    </div>
                  </div>
                </label>
              </div>

              {isLoadingSheets && (
                <div className="flex justify-center">
                  <Alert className="border-0 rounded-[12px] bg-[var(--brand-wash)] w-fit">
                    <FileSpreadsheet className="h-4 w-4 text-[var(--brand)]" />
                    <AlertDescription className="text-[var(--ink)]">
                      Membaca file dan menganalisis sheet...
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </div>
          )}

          {uploadStep === 2 && (
            <div className="space-y-4">
              <div className="bg-[var(--brand-wash)] rounded-[12px] p-4 mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-[var(--brand)]" />
                  <span className="font-medium text-[var(--ink)]">
                    File berhasil diupload: {file?.name}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-[var(--ink)] mb-3">
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
                      className="flex items-center justify-between p-4 rounded-[12px] bg-[var(--card)] shadow-[var(--shadow)] hover:border-[var(--brand)] hover:bg-[var(--brand-wash)] transition-all duration-200 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[var(--brand-wash)] rounded">
                          <FileSpreadsheet className="h-4 w-4 text-[var(--brand)]" />
                        </div>
                        <span className="font-medium text-[var(--ink)]">
                          {sheet.name}
                        </span>
                      </div>
                      <svg
                        className="h-5 w-5 text-[var(--muted)]"
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
                  className="flex-1 rounded-[12px] border-[var(--input-border)] bg-[var(--card)] text-[var(--ink)] hover:bg-[var(--brand-wash)] py-3"
                >
                  Kembali ke Pilihan File
                </Button>
              </div>
            </div>
          )}

          {uploadStep === 3 && (
            <div className="space-y-6">
              <div className="bg-[var(--brand-wash)] rounded-[12px] p-4 mb-6">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="h-6 w-6 text-[var(--brand)]" />
                  <span className="font-semibold text-[var(--ink)]">
                    Sheet Terpilih: {selectedSheet}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="block text-sm font-semibold text-[var(--ink)]">
                    Baris Awal
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    value={rowStart}
                    onChange={(e) => setRowStart(e.target.value)}
                    className="w-full px-4 py-3 h-12 border border-[var(--input-border)] rounded-[12px] bg-white text-base focus:ring-[3px] focus:ring-[rgba(59,90,69,0.35)] focus:border-[var(--brand)] transition-colors"
                    placeholder="2"
                  />
                  <p className="text-xs text-[var(--muted)]">
                    Biasanya baris 2 (setelah header)
                  </p>
                </div>

                <div className="space-y-3">
                  <Label className="block text-sm font-semibold text-[var(--ink)]">
                    Baris Akhir
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    value={rowEnd}
                    onChange={(e) => setRowEnd(e.target.value)}
                    className="w-full px-4 py-3 h-12 border border-[var(--input-border)] rounded-[12px] bg-white text-base focus:ring-[3px] focus:ring-[rgba(59,90,69,0.35)] focus:border-[var(--brand)] transition-colors"
                    placeholder="100"
                  />
                  <p className="text-xs text-[var(--muted)]">
                    Baris terakhir yang akan diproses
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={() => setUploadStep(2)}
                  variant="outline"
                  className="flex-1 rounded-[12px] border-[var(--input-border)] bg-[var(--card)] text-[var(--ink)] hover:bg-[var(--brand-wash)] py-3"
                >
                  Kembali ke Pilihan Sheet
                </Button>
                <Button
                  onClick={() => setUploadStep(4)}
                  className="flex-1 rounded-[12px] bg-[var(--brand)] hover:bg-[var(--brand-dark)] text-white py-3"
                >
                  Lanjut ke Review
                </Button>
              </div>
            </div>
          )}

          {uploadStep === 4 && (
            <div className="space-y-6">
              <Card className="rounded-[16px] border-0 bg-[var(--card)] shadow-[var(--shadow)]">
                <CardHeader>
                  <CardTitle>Review Pengaturan Upload</CardTitle>
                  <CardDescription>
                    Pastikan pengaturan berikut sudah benar sebelum memulai
                    upload
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-2 text-sm [&>div]:rounded-[12px] [&>div]:bg-[var(--brand-wash)] [&>div]:px-3 [&>div]:py-2">
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
                      <div className="text-sm text-[var(--muted)]">
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
                  className="flex-1 rounded-[12px] border-[var(--input-border)] bg-[var(--card)] text-[var(--ink)] hover:bg-[var(--brand-wash)] py-3"
                >
                  Kembali ke Pengaturan
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="flex-1 rounded-[12px] bg-[var(--brand)] hover:bg-[var(--brand-dark)] text-white py-3"
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

          {error && (
            <div className="mt-6">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}

          {uploadResult && (
            <div className="mt-6">
              <Card className="rounded-[16px] border-0 bg-[var(--card)] shadow-[var(--shadow)]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-[var(--brand)]" />
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
                        <strong className="text-[var(--brand)]">
                          {uploadResult.summary.successfulUploads}
                        </strong>
                      </div>
                      {uploadResult.summary.newRecords > 0 && (
                        <div>
                          Data baru:{" "}
                          <strong className="text-[var(--brand)]">
                            {uploadResult.summary.newRecords}
                          </strong>
                        </div>
                      )}
                      {uploadResult.summary.updatedRecords > 0 && (
                        <div>
                          Data diperbarui:{" "}
                          <strong className="text-[var(--accent)]">
                            {uploadResult.summary.updatedRecords}
                          </strong>
                        </div>
                      )}
                      {uploadResult.summary.errorCount > 0 && (
                        <div>
                          Error:{" "}
                          <strong className="text-[var(--error)]">
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
                              <div key={index} className="text-[var(--error)]">
                                Baris {error.rowIndex}: {error.error}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    <div className="flex justify-center mt-6">
                      <Button
                        onClick={resetUploadProcess}
                        className="rounded-[12px] bg-[var(--brand)] hover:bg-[var(--brand-dark)] text-white px-6 py-2"
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
