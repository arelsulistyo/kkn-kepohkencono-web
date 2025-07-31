"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";
import { Loader2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { SuratTemplateType } from "@/components/layanan-surat/surat-templates";

interface SuratDomisiliFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  namaPeminta?: string;
  setNamaPeminta?: (value: string) => void;
  namaPemintaError?: string;
  setNamaPemintaError?: (value: string) => void;
  isLoading?: boolean;
  setIsLoading?: (value: boolean) => void;
  onSubmitSuccess?: () => void;
}

const SuratDomisiliForm = ({
  isOpen,
  onOpenChange,
  namaPeminta: externalNamaPeminta,
  setNamaPeminta: externalSetNamaPeminta,
  namaPemintaError: externalNamaPemintaError,
  setNamaPemintaError: externalSetNamaPemintaError,
  isLoading: externalIsLoading,
  setIsLoading: externalSetIsLoading,
  onSubmitSuccess,
}: SuratDomisiliFormProps) => {
  const { toast } = useToast();

  // Internal state (fallback when external props not provided)
  const [internalIsLoading, setInternalIsLoading] = useState(false);
  const [internalNamaPeminta, setInternalNamaPeminta] = useState("");
  const [internalNamaPemintaError, setInternalNamaPemintaError] = useState("");

  // Use external props if provided, otherwise use internal state
  const isLoading = externalIsLoading ?? internalIsLoading;
  const setIsLoading = externalSetIsLoading ?? setInternalIsLoading;
  const namaPeminta = externalNamaPeminta ?? internalNamaPeminta;
  const setNamaPeminta = externalSetNamaPeminta ?? setInternalNamaPeminta;
  const namaPemintaError = externalNamaPemintaError ?? internalNamaPemintaError;
  const setNamaPemintaError =
    externalSetNamaPemintaError ?? setInternalNamaPemintaError;

  // Form state (always internal)
  const [alamatDomisili, setAlamatDomisili] = useState("");
  const [signatureType, setSignatureType] = useState<"sekretaris" | "kepala">(
    "sekretaris"
  );

  // Error state
  const [alamatDomisiliError, setAlamatDomisiliError] = useState("");

  // Alamat groups data
  const alamatGroups = [
    {
      label: "Manding (RW 01)",
      options: [
        {
          value: "MANDING 01/01 KEPOHKENCONO PUCAKWANGI",
          label: "RT 01/RW 01",
        },
        {
          value: "MANDING 02/01 KEPOHKENCONO PUCAKWANGI",
          label: "RT 02/RW 01",
        },
        {
          value: "MANDING 03/01 KEPOHKENCONO PUCAKWANGI",
          label: "RT 03/RW 01",
        },
        {
          value: "MANDING 04/01 KEPOHKENCONO PUCAKWANGI",
          label: "RT 04/RW 01",
        },
        {
          value: "MANDING 05/01 KEPOHKENCONO PUCAKWANGI",
          label: "RT 05/RW 01",
        },
      ],
    },
    {
      label: "Manding (RW 02)",
      options: [
        {
          value: "MANDING 01/02 KEPOHKENCONO PUCAKWANGI",
          label: "RT 01/RW 02",
        },
        {
          value: "MANDING 02/02 KEPOHKENCONO PUCAKWANGI",
          label: "RT 02/RW 02",
        },
        {
          value: "MANDING 03/02 KEPOHKENCONO PUCAKWANGI",
          label: "RT 03/RW 02",
        },
        {
          value: "MANDING 04/02 KEPOHKENCONO PUCAKWANGI",
          label: "RT 04/RW 02",
        },
        {
          value: "MANDING 05/02 KEPOHKENCONO PUCAKWANGI",
          label: "RT 05/RW 02",
        },
      ],
    },
    {
      label: "Kepohkencono (RW 03)",
      options: [
        {
          value: "KEPOHKENCONO 01/03 KEPOHKENCONO PUCAKWANGI",
          label: "RT 01/RW 03",
        },
        {
          value: "KEPOHKENCONO 02/03 KEPOHKENCONO PUCAKWANGI",
          label: "RT 02/RW 03",
        },
        {
          value: "KEPOHKENCONO 03/03 KEPOHKENCONO PUCAKWANGI",
          label: "RT 03/RW 03",
        },
        {
          value: "KEPOHKENCONO 04/03 KEPOHKENCONO PUCAKWANGI",
          label: "RT 04/RW 03",
        },
        {
          value: "KEPOHKENCONO 05/03 KEPOHKENCONO PUCAKWANGI",
          label: "RT 05/RW 03",
        },
      ],
    },
  ];

  // Reset form function
  const resetForm = () => {
    setNamaPeminta("");
    setAlamatDomisili("");
    setSignatureType("sekretaris");
    setNamaPemintaError("");
    setAlamatDomisiliError("");
  };

  // Generate PDF function
  const generatePDF = async () => {
    try {
      // Import fungsi untuk mendapatkan template surat
      const { getSuratTemplate } = await import(
        "@/components/layanan-surat/surat-templates"
      );

      // Dapatkan template surat berdasarkan tipe yang dipilih
      const generateSurat = await getSuratTemplate(
        "domisili" as SuratTemplateType
      );

      // Siapkan data yang akan dikirim ke template surat
      const suratData: any = {
        namaPeminta,
        alamatDomisili,
        signatureType,
      };

      // Generate PDF
      const result = await generateSurat(suratData);
      return result;
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw error;
    }
  };

  // Handle form submission
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    let isValid = true;

    if (!namaPeminta.trim()) {
      setNamaPemintaError("Nama peminta surat harus diisi");
      isValid = false;
    } else {
      setNamaPemintaError("");
    }

    if (!alamatDomisili) {
      setAlamatDomisiliError("Alamat domisili harus dipilih");
      isValid = false;
    } else {
      setAlamatDomisiliError("");
    }

    if (isValid) {
      // Set loading state to true
      setIsLoading(true);

      try {
        // Generate PDF (async operation)
        const pdfGenerated = await generatePDF();

        // Process form submission if PDF was generated successfully
        if (pdfGenerated) {
          toast({
            title: "Surat Berhasil Dibuat",
            description:
              "Surat Keterangan Domisili telah berhasil dibuat dan diunduh",
          });
          resetForm();
          onOpenChange(false);
          onSubmitSuccess?.();
        }
      } catch (error) {
        console.error("Error generating PDF:", error);
        toast({
          title: "Gagal Membuat Surat",
          description:
            "Terjadi kesalahan saat membuat surat. Silakan coba lagi.",
          variant: "destructive",
        });
      } finally {
        // Set loading state back to false
        setIsLoading(false);
      }
    }
  };

  // Handle dialog close
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[650px] p-8 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Formulir Surat Keterangan Domisili
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            Silakan lengkapi data berikut untuk pembuatan Surat Keterangan
            Domisili.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmitForm}
          className="space-y-6 mt-4"
        >
          <div className="space-y-3">
            <Label htmlFor="namaPeminta" className="text-lg">
              Nama Peminta Surat
            </Label>
            <Input
              id="namaPeminta"
              placeholder="Masukkan nama lengkap"
              className={`text-base mt-3 ${
                namaPemintaError ? "border-red-500" : "border-gray-400"
              }`}
              value={namaPeminta}
              onChange={(e) => {
                setNamaPeminta(e.target.value);
                setNamaPemintaError("");
              }}
            />
            {namaPemintaError && (
              <p className="text-base text-red-500 mt-1">{namaPemintaError}</p>
            )}
          </div>
          <div className="space-y-3">
            <Label htmlFor="alamatDomisili" className="text-lg">
              Alamat Domisili
            </Label>
            <Combobox
              groups={alamatGroups}
              value={alamatDomisili}
              onValueChange={(value) => {
                setAlamatDomisili(value);
                setAlamatDomisiliError("");
              }}
              placeholder="Pilih alamat domisili"
              className={`text-base mt-3 ${
                alamatDomisiliError ? "border-red-500" : "border-gray-400"
              }`}
            />
            {alamatDomisiliError && (
              <p className="text-base text-red-500 mt-1">
                {alamatDomisiliError}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="signatureType" className="text-lg">
              Pilih Tanda Tangan
            </Label>
            <div className="flex flex-col space-y-2 mt-3">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="sekretaris"
                  name="signatureType"
                  value="sekretaris"
                  checked={signatureType === "sekretaris"}
                  onChange={() => setSignatureType("sekretaris")}
                  className="mr-2"
                />
                <Label htmlFor="sekretaris">
                  Plt.Sekretaris Desa - AGUS SUMANTO
                </Label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="kepala"
                  name="signatureType"
                  value="kepala"
                  checked={signatureType === "kepala"}
                  onChange={() => setSignatureType("kepala")}
                  className="mr-2"
                />
                <Label htmlFor="kepala">Pj.Kepala Desa - NGASIMAN S.H.</Label>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDialogClose(false)}
              className="text-base h-12 px-6"
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-base h-12 px-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4 " />
                  Unduh Surat
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SuratDomisiliForm;
