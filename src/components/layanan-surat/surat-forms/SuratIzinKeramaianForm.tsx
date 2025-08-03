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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import IndonesianCalendar from "@/components/ui/indonesian-calendar";
import { CalendarIcon, Loader2, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import type { SuratTemplateType } from "@/components/layanan-surat/surat-templates";
import PersonSearchBar from "@/components/layanan-surat/common/PersonSearchBar";
import type { PersonData } from "@/components/ui/person-search";

export interface IzinKeramaianFormData {
  // Personal data (shared with Pengantar Desa)
  nama: string;
  jenisKelamin: string;
  tempatLahir: string;
  tanggalLahir: string;
  agama: string;
  pekerjaan: string;
  rt: string;
  rw: string;
  ktpNomor: string;
  kkNomor: string;
  keperluan: string;
  berlakuMulai: string;
  berlakuSampai: string;
  keteranganLain: string;

  // Unique to Izin Keramaian
  noHP: string;
  jabatan: string;
  namaAcara: string;
  tanggalAcara: string;
  waktuAcara: string;
  tempatAcara: string;
  detailAcara: string;
  pemilikLokasiNama: string;
  pemilikLokasiAlamat: string;
  pemilikLokasiPekerjaan: string;
}

interface SuratIzinKeramaianFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading?: boolean;
  setIsLoading?: (value: boolean) => void;
  onSubmitSuccess?: () => void;
}

const SuratIzinKeramaianForm = ({
  isOpen,
  onOpenChange,
  isLoading: externalIsLoading,
  setIsLoading: externalSetIsLoading,
  onSubmitSuccess,
}: SuratIzinKeramaianFormProps) => {
  const { toast } = useToast();

  // Internal state (fallback when external props not provided)
  const [internalIsLoading, setInternalIsLoading] = useState(false);

  // Use external props if provided, otherwise use internal state
  const isLoading = externalIsLoading ?? internalIsLoading;
  const setIsLoading = externalSetIsLoading ?? setInternalIsLoading;

  // Personal data form state (shared with Pengantar Desa)
  const [nama, setNama] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("Lk");
  const [tempatLahir, setTempatLahir] = useState("Pati");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [agama, setAgama] = useState("");
  const [pekerjaan, setPekerjaan] = useState("");
  const [rt, setRt] = useState("");
  const [rw, setRw] = useState("");
  const [ktpNomor, setKtpNomor] = useState("");
  const [kkNomor, setKkNomor] = useState("");
  const [keperluan, setKeperluan] = useState("");
  const [berlakuMulai, setBerlakuMulai] = useState("");
  const [berlakuSampai, setBerlakuSampai] = useState("");
  const [berlakuMulaiDate, setBerlakuMulaiDate] = useState<Date | undefined>(
    undefined
  );
  const [berlakuSampaiDate, setBerlakuSampaiDate] = useState<Date | undefined>(
    undefined
  );
  const [keteranganLain, setKeteranganLain] = useState("");

  // Unique to Izin Keramaian form state
  const [noHP, setNoHP] = useState("");
  const [jabatan, setJabatan] = useState("Pemilik");
  const [namaAcara, setNamaAcara] = useState("");
  const [tanggalAcara, setTanggalAcara] = useState("");
  const [tanggalAcaraDate, setTanggalAcaraDate] = useState<Date | undefined>(
    undefined
  );
  const [waktuAcara, setWaktuAcara] = useState("");
  const [tempatAcara, setTempatAcara] = useState("");
  const [detailAcara, setDetailAcara] = useState("");
  const [pemilikLokasiNama, setPemilikLokasiNama] = useState("");
  const [pemilikLokasiAlamat, setPemilikLokasiAlamat] = useState("");
  const [pemilikLokasiPekerjaan, setPemilikLokasiPekerjaan] = useState("");

  // Error state for personal data
  const [namaError, setNamaError] = useState("");
  const [tanggalLahirError, setTanggalLahirError] = useState("");
  const [agamaError, setAgamaError] = useState("");
  const [pekerjaanError, setPekerjaanError] = useState("");
  const [rtError, setRtError] = useState("");
  const [rwError, setRwError] = useState("");
  const [ktpNomorError, setKtpNomorError] = useState("");
  const [kkNomorError, setKkNomorError] = useState("");
  const [keperluanError, setKeperluanError] = useState("");
  const [berlakuMulaiError, setBerlakuMulaiError] = useState("");
  const [berlakuSampaiError, setBerlakuSampaiError] = useState("");

  // Error state for Izin Keramaian specific fields
  const [noHPError, setNoHPError] = useState("");
  const [namaAcaraError, setNamaAcaraError] = useState("");
  const [tanggalAcaraError, setTanggalAcaraError] = useState("");
  const [waktuAcaraError, setWaktuAcaraError] = useState("");
  const [tempatAcaraError, setTempatAcaraError] = useState("");
  const [detailAcaraError, setDetailAcaraError] = useState("");
  const [pemilikLokasiNamaError, setPemilikLokasiNamaError] = useState("");
  const [pemilikLokasiAlamatError, setPemilikLokasiAlamatError] = useState("");
  const [pemilikLokasiPekerjaanError, setPemilikLokasiPekerjaanError] =
    useState("");

  // PersonSearchBar state
  const [selectedPemohon, setSelectedPemohon] = useState<PersonData | null>(null);
  const [selectedPemilikLokasi, setSelectedPemilikLokasi] = useState<PersonData | null>(null);

  // Reset form function
  const resetForm = () => {
    // Reset personal data
    setNama("");
    setJenisKelamin("Lk");
    setTempatLahir("Pati");
    setTanggalLahir("");
    setAgama("");
    setPekerjaan("");
    setRt("");
    setRw("");
    setKtpNomor("");
    setKkNomor("");
    setKeperluan("");
    setBerlakuMulai("");
    setBerlakuSampai("");
    setBerlakuMulaiDate(undefined);
    setBerlakuSampaiDate(undefined);
    setKeteranganLain("");

    // Reset Izin Keramaian specific data
    setNoHP("");
    setJabatan("Pemilik");
    setNamaAcara("");
    setTanggalAcara("");
    setTanggalAcaraDate(undefined);
    setWaktuAcara("");
    setTempatAcara("");
    setDetailAcara("");
    setPemilikLokasiNama("");
    setPemilikLokasiAlamat("");
    setPemilikLokasiPekerjaan("");

    // Reset error states
    setNamaError("");
    setTanggalLahirError("");
    setAgamaError("");
    setPekerjaanError("");
    setRtError("");
    setRwError("");
    setKtpNomorError("");
    setKkNomorError("");
    setKeperluanError("");
    setBerlakuMulaiError("");
    setBerlakuSampaiError("");
    setNoHPError("");
    setNamaAcaraError("");
    setTanggalAcaraError("");
    setWaktuAcaraError("");
    setTempatAcaraError("");
    setDetailAcaraError("");
    setPemilikLokasiNamaError("");
    setPemilikLokasiAlamatError("");
    setPemilikLokasiPekerjaanError("");
    
    // Reset PersonSearchBar state
    setSelectedPemohon(null);
    setSelectedPemilikLokasi(null);
  };

  // Handle person selection for Data Pemohon
  const handlePemohonSelect = (person: PersonData) => {
    setSelectedPemohon(person);
    
    // Auto-fill personal data
    setNama(person.NAMA || "");
    setJenisKelamin(person.JK === "LAKI-LAKI" ? "Lk" : "Pr");
    setTempatLahir(person.TMPT_LHR || "Pati");
    setTanggalLahir(person.TGL_LHR || "");
    setAgama(person.AGAMA || "");
    setPekerjaan(person.PEKERJAAN || "");
    setRt(person.RT || "");
    setRw(person.RW || "");
    setKtpNomor(person.NIK || "");
    setKkNomor(person.NO_KK || "");
    
    // Clear errors
    setNamaError("");
    setTanggalLahirError("");
    setAgamaError("");
    setPekerjaanError("");
    setRtError("");
    setRwError("");
    setKtpNomorError("");
    setKkNomorError("");
  };

  // Handle person selection for Data Pemilik Lokasi
  const handlePemilikLokasiSelect = (person: PersonData) => {
    setSelectedPemilikLokasi(person);
    
    // Auto-fill location owner data
    setPemilikLokasiNama(person.NAMA || "");
    setPemilikLokasiAlamat(`RT ${person.RT || ""}/RW ${person.RW || ""}, Desa Kepohkencono`);
    setPemilikLokasiPekerjaan(person.PEKERJAAN || "");
    
    // Clear errors
    setPemilikLokasiNamaError("");
    setPemilikLokasiAlamatError("");
    setPemilikLokasiPekerjaanError("");
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
        "izin-keramaian" as SuratTemplateType
      );

      // Siapkan data yang akan dikirim ke template surat
      const suratData: any = {
        // Personal data
        nama,
        jenisKelamin,
        tempatLahir,
        tanggalLahir,
        agama,
        pekerjaan,
        tempatTinggal: {
          rt,
          rw,
        },
        suratBuktiDiri: {
          ktpNomor,
          kkNomor,
        },
        keperluan,
        berlakuMulai,
        berlakuSampai,
        keteranganLain,

        // Izin Keramaian specific data
        noHP,
        jabatan,
        acara: {
          namaAcara,
          tanggalAcara,
          waktuAcara,
          tempatAcara,
          detailAcara,
        },
        pemilikLokasi: {
          nama: pemilikLokasiNama,
          alamat: pemilikLokasiAlamat,
          pekerjaan: pemilikLokasiPekerjaan,
        },
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

    // Personal data validation
    if (!nama.trim()) {
      setNamaError("Nama harus diisi");
      isValid = false;
    } else {
      setNamaError("");
    }

    if (!tanggalLahir.trim()) {
      setTanggalLahirError("Tanggal lahir harus diisi");
      isValid = false;
    } else {
      setTanggalLahirError("");
    }

    if (!agama.trim()) {
      setAgamaError("Agama harus diisi");
      isValid = false;
    } else {
      setAgamaError("");
    }

    if (!pekerjaan.trim()) {
      setPekerjaanError("Pekerjaan harus diisi");
      isValid = false;
    } else {
      setPekerjaanError("");
    }

    if (!rt.trim()) {
      setRtError("RT harus diisi");
      isValid = false;
    } else {
      setRtError("");
    }

    if (!rw.trim()) {
      setRwError("RW harus diisi");
      isValid = false;
    } else {
      setRwError("");
    }

    if (!ktpNomor.trim()) {
      setKtpNomorError("Nomor KTP harus diisi");
      isValid = false;
    } else {
      setKtpNomorError("");
    }

    if (!kkNomor.trim()) {
      setKkNomorError("Nomor KK harus diisi");
      isValid = false;
    } else {
      setKkNomorError("");
    }

    if (!keperluan.trim()) {
      setKeperluanError("Keperluan harus diisi");
      isValid = false;
    } else {
      setKeperluanError("");
    }

    if (!berlakuMulai.trim()) {
      setBerlakuMulaiError("Tanggal mulai berlaku harus diisi");
      isValid = false;
    } else {
      setBerlakuMulaiError("");
    }

    if (!berlakuSampai.trim()) {
      setBerlakuSampaiError("Tanggal akhir berlaku harus diisi");
      isValid = false;
    } else {
      setBerlakuSampaiError("");
    }

    // Izin Keramaian specific validation
    if (!noHP.trim()) {
      setNoHPError("Nomor HP harus diisi");
      isValid = false;
    } else {
      setNoHPError("");
    }

    if (!namaAcara.trim()) {
      setNamaAcaraError("Nama acara/hajat harus diisi");
      isValid = false;
    } else {
      setNamaAcaraError("");
    }

    if (!tanggalAcara.trim()) {
      setTanggalAcaraError("Tanggal acara harus diisi");
      isValid = false;
    } else {
      setTanggalAcaraError("");
    }

    if (!waktuAcara.trim()) {
      setWaktuAcaraError("Waktu acara harus diisi");
      isValid = false;
    } else {
      setWaktuAcaraError("");
    }

    if (!tempatAcara.trim()) {
      setTempatAcaraError("Tempat acara harus diisi");
      isValid = false;
    } else {
      setTempatAcaraError("");
    }

    if (!detailAcara.trim()) {
      setDetailAcaraError("Detail acara/hajat harus diisi");
      isValid = false;
    } else {
      setDetailAcaraError("");
    }

    if (!pemilikLokasiNama.trim()) {
      setPemilikLokasiNamaError("Nama pemilik lokasi harus diisi");
      isValid = false;
    } else {
      setPemilikLokasiNamaError("");
    }

    if (!pemilikLokasiAlamat.trim()) {
      setPemilikLokasiAlamatError("Alamat pemilik lokasi harus diisi");
      isValid = false;
    } else {
      setPemilikLokasiAlamatError("");
    }

    if (!pemilikLokasiPekerjaan.trim()) {
      setPemilikLokasiPekerjaanError("Pekerjaan pemilik lokasi harus diisi");
      isValid = false;
    } else {
      setPemilikLokasiPekerjaanError("");
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
              "Surat Permohonan Izin Keramaian telah berhasil dibuat dan diunduh",
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
            Formulir Surat Permohonan Izin Keramaian
          </DialogTitle>
          <DialogDescription className="text-base mt-1 mb-0">
            Silakan lengkapi data berikut untuk pembuatan Surat Permohonan Izin
            Keramaian.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmitForm} className="space-y-4 mt-0">
          {/* Data Pemohon */}
          <div className="pt-2 mt-1">
            <h3 className="text-lg font-semibold mb-4">Data Pemohon</h3>

            <PersonSearchBar
              selectedPerson={selectedPemohon}
              onPersonSelect={handlePemohonSelect}
              title="Pencarian Data Pemohon"
              description="Gunakan pencarian di atas untuk memilih data pemohon dari database. Data akan otomatis terisi ke form di bawah."
            />

            <div className="space-y-2">
              <Label htmlFor="nama" className="text-base">
                Nama
              </Label>
              <Input
                id="nama"
                placeholder="Masukkan nama lengkap"
                className={`text-base mt-2 ${
                  namaError ? "border-red-500" : "border-gray-400"
                }`}
                value={nama}
                onChange={(e) => {
                  setNama(e.target.value);
                  setNamaError("");
                }}
              />
              {namaError && (
                <p className="text-base text-red-500 mt-1">{namaError}</p>
              )}
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="jenisKelamin" className="text-base">
                Jenis Kelamin
              </Label>
              <div className="flex space-x-4 mt-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="jenisKelaminLk"
                    name="jenisKelamin"
                    value="Lk"
                    checked={jenisKelamin === "Lk"}
                    onChange={() => setJenisKelamin("Lk")}
                    className="mr-2"
                  />
                  <Label htmlFor="jenisKelaminLk" className="text-base">
                    Laki-laki
                  </Label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="jenisKelaminPr"
                    name="jenisKelamin"
                    value="Pr"
                    checked={jenisKelamin === "Pr"}
                    onChange={() => setJenisKelamin("Pr")}
                    className="mr-2"
                  />
                  <Label htmlFor="jenisKelaminPr" className="text-base">
                    Perempuan
                  </Label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="tempatLahir" className="text-base">
                  Tempat Lahir
                </Label>
                <Input
                  id="tempatLahir"
                  placeholder="Masukkan tempat lahir"
                  className="text-base mt-2 border-gray-400"
                  value={tempatLahir}
                  onChange={(e) => setTempatLahir(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tanggalLahir" className="text-base">
                  Tanggal Lahir
                </Label>
                <Input
                  id="tanggalLahir"
                  placeholder="Masukkan tanggal lahir"
                  className={`text-base mt-2 ${
                    tanggalLahirError ? "border-red-500" : "border-gray-400"
                  }`}
                  value={tanggalLahir}
                  onChange={(e) => {
                    setTanggalLahir(e.target.value);
                    setTanggalLahirError("");
                  }}
                />
                {tanggalLahirError && (
                  <p className="text-base text-red-500 mt-1">
                    {tanggalLahirError}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="agama" className="text-base">
                Agama
              </Label>
              <Input
                id="agama"
                placeholder="Masukkan agama"
                className={`text-base mt-2 ${
                  agamaError ? "border-red-500" : "border-gray-400"
                }`}
                value={agama}
                onChange={(e) => {
                  setAgama(e.target.value);
                  setAgamaError("");
                }}
              />
              {agamaError && (
                <p className="text-base text-red-500 mt-1">{agamaError}</p>
              )}
            </div>

            <div className="space-y-2 mt-4">
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
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Data Alamat</h3>

            <div className="space-y-2">
              <Label className="text-base">Tempat Tinggal</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="space-y-2">
                  <Label htmlFor="rt" className="text-base">
                    RT
                  </Label>
                  <Input
                    id="rt"
                    placeholder="Masukkan RT"
                    className={`text-base mt-2 ${
                      rtError ? "border-red-500" : "border-gray-400"
                    }`}
                    value={rt}
                    onChange={(e) => {
                      setRt(e.target.value);
                      setRtError("");
                    }}
                  />
                  {rtError && (
                    <p className="text-base text-red-500 mt-1">{rtError}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rw" className="text-base">
                    RW
                  </Label>
                  <Input
                    id="rw"
                    placeholder="Masukkan RW"
                    className={`text-base mt-2 ${
                      rwError ? "border-red-500" : "border-gray-400"
                    }`}
                    value={rw}
                    onChange={(e) => {
                      setRw(e.target.value);
                      setRwError("");
                    }}
                  />
                  {rwError && (
                    <p className="text-base text-red-500 mt-1">{rwError}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Data Dokumen
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ktpNomor" className="text-base">
                  Nomor KTP
                </Label>
                <Input
                  id="ktpNomor"
                  placeholder="Masukkan nomor KTP"
                  className={`text-base mt-2 ${
                    ktpNomorError ? "border-red-500" : "border-gray-400"
                  }`}
                  value={ktpNomor}
                  onChange={(e) => {
                    setKtpNomor(e.target.value);
                    setKtpNomorError("");
                  }}
                />
                {ktpNomorError && (
                  <p className="text-base text-red-500 mt-1">{ktpNomorError}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="kkNomor" className="text-base">
                  Nomor KK
                </Label>
                <Input
                  id="kkNomor"
                  placeholder="Masukkan nomor KK"
                  className={`text-base mt-2 ${
                    kkNomorError ? "border-red-500" : "border-gray-400"
                  }`}
                  value={kkNomor}
                  onChange={(e) => {
                    setKkNomor(e.target.value);
                    setKkNomorError("");
                  }}
                />
                {kkNomorError && (
                  <p className="text-base text-red-500 mt-1">{kkNomorError}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Data Keperluan
              </h3>

              <div className="space-y-2">
                <Label htmlFor="keperluan" className="text-base">
                  Keperluan
                </Label>
                <textarea
                  id="keperluan"
                  placeholder="Masukkan keperluan"
                  className={`flex h-24 mt-2 w-full rounded-md border bg-background px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:border-black ${
                    keperluanError ? "border-red-500" : "border-gray-400"
                  }`}
                  rows={4}
                  value={keperluan}
                  onChange={(e) => {
                    setKeperluan(e.target.value);
                    setKeperluanError("");
                  }}
                />
                {keperluanError && (
                  <p className="text-base text-red-500 mt-1">
                    {keperluanError}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="berlakuMulai" className="text-base">
                    Berlaku Mulai
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full mt-2 justify-start text-left font-normal ${
                          berlakuMulaiError
                            ? "border-red-500"
                            : "border-gray-400"
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {berlakuMulaiDate ? (
                          format(berlakuMulaiDate, "dd MMMM yyyy", {
                            locale: id,
                          })
                        ) : (
                          <span className="text-muted-foreground">
                            Masukkan tanggal mulai
                          </span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <IndonesianCalendar
                        value={berlakuMulaiDate}
                        onChange={(date) => {
                          if (date) {
                            setBerlakuMulaiDate(date);
                            const formattedDate = format(date, "dd MMMM yyyy", {
                              locale: id,
                            });
                            setBerlakuMulai(formattedDate);
                            setBerlakuMulaiError("");

                            // Close the popover immediately after selection
                            const closeEvent = new Event("keydown");
                            Object.defineProperty(closeEvent, "key", {
                              value: "Escape",
                            });
                            document.dispatchEvent(closeEvent);
                          }
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  {berlakuMulaiError && (
                    <p className="text-base text-red-500 mt-1">
                      {berlakuMulaiError}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="berlakuSampai" className="text-base">
                    Berlaku Sampai
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full mt-2 justify-start text-left font-normal ${
                          berlakuSampaiError
                            ? "border-red-500"
                            : "border-gray-400"
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {berlakuSampaiDate ? (
                          format(berlakuSampaiDate, "dd MMMM yyyy", {
                            locale: id,
                          })
                        ) : (
                          <span className="text-muted-foreground">
                            Masukkan tanggal akhir
                          </span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <IndonesianCalendar
                        value={berlakuSampaiDate}
                        onChange={(date) => {
                          if (date) {
                            setBerlakuSampaiDate(date);
                            const formattedDate = format(date, "dd MMMM yyyy", {
                              locale: id,
                            });
                            setBerlakuSampai(formattedDate);
                            setBerlakuSampaiError("");

                            // Close the popover immediately after selection
                            const closeEvent = new Event("keydown");
                            Object.defineProperty(closeEvent, "key", {
                              value: "Escape",
                            });
                            document.dispatchEvent(closeEvent);
                          }
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  {berlakuSampaiError && (
                    <p className="text-base text-red-500 mt-1">
                      {berlakuSampaiError}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keteranganLain" className="text-base">
                  Keterangan Lain-lain
                </Label>
                <textarea
                  id="keteranganLain"
                  placeholder="Masukkan keterangan lain (opsional)"
                  className="flex h-24 mt-2 w-full rounded-md border border-gray-400 bg-background px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:border-black"
                  rows={4}
                  value={keteranganLain}
                  onChange={(e) => setKeteranganLain(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Data Kontak Pemohon
              </h3>

              <div className="space-y-2">
                <Label htmlFor="noHP" className="text-base">
                  Nomor HP
                </Label>
                <Input
                  id="noHP"
                  placeholder="Masukkan nomor HP"
                  className={`text-base mt-2 ${
                    noHPError ? "border-red-500" : "border-gray-400"
                  }`}
                  value={noHP}
                  onChange={(e) => {
                    setNoHP(e.target.value);
                    setNoHPError("");
                  }}
                />
                {noHPError && (
                  <p className="text-base text-red-500 mt-1">{noHPError}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Data Acara
              </h3>

              <div className="space-y-2">
                <Label htmlFor="jabatan" className="text-base">
                  Jabatan
                </Label>
                <div className="flex space-x-4 mt-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="jabatanPemilik"
                      name="jabatan"
                      value="Pemilik"
                      checked={jabatan === "Pemilik"}
                      onChange={() => setJabatan("Pemilik")}
                      className="mr-2"
                    />
                    <Label htmlFor="jabatanPemilik" className="text-base">
                      Pemilik Hajat Keramaian
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="jabatanPanitia"
                      name="jabatan"
                      value="Panitia"
                      checked={jabatan === "Panitia"}
                      onChange={() => setJabatan("Panitia")}
                      className="mr-2"
                    />
                    <Label htmlFor="jabatanPanitia" className="text-base">
                      Panitia Hajat Keramaian
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="namaAcara" className="text-base">
                  Nama Acara/Hajat
                </Label>
                <Input
                  id="namaAcara"
                  placeholder="Masukkan nama acara/hajat"
                  className={`text-base mt-2 ${
                    namaAcaraError ? "border-red-500" : "border-gray-400"
                  }`}
                  value={namaAcara}
                  onChange={(e) => {
                    setNamaAcara(e.target.value);
                    setNamaAcaraError("");
                  }}
                />
                {namaAcaraError && (
                  <p className="text-base text-red-500 mt-1">
                    {namaAcaraError}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tanggalAcara" className="text-base">
                  Tanggal Acara
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full mt-2 justify-start text-left font-normal ${
                        tanggalAcaraError ? "border-red-500" : "border-gray-400"
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {tanggalAcaraDate ? (
                        format(tanggalAcaraDate, "dd MMMM yyyy", { locale: id })
                      ) : (
                        <span className="text-muted-foreground">
                          Masukkan tanggal acara
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <IndonesianCalendar
                      value={tanggalAcaraDate}
                      onChange={(date) => {
                        if (date) {
                          setTanggalAcaraDate(date);
                          const formattedDate = format(date, "dd MMMM yyyy", {
                            locale: id,
                          });
                          setTanggalAcara(formattedDate);
                          setTanggalAcaraError("");

                          // Close the popover immediately after selection
                          const closeEvent = new Event("keydown");
                          Object.defineProperty(closeEvent, "key", {
                            value: "Escape",
                          });
                          document.dispatchEvent(closeEvent);
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
                {tanggalAcaraError && (
                  <p className="text-base text-red-500 mt-1">
                    {tanggalAcaraError}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="waktuAcara" className="text-base">
                  Waktu Acara
                </Label>
                <Input
                  id="waktuAcara"
                  placeholder="Masukkan waktu acara (contoh: 09.00 - 17.00 WIB)"
                  className={`text-base mt-2 ${
                    waktuAcaraError ? "border-red-500" : "border-gray-400"
                  }`}
                  value={waktuAcara}
                  onChange={(e) => {
                    setWaktuAcara(e.target.value);
                    setWaktuAcaraError("");
                  }}
                />
                {waktuAcaraError && (
                  <p className="text-base text-red-500 mt-1">
                    {waktuAcaraError}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tempatAcara" className="text-base">
                  Tempat Acara
                </Label>
                <Input
                  id="tempatAcara"
                  placeholder="Masukkan tempat acara"
                  className={`text-base mt-2 ${
                    tempatAcaraError ? "border-red-500" : "border-gray-400"
                  }`}
                  value={tempatAcara}
                  onChange={(e) => {
                    setTempatAcara(e.target.value);
                    setTempatAcaraError("");
                  }}
                />
                {tempatAcaraError && (
                  <p className="text-base text-red-500 mt-1">
                    {tempatAcaraError}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="detailAcara" className="text-base">
                  Detail Acara/Hajat
                </Label>
                <textarea
                  id="detailAcara"
                  placeholder="Masukkan detail acara/hajat"
                  className={`flex h-24 mt-2 w-full rounded-md border bg-background px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:border-black ${
                    detailAcaraError ? "border-red-500" : "border-gray-400"
                  }`}
                  rows={4}
                  value={detailAcara}
                  onChange={(e) => {
                    setDetailAcara(e.target.value);
                    setDetailAcaraError("");
                  }}
                />
                {detailAcaraError && (
                  <p className="text-base text-red-500 mt-1">
                    {detailAcaraError}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Data Pemilik Lokasi
            </h3>
            <p className="text-sm text-gray-600">
              Isi data pemilik lokasi untuk halaman surat keterangan ijin tempat
              lokasi kegiatan
            </p>

            <PersonSearchBar
              selectedPerson={selectedPemilikLokasi}
              onPersonSelect={handlePemilikLokasiSelect}
              title="Pencarian Data Pemilik Lokasi"
              description="Gunakan pencarian di atas untuk memilih data pemilik lokasi dari database. Data akan otomatis terisi ke form di bawah."
            />

            <div className="space-y-2">
              <Label htmlFor="pemilikLokasiNama" className="text-base">
                Nama Pemilik Lokasi
              </Label>
              <Input
                id="pemilikLokasiNama"
                placeholder="Masukkan nama pemilik lokasi"
                className={`text-base mt-2 ${
                  pemilikLokasiNamaError ? "border-red-500" : "border-gray-400"
                }`}
                value={pemilikLokasiNama}
                onChange={(e) => {
                  setPemilikLokasiNama(e.target.value);
                  setPemilikLokasiNamaError("");
                }}
              />
              {pemilikLokasiNamaError && (
                <p className="text-base text-red-500 mt-1">
                  {pemilikLokasiNamaError}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pemilikLokasiAlamat" className="text-base">
                Alamat Pemilik Lokasi
              </Label>
              <Input
                id="pemilikLokasiAlamat"
                placeholder="Masukkan alamat pemilik lokasi"
                className={`text-base mt-2 ${
                  pemilikLokasiAlamatError
                    ? "border-red-500"
                    : "border-gray-400"
                }`}
                value={pemilikLokasiAlamat}
                onChange={(e) => {
                  setPemilikLokasiAlamat(e.target.value);
                  setPemilikLokasiAlamatError("");
                }}
              />
              {pemilikLokasiAlamatError && (
                <p className="text-base text-red-500 mt-1">
                  {pemilikLokasiAlamatError}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pemilikLokasiPekerjaan" className="text-base">
                Pekerjaan Pemilik Lokasi
              </Label>
              <Input
                id="pemilikLokasiPekerjaan"
                placeholder="Masukkan pekerjaan pemilik lokasi"
                className={`text-base mt-2 ${
                  pemilikLokasiPekerjaanError
                    ? "border-red-500"
                    : "border-gray-400"
                }`}
                value={pemilikLokasiPekerjaan}
                onChange={(e) => {
                  setPemilikLokasiPekerjaan(e.target.value);
                  setPemilikLokasiPekerjaanError("");
                }}
              />
              {pemilikLokasiPekerjaanError && (
                <p className="text-base text-red-500 mt-1">
                  {pemilikLokasiPekerjaanError}
                </p>
              )}
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

export default SuratIzinKeramaianForm;
