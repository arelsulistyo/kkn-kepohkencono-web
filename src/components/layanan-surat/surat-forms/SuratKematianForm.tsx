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
import { PersonData, convertTimestampToDate } from "@/components/ui/person-search";
import PersonSearchBar from "@/components/layanan-surat/common/PersonSearchBar";

export interface KematianFormData {
  namaKematian: string;
  tempatLahirKematian: string;
  tanggalLahirKematian: string;
  jenisKelaminKematian: string;
  pekerjaanKematian: string;
  alamatKematian: string;
  agamaKematian: string;
  hariTanggalKematian: string;
  jamKematian: string;
  sebabKematian: string;
  yangMenerangkan: string;
  tempatKematian: string;
}

export interface SuratKematianFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: KematianFormData) => Promise<void>;
  isLoading: boolean;
}

const SuratKematianForm: React.FC<SuratKematianFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}) => {
  // Form state
  const [selectedPerson, setSelectedPerson] = useState<PersonData | null>(null);
  const [namaKematian, setNamaKematian] = useState("");
  const [tempatLahirKematian, setTempatLahirKematian] = useState("Pati");
  const [tanggalLahirKematian, setTanggalLahirKematian] = useState("");
  const [jenisKelaminKematian, setJenisKelaminKematian] = useState("L");
  const [pekerjaanKematian, setPekerjaanKematian] = useState("");
  const [alamatKematian, setAlamatKematian] = useState("");
  const [agamaKematian, setAgamaKematian] = useState("");
  const [hariTanggalKematian, setHariTanggalKematian] = useState("");
  const [jamKematian, setJamKematian] = useState("");
  const [sebabKematian, setSebabKematian] = useState("");
  const [yangMenerangkan, setYangMenerangkan] = useState("");
  const [tempatKematian, setTempatKematian] = useState("");

  // Error state
  const [namaKematianError, setNamaKematianError] = useState("");
  const [tempatLahirKematianError, setTempatLahirKematianError] = useState("");
  const [tanggalLahirKematianError, setTanggalLahirKematianError] =
    useState("");
  const [pekerjaanKematianError, setPekerjaanKematianError] = useState("");
  const [alamatKematianError, setAlamatKematianError] = useState("");
  const [agamaKematianError, setAgamaKematianError] = useState("");
  const [hariTanggalKematianError, setHariTanggalKematianError] = useState("");
  const [jamKematianError, setJamKematianError] = useState("");
  const [sebabKematianError, setSebabKematianError] = useState("");
  const [yangMenerangkanError, setYangMenerangkanError] = useState("");
  const [tempatKematianError, setTempatKematianError] = useState("");

  // Helper function to map RT/RW to simple alamat format
  const mapRTRWToAlamat = (rt: string, rw: string): string => {
    return `RT ${rt || ""}/RW ${rw || ""}, Desa Kepohkencono`;
  };

  // Handle person selection from search bar
  const handlePersonSelect = (person: PersonData) => {
    setSelectedPerson(person);
    
    // Auto-fill form fields
    setNamaKematian(person.NAMA || "");
    setTempatLahirKematian(person.TMPT_LHR || "Pati");
    
    // Convert timestamp to date string if available
    if (person.TGL_LHR) {
      const dateStr = convertTimestampToDate(person.TGL_LHR);
      setTanggalLahirKematian(dateStr);
    }
    
    setJenisKelaminKematian(person.JK || "L");
    setPekerjaanKematian(person.PEKERJAAN || "");
    
    // Map RT/RW to alamat
    const alamat = mapRTRWToAlamat(person.RT || "", person.RW || "");
    setAlamatKematian(alamat);
    
    setAgamaKematian(person.AGAMA || "");
    
    // Clear related errors
    setNamaKematianError("");
    setTempatLahirKematianError("");
    setTanggalLahirKematianError("");
    setPekerjaanKematianError("");
    setAlamatKematianError("");
    setAgamaKematianError("");
  };

  const resetForm = () => {
    setSelectedPerson(null);
    setNamaKematian("");
    setTempatLahirKematian("Pati");
    setTanggalLahirKematian("");
    setJenisKelaminKematian("L");
    setPekerjaanKematian("");
    setAlamatKematian("");
    setAgamaKematian("");
    setHariTanggalKematian("");
    setJamKematian("");
    setSebabKematian("");
    setYangMenerangkan("");
    setTempatKematian("");

    // Reset errors
    setNamaKematianError("");
    setTempatLahirKematianError("");
    setTanggalLahirKematianError("");
    setPekerjaanKematianError("");
    setAlamatKematianError("");
    setAgamaKematianError("");
    setHariTanggalKematianError("");
    setJamKematianError("");
    setSebabKematianError("");
    setYangMenerangkanError("");
    setTempatKematianError("");
  };

  const validateForm = (): boolean => {
    let isValid = true;

    // Validate required fields
    if (!namaKematian.trim()) {
      setNamaKematianError("Nama harus diisi");
      isValid = false;
    }

    if (!tempatLahirKematian.trim()) {
      setTempatLahirKematianError("Tempat lahir harus diisi");
      isValid = false;
    }

    if (!tanggalLahirKematian.trim()) {
      setTanggalLahirKematianError("Tanggal lahir harus diisi");
      isValid = false;
    }

    if (!pekerjaanKematian.trim()) {
      setPekerjaanKematianError("Pekerjaan harus diisi");
      isValid = false;
    }

    if (!alamatKematian.trim()) {
      setAlamatKematianError("Alamat harus diisi");
      isValid = false;
    }

    if (!agamaKematian.trim()) {
      setAgamaKematianError("Agama harus diisi");
      isValid = false;
    }

    if (!hariTanggalKematian.trim()) {
      setHariTanggalKematianError("Hari/tanggal kematian harus diisi");
      isValid = false;
    }

    if (!jamKematian.trim()) {
      setJamKematianError("Jam kematian harus diisi");
      isValid = false;
    }

    if (!sebabKematian.trim()) {
      setSebabKematianError("Sebab kematian harus diisi");
      isValid = false;
    }

    if (!yangMenerangkan.trim()) {
      setYangMenerangkanError("Yang menerangkan harus diisi");
      isValid = false;
    }

    if (!tempatKematian.trim()) {
      setTempatKematianError("Tempat kematian harus diisi");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData: KematianFormData = {
      namaKematian,
      tempatLahirKematian,
      tanggalLahirKematian,
      jenisKelaminKematian,
      pekerjaanKematian,
      alamatKematian,
      agamaKematian,
      hariTanggalKematian,
      jamKematian,
      sebabKematian,
      yangMenerangkan,
      tempatKematian,
    };

    try {
      await onSubmit(formData);
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[650px] p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-0">
          <DialogTitle className="text-2xl font-bold">
            Formulir Surat Keterangan Kematian
          </DialogTitle>
          <DialogDescription className="text-base mt-1">
            Silakan lengkapi data berikut untuk pembuatan Surat Keterangan
            Kematian.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Data Almarhum/Almarhumah */}
          <div className="pt-2 mt-1">
            <h3 className="text-lg font-semibold mb-4">
              Data Almarhum/Almarhumah
            </h3>

            <PersonSearchBar
              selectedPerson={selectedPerson}
              onPersonSelect={handlePersonSelect}
              placeholder="Cari data almarhum/almarhumah..."
            />

            <div className="space-y-2 mt-2">
              <Label htmlFor="namaKematian" className="text-base">
                Nama
              </Label>
              <Input
                id="namaKematian"
                placeholder="Masukkan nama lengkap"
                className={`text-base mt-2 ${
                  namaKematianError ? "border-red-500" : "border-gray-400"
                }`}
                value={namaKematian}
                onChange={(e) => {
                  setNamaKematian(e.target.value);
                  setNamaKematianError("");
                }}
              />
              {namaKematianError && (
                <p className="text-base text-red-500 mt-1">
                  {namaKematianError}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="space-y-2">
                <Label htmlFor="tempatLahirKematian" className="text-base">
                  Tempat Lahir
                </Label>
                <Input
                  id="tempatLahirKematian"
                  placeholder="Masukkan tempat lahir"
                  className={`text-base mt-2 ${
                    tempatLahirKematianError
                      ? "border-red-500"
                      : "border-gray-400"
                  }`}
                  value={tempatLahirKematian}
                  onChange={(e) => {
                    setTempatLahirKematian(e.target.value);
                    setTempatLahirKematianError("");
                  }}
                />
                {tempatLahirKematianError && (
                  <p className="text-base text-red-500 mt-1">
                    {tempatLahirKematianError}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tanggalLahirKematian" className="text-base">
                  Tanggal Lahir
                </Label>
                <Input
                  id="tanggalLahirKematian"
                  placeholder="Masukkan tanggal lahir"
                  className={`text-base mt-2 ${
                    tanggalLahirKematianError
                      ? "border-red-500"
                      : "border-gray-400"
                  }`}
                  value={tanggalLahirKematian}
                  onChange={(e) => {
                    setTanggalLahirKematian(e.target.value);
                    setTanggalLahirKematianError("");
                  }}
                />
                {tanggalLahirKematianError && (
                  <p className="text-base text-red-500 mt-1">
                    {tanggalLahirKematianError}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2 mt-3">
              <Label htmlFor="jenisKelaminKematian" className="text-base">
                Jenis Kelamin
              </Label>
              <div className="flex space-x-4 mt-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="jenisKelaminL"
                    name="jenisKelaminKematian"
                    value="L"
                    checked={jenisKelaminKematian === "L"}
                    onChange={() => setJenisKelaminKematian("L")}
                    className="mr-2"
                  />
                  <Label htmlFor="jenisKelaminL">Laki-laki</Label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="jenisKelaminP"
                    name="jenisKelaminKematian"
                    value="P"
                    checked={jenisKelaminKematian === "P"}
                    onChange={() => setJenisKelaminKematian("P")}
                    className="mr-2"
                  />
                  <Label htmlFor="jenisKelaminP">Perempuan</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-3">
              <Label htmlFor="pekerjaanKematian" className="text-base">
                Pekerjaan
              </Label>
              <Input
                id="pekerjaanKematian"
                placeholder="Masukkan pekerjaan"
                className={`text-base mt-2 ${
                  pekerjaanKematianError ? "border-red-500" : "border-gray-400"
                }`}
                value={pekerjaanKematian}
                onChange={(e) => {
                  setPekerjaanKematian(e.target.value);
                  setPekerjaanKematianError("");
                }}
              />
              {pekerjaanKematianError && (
                <p className="text-base text-red-500 mt-1">
                  {pekerjaanKematianError}
                </p>
              )}
            </div>

            <div className="space-y-2 mt-3">
              <Label htmlFor="alamatKematian" className="text-base">
                Alamat
              </Label>
              <Input
                id="alamatKematian"
                placeholder="Masukkan alamat lengkap"
                className={`text-base mt-2 ${
                  alamatKematianError ? "border-red-500" : "border-gray-400"
                }`}
                value={alamatKematian}
                onChange={(e) => {
                  setAlamatKematian(e.target.value);
                  setAlamatKematianError("");
                }}
              />
              {alamatKematianError && (
                <p className="text-base text-red-500 mt-1">
                  {alamatKematianError}
                </p>
              )}
            </div>

            <div className="space-y-2 mt-3">
              <Label htmlFor="agamaKematian" className="text-base">
                Agama
              </Label>
              <Input
                id="agamaKematian"
                placeholder="Masukkan agama"
                className={`text-base mt-2 ${
                  agamaKematianError ? "border-red-500" : "border-gray-400"
                }`}
                value={agamaKematian}
                onChange={(e) => {
                  setAgamaKematian(e.target.value);
                  setAgamaKematianError("");
                }}
              />
              {agamaKematianError && (
                <p className="text-base text-red-500 mt-1">
                  {agamaKematianError}
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-2 mt-6">
            <h3 className="text-lg font-semibold mb-1">Data Kematian</h3>

            <div className="space-y-2">
              <Label htmlFor="hariTanggalKematian" className="text-base">
                Hari/Tanggal Kematian
              </Label>
              <Input
                id="hariTanggalKematian"
                placeholder="Contoh: Senin, 10 Januari 2023"
                className={`text-base mt-2 ${
                  hariTanggalKematianError
                    ? "border-red-500"
                    : "border-gray-400"
                }`}
                value={hariTanggalKematian}
                onChange={(e) => {
                  setHariTanggalKematian(e.target.value);
                  setHariTanggalKematianError("");
                }}
              />
              {hariTanggalKematianError && (
                <p className="text-base text-red-500 mt-1">
                  {hariTanggalKematianError}
                </p>
              )}
            </div>

            <div className="space-y-2 mt-3">
              <Label htmlFor="jamKematian" className="text-base">
                Jam Kematian
              </Label>
              <Input
                id="jamKematian"
                placeholder="Contoh: 14:30 WIB"
                className={`text-base mt-2 ${
                  jamKematianError ? "border-red-500" : "border-gray-400"
                }`}
                value={jamKematian}
                onChange={(e) => {
                  setJamKematian(e.target.value);
                  setJamKematianError("");
                }}
              />
              {jamKematianError && (
                <p className="text-base text-red-500 mt-1">
                  {jamKematianError}
                </p>
              )}
            </div>

            <div className="space-y-2 mt-3">
              <Label htmlFor="sebabKematian" className="text-base">
                Sebab Kematian
              </Label>
              <Input
                id="sebabKematian"
                placeholder="Masukkan sebab kematian"
                className={`text-base mt-2 ${
                  sebabKematianError ? "border-red-500" : "border-gray-400"
                }`}
                value={sebabKematian}
                onChange={(e) => {
                  setSebabKematian(e.target.value);
                  setSebabKematianError("");
                }}
              />
              {sebabKematianError && (
                <p className="text-base text-red-500 mt-1">
                  {sebabKematianError}
                </p>
              )}
            </div>

            <div className="space-y-2 mt-3">
              <Label htmlFor="yangMenerangkan" className="text-base">
                Yang Menerangkan Kematian
              </Label>
              <Input
                id="yangMenerangkan"
                placeholder="Contoh: Dokter RS Pati / Keluarga"
                className={`text-base mt-2 ${
                  yangMenerangkanError ? "border-red-500" : "border-gray-400"
                }`}
                value={yangMenerangkan}
                onChange={(e) => {
                  setYangMenerangkan(e.target.value);
                  setYangMenerangkanError("");
                }}
              />
              {yangMenerangkanError && (
                <p className="text-base text-red-500 mt-1">
                  {yangMenerangkanError}
                </p>
              )}
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="tempatKematian" className="text-base">
                Tempat Kematian
              </Label>
              <Input
                id="tempatKematian"
                placeholder="Contoh: RS Pati / Rumah"
                className={`text-base mt-2 ${
                  tempatKematianError ? "border-red-500" : "border-gray-400"
                }`}
                value={tempatKematian}
                onChange={(e) => {
                  setTempatKematian(e.target.value);
                  setTempatKematianError("");
                }}
              />
              {tempatKematianError && (
                <p className="text-base text-red-500 mt-1">
                  {tempatKematianError}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="mt-4">
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

export default SuratKematianForm;
