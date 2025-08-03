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
import { Loader2, Download } from "lucide-react";
import { alamatGroupsShort } from "@/app/layanan-surat/data/alamatGroupsShort";
import PersonSearchBar from "@/components/layanan-surat/common/PersonSearchBar";
import type { PersonData } from "@/components/ui/person-search";
import { convertTimestampToDate } from "@/components/ui/person-search";

export interface TidakMampuFormData {
  namaPemohonTidakMampu: string;
  tempatLahirPemohonTidakMampu: string;
  tanggalLahirPemohonTidakMampu: string;
  jenisKelaminPemohonTidakMampu: string;
  pekerjaanPemohonTidakMampu: string;
  alamatPemohonTidakMampu: string;
  persyaratanTidakMampu: string;
}

interface SuratTidakMampuFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TidakMampuFormData) => Promise<void>;
  isLoading: boolean;
}

const SuratTidakMampuForm = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: SuratTidakMampuFormProps) => {
  // State variables
  const [namaPemohonTidakMampu, setNamaPemohonTidakMampu] = useState("");
  const [tempatLahirPemohonTidakMampu, setTempatLahirPemohonTidakMampu] =
    useState("Pati");
  const [tanggalLahirPemohonTidakMampu, setTanggalLahirPemohonTidakMampu] =
    useState("");
  const [jenisKelaminPemohonTidakMampu, setJenisKelaminPemohonTidakMampu] =
    useState("L");
  const [pekerjaanPemohonTidakMampu, setPekerjaanPemohonTidakMampu] =
    useState("");
  const [alamatPemohonTidakMampu, setAlamatPemohonTidakMampu] = useState("");
  const [persyaratanTidakMampu, setPersyaratanTidakMampu] = useState("");

  // Person search state
  const [selectedPerson, setSelectedPerson] = useState<PersonData | null>(null);

  // Error state variables
  const [namaPemohonTidakMampuError, setNamaPemohonTidakMampuError] =
    useState("");
  const [
    tempatLahirPemohonTidakMampuError,
    setTempatLahirPemohonTidakMampuError,
  ] = useState("");
  const [
    tanggalLahirPemohonTidakMampuError,
    setTanggalLahirPemohonTidakMampuError,
  ] = useState("");
  const [pekerjaanPemohonTidakMampuError, setPekerjaanPemohonTidakMampuError] =
    useState("");
  const [alamatPemohonTidakMampuError, setAlamatPemohonTidakMampuError] =
    useState("");
  const [persyaratanTidakMampuError, setPersyaratanTidakMampuError] =
    useState("");

  // Function to map RT/RW to simple alamat format
  const mapRTRWToAlamat = (rt: string, rw: string): string => {
    return `RT ${rt || ""}/RW ${rw || ""}, Desa Kepohkencono`;
  };

  // Function to handle person selection
  const handlePersonSelect = (person: PersonData | null) => {
    setSelectedPerson(person);
    
    if (person) {
      // Auto-fill available fields
      setNamaPemohonTidakMampu(person.NAMA || "");
      setTempatLahirPemohonTidakMampu(person.TMPT_LHR || "");
      
      // Convert timestamp to date if available
      if (person.TGL_LHR) {
        const dateStr = convertTimestampToDate(person.TGL_LHR);
        setTanggalLahirPemohonTidakMampu(dateStr);
      }
      
      setJenisKelaminPemohonTidakMampu(person.JK || "");
      setPekerjaanPemohonTidakMampu(person.PEKERJAAN || "");
      
      // Map RT/RW to alamat
      if (person.RT && person.RW) {
        const alamat = mapRTRWToAlamat(person.RT, person.RW);
        setAlamatPemohonTidakMampu(alamat);
      }
      
      // Clear related errors
      setNamaPemohonTidakMampuError("");
      setTempatLahirPemohonTidakMampuError("");
      setTanggalLahirPemohonTidakMampuError("");
      setPekerjaanPemohonTidakMampuError("");
      setAlamatPemohonTidakMampuError("");
    }
  };

  const resetForm = () => {
    setNamaPemohonTidakMampu("");
    setTempatLahirPemohonTidakMampu("Pati");
    setTanggalLahirPemohonTidakMampu("");
    setJenisKelaminPemohonTidakMampu("L");
    setPekerjaanPemohonTidakMampu("");
    setAlamatPemohonTidakMampu("");
    setPersyaratanTidakMampu("");
    setSelectedPerson(null);

    // Reset errors
    setNamaPemohonTidakMampuError("");
    setTempatLahirPemohonTidakMampuError("");
    setTanggalLahirPemohonTidakMampuError("");
    setPekerjaanPemohonTidakMampuError("");
    setAlamatPemohonTidakMampuError("");
    setPersyaratanTidakMampuError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    let hasError = false;

    if (!namaPemohonTidakMampu.trim()) {
      setNamaPemohonTidakMampuError("Nama harus diisi");
      hasError = true;
    }

    if (!tempatLahirPemohonTidakMampu.trim()) {
      setTempatLahirPemohonTidakMampuError("Tempat lahir harus diisi");
      hasError = true;
    }

    if (!tanggalLahirPemohonTidakMampu.trim()) {
      setTanggalLahirPemohonTidakMampuError("Tanggal lahir harus diisi");
      hasError = true;
    }

    if (!pekerjaanPemohonTidakMampu.trim()) {
      setPekerjaanPemohonTidakMampuError("Pekerjaan harus diisi");
      hasError = true;
    }

    if (!alamatPemohonTidakMampu.trim()) {
      setAlamatPemohonTidakMampuError("Alamat harus diisi");
      hasError = true;
    }

    if (!persyaratanTidakMampu.trim()) {
      setPersyaratanTidakMampuError("Persyaratan harus diisi");
      hasError = true;
    }

    if (hasError) return;

    const formData: TidakMampuFormData = {
      namaPemohonTidakMampu,
      tempatLahirPemohonTidakMampu,
      tanggalLahirPemohonTidakMampu,
      jenisKelaminPemohonTidakMampu,
      pekerjaanPemohonTidakMampu,
      alamatPemohonTidakMampu,
      persyaratanTidakMampu,
    };

    onSubmit(formData);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[650px] p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-0">
          <DialogTitle className="text-2xl font-bold">
            Formulir Surat Keterangan Tidak Mampu
          </DialogTitle>
          <DialogDescription className="text-base mt-1 mb-0">
            Silakan lengkapi data berikut untuk pembuatan Surat Keterangan Tidak
            Mampu.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-0">
          <div className="pt-2 mt-1">
            <h3 className="text-lg font-semibold mb-4">Data Pemohon</h3>
            
            <PersonSearchBar
              selectedPerson={selectedPerson}
              onPersonSelect={handlePersonSelect}
              placeholder="Cari data pemohon..."
              className="mb-4"
            />

            <div className="space-y-2">
              <Label htmlFor="namaPemohonTidakMampu" className="text-base">
                Nama
              </Label>
              <Input
                id="namaPemohonTidakMampu"
                placeholder="Masukkan nama lengkap"
                className={`text-base mt-2 ${
                  namaPemohonTidakMampuError
                    ? "border-red-500"
                    : "border-gray-400"
                }`}
                value={namaPemohonTidakMampu}
                onChange={(e) => {
                  setNamaPemohonTidakMampu(e.target.value);
                  setNamaPemohonTidakMampuError("");
                }}
              />
              {namaPemohonTidakMampuError && (
                <p className="text-base text-red-500 mt-1">
                  {namaPemohonTidakMampuError}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="space-y-2">
                <Label
                  htmlFor="tempatLahirPemohonTidakMampu"
                  className="text-base"
                >
                  Tempat Lahir
                </Label>
                <Input
                  id="tempatLahirPemohonTidakMampu"
                  placeholder="Masukkan tempat lahir"
                  className={`text-base mt-2 ${
                    tempatLahirPemohonTidakMampuError
                      ? "border-red-500"
                      : "border-gray-400"
                  }`}
                  value={tempatLahirPemohonTidakMampu}
                  onChange={(e) => {
                    setTempatLahirPemohonTidakMampu(e.target.value);
                    setTempatLahirPemohonTidakMampuError("");
                  }}
                />
                {tempatLahirPemohonTidakMampuError && (
                  <p className="text-base text-red-500 mt-1">
                    {tempatLahirPemohonTidakMampuError}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="tanggalLahirPemohonTidakMampu"
                  className="text-base"
                >
                  Tanggal Lahir
                </Label>
                <Input
                  id="tanggalLahirPemohonTidakMampu"
                  placeholder="Masukkan tanggal lahir"
                  className={`text-base mt-2 ${
                    tanggalLahirPemohonTidakMampuError
                      ? "border-red-500"
                      : "border-gray-400"
                  }`}
                  value={tanggalLahirPemohonTidakMampu}
                  onChange={(e) => {
                    setTanggalLahirPemohonTidakMampu(e.target.value);
                    setTanggalLahirPemohonTidakMampuError("");
                  }}
                />
                {tanggalLahirPemohonTidakMampuError && (
                  <p className="text-base text-red-500 mt-1">
                    {tanggalLahirPemohonTidakMampuError}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2 mt-3">
              <Label
                htmlFor="jenisKelaminPemohonTidakMampu"
                className="text-base"
              >
                Jenis Kelamin
              </Label>
              <div className="flex space-x-4 mt-2 ">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="jenisKelaminPemohonTidakMampuL"
                    name="jenisKelaminPemohonTidakMampu"
                    value="L"
                    checked={jenisKelaminPemohonTidakMampu === "L"}
                    onChange={() => setJenisKelaminPemohonTidakMampu("L")}
                    className="mr-2"
                  />
                  <Label htmlFor="jenisKelaminPemohonTidakMampuL">
                    Laki-laki
                  </Label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="jenisKelaminPemohonTidakMampuP"
                    name="jenisKelaminPemohonTidakMampu"
                    value="P"
                    checked={jenisKelaminPemohonTidakMampu === "P"}
                    onChange={() => setJenisKelaminPemohonTidakMampu("P")}
                    className="mr-2"
                  />
                  <Label htmlFor="jenisKelaminPemohonTidakMampuP">
                    Perempuan
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-3">
              <Label htmlFor="pekerjaanPemohonTidakMampu" className="text-base">
                Pekerjaan
              </Label>
              <Input
                id="pekerjaanPemohonTidakMampu"
                placeholder="Masukkan pekerjaan"
                className={`text-base mt-2 ${
                  pekerjaanPemohonTidakMampuError
                    ? "border-red-500"
                    : "border-gray-400"
                }`}
                value={pekerjaanPemohonTidakMampu}
                onChange={(e) => {
                  setPekerjaanPemohonTidakMampu(e.target.value);
                  setPekerjaanPemohonTidakMampuError("");
                }}
              />
              {pekerjaanPemohonTidakMampuError && (
                <p className="text-base text-red-500 mt-1">
                  {pekerjaanPemohonTidakMampuError}
                </p>
              )}
            </div>

            <div className="space-y-2 mt-3">
              <Label htmlFor="alamatPemohonTidakMampu" className="text-base">
                Alamat
              </Label>
              <Input
                id="alamatPemohonTidakMampu"
                placeholder="Masukkan alamat lengkap"
                className={`text-base mt-2 ${
                  alamatPemohonTidakMampuError
                    ? "border-red-500"
                    : "border-gray-400"
                }`}
                value={alamatPemohonTidakMampu}
                onChange={(e) => {
                  setAlamatPemohonTidakMampu(e.target.value);
                  setAlamatPemohonTidakMampuError("");
                }}
              />
              {alamatPemohonTidakMampuError && (
                <p className="text-base text-red-500 mt-1">
                  {alamatPemohonTidakMampuError}
                </p>
              )}
            </div>

            <div className="space-y-2 mt-3">
              <Label htmlFor="persyaratanTidakMampu" className="text-base">
                Persyaratan
              </Label>
              <Input
                id="persyaratanTidakMampu"
                placeholder="Masukkan persyaratan yang diperlukan"
                className={`text-base mt-2 ${
                  persyaratanTidakMampuError
                    ? "border-red-500"
                    : "border-gray-400"
                }`}
                value={persyaratanTidakMampu}
                onChange={(e) => {
                  setPersyaratanTidakMampu(e.target.value);
                  setPersyaratanTidakMampuError("");
                }}
              />
              {persyaratanTidakMampuError && (
                <p className="text-base text-red-500 mt-1">
                  {persyaratanTidakMampuError}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
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

export default SuratTidakMampuForm;
