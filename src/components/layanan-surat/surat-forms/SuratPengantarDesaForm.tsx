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
import { CalendarIcon, Loader2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import type { SuratTemplateType } from "@/components/layanan-surat/surat-templates";

export interface PengantarDesaFormData {
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
}

interface SuratPengantarDesaFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading?: boolean;
  setIsLoading?: (value: boolean) => void;
  onSubmitSuccess?: () => void;
}

const SuratPengantarDesaForm = ({
  isOpen,
  onOpenChange,
  isLoading: externalIsLoading,
  setIsLoading: externalSetIsLoading,
  onSubmitSuccess,
}: SuratPengantarDesaFormProps) => {
  const { toast } = useToast();

  // Internal state (fallback when external props not provided)
  const [internalIsLoading, setInternalIsLoading] = useState(false);

  // Use external props if provided, otherwise use internal state
  const isLoading = externalIsLoading ?? internalIsLoading;
  const setIsLoading = externalSetIsLoading ?? setInternalIsLoading;

  // Form state
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

  // Error state
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

  // Reset form function
  const resetForm = () => {
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
        "pengantar-desa" as SuratTemplateType
      );

      // Siapkan data yang akan dikirim ke template surat
      const suratData: any = {
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
              "Surat Keterangan Pengantar Desa telah berhasil dibuat dan diunduh",
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
            Formulir Surat Keterangan Pengantar Desa
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            Silakan lengkapi data berikut untuk pembuatan Surat Keterangan
            Pengantar Desa.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmitForm} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="nama" className="text-base">
              Nama
            </Label>
            <Input
              id="nama"
              placeholder="Masukkan nama lengkap"
              className={`text-base mt-3 ${
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

          <div className="space-y-2">
            <Label htmlFor="jenisKelamin" className="text-base">
              Jenis Kelamin
            </Label>
            <div className="flex space-x-4 mt-3">
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
                <Label htmlFor="jenisKelaminLk">Laki-laki</Label>
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
                <Label htmlFor="jenisKelaminPr">Perempuan</Label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tempatLahir" className="text-base">
                Tempat Lahir
              </Label>
              <Input
                id="tempatLahir"
                placeholder="Masukkan tempat lahir"
                className="text-base mt-3 border-gray-400"
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
                className={`text-base mt-3 ${
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

          <div className="space-y-2">
            <Label htmlFor="agama" className="text-base">
              Agama
            </Label>
            <Input
              id="agama"
              placeholder="Masukkan agama"
              className={`text-base mt-3 ${
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

          <div className="space-y-2">
            <Label htmlFor="pekerjaan" className="text-base">
              Pekerjaan
            </Label>
            <Input
              id="pekerjaan"
              placeholder="Masukkan pekerjaan"
              className={`text-base mt-3 ${
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
                  className={`text-base ${
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
                  className={`text-base ${
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

          <div className="space-y-2">
            <Label className="text-base">Surat Bukti Diri</Label>
            <div className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="ktpNomor" className="text-base">
                  Nomor KTP
                </Label>
                <Input
                  id="ktpNomor"
                  placeholder="Masukkan nomor KTP"
                  className={`text-base mt-3 ${
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
                  className={`text-base mt-3 ${
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="keperluan" className="text-base">
              Keperluan
            </Label>
            <textarea
              id="keperluan"
              placeholder="Masukkan keperluan"
              className={`flex h-24 w-full mt-3 rounded-md border bg-background px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:border-black ${
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
              <p className="text-base text-red-500 mt-1">{keperluanError}</p>
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
                    className={`w-full mt-3 justify-start text-left font-normal ${
                      berlakuMulaiError ? "border-red-500" : "border-gray-400"
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {berlakuMulaiDate ? (
                      format(berlakuMulaiDate, "dd MMMM yyyy", { locale: id })
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
                    className={`w-full mt-3 justify-start text-left font-normal ${
                      berlakuSampaiError ? "border-red-500" : "border-gray-400"
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
              className="flex h-24 mt-3 w-full rounded-md border border-gray-400 bg-background px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:border-black"
              rows={4}
              value={keteranganLain}
              onChange={(e) => setKeteranganLain(e.target.value)}
            />
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

export default SuratPengantarDesaForm;
