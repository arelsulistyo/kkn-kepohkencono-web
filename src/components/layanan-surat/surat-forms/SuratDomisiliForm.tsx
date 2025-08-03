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
import { alamatGroups } from "@/app/layanan-surat/data/alamatGroups";
import PersonSearchBar from "@/components/layanan-surat/common/PersonSearchBar";
import type { PersonData } from "@/components/ui/person-search";

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
  const [selectedPerson, setSelectedPerson] = useState<PersonData | null>(null);

  // Error state
  const [alamatDomisiliError, setAlamatDomisiliError] = useState("");

  // Function to map RT/RW to simple alamat format
  const mapRTRWToAlamat = (rt: string, rw: string): string => {
    return `RT ${rt || ""}/RW ${rw || ""}, Desa Kepohkencono`;
  };

  // Handle person selection from search
  const handlePersonSelect = (person: PersonData) => {
    setSelectedPerson(person);
    setNamaPeminta(person.NAMA);
    
    // Map RT/RW to alamat value
    const alamatValue = mapRTRWToAlamat(person.RT, person.RW);
    setAlamatDomisili(alamatValue);
    
    // Clear errors for auto-filled fields
    setNamaPemintaError("");
    setAlamatDomisiliError("");
  };

  // Reset form function
  const resetForm = () => {
    setNamaPeminta("");
    setAlamatDomisili("");
    setSignatureType("sekretaris");
    setSelectedPerson(null);
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
        <DialogHeader className="pb-0">
          <DialogTitle className="text-2xl font-bold">
            Formulir Surat Keterangan Domisili
          </DialogTitle>
          <DialogDescription className="text-base mt-1 mb-0">
            Silakan lengkapi data berikut untuk pembuatan Surat Keterangan
            Domisili.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmitForm} className="space-y-4 mt-0">
          {/* Data Pemohon */}
          <div className="pt-2 mt-1">
            <h3 className="text-lg font-semibold mb-4">Data Pemohon</h3>
            
            <PersonSearchBar
              selectedPerson={selectedPerson}
              onPersonSelect={handlePersonSelect}
              placeholder="Cari data pemohon..."
              className="mb-4"
            />

            <div className="space-y-2">
              <Label htmlFor="namaPeminta" className="text-base">
                Nama
              </Label>
              <Input
                id="namaPeminta"
                placeholder="Masukkan nama lengkap"
                className={`text-base mt-2 ${
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

            <div className="space-y-2 mt-3">
              <Label htmlFor="alamatDomisili" className="text-base">
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
                className={`text-base mt-2 ${
                  alamatDomisiliError ? "border-red-500" : "border-gray-400"
                }`}
              />
              {alamatDomisiliError && (
                <p className="text-base text-red-500 mt-1">
                  {alamatDomisiliError}
                </p>
              )}
          </div>
          </div>

          {/* Tanda Tangan */}
          <div className="pt-2">
            <h3 className="text-lg font-semibold mb-4">Tanda Tangan</h3>
            <div className="space-y-2">
              <Label className="text-base">
                Pilih Penandatangan
              </Label>
              <div className="flex flex-col space-y-2 mt-2">
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
                  <Label htmlFor="sekretaris" className="text-base">
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
                  <Label htmlFor="kepala" className="text-base">Pj.Kepala Desa - NGASIMAN S.H.</Label>
                </div>
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
