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

export interface KelahiranFormData {
  namaPemohon: string;
  tempatLahirPemohon: string;
  tanggalLahirPemohon: string;
  jenisKelaminPemohon: string;
  pekerjaanPemohon: string;
  alamatPemohon: string;
  namaAnak: string;
  tempatLahirAnak: string;
  tanggalLahirAnak: string;
  jenisKelaminAnak: string;
  agamaAnak: string;
  alamatAnak: string;
  namaAyah: string;
  namaIbu: string;
}

export interface SuratKelahiranFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: KelahiranFormData) => Promise<void>;
  isLoading: boolean;
}

const SuratKelahiranForm: React.FC<SuratKelahiranFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}) => {
  // Form state - Data Pemohon
  const [namaPemohon, setNamaPemohon] = useState("");
  const [tempatLahirPemohon, setTempatLahirPemohon] = useState("Pati");
  const [tanggalLahirPemohon, setTanggalLahirPemohon] = useState("");
  const [jenisKelaminPemohon, setJenisKelaminPemohon] = useState("L");
  const [pekerjaanPemohon, setPekerjaanPemohon] = useState("");
  const [alamatPemohon, setAlamatPemohon] = useState("");

  // Form state - Data Anak
  const [namaAnak, setNamaAnak] = useState("");
  const [tempatLahirAnak, setTempatLahirAnak] = useState("");
  const [tanggalLahirAnak, setTanggalLahirAnak] = useState("");
  const [jenisKelaminAnak, setJenisKelaminAnak] = useState("L");
  const [agamaAnak, setAgamaAnak] = useState("");
  const [alamatAnak, setAlamatAnak] = useState("");

  // Form state - Data Orang Tua
  const [namaAyah, setNamaAyah] = useState("");
  const [namaIbu, setNamaIbu] = useState("");

  // Person search state
  const [selectedPerson, setSelectedPerson] = useState<PersonData | null>(null);

  // Error states - Data Pemohon
  const [namaPemohonError, setNamaPemohonError] = useState("");
  const [tempatLahirPemohonError, setTempatLahirPemohonError] = useState("");
  const [tanggalLahirPemohonError, setTanggalLahirPemohonError] = useState("");
  const [pekerjaanPemohonError, setPekerjaanPemohonError] = useState("");
  const [alamatPemohonError, setAlamatPemohonError] = useState("");

  // Error states - Data Anak
  const [namaAnakError, setNamaAnakError] = useState("");
  const [tempatLahirAnakError, setTempatLahirAnakError] = useState("");
  const [tanggalLahirAnakError, setTanggalLahirAnakError] = useState("");
  const [agamaAnakError, setAgamaAnakError] = useState("");
  const [alamatAnakError, setAlamatAnakError] = useState("");

  // Error states - Data Orang Tua
  const [namaAyahError, setNamaAyahError] = useState("");
  const [namaIbuError, setNamaIbuError] = useState("");

  // Function to map RT/RW to simple alamat format
  const mapRTRWToAlamat = (rt: string, rw: string): string => {
    return `RT ${rt || ""}/RW ${rw || ""}, Desa Kepohkencono`;
  };

  // Function to handle person selection
  const handlePersonSelect = (person: PersonData | null) => {
    setSelectedPerson(person);
    
    if (person) {
      // Auto-fill available fields for pemohon
      setNamaPemohon(person.NAMA || "");
      setTempatLahirPemohon(person.TMPT_LHR || "");
      
      // Convert timestamp to date if available
      if (person.TGL_LHR) {
        const dateStr = convertTimestampToDate(person.TGL_LHR);
        setTanggalLahirPemohon(dateStr);
      }
      
      setJenisKelaminPemohon(person.JK || "L");
      setPekerjaanPemohon(person.PEKERJAAN || "");
      
      // Map RT/RW to alamat
      if (person.RT && person.RW) {
        const alamat = mapRTRWToAlamat(person.RT, person.RW);
        setAlamatPemohon(alamat);
      }
      
      // Clear related errors
      setNamaPemohonError("");
      setTempatLahirPemohonError("");
      setTanggalLahirPemohonError("");
      setPekerjaanPemohonError("");
      setAlamatPemohonError("");
    }
  };

  const resetForm = () => {
    // Reset form fields - Data Pemohon
    setNamaPemohon("");
    setTempatLahirPemohon("Pati");
    setTanggalLahirPemohon("");
    setJenisKelaminPemohon("L");
    setPekerjaanPemohon("");
    setAlamatPemohon("");

    // Reset form fields - Data Anak
    setNamaAnak("");
    setTempatLahirAnak("");
    setTanggalLahirAnak("");
    setJenisKelaminAnak("L");
    setAgamaAnak("");
    setAlamatAnak("");

    // Reset form fields - Data Orang Tua
    setNamaAyah("");
    setNamaIbu("");

    // Reset person search state
    setSelectedPerson(null);

    // Reset error states - Data Pemohon
    setNamaPemohonError("");
    setTempatLahirPemohonError("");
    setTanggalLahirPemohonError("");
    setPekerjaanPemohonError("");
    setAlamatPemohonError("");

    // Reset error states - Data Anak
    setNamaAnakError("");
    setTempatLahirAnakError("");
    setTanggalLahirAnakError("");
    setAgamaAnakError("");
    setAlamatAnakError("");

    // Reset error states - Data Orang Tua
    setNamaAyahError("");
    setNamaIbuError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    let isValid = true;

    // Validate Data Pemohon
    if (!namaPemohon.trim()) {
      setNamaPemohonError("Nama pemohon harus diisi");
      isValid = false;
    } else {
      setNamaPemohonError("");
    }

    if (!tempatLahirPemohon.trim()) {
      setTempatLahirPemohonError("Tempat lahir pemohon harus diisi");
      isValid = false;
    } else {
      setTempatLahirPemohonError("");
    }

    if (!tanggalLahirPemohon.trim()) {
      setTanggalLahirPemohonError("Tanggal lahir pemohon harus diisi");
      isValid = false;
    } else {
      setTanggalLahirPemohonError("");
    }

    if (!pekerjaanPemohon.trim()) {
      setPekerjaanPemohonError("Pekerjaan pemohon harus diisi");
      isValid = false;
    } else {
      setPekerjaanPemohonError("");
    }

    if (!alamatPemohon.trim()) {
      setAlamatPemohonError("Alamat pemohon harus diisi");
      isValid = false;
    } else {
      setAlamatPemohonError("");
    }

    // Validate Data Anak
    if (!namaAnak.trim()) {
      setNamaAnakError("Nama anak harus diisi");
      isValid = false;
    } else {
      setNamaAnakError("");
    }

    if (!tempatLahirAnak.trim()) {
      setTempatLahirAnakError("Tempat lahir anak harus diisi");
      isValid = false;
    } else {
      setTempatLahirAnakError("");
    }

    if (!tanggalLahirAnak.trim()) {
      setTanggalLahirAnakError("Tanggal lahir anak harus diisi");
      isValid = false;
    } else {
      setTanggalLahirAnakError("");
    }

    if (!agamaAnak.trim()) {
      setAgamaAnakError("Agama anak harus diisi");
      isValid = false;
    } else {
      setAgamaAnakError("");
    }

    if (!alamatAnak.trim()) {
      setAlamatAnakError("Alamat anak harus diisi");
      isValid = false;
    } else {
      setAlamatAnakError("");
    }

    // Validate Data Orang Tua
    if (!namaAyah.trim()) {
      setNamaAyahError("Nama ayah harus diisi");
      isValid = false;
    } else {
      setNamaAyahError("");
    }

    if (!namaIbu.trim()) {
      setNamaIbuError("Nama ibu harus diisi");
      isValid = false;
    } else {
      setNamaIbuError("");
    }

    if (!isValid) {
      return;
    }

    // Prepare form data
    const formData: KelahiranFormData = {
      namaPemohon,
      tempatLahirPemohon,
      tanggalLahirPemohon,
      jenisKelaminPemohon,
      pekerjaanPemohon,
      alamatPemohon,
      namaAnak,
      tempatLahirAnak,
      tanggalLahirAnak,
      jenisKelaminAnak,
      agamaAnak,
      alamatAnak,
      namaAyah,
      namaIbu,
    };

    try {
      await onSubmit(formData);
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[650px] p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-0">
          <DialogTitle className="text-2xl font-bold">
            Formulir Surat Keterangan Kelahiran
          </DialogTitle>
          <DialogDescription className="text-base mt-1 mb-0">
            Silakan lengkapi data berikut untuk pembuatan Surat Keterangan
            Kelahiran.
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
              <Label htmlFor="namaPemohon" className="text-base">
                Nama
              </Label>
              <Input
                id="namaPemohon"
                placeholder="Masukkan nama lengkap"
                className={`text-base mt-2 ${
                  namaPemohonError ? "border-red-500" : "border-gray-400"
                }`}
                value={namaPemohon}
                onChange={(e) => {
                  setNamaPemohon(e.target.value);
                  setNamaPemohonError("");
                }}
              />
              {namaPemohonError && (
                <p className="text-base text-red-500 mt-1">
                  {namaPemohonError}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="space-y-2">
                <Label htmlFor="tempatLahirPemohon" className="text-base">
                  Tempat Lahir
                </Label>
                <Input
                  id="tempatLahirPemohon"
                  placeholder="Masukkan tempat lahir"
                  className={`text-base mt-2 ${
                    tempatLahirPemohonError
                      ? "border-red-500"
                      : "border-gray-400"
                  }`}
                  value={tempatLahirPemohon}
                  onChange={(e) => {
                    setTempatLahirPemohon(e.target.value);
                    setTempatLahirPemohonError("");
                  }}
                />
                {tempatLahirPemohonError && (
                  <p className="text-base text-red-500 mt-1">
                    {tempatLahirPemohonError}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tanggalLahirPemohon" className="text-base">
                  Tanggal Lahir
                </Label>
                <Input
                  id="tanggalLahirPemohon"
                  placeholder="Masukkan tanggal lahir"
                  className={`text-base mt-2 ${
                    tanggalLahirPemohonError
                      ? "border-red-500"
                      : "border-gray-400"
                  }`}
                  value={tanggalLahirPemohon}
                  onChange={(e) => {
                    setTanggalLahirPemohon(e.target.value);
                    setTanggalLahirPemohonError("");
                  }}
                />
                {tanggalLahirPemohonError && (
                  <p className="text-base text-red-500 mt-1">
                    {tanggalLahirPemohonError}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2 mt-3">
              <Label htmlFor="jenisKelaminPemohon" className="text-base">
                Jenis Kelamin
              </Label>
              <div className="flex space-x-4 mt-2 ">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="jenisKelaminPemohonL"
                    name="jenisKelaminPemohon"
                    value="L"
                    checked={jenisKelaminPemohon === "L"}
                    onChange={() => setJenisKelaminPemohon("L")}
                    className="mr-2"
                  />
                  <Label htmlFor="jenisKelaminPemohonL">Laki-laki</Label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="jenisKelaminPemohonP"
                    name="jenisKelaminPemohon"
                    value="P"
                    checked={jenisKelaminPemohon === "P"}
                    onChange={() => setJenisKelaminPemohon("P")}
                    className="mr-2"
                  />
                  <Label htmlFor="jenisKelaminPemohonP">Perempuan</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-3">
              <Label htmlFor="pekerjaanPemohon" className="text-base">
                Pekerjaan
              </Label>
              <Input
                id="pekerjaanPemohon"
                placeholder="Masukkan pekerjaan"
                className={`text-base mt-2 ${
                  pekerjaanPemohonError ? "border-red-500" : "border-gray-400"
                }`}
                value={pekerjaanPemohon}
                onChange={(e) => {
                  setPekerjaanPemohon(e.target.value);
                  setPekerjaanPemohonError("");
                }}
              />
              {pekerjaanPemohonError && (
                <p className="text-base text-red-500 mt-1">
                  {pekerjaanPemohonError}
                </p>
              )}
            </div>

            <div className="space-y-2 mt-3">
              <Label htmlFor="alamatPemohon" className="text-base">
                Alamat
              </Label>
              <Input
                id="alamatPemohon"
                placeholder="Masukkan alamat lengkap"
                className={`text-base mt-2 ${
                  alamatPemohonError ? "border-red-500" : "border-gray-400"
                }`}
                value={alamatPemohon}
                onChange={(e) => {
                  setAlamatPemohon(e.target.value);
                  setAlamatPemohonError("");
                }}
              />
              {alamatPemohonError && (
                <p className="text-base text-red-500 mt-1">
                  {alamatPemohonError}
                </p>
              )}
            </div>
          </div>

          {/* Data Anak */}
          <div className="border-t border-gray-200 pt-4 mt-2">
            <h3 className="text-lg font-semibold mb-3">Data Anak</h3>

            <div className="space-y-2">
              <Label htmlFor="namaAnak" className="text-base">
                Nama
              </Label>
              <Input
                id="namaAnak"
                placeholder="Masukkan nama lengkap anak"
                className={`text-base mt-2 ${
                  namaAnakError ? "border-red-500" : "border-gray-400"
                }`}
                value={namaAnak}
                onChange={(e) => {
                  setNamaAnak(e.target.value);
                  setNamaAnakError("");
                }}
              />
              {namaAnakError && (
                <p className="text-base text-red-500 mt-1">{namaAnakError}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="space-y-2">
                <Label htmlFor="tempatLahirAnak" className="text-base">
                  Tempat Lahir
                </Label>
                <Input
                  id="tempatLahirAnak"
                  placeholder="Masukkan tempat lahir anak"
                  className={`text-base mt-2  ${
                    tempatLahirAnakError ? "border-red-500" : "border-gray-400"
                  }`}
                  value={tempatLahirAnak}
                  onChange={(e) => {
                    setTempatLahirAnak(e.target.value);
                    setTempatLahirAnakError("");
                  }}
                />
                {tempatLahirAnakError && (
                  <p className="text-base text-red-500 mt-1">
                    {tempatLahirAnakError}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tanggalLahirAnak" className="text-base">
                  Tanggal Lahir
                </Label>
                <Input
                  id="tanggalLahirAnak"
                  placeholder="Masukkan tanggal lahir anak"
                  className={`text-base mt-2 ${
                    tanggalLahirAnakError ? "border-red-500" : "border-gray-400"
                  }`}
                  value={tanggalLahirAnak}
                  onChange={(e) => {
                    setTanggalLahirAnak(e.target.value);
                    setTanggalLahirAnakError("");
                  }}
                />
                {tanggalLahirAnakError && (
                  <p className="text-base text-red-500 mt-1">
                    {tanggalLahirAnakError}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2 mt-3">
              <Label htmlFor="jenisKelaminAnak" className="text-base">
                Jenis Kelamin
              </Label>
              <div className="flex space-x-4 mt-2 ">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="jenisKelaminAnakL"
                    name="jenisKelaminAnak"
                    value="L"
                    checked={jenisKelaminAnak === "L"}
                    onChange={() => setJenisKelaminAnak("L")}
                    className="mr-2"
                  />
                  <Label htmlFor="jenisKelaminAnakL">Laki-laki</Label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="jenisKelaminAnakP"
                    name="jenisKelaminAnak"
                    value="P"
                    checked={jenisKelaminAnak === "P"}
                    onChange={() => setJenisKelaminAnak("P")}
                    className="mr-2"
                  />
                  <Label htmlFor="jenisKelaminAnakP">Perempuan</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-3">
              <Label htmlFor="agamaAnak" className="text-base">
                Agama
              </Label>
              <Input
                id="agamaAnak"
                placeholder="Masukkan agama anak"
                className={`text-base mt-2 ${
                  agamaAnakError ? "border-red-500" : "border-gray-400"
                }`}
                value={agamaAnak}
                onChange={(e) => {
                  setAgamaAnak(e.target.value);
                  setAgamaAnakError("");
                }}
              />
              {agamaAnakError && (
                <p className="text-base text-red-500 mt-1">{agamaAnakError}</p>
              )}
            </div>

            <div className="space-y-2 mt-3">
              <Label htmlFor="alamatAnak" className="text-base">
                Alamat
              </Label>
              <Input
                id="alamatAnak"
                placeholder="Masukkan alamat anak"
                className={`text-base mt-2 ${
                  alamatAnakError ? "border-red-500" : "border-gray-400"
                }`}
                value={alamatAnak}
                onChange={(e) => {
                  setAlamatAnak(e.target.value);
                  setAlamatAnakError("");
                }}
              />
              {alamatAnakError && (
                <p className="text-base text-red-500 mt-1">{alamatAnakError}</p>
              )}
            </div>
          </div>

          {/* Data Orang Tua */}
          <div className="border-t border-gray-200 pt-4 mt-2">
            <h3 className="text-lg font-semibold mb-3">Data Orang Tua</h3>

            <div className="space-y-2">
              <Label htmlFor="namaAyah" className="text-base">
                Nama Ayah
              </Label>
              <Input
                id="namaAyah"
                placeholder="Masukkan nama ayah"
                className={`text-base mt-2 ${
                  namaAyahError ? "border-red-500" : "border-gray-400"
                }`}
                value={namaAyah}
                onChange={(e) => {
                  setNamaAyah(e.target.value);
                  setNamaAyahError("");
                }}
              />
              {namaAyahError && (
                <p className="text-base text-red-500 mt-1">{namaAyahError}</p>
              )}
            </div>

            <div className="space-y-2 mt-3">
              <Label htmlFor="namaIbu" className="text-base">
                Nama Ibu
              </Label>
              <Input
                id="namaIbu"
                placeholder="Masukkan nama ibu"
                className={`text-base mt-2 ${
                  namaIbuError ? "border-red-500" : "border-gray-400"
                }`}
                value={namaIbu}
                onChange={(e) => {
                  setNamaIbu(e.target.value);
                  setNamaIbuError("");
                }}
              />
              {namaIbuError && (
                <p className="text-base text-red-500 mt-1">{namaIbuError}</p>
              )}
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
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

export default SuratKelahiranForm;
