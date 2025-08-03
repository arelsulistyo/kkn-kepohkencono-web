"use client";

import React, { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { Loader2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateSuratKeteranganUsaha } from "@/components/layanan-surat/surat-templates";
import { alamatGroupsShort } from "@/app/layanan-surat/data/alamatGroupsShort";
import PersonSearchBar from "@/components/layanan-surat/common/PersonSearchBar";
import type { PersonData } from "@/components/ui/person-search";

interface SuratKeteranganUsahaFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitSuccess?: () => void;
  // Optional external state props
  namaPeminta?: string;
  setNamaPeminta?: (value: string) => void;
  namaPemintaError?: string;
  setNamaPemintaError?: (value: string) => void;
  isLoading?: boolean;
  setIsLoading?: (value: boolean) => void;
}

const jenisGarapanOptions = [
  { value: "Tambak", label: "Tambak" },
  { value: "Sawah", label: "Sawah" },
  { value: "Tegalan", label: "Tegalan" },
];

export const SuratKeteranganUsahaForm: React.FC<
  SuratKeteranganUsahaFormProps
> = ({
  isOpen,
  onOpenChange,
  onSubmitSuccess,
  namaPeminta: externalNamaPeminta,
  setNamaPeminta: externalSetNamaPeminta,
  namaPemintaError: externalNamaPemintaError,
  setNamaPemintaError: externalSetNamaPemintaError,
  isLoading: externalIsLoading,
  setIsLoading: externalSetIsLoading,
}) => {
  const { toast } = useToast();

  // Internal state (used when external props are not provided)
  const [internalNamaPeminta, setInternalNamaPeminta] = useState("");
  const [internalNamaPemintaError, setInternalNamaPemintaError] = useState("");
  const [internalIsLoading, setInternalIsLoading] = useState(false);

  // Person search state
  const [selectedPerson, setSelectedPerson] = useState<PersonData | null>(null);

  // Form-specific state
  const [pekerjaan, setPekerjaan] = useState("");
  const [alamat, setAlamat] = useState("");
  const [jenisUsaha, setJenisUsaha] = useState("");
  const [jenisGarapan, setJenisGarapan] = useState("");
  const [luasLahan, setLuasLahan] = useState("");
  const [lokasiLahan, setLokasiLahan] = useState("");
  const [jenisBibit, setJenisBibit] = useState("");
  const [hasilPanenTon, setHasilPanenTon] = useState("");
  const [hasilPanenKw, setHasilPanenKw] = useState("");
  const [hasilPanenKg, setHasilPanenKg] = useState("");

  // Error states
  const [pekerjaanError, setPekerjaanError] = useState("");
  const [alamatError, setAlamatError] = useState("");
  const [jenisUsahaError, setJenisUsahaError] = useState("");

  // Use external state if provided, otherwise use internal state
  const namaPeminta = externalNamaPeminta ?? internalNamaPeminta;
  const setNamaPeminta = externalSetNamaPeminta ?? setInternalNamaPeminta;
  const namaPemintaError = externalNamaPemintaError ?? internalNamaPemintaError;
  const setNamaPemintaError =
    externalSetNamaPemintaError ?? setInternalNamaPemintaError;
  const isLoading = externalIsLoading ?? internalIsLoading;
  const setIsLoading = externalSetIsLoading ?? setInternalIsLoading;

  // Function to map RT/RW to simple alamat format
  const mapRTRWToAlamat = (rt: string, rw: string): string => {
    return `RT ${rt || ""}/RW ${rw || ""}, Desa Kepohkencono`;
  };

  // Handle person selection from search
  const handlePersonSelect = (person: PersonData) => {
    setSelectedPerson(person);
    setNamaPeminta(person.NAMA);
    setPekerjaan(person.PEKERJAAN);
    
    // Map RT/RW to alamat value
    const alamatValue = mapRTRWToAlamat(person.RT, person.RW);
    setAlamat(alamatValue);
    
    // Clear errors for auto-filled fields
    setNamaPemintaError("");
    setPekerjaanError("");
    setAlamatError("");
  };

  const resetForm = () => {
    // Reset form fields
    setNamaPeminta("");
    setPekerjaan("");
    setAlamat("");
    setJenisUsaha("");
    setJenisGarapan("");
    setLuasLahan("");
    setLokasiLahan("");
    setJenisBibit("");
    setHasilPanenTon("");
    setHasilPanenKw("");
    setHasilPanenKg("");
    setSelectedPerson(null);

    // Reset error states
    setNamaPemintaError("");
    setPekerjaanError("");
    setAlamatError("");
    setJenisUsahaError("");
  };

  const generatePDF = async () => {
    try {
      const suratData: any = {
        namaPeminta,
        pekerjaan,
        alamat,
        jenisUsaha,
        jenisGarapan,
        luasLahan,
        lokasiLahan,
        jenisBibit,
        hasilPanen: {
          ton: hasilPanenTon,
          kw: hasilPanenKw,
          kg: hasilPanenKg,
        },
      };

      await generateSuratKeteranganUsaha(suratData);
      return true;
    } catch (error) {
      console.error("Error generating PDF:", error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    let isValid = true;

    if (!namaPeminta.trim()) {
      setNamaPemintaError("Nama peminta surat harus diisi");
      isValid = false;
    } else {
      setNamaPemintaError("");
    }

    if (!pekerjaan.trim()) {
      setPekerjaanError("Pekerjaan harus diisi");
      isValid = false;
    } else {
      setPekerjaanError("");
    }

    if (!alamat.trim()) {
      setAlamatError("Alamat harus diisi");
      isValid = false;
    } else {
      setAlamatError("");
    }

    if (!jenisUsaha.trim()) {
      setJenisUsahaError("Jenis usaha harus diisi");
      isValid = false;
    } else {
      setJenisUsahaError("");
    }

    if (isValid) {
      setIsLoading(true);

      try {
        const pdfGenerated = await generatePDF();

        if (pdfGenerated) {
          toast({
            title: "Surat Berhasil Dibuat",
            description:
              "Surat Keterangan Usaha telah berhasil dibuat dan diunduh",
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
        setIsLoading(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] p-8 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-0">
          <DialogTitle className="text-2xl font-bold">
            Formulir Surat Keterangan Usaha
          </DialogTitle>
          <DialogDescription className="text-base mt-1 mb-0">
            Silakan lengkapi data berikut untuk pembuatan Surat Keterangan
            Usaha.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-0">
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
              <Label htmlFor="pekerjaan" className="text-base">
                Pekerjaan
              </Label>
              <Input
                id="pekerjaan"
                placeholder="Masukkan pekerjaan"
                className={`text-base mt-2 ${
                  pekerjaanError ? "border-red-500" : "border-gray-400"
                }`}
                value={pekerjaan}
                onChange={(e) => {
                  setPekerjaan(e.target.value);
                  setPekerjaanError("");
                }}
              />
              {pekerjaanError && (
                <p className="text-base text-red-500 mt-1">{pekerjaanError}</p>
              )}
            </div>

            <div className="space-y-2 mt-3">
              <Label htmlFor="alamat" className="text-base">
                Alamat
              </Label>
              <Input
                id="alamat"
                placeholder="Masukkan alamat lengkap"
                className={`text-base mt-2 ${
                  alamatError ? "border-red-500" : "border-gray-400"
                }`}
                value={alamat}
                onChange={(e) => {
                  setAlamat(e.target.value);
                  setAlamatError("");
                }}
              />
              {alamatError && (
                <p className="text-base text-red-500 mt-1">{alamatError}</p>
              )}
            </div>
          </div>

          {/* Data Usaha */}
          <div className="pt-2">
            <h3 className="text-lg font-semibold mb-4">Data Usaha</h3>
            
            <div className="space-y-2">
              <Label htmlFor="jenisUsaha" className="text-base">
                Jenis Usaha
              </Label>
              <Input
                id="jenisUsaha"
                placeholder="Masukkan jenis usaha"
                className={`text-base mt-2 ${
                  jenisUsahaError ? "border-red-500" : "border-gray-400"
                }`}
                value={jenisUsaha}
                onChange={(e) => {
                  setJenisUsaha(e.target.value);
                  setJenisUsahaError("");
                }}
              />
              {jenisUsahaError && (
                <p className="text-base text-red-500 mt-1">{jenisUsahaError}</p>
              )}
            </div>
          </div>

          {/* Informasi Tambahan Pertanian */}
          <div className="pt-2">
            <h3 className="text-lg font-semibold mb-4">
              Informasi Tambahan untuk Usaha Pertanian (Opsional)
            </h3>

            <div className="space-y-2 mb-3">
              <Label htmlFor="jenisGarapan" className="text-base">
                Jenis Garapan
              </Label>
              <Combobox
                options={jenisGarapanOptions}
                value={jenisGarapan}
                onValueChange={(value) => {
                  setJenisGarapan(value);
                }}
                placeholder="Pilih jenis garapan"
                className="text-base mt-2 border-gray-400"
              />
            </div>

            <div className="space-y-2 mb-3">
              <Label htmlFor="luasLahan" className="text-base">
                Luas Lahan (Ha)
              </Label>
              <Input
                id="luasLahan"
                placeholder="Masukkan luas lahan dalam hektar"
                className="text-base mt-2 border-gray-400"
                value={luasLahan}
                onChange={(e) => setLuasLahan(e.target.value)}
              />
            </div>

            <div className="space-y-2 mb-3">
              <Label htmlFor="lokasiLahan" className="text-base">
                Lokasi Lahan (Desa)
              </Label>
              <Input
                id="lokasiLahan"
                placeholder="Masukkan lokasi lahan"
                className="text-base mt-2 border-gray-400"
                value={lokasiLahan}
                onChange={(e) => setLokasiLahan(e.target.value)}
              />
            </div>

            <div className="space-y-2 mb-3">
              <Label htmlFor="jenisBibit" className="text-base">
                Jenis Bibit
              </Label>
              <Input
                id="jenisBibit"
                placeholder="Masukkan jenis bibit"
                className="text-base mt-2 border-gray-400"
                value={jenisBibit}
                onChange={(e) => setJenisBibit(e.target.value)}
              />
            </div>

            <div className="space-y-2 mb-3">
              <Label className="text-base mb-2">Hasil Panen per Ha</Label>
              <div className="grid grid-cols-3 gap-4 mt-2">
                <div>
                  <Label htmlFor="hasilPanenTon" className="text-sm">
                    Ton
                  </Label>
                  <Input
                    id="hasilPanenTon"
                    placeholder="Ton"
                    className="text-base border-gray-400"
                    value={hasilPanenTon}
                    onChange={(e) => setHasilPanenTon(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="hasilPanenKw" className="text-sm">
                    Kwintal
                  </Label>
                  <Input
                    id="hasilPanenKw"
                    placeholder="Kw"
                    className="text-base border-gray-400"
                    value={hasilPanenKw}
                    onChange={(e) => setHasilPanenKw(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="hasilPanenKg" className="text-sm">
                    Kilogram
                  </Label>
                  <Input
                    id="hasilPanenKg"
                    placeholder="Kg"
                    className="text-base border-gray-400"
                    value={hasilPanenKg}
                    onChange={(e) => setHasilPanenKg(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
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
                  <Download className="mr-2 h-4 w-4" />
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
