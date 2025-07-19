import { useState } from "react";
import type { SuratTemplateType } from "@/components/surat-templates";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  FileText,
  Clock,
  CheckCircle,
  Users,
  Loader2,
  CalendarIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Combobox } from "@/components/ui/combobox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const LayananSurat = () => {
  const { login, logout, user, loading } = useAuth();
  const { toast } = useToast();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const services = [
    {
      id: "domisili",
      title: "Surat Keterangan Domisili",
      description: "Surat yang menyatakan tempat tinggal/domisili seseorang",
      requirements: ["KTP Asli", "Kartu Keluarga", "Surat Pengantar RT/RW"],
      estimatedTime: "1-2 Hari Kerja",
      status: "Tersedia",
    },
    {
      id: "pengantar-desa",
      title: "Surat Keterangan Pengantar Desa",
      description:
        "Surat pengantar dari desa untuk berbagai keperluan administratif",
      requirements: ["KTP Asli", "Kartu Keluarga", "Surat Pengantar RT/RW"],
      estimatedTime: "1 Hari Kerja",
      status: "Tersedia",
    },
    {
      id: "izin-keramaian",
      title: "Surat Permohonan Izin Keramaian",
      description:
        "Surat izin untuk mengadakan acara atau kegiatan yang melibatkan banyak orang",
      requirements: [
        "KTP Asli",
        "Kartu Keluarga",
        "Surat Pengantar RT/RW",
        "Rincian Acara",
      ],
      estimatedTime: "1-2 Hari Kerja",
      status: "Tersedia",
    },
    {
      id: "skck",
      title: "Surat Pengantar SKCK",
      description:
        "Surat pengantar untuk pembuatan Surat Keterangan Catatan Kepolisian",
      requirements: ["KTP Asli", "Kartu Keluarga", "Pas Foto 4x6"],
      estimatedTime: "1 Hari Kerja",
      status: "Tersedia",
    },
    {
      id: "usaha",
      title: "Surat Keterangan Usaha",
      description:
        "Surat yang menyatakan seseorang memiliki usaha/berwirausaha",
      requirements: ["KTP Asli", "Kartu Keluarga", "Foto Tempat Usaha"],
      estimatedTime: "2-3 Hari Kerja",
      status: "Tersedia",
    },
    {
      id: "tidak-mampu",
      title: "Surat Keterangan Tidak Mampu",
      description: "Surat yang menyatakan kondisi ekonomi kurang mampu",
      requirements: ["KTP Asli", "Kartu Keluarga", "Surat Pengantar RT/RW"],
      estimatedTime: "1-2 Hari Kerja",
      status: "Tersedia",
    },
    {
      id: "kelahiran",
      title: "Surat Keterangan Kelahiran",
      description: "Surat pengantar untuk pengurusan akta kelahiran",
      requirements: [
        "Surat Keterangan Lahir dari Bidan/Dokter",
        "KTP Orang Tua",
        "Kartu Keluarga",
      ],
      estimatedTime: "1 Hari Kerja",
      status: "Tersedia",
    },
    {
      id: "kematian",
      title: "Surat Keterangan Kematian",
      description: "Surat yang menyatakan seseorang telah meninggal dunia",
      requirements: [
        "Surat Keterangan Kematian dari Dokter",
        "KTP Almarhum",
        "KTP Pelapor",
      ],
      estimatedTime: "1 Hari Kerja",
      status: "Tersedia",
    },
  ];

  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isUsahaFormDialogOpen, setIsUsahaFormDialogOpen] = useState(false);
  const [isPengantarDesaFormDialogOpen, setIsPengantarDesaFormDialogOpen] =
    useState(false);
  const [isIzinKeramaianFormDialogOpen, setIsIzinKeramaianFormDialogOpen] =
    useState(false);
  const [namaPeminta, setNamaPeminta] = useState("");
  const [alamatDomisili, setAlamatDomisili] = useState("");
  const [namaPemintaError, setNamaPemintaError] = useState("");
  const [alamatDomisiliError, setAlamatDomisiliError] = useState("");

  // State untuk form Surat Keterangan Usaha
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

  // Error state untuk form Surat Keterangan Usaha
  const [pekerjaanError, setPekerjaanError] = useState("");
  const [alamatError, setAlamatError] = useState("");
  const [jenisUsahaError, setJenisUsahaError] = useState("");

  // State untuk form Surat Keterangan Pengantar Desa
  const [nama, setNama] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("Lk");
  const [tempatLahir, setTempatLahir] = useState("Pati");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [agama, setAgama] = useState("");
  const [pekerjaanPengantar, setPekerjaanPengantar] = useState("");
  const [rtPengantar, setRtPengantar] = useState("");
  const [rwPengantar, setRwPengantar] = useState("");
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

  // State untuk form Surat Izin Keramaian - tambahan fields
  const [noHP, setNoHP] = useState("");
  const [jabatan, setJabatan] = useState("Pemilik");
  const [tanggalAcara, setTanggalAcara] = useState("");
  const [tanggalAcaraDate, setTanggalAcaraDate] = useState<Date | undefined>(
    undefined
  );
  const [waktuAcara, setWaktuAcara] = useState("");
  const [tempatAcara, setTempatAcara] = useState("");
  const [namaAcara, setNamaAcara] = useState("");
  const [detailAcara, setDetailAcara] = useState("");

  // State untuk data pemilik lokasi
  const [pemilikLokasiNama, setPemilikLokasiNama] = useState("");
  const [pemilikLokasiAlamat, setPemilikLokasiAlamat] = useState("");
  const [pemilikLokasiPekerjaan, setPemilikLokasiPekerjaan] = useState("");

  // Error state untuk fields tambahan
  const [noHPError, setNoHPError] = useState("");
  const [tanggalAcaraError, setTanggalAcaraError] = useState("");
  const [waktuAcaraError, setWaktuAcaraError] = useState("");
  const [tempatAcaraError, setTempatAcaraError] = useState("");
  const [namaAcaraError, setNamaAcaraError] = useState("");
  const [detailAcaraError, setDetailAcaraError] = useState("");

  // Error state untuk data pemilik lokasi
  const [pemilikLokasiNamaError, setPemilikLokasiNamaError] = useState("");
  const [pemilikLokasiAlamatError, setPemilikLokasiAlamatError] = useState("");
  const [pemilikLokasiPekerjaanError, setPemilikLokasiPekerjaanError] =
    useState("");

  // Error state untuk form Surat Keterangan Pengantar Desa
  const [namaError, setNamaError] = useState("");
  const [tanggalLahirError, setTanggalLahirError] = useState("");
  const [agamaError, setAgamaError] = useState("");
  const [pekerjaanPengantarError, setPekerjaanPengantarError] = useState("");
  const [rtPengantarError, setRtPengantarError] = useState("");
  const [rwPengantarError, setRwPengantarError] = useState("");
  const [ktpNomorError, setKtpNomorError] = useState("");
  const [kkNomorError, setKkNomorError] = useState("");
  const [keperluanError, setKeperluanError] = useState("");
  const [berlakuMulaiError, setBerlakuMulaiError] = useState("");
  const [berlakuSampaiError, setBerlakuSampaiError] = useState("");

  const alamatOptions = [
    {
      value: "MANDING 05/01 KEPOHKENCONO PUCAKWANGI",
      label: "MANDING 05/01 KEPOHKENCONO PUCAKWANGI",
    },
    {
      value: "MANDING 04/01 KEPOHKENCONO PUCAKWANGI",
      label: "MANDING 04/01 KEPOHKENCONO PUCAKWANGI",
    },
  ];

  const jenisGarapanOptions = [
    { value: "Tambak", label: "Tambak" },
    { value: "Sawah", label: "Sawah" },
    { value: "Tegalan", label: "Tegalan" },
  ];

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);

    // Check if user is logged in before allowing service access
    if (!user) {
      toast({
        title: "Login Diperlukan",
        description:
          "Anda harus login terlebih dahulu untuk menggunakan layanan surat.",
        variant: "destructive",
      });
      setIsDialogOpen(true); // Open login dialog
      return;
    }

    // Reset form fields when opening the form
    if (serviceId === "domisili") {
      setNamaPeminta("");
      setAlamatDomisili("");
      setNamaPemintaError("");
      setAlamatDomisiliError("");
      setIsFormDialogOpen(true);
    } else if (serviceId === "usaha") {
      // Reset form fields for Surat Keterangan Usaha
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

      // Reset error states
      setNamaPemintaError("");
      setPekerjaanError("");
      setAlamatError("");
      setJenisUsahaError("");

      setIsUsahaFormDialogOpen(true);
    } else if (serviceId === "pengantar-desa") {
      // Reset form fields for Surat Keterangan Pengantar Desa
      setNama("");
      setJenisKelamin("Lk");
      setTempatLahir("Pati");
      setTanggalLahir("");
      setAgama("");
      setPekerjaanPengantar("");
      setRtPengantar("");
      setRwPengantar("");
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
      setPekerjaanPengantarError("");
      setRtPengantarError("");
      setRwPengantarError("");
      setKtpNomorError("");
      setKkNomorError("");
      setKeperluanError("");
      setBerlakuMulaiError("");
      setBerlakuSampaiError("");

      setIsPengantarDesaFormDialogOpen(true);
    } else if (serviceId === "izin-keramaian") {
      // Reset form fields for Surat Izin Keramaian (sama seperti Pengantar Desa)
      setNama("");
      setJenisKelamin("Lk");
      setTempatLahir("Pati");
      setTanggalLahir("");
      setAgama("");
      setPekerjaanPengantar("");
      setRtPengantar("");
      setRwPengantar("");
      setKtpNomor("");
      setKkNomor("");
      setKeperluan("");
      setBerlakuMulai("");
      setBerlakuSampai("");
      setBerlakuMulaiDate(undefined);
      setBerlakuSampaiDate(undefined);
      setKeteranganLain("");

      // Reset tambahan fields untuk Izin Keramaian
      setNoHP("");
      setJabatan("Pemilik");
      setTanggalAcara("");
      setTanggalAcaraDate(undefined);
      setWaktuAcara("");
      setTempatAcara("");
      setNamaAcara("");
      setDetailAcara("");

      // Reset data pemilik lokasi
      setPemilikLokasiNama("");
      setPemilikLokasiAlamat("");
      setPemilikLokasiPekerjaan("");

      // Reset error states
      setNamaError("");
      setTanggalLahirError("");
      setAgamaError("");
      setPekerjaanPengantarError("");
      setRtPengantarError("");
      setRwPengantarError("");
      setKtpNomorError("");
      setKkNomorError("");
      setKeperluanError("");
      setBerlakuMulaiError("");
      setBerlakuSampaiError("");

      // Reset error states untuk tambahan fields
      setNoHPError("");
      setTanggalAcaraError("");
      setWaktuAcaraError("");
      setTempatAcaraError("");
      setNamaAcaraError("");
      setDetailAcaraError("");

      // Reset error data pemilik lokasi
      setPemilikLokasiNamaError("");
      setPemilikLokasiAlamatError("");
      setPemilikLokasiPekerjaanError("");

      setIsIzinKeramaianFormDialogOpen(true);
    } else {
      // Untuk layanan surat lainnya yang belum diimplementasikan
      toast({
        title: "Layanan Belum Tersedia",
        description: `Layanan ${serviceId} sedang dalam pengembangan. Silakan coba lagi nanti.`,
        variant: "default",
      });
      console.log(`Selected service: ${serviceId}`);
    }
  };

  // Fungsi untuk mengkonversi URL gambar ke base64 telah dipindahkan ke komponen template surat

  // Fungsi untuk menghasilkan PDF menggunakan template surat yang sesuai
  const generatePDF = async () => {
    try {
      if (!selectedService) {
        throw new Error("Tidak ada layanan surat yang dipilih");
      }

      // Import fungsi untuk mendapatkan template surat
      const { getSuratTemplate } = await import("@/components/surat-templates");

      // Dapatkan template surat berdasarkan tipe yang dipilih
      const generateSurat = await getSuratTemplate(
        selectedService as SuratTemplateType
      );

      // Siapkan data yang akan dikirim ke template surat
      const suratData: any = {};

      // Tambahkan data sesuai dengan tipe surat
      if (selectedService === "domisili") {
        suratData.namaPeminta = namaPeminta;
        suratData.alamatDomisili = alamatDomisili;
      } else if (selectedService === "usaha") {
        suratData.namaPeminta = namaPeminta;
        suratData.pekerjaan = pekerjaan;
        suratData.alamat = alamat;
        suratData.jenisUsaha = jenisUsaha;

        // Tambahkan data pertanian jika diisi
        if (jenisGarapan) {
          suratData.jenisGarapan = jenisGarapan;
          suratData.luasLahan = luasLahan;
          suratData.lokasiLahan = lokasiLahan;
          suratData.jenisBibit = jenisBibit;
          suratData.hasilPanen = {
            ton: hasilPanenTon,
            kw: hasilPanenKw,
            kg: hasilPanenKg,
          };
        }
      } else if (selectedService === "pengantar-desa") {
        suratData.nama = nama;
        suratData.jenisKelamin = jenisKelamin;
        suratData.tempatLahir = tempatLahir;
        suratData.tanggalLahir = tanggalLahir;
        suratData.agama = agama;
        suratData.pekerjaan = pekerjaanPengantar;
        suratData.tempatTinggal = {
          rt: rtPengantar,
          rw: rwPengantar,
        };
        suratData.suratBuktiDiri = {
          ktpNomor: ktpNomor,
          kkNomor: kkNomor,
        };
        suratData.keperluan = keperluan;
        suratData.berlakuMulai = berlakuMulai;
        suratData.berlakuSampai = berlakuSampai;
        suratData.keteranganLain = keteranganLain;
      } else if (selectedService === "izin-keramaian") {
        suratData.nama = nama;
        suratData.jenisKelamin = jenisKelamin;
        suratData.tempatLahir = tempatLahir;
        suratData.tanggalLahir = tanggalLahir;
        suratData.agama = agama;
        suratData.pekerjaan = pekerjaanPengantar;
        suratData.tempatTinggal = {
          rt: rtPengantar,
          rw: rwPengantar,
        };
        suratData.suratBuktiDiri = {
          ktpNomor: ktpNomor,
          kkNomor: kkNomor,
        };
        suratData.keperluan = keperluan;
        suratData.berlakuMulai = berlakuMulai;
        suratData.berlakuSampai = berlakuSampai;
        suratData.keteranganLain = keteranganLain;
        // Tambahan fields untuk Izin Keramaian
        suratData.noHP = noHP;
        suratData.jabatan = jabatan;
        suratData.keteranganAcara = {
          namaAcara: namaAcara,
          tanggalAcara: tanggalAcara,
          waktuAcara: waktuAcara,
          tempatAcara: tempatAcara,
          detailAcara: detailAcara,
        };

        // Tambahkan data pemilik lokasi (required)
        suratData.pemilikLokasi = {
          nama: pemilikLokasiNama,
          alamat: pemilikLokasiAlamat,
          pekerjaan: pemilikLokasiPekerjaan,
        };
      }
      // Tambahkan kondisi untuk tipe surat lainnya di masa depan
      // else if (selectedService === 'skck') { ... }

      // Gunakan template surat dengan data yang sesuai
      const result = await generateSurat(suratData);

      if (!result) {
        throw new Error("Gagal membuat PDF");
      }

      // Return success
      return true;
    } catch (error) {
      console.error("Gagal membuat PDF:", error);
      toast({
        title: "Gagal membuat PDF",
        description: "Terjadi kesalahan saat membuat PDF. Silakan coba lagi.",
        variant: "destructive",
      });
      return false;
    }
  };

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
          setIsFormDialogOpen(false);
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

  const handleSubmitPengantarDesaForm = async (e: React.FormEvent) => {
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

    if (!pekerjaanPengantar.trim()) {
      setPekerjaanPengantarError("Pekerjaan harus diisi");
      isValid = false;
    } else {
      setPekerjaanPengantarError("");
    }

    if (!rtPengantar.trim()) {
      setRtPengantarError("RT harus diisi");
      isValid = false;
    } else {
      setRtPengantarError("");
    }

    if (!rwPengantar.trim()) {
      setRwPengantarError("RW harus diisi");
      isValid = false;
    } else {
      setRwPengantarError("");
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

    // Validasi untuk field tambahan dan data pemilik lokasi dilakukan di handleSubmitIzinKeramaianForm

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
          setIsPengantarDesaFormDialogOpen(false);
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

  const handleSubmitUsahaForm = async (e: React.FormEvent) => {
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
              "Surat Keterangan Usaha telah berhasil dibuat dan diunduh",
          });
          setIsUsahaFormDialogOpen(false);
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

  const handleSubmitIzinKeramaianForm = async (e: React.FormEvent) => {
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

    if (!pekerjaanPengantar.trim()) {
      setPekerjaanPengantarError("Pekerjaan harus diisi");
      isValid = false;
    } else {
      setPekerjaanPengantarError("");
    }

    if (!rtPengantar.trim()) {
      setRtPengantarError("RT harus diisi");
      isValid = false;
    } else {
      setRtPengantarError("");
    }

    if (!rwPengantar.trim()) {
      setRwPengantarError("RW harus diisi");
      isValid = false;
    } else {
      setRwPengantarError("");
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

    // Validasi data pemilik lokasi (required)
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

    // Validasi field tambahan untuk Izin Keramaian
    if (!noHP.trim()) {
      setNoHPError("Nomor HP harus diisi");
      isValid = false;
    } else {
      setNoHPError("");
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

    if (!namaAcara.trim()) {
      setNamaAcaraError("Nama acara/hajat harus diisi");
      isValid = false;
    } else {
      setNamaAcaraError("");
    }

    if (!detailAcara.trim()) {
      setDetailAcaraError("Detail acara/hajat harus diisi");
      isValid = false;
    } else {
      setDetailAcaraError("");
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
          setIsIzinKeramaianFormDialogOpen(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm fixed w-full z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link
              to="/"
              className="flex items-center space-x-2 text-green-800 hover:text-green-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Kembali ke Beranda</span>
            </Link>
            <h1 className="text-2xl font-bold text-green-800">
              Layanan Surat Desa
            </h1>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                {loading ? (
                  <Button
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-50"
                    disabled
                  >
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </Button>
                ) : user ? (
                  <div className="flex items-center gap-2">
                    <span className="text-green-800">{user.email}</span>
                    <Button
                      variant="outline"
                      className="border-green-600 text-green-600 hover:bg-green-50"
                      onClick={async () => {
                        const result = await logout();
                        if (result.success) {
                          toast({
                            title: "Logout berhasil",
                            description: "Sampai jumpa kembali!",
                          });
                        }
                      }}
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Users className="w-4 h-4 mr-2" />
                    Login Admin
                  </Button>
                )}
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Login Admin</DialogTitle>
                  <DialogDescription>
                    Masuk sebagai admin untuk mengelola layanan surat.
                  </DialogDescription>
                </DialogHeader>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setIsLoading(true);
                    try {
                      setEmailError("");
                      setPasswordError("");
                      setConfirmPasswordError("");

                      const result = await login(email, password);
                      if (result.success) {
                        toast({
                          title: "Login berhasil",
                          description: "Selamat datang di dashboard admin",
                        });
                        setIsDialogOpen(false);
                      } else {
                        if (result.error) {
                          if (result.error.includes("email")) {
                            setEmailError(result.error);
                          } else if (result.error.includes("password")) {
                            setPasswordError(result.error);
                          } else {
                            toast({
                              variant: "destructive",
                              title: "Login gagal",
                              description:
                                result.error ||
                                "Terjadi kesalahan. Silakan coba lagi.",
                            });
                          }
                        }
                      }
                    } catch (error) {
                      toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Terjadi kesalahan saat login",
                      });
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError("");
                      }}
                      className={`bg-gray-100 placeholder:text-gray-800 ${
                        emailError ? "border-red-500" : "border-gray-400"
                      }`}
                      required
                    />
                    {emailError && (
                      <p className="text-sm text-red-500 mt-1">{emailError}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Masukkan kata sandi"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError("");
                      }}
                      className={`bg-gray-100 placeholder:text-gray-600 ${
                        passwordError ? "border-red-500" : "border-gray-400"
                      }`}
                      required
                    />
                    {passwordError && (
                      <p className="text-sm text-red-500 mt-1">
                        {passwordError}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-green-800 hover:bg-green-900 text-white"
                    disabled={isLoading}
                  >
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isLoading ? "Loading..." : "Login"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <section className="pt-24 pb-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h1 className="text-5xl font-bold mb-4">Layanan Surat Desa</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Dapatkan surat-surat administrasi desa dengan mudah dan cepat.
            Sistem digital yang memungkinkan Anda mengajukan permohonan kapan
            saja, di mana saja.
          </p>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-800">
                Mudah & Praktis
              </h3>
              <p className="text-gray-600">
                Ajukan permohonan surat secara online tanpa perlu antri
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-800">
                Proses Cepat
              </h3>
              <p className="text-gray-600">
                Estimasi waktu pemrosesan yang jelas untuk setiap jenis surat
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-800">
                Terpercaya
              </h3>
              <p className="text-gray-600">
                Sistem yang aman dengan verifikasi resmi dari perangkat desa
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-green-800 mb-4">
              Pilih Jenis Surat
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Silakan pilih jenis surat yang ingin Anda ajukan. Pastikan Anda
              telah menyiapkan dokumen-dokumen yang diperlukan sebelum mengisi
              formulir.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card
                key={service.id}
                className={`hover:shadow-lg transition-all duration-300 cursor-pointer border-2 ${
                  selectedService === service.id
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-green-300"
                }`}
                onClick={() => handleServiceSelect(service.id)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <FileText className="w-8 h-8 text-green-600 mb-2" />
                    <Badge className="bg-green-100 text-green-800">
                      {service.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-green-800">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Syarat:
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {service.requirements.map((req, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2 text-blue-500" />
                    Estimasi: {service.estimatedTime}
                  </div>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleServiceSelect(service.id);
                    }}
                  >
                    Buat Surat
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-green-800 mb-4">
              Cara Pembuatan Surat
            </h2>
            <p className="text-lg text-gray-700">
              Ikuti langkah-langkah mudah berikut ini
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                1
              </div>
              <h3 className="font-semibold text-green-800 mb-2">Pilih Surat</h3>
              <p className="text-gray-600 text-sm">
                Pilih jenis surat yang ingin Anda buat
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                2
              </div>
              <h3 className="font-semibold text-green-800 mb-2">
                Isi Formulir
              </h3>
              <p className="text-gray-600 text-sm">
                Lengkapi data diri dan informasi yang diperlukan
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                3
              </div>
              <h3 className="font-semibold text-green-800 mb-2">
                Proses Dokumen
              </h3>
              <p className="text-gray-600 text-sm">
                Verifikasi data dan proses pembuatan surat
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                4
              </div>
              <h3 className="font-semibold text-green-800 mb-2">Cetak Surat</h3>
              <p className="text-gray-600 text-sm">
                Cetak surat dan serahkan kepada warga
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Butuh Bantuan?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Tim kami siap membantu Anda. Jangan ragu untuk menghubungi kami jika
            ada pertanyaan tentang proses pembuatan surat atau persyaratan yang
            diperlukan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-green-600 hover:bg-gray-100"
            >
              Hubungi Admin Desa
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-green-600"
            >
              Panduan Lengkap
            </Button>
          </div>
        </div>
      </section>

      {/* Form Dialog for Surat Keterangan Domisili */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="sm:max-w-[650px] p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Formulir Surat Keterangan Domisili
            </DialogTitle>
            <DialogDescription className="text-base mt-2">
              Silakan lengkapi data berikut untuk pembuatan Surat Keterangan
              Domisili.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitForm} className="space-y-6 mt-4">
            <div className="space-y-3">
              <Label htmlFor="namaPeminta" className="text-lg">
                Nama Peminta Surat
              </Label>
              <Input
                id="namaPeminta"
                placeholder="Masukkan nama lengkap"
                className={`text-base ${
                  namaPemintaError ? "border-red-500" : "border-gray-400"
                }`}
                value={namaPeminta}
                onChange={(e) => {
                  setNamaPeminta(e.target.value);
                  setNamaPemintaError("");
                }}
              />
              {namaPemintaError && (
                <p className="text-base text-red-500 mt-1">
                  {namaPemintaError}
                </p>
              )}
            </div>
            <div className="space-y-3">
              <Label htmlFor="alamatDomisili" className="text-lg">
                Alamat Domisili
              </Label>
              <Combobox
                options={alamatOptions}
                value={alamatDomisili}
                onValueChange={(value) => {
                  setAlamatDomisili(value);
                  setAlamatDomisiliError("");
                }}
                placeholder="Pilih alamat domisili"
                className={`text-base ${
                  alamatDomisiliError ? "border-red-500" : "border-gray-400"
                }`}
              />
              {alamatDomisiliError && (
                <p className="text-base text-red-500 mt-1">
                  {alamatDomisiliError}
                </p>
              )}
            </div>
            <DialogFooter className="mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormDialogOpen(false)}
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
                  "Buat Surat"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Form Dialog for Surat Keterangan Usaha */}
      <Dialog
        open={isUsahaFormDialogOpen}
        onOpenChange={setIsUsahaFormDialogOpen}
      >
        <DialogContent className="sm:max-w-[650px] p-8 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Formulir Surat Keterangan Usaha
            </DialogTitle>
            <DialogDescription className="text-base mt-2">
              Silakan lengkapi data berikut untuk pembuatan Surat Keterangan
              Usaha.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitUsahaForm} className="space-y-6 mt-4">
            <div className="space-y-3">
              <Label htmlFor="namaPeminta" className="text-lg">
                Nama Peminta Surat
              </Label>
              <Input
                id="namaPeminta"
                placeholder="Masukkan nama lengkap"
                className={`text-base ${
                  namaPemintaError ? "border-red-500" : "border-gray-400"
                }`}
                value={namaPeminta}
                onChange={(e) => {
                  setNamaPeminta(e.target.value);
                  setNamaPemintaError("");
                }}
              />
              {namaPemintaError && (
                <p className="text-base text-red-500 mt-1">
                  {namaPemintaError}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="pekerjaan" className="text-lg">
                Pekerjaan
              </Label>
              <Input
                id="pekerjaan"
                placeholder="Masukkan pekerjaan"
                className={`text-base ${
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

            <div className="space-y-3">
              <Label htmlFor="alamat" className="text-lg">
                Alamat
              </Label>
              <Input
                id="alamat"
                placeholder="Masukkan alamat lengkap"
                className={`text-base ${
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

            <div className="space-y-3">
              <Label htmlFor="jenisUsaha" className="text-lg">
                Jenis Usaha
              </Label>
              <Input
                id="jenisUsaha"
                placeholder="Masukkan jenis usaha"
                className={`text-base ${
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

            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-semibold mb-4">
                Informasi Tambahan untuk Usaha Pertanian (Opsional)
              </h3>

              <div className="space-y-3 mb-4">
                <Label htmlFor="jenisGarapan" className="text-lg">
                  Jenis Garapan
                </Label>
                <Combobox
                  options={jenisGarapanOptions}
                  value={jenisGarapan}
                  onValueChange={(value) => {
                    setJenisGarapan(value);
                  }}
                  placeholder="Pilih jenis garapan"
                  className="text-base border-gray-400"
                />
              </div>

              <div className="space-y-3 mb-4">
                <Label htmlFor="luasLahan" className="text-lg">
                  Luas Lahan (Ha)
                </Label>
                <Input
                  id="luasLahan"
                  placeholder="Masukkan luas lahan dalam hektar"
                  className="text-base border-gray-400"
                  value={luasLahan}
                  onChange={(e) => setLuasLahan(e.target.value)}
                />
              </div>

              <div className="space-y-3 mb-4">
                <Label htmlFor="lokasiLahan" className="text-lg">
                  Lokasi Lahan (Desa)
                </Label>
                <Input
                  id="lokasiLahan"
                  placeholder="Masukkan lokasi lahan"
                  className="text-base border-gray-400"
                  value={lokasiLahan}
                  onChange={(e) => setLokasiLahan(e.target.value)}
                />
              </div>

              <div className="space-y-3 mb-4">
                <Label htmlFor="jenisBibit" className="text-lg">
                  Jenis Bibit
                </Label>
                <Input
                  id="jenisBibit"
                  placeholder="Masukkan jenis bibit"
                  className="text-base border-gray-400"
                  value={jenisBibit}
                  onChange={(e) => setJenisBibit(e.target.value)}
                />
              </div>

              <div className="space-y-3 mb-4">
                <Label className="text-lg">Hasil Panen per Ha</Label>
                <div className="grid grid-cols-3 gap-4">
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
                onClick={() => setIsUsahaFormDialogOpen(false)}
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
                  "Buat Surat"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Form Dialog for Surat Keterangan Pengantar Desa */}
      <Dialog
        open={isPengantarDesaFormDialogOpen}
        onOpenChange={setIsPengantarDesaFormDialogOpen}
      >
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
          <form
            onSubmit={handleSubmitPengantarDesaForm}
            className="space-y-6 mt-4"
          >
            <div className="space-y-2">
              <Label htmlFor="nama" className="text-base">
                Nama
              </Label>
              <Input
                id="nama"
                placeholder="Masukkan nama lengkap"
                className={`text-base ${
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
              <div className="flex space-x-4">
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
                  className="text-base border-gray-400"
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
                  className={`text-base ${
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
                className={`text-base ${
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
              <Label htmlFor="pekerjaanPengantar" className="text-base">
                Pekerjaan
              </Label>
              <Input
                id="pekerjaanPengantar"
                placeholder="Masukkan pekerjaan"
                className={`text-base ${
                  pekerjaanPengantarError ? "border-red-500" : "border-gray-400"
                }`}
                value={pekerjaanPengantar}
                onChange={(e) => {
                  setPekerjaanPengantar(e.target.value);
                  setPekerjaanPengantarError("");
                }}
              />
              {pekerjaanPengantarError && (
                <p className="text-base text-red-500 mt-1">
                  {pekerjaanPengantarError}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-base">Tempat Tinggal</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rtPengantar" className="text-base">
                    RT
                  </Label>
                  <Input
                    id="rtPengantar"
                    placeholder="Masukkan RT"
                    className={`text-base ${
                      rtPengantarError ? "border-red-500" : "border-gray-400"
                    }`}
                    value={rtPengantar}
                    onChange={(e) => {
                      setRtPengantar(e.target.value);
                      setRtPengantarError("");
                    }}
                  />
                  {rtPengantarError && (
                    <p className="text-base text-red-500 mt-1">
                      {rtPengantarError}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rwPengantar" className="text-base">
                    RW
                  </Label>
                  <Input
                    id="rwPengantar"
                    placeholder="Masukkan RW"
                    className={`text-base ${
                      rwPengantarError ? "border-red-500" : "border-gray-400"
                    }`}
                    value={rwPengantar}
                    onChange={(e) => {
                      setRwPengantar(e.target.value);
                      setRwPengantarError("");
                    }}
                  />
                  {rwPengantarError && (
                    <p className="text-base text-red-500 mt-1">
                      {rwPengantarError}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-base">Surat Bukti Diri</Label>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ktpNomor" className="text-base">
                    Nomor KTP
                  </Label>
                  <Input
                    id="ktpNomor"
                    placeholder="Masukkan nomor KTP"
                    className={`text-base ${
                      ktpNomorError ? "border-red-500" : "border-gray-400"
                    }`}
                    value={ktpNomor}
                    onChange={(e) => {
                      setKtpNomor(e.target.value);
                      setKtpNomorError("");
                    }}
                  />
                  {ktpNomorError && (
                    <p className="text-base text-red-500 mt-1">
                      {ktpNomorError}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kkNomor" className="text-base">
                    Nomor KK
                  </Label>
                  <Input
                    id="kkNomor"
                    placeholder="Masukkan nomor KK"
                    className={`text-base ${
                      kkNomorError ? "border-red-500" : "border-gray-400"
                    }`}
                    value={kkNomor}
                    onChange={(e) => {
                      setKkNomor(e.target.value);
                      setKkNomorError("");
                    }}
                  />
                  {kkNomorError && (
                    <p className="text-base text-red-500 mt-1">
                      {kkNomorError}
                    </p>
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
                className={`flex h-24 w-full rounded-md border bg-background px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:border-black ${
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
                      className={`w-full justify-start text-left font-normal ${
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
                    <Calendar
                      mode="single"
                      selected={berlakuMulaiDate}
                      onSelect={(date) => {
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
                      initialFocus
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
                      className={`w-full justify-start text-left font-normal ${
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
                    <Calendar
                      mode="single"
                      selected={berlakuSampaiDate}
                      onSelect={(date) => {
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
                      initialFocus
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
                className="flex h-24 w-full rounded-md border border-gray-400 bg-background px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:border-black"
                rows={4}
                value={keteranganLain}
                onChange={(e) => setKeteranganLain(e.target.value)}
              />
            </div>

            <DialogFooter className="mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPengantarDesaFormDialogOpen(false)}
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
                  "Buat Surat"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Form Dialog for Surat Izin Keramaian */}
      <Dialog
        open={isIzinKeramaianFormDialogOpen}
        onOpenChange={setIsIzinKeramaianFormDialogOpen}
      >
        <DialogContent className="sm:max-w-[650px] p-8 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Formulir Surat Permohonan Izin Keramaian
            </DialogTitle>
            <DialogDescription className="text-base mt-2">
              Silakan lengkapi data berikut untuk pembuatan Surat Permohonan
              Izin Keramaian.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmitIzinKeramaianForm}
            className="space-y-6 mt-4"
          >
            <div className="space-y-2">
              <Label htmlFor="nama" className="text-base">
                Nama
              </Label>
              <Input
                id="nama"
                placeholder="Masukkan nama lengkap"
                className={`text-base ${
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
              <div className="flex space-x-4">
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
                  className="text-base border-gray-400"
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
                  className={`text-base ${
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
                className={`text-base ${
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
              <Label htmlFor="pekerjaanPengantar" className="text-base">
                Pekerjaan
              </Label>
              <Input
                id="pekerjaanPengantar"
                placeholder="Masukkan pekerjaan"
                className={`text-base ${
                  pekerjaanPengantarError ? "border-red-500" : "border-gray-400"
                }`}
                value={pekerjaanPengantar}
                onChange={(e) => {
                  setPekerjaanPengantar(e.target.value);
                  setPekerjaanPengantarError("");
                }}
              />
              {pekerjaanPengantarError && (
                <p className="text-base text-red-500 mt-1">
                  {pekerjaanPengantarError}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-base">Tempat Tinggal</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rtPengantar" className="text-base">
                    RT
                  </Label>
                  <Input
                    id="rtPengantar"
                    placeholder="Masukkan RT"
                    className={`text-base ${
                      rtPengantarError ? "border-red-500" : "border-gray-400"
                    }`}
                    value={rtPengantar}
                    onChange={(e) => {
                      setRtPengantar(e.target.value);
                      setRtPengantarError("");
                    }}
                  />
                  {rtPengantarError && (
                    <p className="text-base text-red-500 mt-1">
                      {rtPengantarError}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rwPengantar" className="text-base">
                    RW
                  </Label>
                  <Input
                    id="rwPengantar"
                    placeholder="Masukkan RW"
                    className={`text-base ${
                      rwPengantarError ? "border-red-500" : "border-gray-400"
                    }`}
                    value={rwPengantar}
                    onChange={(e) => {
                      setRwPengantar(e.target.value);
                      setRwPengantarError("");
                    }}
                  />
                  {rwPengantarError && (
                    <p className="text-base text-red-500 mt-1">
                      {rwPengantarError}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-base">Surat Bukti Diri</Label>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ktpNomor" className="text-base">
                    Nomor KTP
                  </Label>
                  <Input
                    id="ktpNomor"
                    placeholder="Masukkan nomor KTP"
                    className={`text-base ${
                      ktpNomorError ? "border-red-500" : "border-gray-400"
                    }`}
                    value={ktpNomor}
                    onChange={(e) => {
                      setKtpNomor(e.target.value);
                      setKtpNomorError("");
                    }}
                  />
                  {ktpNomorError && (
                    <p className="text-base text-red-500 mt-1">
                      {ktpNomorError}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kkNomor" className="text-base">
                    Nomor KK
                  </Label>
                  <Input
                    id="kkNomor"
                    placeholder="Masukkan nomor KK"
                    className={`text-base ${
                      kkNomorError ? "border-red-500" : "border-gray-400"
                    }`}
                    value={kkNomor}
                    onChange={(e) => {
                      setKkNomor(e.target.value);
                      setKkNomorError("");
                    }}
                  />
                  {kkNomorError && (
                    <p className="text-base text-red-500 mt-1">
                      {kkNomorError}
                    </p>
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
                className={`flex h-24 w-full rounded-md border bg-background px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:border-black ${
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
                      className={`w-full justify-start text-left font-normal ${
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
                    <Calendar
                      mode="single"
                      selected={berlakuMulaiDate}
                      onSelect={(date) => {
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
                      initialFocus
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
                      className={`w-full justify-start text-left font-normal ${
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
                    <Calendar
                      mode="single"
                      selected={berlakuSampaiDate}
                      onSelect={(date) => {
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
                      initialFocus
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
                className="flex h-24 w-full rounded-md border border-gray-400 bg-background px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:border-black"
                rows={4}
                value={keteranganLain}
                onChange={(e) => setKeteranganLain(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="noHP" className="text-base">
                Nomor HP
              </Label>
              <Input
                id="noHP"
                placeholder="Masukkan nomor HP"
                className={`text-base ${
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

            <div className="space-y-4">
              <Label className="text-base font-bold">Keterangan Acara</Label>

              <div className="space-y-2">
                <Label htmlFor="jabatan" className="text-base">
                  Jabatan
                </Label>
                <div className="flex space-x-4">
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
                    <Label htmlFor="jabatanPemilik">
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
                    <Label htmlFor="jabatanPanitia">
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
                  className={`text-base ${
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
                      className={`w-full justify-start text-left font-normal ${
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
                    <Calendar
                      mode="single"
                      selected={tanggalAcaraDate}
                      onSelect={(date) => {
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
                      initialFocus
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
                  className={`text-base ${
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
                  className={`text-base ${
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
                  className={`flex h-24 w-full rounded-md border bg-background px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:border-black ${
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

            <div className="space-y-4 mt-6">
              <Label className="text-base font-bold">Data Pemilik Lokasi</Label>
              <p className="text-sm text-gray-600">
                Isi data pemilik lokasi untuk halaman surat keterangan ijin
                tempat lokasi kegiatan
              </p>

              <div className="space-y-2">
                <Label htmlFor="pemilikLokasiNama" className="text-base">
                  Nama Pemilik Lokasi
                </Label>
                <Input
                  id="pemilikLokasiNama"
                  placeholder="Masukkan nama pemilik lokasi"
                  className={`text-base ${
                    pemilikLokasiNamaError
                      ? "border-red-500"
                      : "border-gray-400"
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
                  className={`text-base ${
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
                  className={`text-base ${
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
                onClick={() => setIsIzinKeramaianFormDialogOpen(false)}
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
                  "Buat Surat"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LayananSurat;
