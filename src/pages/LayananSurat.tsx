import { useState, useEffect } from "react";
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
  Search,
  Filter,
  Home,
  Building,
  IdCard,
  Award,
  ScrollText,
  Handshake,
  UserCheck,
  Heart,
  Eye,
  LogIn,
  Download,
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
import { TemplatePreviewDialog } from "@/components/preview";

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

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    "all"
  );
  const [filteredServices, setFilteredServices] = useState<typeof services>([]);

  // Preview dialog state
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [previewService, setPreviewService] = useState<
    (typeof services)[0] | null
  >(null);

  // Categories for filter
  const categories = [
    { id: "all", name: "All" },
    { id: "Personal", name: "Personal" },
    { id: "Administratif", name: "Administratif" },
    { id: "Bisnis", name: "Bisnis" },
    { id: "Izin", name: "Izin" },
  ];

  // Filter services based on search query and selected category
  const handlePreviewClick = (service: (typeof services)[0]) => {
    setPreviewService(service);
    setIsPreviewDialogOpen(true);
  };

  useEffect(() => {
    let result = services;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (service) =>
          service.title.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter(
        (service) => service.category === selectedCategory
      );
    }

    setFilteredServices(result);
  }, [searchQuery, selectedCategory]);

  const services = [
    {
      id: "domisili",
      title: "Surat Keterangan Domisili",
      description: "Surat yang menyatakan tempat tinggal/domisili seseorang",
      requirements: ["KTP Asli", "Kartu Keluarga", "Surat Pengantar RT/RW"],
      estimatedTime: "1-2 Hari Kerja",
      status: "Tersedia",
      category: "Personal",
      categoryColor: "bg-green-100 text-green-800",
    },
    {
      id: "pengantar-desa",
      title: "Surat Keterangan Pengantar Desa",
      description:
        "Surat pengantar dari desa untuk berbagai keperluan administratif",
      requirements: ["KTP Asli", "Kartu Keluarga", "Surat Pengantar RT/RW"],
      estimatedTime: "1 Hari Kerja",
      status: "Tersedia",
      category: "Administratif",
      categoryColor: "bg-green-100 text-green-800",
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
      category: "Izin",
      categoryColor: "bg-green-100 text-green-800",
    },

    {
      id: "usaha",
      title: "Surat Keterangan Usaha",
      description:
        "Surat yang menyatakan seseorang memiliki usaha/berwirausaha",
      requirements: ["KTP Asli", "Kartu Keluarga", "Foto Tempat Usaha"],
      estimatedTime: "2-3 Hari Kerja",
      status: "Tersedia",
      category: "Bisnis",
      categoryColor: "bg-green-100 text-green-800",
    },
    {
      id: "tidak-mampu",
      title: "Surat Keterangan Tidak Mampu",
      description: "Surat yang menyatakan kondisi ekonomi kurang mampu",
      requirements: ["KTP Asli", "Kartu Keluarga", "Surat Pengantar RT/RW"],
      estimatedTime: "1-2 Hari Kerja",
      status: "Tersedia",
      category: "Personal",
      categoryColor: "bg-green-100 text-green-800",
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
      category: "Personal",
      categoryColor: "bg-green-100 text-green-800",
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
      category: "Personal",
      categoryColor: "bg-green-100 text-green-800",
    },
  ];

  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isUsahaFormDialogOpen, setIsUsahaFormDialogOpen] = useState(false);
  const [isPengantarDesaFormDialogOpen, setIsPengantarDesaFormDialogOpen] =
    useState(false);
  const [isIzinKeramaianFormDialogOpen, setIsIzinKeramaianFormDialogOpen] =
    useState(false);
  const [isKematianFormDialogOpen, setIsKematianFormDialogOpen] =
    useState(false);
  const [isKelahiranFormDialogOpen, setIsKelahiranFormDialogOpen] =
    useState(false);
  const [isTidakMampuFormDialogOpen, setIsTidakMampuFormDialogOpen] =
    useState(false);
  const [namaPeminta, setNamaPeminta] = useState("");
  const [alamatDomisili, setAlamatDomisili] = useState("");
  const [signatureType, setSignatureType] = useState<"sekretaris" | "kepala">(
    "sekretaris"
  );
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

  // State untuk form Surat Keterangan Kematian
  const [namaKematian, setNamaKematian] = useState("");
  const [tempatLahirKematian, setTempatLahirKematian] = useState("");
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

  // State untuk form Surat Keterangan Kelahiran
  const [namaPemohon, setNamaPemohon] = useState("");
  const [tempatLahirPemohon, setTempatLahirPemohon] = useState("");
  const [tanggalLahirPemohon, setTanggalLahirPemohon] = useState("");
  const [jenisKelaminPemohon, setJenisKelaminPemohon] = useState("L");
  const [pekerjaanPemohon, setPekerjaanPemohon] = useState("");
  const [alamatPemohon, setAlamatPemohon] = useState("");
  const [namaAnak, setNamaAnak] = useState("");
  const [tempatLahirAnak, setTempatLahirAnak] = useState("");
  const [tanggalLahirAnak, setTanggalLahirAnak] = useState("");
  const [jenisKelaminAnak, setJenisKelaminAnak] = useState("L");
  const [agamaAnak, setAgamaAnak] = useState("");
  const [alamatAnak, setAlamatAnak] = useState("");
  const [namaAyah, setNamaAyah] = useState("");
  const [namaIbu, setNamaIbu] = useState("");

  // State untuk form Surat Keterangan Tidak Mampu
  const [namaPemohonTidakMampu, setNamaPemohonTidakMampu] = useState("");
  const [tempatLahirPemohonTidakMampu, setTempatLahirPemohonTidakMampu] =
    useState("");
  const [tanggalLahirPemohonTidakMampu, setTanggalLahirPemohonTidakMampu] =
    useState("");
  const [jenisKelaminPemohonTidakMampu, setJenisKelaminPemohonTidakMampu] =
    useState("L");
  const [pekerjaanPemohonTidakMampu, setPekerjaanPemohonTidakMampu] =
    useState("");
  const [alamatPemohonTidakMampu, setAlamatPemohonTidakMampu] = useState("");
  const [persyaratanTidakMampu, setPersyaratanTidakMampu] = useState("");

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

  // Error state untuk form Surat Keterangan Kematian
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

  // Error state untuk form Surat Keterangan Kelahiran
  const [namaPemohonError, setNamaPemohonError] = useState("");
  const [tempatLahirPemohonError, setTempatLahirPemohonError] = useState("");
  const [tanggalLahirPemohonError, setTanggalLahirPemohonError] = useState("");
  const [pekerjaanPemohonError, setPekerjaanPemohonError] = useState("");
  const [alamatPemohonError, setAlamatPemohonError] = useState("");
  const [namaAnakError, setNamaAnakError] = useState("");
  const [tempatLahirAnakError, setTempatLahirAnakError] = useState("");
  const [tanggalLahirAnakError, setTanggalLahirAnakError] = useState("");
  const [agamaAnakError, setAgamaAnakError] = useState("");
  const [alamatAnakError, setAlamatAnakError] = useState("");
  const [namaAyahError, setNamaAyahError] = useState("");
  const [namaIbuError, setNamaIbuError] = useState("");

  // Error state untuk form Surat Keterangan Tidak Mampu
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
        {
          value: "MANDING 06/01 KEPOHKENCONO PUCAKWANGI",
          label: "RT 06/RW 01",
        },
        {
          value: "MANDING 07/01 KEPOHKENCONO PUCAKWANGI",
          label: "RT 07/RW 01",
        },
        {
          value: "MANDING 08/01 KEPOHKENCONO PUCAKWANGI",
          label: "RT 08/RW 01",
        },
      ],
    },
    {
      label: "Panggang (RW 02)",
      options: [
        {
          value: "PANGGANG 01/02 KEPOHKENCONO PUCAKWANGI",
          label: "RT 01/RW 02",
        },
        {
          value: "PANGGANG 02/02 KEPOHKENCONO PUCAKWANGI",
          label: "RT 02/RW 02",
        },
        {
          value: "PANGGANG 03/02 KEPOHKENCONO PUCAKWANGI",
          label: "RT 03/RW 02",
        },
      ],
    },
    {
      label: "Prau (RW 03)",
      options: [
        {
          value: "PRAU 01/03 KEPOHKENCONO PUCAKWANGI",
          label: "RT 01/RW 03",
        },
        {
          value: "PRAU 02/03 KEPOHKENCONO PUCAKWANGI",
          label: "RT 02/RW 03",
        },
        {
          value: "PRAU 03/03 KEPOHKENCONO PUCAKWANGI",
          label: "RT 03/RW 03",
        },
        {
          value: "PRAU 04/03 KEPOHKENCONO PUCAKWANGI",
          label: "RT 04/RW 03",
        },
        {
          value: "PRAU 05/03 KEPOHKENCONO PUCAKWANGI",
          label: "RT 05/RW 03",
        },
      ],
    },
    {
      label: "Ngepoh (RW 04)",
      options: [
        {
          value: "NGEPOH 01/04 KEPOHKENCONO PUCAKWANGI",
          label: "RT 01/RW 04",
        },
        {
          value: "NGEPOH 02/04 KEPOHKENCONO PUCAKWANGI",
          label: "RT 02/RW 04",
        },
        {
          value: "NGEPOH 03/04 KEPOHKENCONO PUCAKWANGI",
          label: "RT 03/RW 04",
        },
      ],
    },
    {
      label: "Jatikebo (RW 05)",
      options: [
        {
          value: "JATIKEBO 01/05 KEPOHKENCONO PUCAKWANGI",
          label: "RT 01/RW 05",
        },
        {
          value: "JATIKEBO 02/05 KEPOHKENCONO PUCAKWANGI",
          label: "RT 02/RW 05",
        },
        {
          value: "JATIKEBO 03/05 KEPOHKENCONO PUCAKWANGI",
          label: "RT 03/RW 05",
        },
      ],
    },
    {
      label: "Dangklik (RW 06)",
      options: [
        {
          value: "DANGKLIK 01/06 KEPOHKENCONO PUCAKWANGI",
          label: "RT 01/RW 06",
        },
        {
          value: "DANGKLIK 02/06 KEPOHKENCONO PUCAKWANGI",
          label: "RT 02/RW 06",
        },
      ],
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
      setSignatureType("sekretaris"); // Reset to default signature type
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
    } else if (serviceId === "kematian") {
      // Reset form fields for Surat Keterangan Kematian
      setNamaKematian("");
      setTempatLahirKematian("");
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

      // Reset error states
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

      setIsKematianFormDialogOpen(true);
    } else if (serviceId === "kelahiran") {
      // Reset form fields for Surat Keterangan Kelahiran
      setNamaPemohon("");
      setTempatLahirPemohon("");
      setTanggalLahirPemohon("");
      setJenisKelaminPemohon("L");
      setPekerjaanPemohon("");
      setAlamatPemohon("");
      setNamaAnak("");
      setTempatLahirAnak("");
      setTanggalLahirAnak("");
      setJenisKelaminAnak("L");
      setAgamaAnak("");
      setAlamatAnak("");
      setNamaAyah("");
      setNamaIbu("");

      // Reset error states
      setNamaPemohonError("");
      setTempatLahirPemohonError("");
      setTanggalLahirPemohonError("");
      setPekerjaanPemohonError("");
      setAlamatPemohonError("");
      setNamaAnakError("");
      setTempatLahirAnakError("");
      setTanggalLahirAnakError("");
      setAgamaAnakError("");
      setAlamatAnakError("");
      setNamaAyahError("");
      setNamaIbuError("");

      setIsKelahiranFormDialogOpen(true);
    } else if (serviceId === "tidak-mampu") {
      // Reset form fields for Surat Keterangan Tidak Mampu
      setNamaPemohonTidakMampu("");
      setTempatLahirPemohonTidakMampu("");
      setTanggalLahirPemohonTidakMampu("");
      setJenisKelaminPemohonTidakMampu("L");
      setPekerjaanPemohonTidakMampu("");
      setAlamatPemohonTidakMampu("");
      setPersyaratanTidakMampu("");

      // Reset error states
      setNamaPemohonTidakMampuError("");
      setTempatLahirPemohonTidakMampuError("");
      setTanggalLahirPemohonTidakMampuError("");
      setPekerjaanPemohonTidakMampuError("");
      setAlamatPemohonTidakMampuError("");
      setPersyaratanTidakMampuError("");

      setIsTidakMampuFormDialogOpen(true);
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
        suratData.signatureType = signatureType; // Add signature type
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
      } else if (selectedService === "kematian") {
        suratData.nama = namaKematian;
        suratData.tempatLahir = tempatLahirKematian;
        suratData.tanggalLahir = tanggalLahirKematian;
        suratData.jenisKelamin = jenisKelaminKematian;
        suratData.pekerjaan = pekerjaanKematian;
        suratData.alamat = alamatKematian;
        suratData.agama = agamaKematian;
        suratData.hariTanggalKematian = hariTanggalKematian;
        suratData.jamKematian = jamKematian;
        suratData.sebabKematian = sebabKematian;
        suratData.yangMenerangkan = yangMenerangkan;
        suratData.tempatKematian = tempatKematian;
      } else if (selectedService === "kelahiran") {
        suratData.namaPemohon = namaPemohon;
        suratData.tempatLahirPemohon = tempatLahirPemohon;
        suratData.tanggalLahirPemohon = tanggalLahirPemohon;
        suratData.jenisKelaminPemohon = jenisKelaminPemohon;
        suratData.pekerjaanPemohon = pekerjaanPemohon;
        suratData.alamatPemohon = alamatPemohon;
        suratData.namaAnak = namaAnak;
        suratData.tempatLahirAnak = tempatLahirAnak;
        suratData.tanggalLahirAnak = tanggalLahirAnak;
        suratData.jenisKelaminAnak = jenisKelaminAnak;
        suratData.agamaAnak = agamaAnak;
        suratData.alamatAnak = alamatAnak;
        suratData.namaAyah = namaAyah;
        suratData.namaIbu = namaIbu;
      } else if (selectedService === "tidak-mampu") {
        suratData.namaPemohon = namaPemohonTidakMampu;
        suratData.tempatLahirPemohon = tempatLahirPemohonTidakMampu;
        suratData.tanggalLahirPemohon = tanggalLahirPemohonTidakMampu;
        suratData.jenisKelaminPemohon = jenisKelaminPemohonTidakMampu;
        suratData.pekerjaanPemohon = pekerjaanPemohonTidakMampu;
        suratData.alamatPemohon = alamatPemohonTidakMampu;
        suratData.persyaratan = persyaratanTidakMampu;
      }
      // Tambahkan kondisi untuk tipe surat lainnya di masa depan

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

  const handleSubmitKematianForm = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    let isValid = true;

    if (!namaKematian.trim()) {
      setNamaKematianError("Nama harus diisi");
      isValid = false;
    } else {
      setNamaKematianError("");
    }

    if (!tempatLahirKematian.trim()) {
      setTempatLahirKematianError("Tempat lahir harus diisi");
      isValid = false;
    } else {
      setTempatLahirKematianError("");
    }

    if (!tanggalLahirKematian.trim()) {
      setTanggalLahirKematianError("Tanggal lahir harus diisi");
      isValid = false;
    } else {
      setTanggalLahirKematianError("");
    }

    if (!pekerjaanKematian.trim()) {
      setPekerjaanKematianError("Pekerjaan harus diisi");
      isValid = false;
    } else {
      setPekerjaanKematianError("");
    }

    if (!alamatKematian.trim()) {
      setAlamatKematianError("Alamat harus diisi");
      isValid = false;
    } else {
      setAlamatKematianError("");
    }

    if (!agamaKematian.trim()) {
      setAgamaKematianError("Agama harus diisi");
      isValid = false;
    } else {
      setAgamaKematianError("");
    }

    if (!hariTanggalKematian.trim()) {
      setHariTanggalKematianError("Hari/tanggal kematian harus diisi");
      isValid = false;
    } else {
      setHariTanggalKematianError("");
    }

    if (!jamKematian.trim()) {
      setJamKematianError("Jam kematian harus diisi");
      isValid = false;
    } else {
      setJamKematianError("");
    }

    if (!sebabKematian.trim()) {
      setSebabKematianError("Sebab kematian harus diisi");
      isValid = false;
    } else {
      setSebabKematianError("");
    }

    if (!yangMenerangkan.trim()) {
      setYangMenerangkanError("Yang menerangkan kematian harus diisi");
      isValid = false;
    } else {
      setYangMenerangkanError("");
    }

    if (!tempatKematian.trim()) {
      setTempatKematianError("Tempat kematian harus diisi");
      isValid = false;
    } else {
      setTempatKematianError("");
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
              "Surat Keterangan Kematian telah berhasil dibuat dan diunduh",
          });
          setIsKematianFormDialogOpen(false);
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

  const handleSubmitKelahiranForm = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    let isValid = true;

    // Validate pemohon data
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

    // Validate anak data
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

    // Validate orang tua data
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
              "Surat Keterangan Kelahiran telah berhasil dibuat dan diunduh",
          });
          setIsKelahiranFormDialogOpen(false);
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

  const handleSubmitTidakMampuForm = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    let isValid = true;

    if (!namaPemohonTidakMampu.trim()) {
      setNamaPemohonTidakMampuError("Nama pemohon harus diisi");
      isValid = false;
    } else {
      setNamaPemohonTidakMampuError("");
    }

    if (!tempatLahirPemohonTidakMampu.trim()) {
      setTempatLahirPemohonTidakMampuError("Tempat lahir harus diisi");
      isValid = false;
    } else {
      setTempatLahirPemohonTidakMampuError("");
    }

    if (!tanggalLahirPemohonTidakMampu.trim()) {
      setTanggalLahirPemohonTidakMampuError("Tanggal lahir harus diisi");
      isValid = false;
    } else {
      setTanggalLahirPemohonTidakMampuError("");
    }

    if (!pekerjaanPemohonTidakMampu.trim()) {
      setPekerjaanPemohonTidakMampuError("Pekerjaan harus diisi");
      isValid = false;
    } else {
      setPekerjaanPemohonTidakMampuError("");
    }

    if (!alamatPemohonTidakMampu.trim()) {
      setAlamatPemohonTidakMampuError("Alamat harus diisi");
      isValid = false;
    } else {
      setAlamatPemohonTidakMampuError("");
    }

    if (!persyaratanTidakMampu.trim()) {
      setPersyaratanTidakMampuError("Persyaratan harus diisi");
      isValid = false;
    } else {
      setPersyaratanTidakMampuError("");
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
              "Surat Keterangan Tidak Mampu telah berhasil dibuat dan diunduh",
          });
          setIsTidakMampuFormDialogOpen(false);
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
      <nav className="bg-white/90 backdrop-blur-[2px] fixed w-full z-50 shadow-xl top-0 left-0">
        <div className="container mx-auto px-6 py-4">
          <div className="grid grid-cols-5 items-center">
            <div className="flex justify-start col-span-1">
              <Link
                to="/"
                className="flex items-center space-x-2 text-green-800 hover:text-green-900"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-semibold">Kembali ke Beranda</span>
              </Link>
            </div>
            <div className="flex flex-col items-center justify-center col-span-3">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-2 rounded-md mr-2">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent font-poppins">
                  Layanan Surat Desa
                </h1>
              </div>
              <p className="text-md text-gray-600 mt-1 text-center whitespace-nowrap">
                Template Siap Pakai untuk Administrasi Desa Kepohkencono
              </p>
            </div>
            <div className="flex justify-end col-span-1">
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
                <div className="flex justify-end">
                  <div className="flex items-center gap-3">
                    {/* User Profile Dropdown */}
                    <div className="relative group">
                      <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-full px-4 py-2 hover:border-green-300 hover:shadow-md transition-all duration-300 cursor-pointer">
                        {/* User Avatar */}
                        <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {user.email
                              ? user.email.substring(0, 2).toUpperCase()
                              : "AD"}
                          </span>
                        </div>

                        {/* User Info */}
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            {user.email}
                          </span>
                          <span className="text-xs text-gray-500">
                            Administrator
                          </span>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2 text-gray-500 hover:text-red-600 hover:bg-red-50 p-1 h-auto"
                          onClick={async (e) => {
                            e.stopPropagation();
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
                    </div>
                  </div>
                </div>
              ) : (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      <LogIn className="h-4 w-4" />
                      Login
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader className="pb-0">
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
                          <p className="text-sm text-red-500 mt-1">
                            {emailError}
                          </p>
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
              )}
            </div>

            {/* Form Dialog for Surat Keterangan Kematian */}
            <Dialog
              open={isKematianFormDialogOpen}
              onOpenChange={setIsKematianFormDialogOpen}
            >
              <DialogContent className="sm:max-w-[650px] p-6 max-h-[90vh] overflow-y-auto">
                <DialogHeader className="pb-0">
                  <DialogTitle className="text-2xl font-bold">
                    Formulir Surat Keterangan Kematian
                  </DialogTitle>
                  <DialogDescription className="text-base mt-1">
                    Silakan lengkapi data berikut untuk pembuatan Surat
                    Keterangan Kematian.
                  </DialogDescription>
                </DialogHeader>
                <form
                  onSubmit={handleSubmitKematianForm}
                  className="space-y-4 mt-2"
                >
                  {/* Data Almarhum/Almarhumah */}
                  <div className="border-t pt-2 mt-1">
                    <h3 className="text-lg font-semibold mb-3">
                      Data Almarhum/Almarhumah
                    </h3>

                    <div className="space-y-2 mt-2">
                      <Label htmlFor="namaKematian" className="text-base">
                        Nama
                      </Label>
                      <Input
                        id="namaKematian"
                        placeholder="Masukkan nama lengkap"
                        className={`text-base ${
                          namaKematianError
                            ? "border-red-500"
                            : "border-gray-400"
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
                        <Label
                          htmlFor="tempatLahirKematian"
                          className="text-base"
                        >
                          Tempat Lahir
                        </Label>
                        <Input
                          id="tempatLahirKematian"
                          placeholder="Masukkan tempat lahir"
                          className={`text-base ${
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
                        <Label
                          htmlFor="tanggalLahirKematian"
                          className="text-base"
                        >
                          Tanggal Lahir
                        </Label>
                        <Input
                          id="tanggalLahirKematian"
                          placeholder="Masukkan tanggal lahir"
                          className={`text-base ${
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
                      <Label
                        htmlFor="jenisKelaminKematian"
                        className="text-base"
                      >
                        Jenis Kelamin
                      </Label>
                      <div className="flex space-x-4">
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
                        className={`text-base ${
                          pekerjaanKematianError
                            ? "border-red-500"
                            : "border-gray-400"
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
                        className={`text-base ${
                          alamatKematianError
                            ? "border-red-500"
                            : "border-gray-400"
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
                        className={`text-base ${
                          agamaKematianError
                            ? "border-red-500"
                            : "border-gray-400"
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

                  <div className="border-t pt-2 mt-6">
                    <h3 className="text-lg font-semibold mb-1">
                      Data Kematian
                    </h3>

                    <div className="space-y-2">
                      <Label
                        htmlFor="hariTanggalKematian"
                        className="text-base"
                      >
                        Hari/Tanggal Kematian
                      </Label>
                      <Input
                        id="hariTanggalKematian"
                        placeholder="Contoh: Senin, 10 Januari 2023"
                        className={`text-base ${
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
                        className={`text-base ${
                          jamKematianError
                            ? "border-red-500"
                            : "border-gray-400"
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
                        className={`text-base ${
                          sebabKematianError
                            ? "border-red-500"
                            : "border-gray-400"
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
                        className={`text-base ${
                          yangMenerangkanError
                            ? "border-red-500"
                            : "border-gray-400"
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
                        className={`text-base ${
                          tempatKematianError
                            ? "border-red-500"
                            : "border-gray-400"
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
                      onClick={() => setIsKematianFormDialogOpen(false)}
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

            {/* Form Dialog for Surat Keterangan Kelahiran */}
            <Dialog
              open={isKelahiranFormDialogOpen}
              onOpenChange={setIsKelahiranFormDialogOpen}
            >
              <DialogContent className="sm:max-w-[650px] p-6 max-h-[90vh] overflow-y-auto">
                <DialogHeader className="pb-0">
                  <DialogTitle className="text-2xl font-bold">
                    Formulir Surat Keterangan Kelahiran
                  </DialogTitle>
                  <DialogDescription className="text-base mt-1 mb-0">
                    Silakan lengkapi data berikut untuk pembuatan Surat
                    Keterangan Kelahiran.
                  </DialogDescription>
                </DialogHeader>
                <form
                  onSubmit={handleSubmitKelahiranForm}
                  className="space-y-4 mt-0"
                >
                  {/* Data Pemohon */}
                  <div className="border-t pt-2 mt-1">
                    <h3 className="text-lg font-semibold mb-1">Data Pemohon</h3>

                    <div className="space-y-2">
                      <Label htmlFor="namaPemohon" className="text-base">
                        Nama
                      </Label>
                      <Input
                        id="namaPemohon"
                        placeholder="Masukkan nama lengkap"
                        className={`text-base ${
                          namaPemohonError
                            ? "border-red-500"
                            : "border-gray-400"
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
                        <Label
                          htmlFor="tempatLahirPemohon"
                          className="text-base"
                        >
                          Tempat Lahir
                        </Label>
                        <Input
                          id="tempatLahirPemohon"
                          placeholder="Masukkan tempat lahir"
                          className={`text-base ${
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
                        <Label
                          htmlFor="tanggalLahirPemohon"
                          className="text-base"
                        >
                          Tanggal Lahir
                        </Label>
                        <Input
                          id="tanggalLahirPemohon"
                          placeholder="Masukkan tanggal lahir"
                          className={`text-base ${
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
                      <Label
                        htmlFor="jenisKelaminPemohon"
                        className="text-base"
                      >
                        Jenis Kelamin
                      </Label>
                      <div className="flex space-x-4">
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
                          <Label htmlFor="jenisKelaminPemohonL">
                            Laki-laki
                          </Label>
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
                          <Label htmlFor="jenisKelaminPemohonP">
                            Perempuan
                          </Label>
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
                        className={`text-base ${
                          pekerjaanPemohonError
                            ? "border-red-500"
                            : "border-gray-400"
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
                        className={`text-base ${
                          alamatPemohonError
                            ? "border-red-500"
                            : "border-gray-400"
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
                  <div className="border-t pt-4 mt-2">
                    <h3 className="text-lg font-semibold mb-3">Data Anak</h3>

                    <div className="space-y-2">
                      <Label htmlFor="namaAnak" className="text-base">
                        Nama
                      </Label>
                      <Input
                        id="namaAnak"
                        placeholder="Masukkan nama lengkap anak"
                        className={`text-base ${
                          namaAnakError ? "border-red-500" : "border-gray-400"
                        }`}
                        value={namaAnak}
                        onChange={(e) => {
                          setNamaAnak(e.target.value);
                          setNamaAnakError("");
                        }}
                      />
                      {namaAnakError && (
                        <p className="text-base text-red-500 mt-1">
                          {namaAnakError}
                        </p>
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
                          className={`text-base ${
                            tempatLahirAnakError
                              ? "border-red-500"
                              : "border-gray-400"
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
                          className={`text-base ${
                            tanggalLahirAnakError
                              ? "border-red-500"
                              : "border-gray-400"
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
                      <div className="flex space-x-4">
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
                        className={`text-base ${
                          agamaAnakError ? "border-red-500" : "border-gray-400"
                        }`}
                        value={agamaAnak}
                        onChange={(e) => {
                          setAgamaAnak(e.target.value);
                          setAgamaAnakError("");
                        }}
                      />
                      {agamaAnakError && (
                        <p className="text-base text-red-500 mt-1">
                          {agamaAnakError}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 mt-3">
                      <Label htmlFor="alamatAnak" className="text-base">
                        Alamat
                      </Label>
                      <Input
                        id="alamatAnak"
                        placeholder="Masukkan alamat anak"
                        className={`text-base ${
                          alamatAnakError ? "border-red-500" : "border-gray-400"
                        }`}
                        value={alamatAnak}
                        onChange={(e) => {
                          setAlamatAnak(e.target.value);
                          setAlamatAnakError("");
                        }}
                      />
                      {alamatAnakError && (
                        <p className="text-base text-red-500 mt-1">
                          {alamatAnakError}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Data Orang Tua */}
                  <div className="border-t pt-4 mt-2">
                    <h3 className="text-lg font-semibold mb-3">
                      Data Orang Tua
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="namaAyah" className="text-base">
                        Nama Ayah
                      </Label>
                      <Input
                        id="namaAyah"
                        placeholder="Masukkan nama ayah"
                        className={`text-base ${
                          namaAyahError ? "border-red-500" : "border-gray-400"
                        }`}
                        value={namaAyah}
                        onChange={(e) => {
                          setNamaAyah(e.target.value);
                          setNamaAyahError("");
                        }}
                      />
                      {namaAyahError && (
                        <p className="text-base text-red-500 mt-1">
                          {namaAyahError}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 mt-3">
                      <Label htmlFor="namaIbu" className="text-base">
                        Nama Ibu
                      </Label>
                      <Input
                        id="namaIbu"
                        placeholder="Masukkan nama ibu"
                        className={`text-base ${
                          namaIbuError ? "border-red-500" : "border-gray-400"
                        }`}
                        value={namaIbu}
                        onChange={(e) => {
                          setNamaIbu(e.target.value);
                          setNamaIbuError("");
                        }}
                      />
                      {namaIbuError && (
                        <p className="text-base text-red-500 mt-1">
                          {namaIbuError}
                        </p>
                      )}
                    </div>
                  </div>

                  <DialogFooter className="mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsKelahiranFormDialogOpen(false)}
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
          </div>
        </div>
      </nav>
      {/* How to Create Letters - Step by Step Guide */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b pt-28">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Cara Membuat Surat
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Ikuti langkah-langkah sederhana berikut untuk membuat surat resmi
              dengan mudah dan cepat
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-4 gap-6">
              {/* Step 1 */}
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <svg
                      className="h-8 w-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    Langkah 1
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Pilih Surat
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Pilih jenis surat yang ingin dibuat dari berbagai template
                    yang tersedia
                  </p>
                </div>
                {/* Arrow for desktop */}
                <div className="hidden md:block absolute top-8 -right-3 text-gray-300">
                  <svg
                    className="h-6 w-6"
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
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <svg
                      className="h-8 w-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </div>
                  <div className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    Langkah 2
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Isi Formulir
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Lengkapi data dan informasi yang diperlukan sesuai dengan
                    jenis surat
                  </p>
                </div>
                {/* Arrow for desktop */}
                <div className="hidden md:block absolute top-8 -right-3 text-gray-300">
                  <svg
                    className="h-6 w-6"
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
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <svg
                      className="h-8 w-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                      />
                    </svg>
                  </div>
                  <div className="bg-teal-100 text-teal-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    Langkah 3
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Unduh Surat
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Klik tombol "Unduh Surat" untuk menghasilkan dokumen final
                  </p>
                </div>
                {/* Arrow for desktop */}
                <div className="hidden md:block absolute top-8 -right-3 text-gray-300">
                  <svg
                    className="h-6 w-6"
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
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <svg
                      className="h-8 w-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                      />
                    </svg>
                  </div>
                  <div className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    Langkah 4
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Cetak Surat
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Cetak surat dan serahkan kepada warga yang membutuhkan
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">
                Siap untuk membuat surat? Mulai sekarang!
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <section className="pt-8 pb-16">
        <div className="container mx-auto px-6">
          {/* <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-green-900 mb-4">
                Pilih Jenis Surat
              </h2>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Silakan pilih jenis surat yang ingin Anda ajukan. Pastikan Anda
                telah menyiapkan dokumen-dokumen yang diperlukan sebelum mengisi
                formulir.
              </p>
            </div> */}

          {/* Search and Filter Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-4 w-4 text-gray-500" />
                </div>
                <Input
                  type="text"
                  placeholder="Cari layanan surat..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={
                        selectedCategory === category.id ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      className={`rounded-md ${
                        selectedCategory === category.id
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "hover:bg-green-50 hover:text-green-700 hover:border-green-300"
                      }`}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-500 mb-4">
            Menunjukkan {filteredServices.length} dari {services.length}{" "}
            template
          </div>

          {/* Templates Grid - Matching the image layout */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <Card
                  key={service.id}
                  className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white border border-gray-200"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg text-green-600">
                          {service.id === "domisili" && (
                            <Home className="w-6 h-6" />
                          )}
                          {service.id === "pengantar-desa" && (
                            <ScrollText className="w-6 h-6" />
                          )}
                          {service.id === "izin-keramaian" && (
                            <Users className="w-6 h-6" />
                          )}

                          {service.id === "usaha" && (
                            <Building className="w-6 h-6" />
                          )}
                          {service.id === "tidak-mampu" && (
                            <UserCheck className="w-6 h-6" />
                          )}
                          {service.id === "kelahiran" && (
                            <Heart className="w-6 h-6" />
                          )}
                          {service.id === "kematian" && (
                            <Award className="w-6 h-6" />
                          )}
                          {![
                            "domisili",
                            "pengantar-desa",
                            "izin-keramaian",
                            "usaha",
                            "tidak-mampu",
                            "kelahiran",
                            "kematian",
                          ].includes(service.id) && (
                            <FileText className="w-6 h-6" />
                          )}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl font-semibold text-gray-900 leading-tight">
                            {service.title}
                          </CardTitle>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs font-medium">
                        {service.status}
                      </Badge>
                    </div>
                    <Badge
                      variant="outline"
                      className={`${service.categoryColor} border-0 text-xs font-medium w-fit rounded-full px-3 py-1`}
                    >
                      {service.category}
                    </Badge>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="mb-4 text-sm leading-relaxed text-gray-600">
                      {service.description}
                    </CardDescription>

                    {/* Requirements Section */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">
                        Syarat:
                      </h4>
                      <div className="space-y-2">
                        {service.requirements.map((req, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePreviewClick(service);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleServiceSelect(service.id);
                        }}
                      >
                        Buat Surat
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <div className="flex flex-col items-center justify-center">
                  <Search className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    Tidak ada layanan yang ditemukan
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Coba ubah kata kunci pencarian atau filter kategori
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                    }}
                  >
                    Reset Pencarian
                  </Button>
                </div>
              </div>
            )}
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
                groups={alamatGroups}
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

            <div className="space-y-3">
              <Label htmlFor="signatureType" className="text-lg">
                Pilih Tanda Tangan
              </Label>
              <div className="flex flex-col space-y-2">
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

      {/* Form Dialog for Surat Keterangan Tidak Mampu */}
      <Dialog
        open={isTidakMampuFormDialogOpen}
        onOpenChange={setIsTidakMampuFormDialogOpen}
      >
        <DialogContent className="sm:max-w-[650px] p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-0">
            <DialogTitle className="text-2xl font-bold">
              Formulir Surat Keterangan Tidak Mampu
            </DialogTitle>
            <DialogDescription className="text-base mt-1 mb-0">
              Silakan lengkapi data berikut untuk pembuatan Surat Keterangan
              Tidak Mampu.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmitTidakMampuForm}
            className="space-y-4 mt-0"
          >
            <div className="border-t pt-2 mt-1">
              <h3 className="text-lg font-semibold mb-1">Data Pemohon</h3>

              <div className="space-y-2">
                <Label htmlFor="namaPemohonTidakMampu" className="text-base">
                  Nama
                </Label>
                <Input
                  id="namaPemohonTidakMampu"
                  placeholder="Masukkan nama lengkap"
                  className={`text-base ${
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
                    className={`text-base ${
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
                    className={`text-base ${
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
                <div className="flex space-x-4">
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
                <Label
                  htmlFor="pekerjaanPemohonTidakMampu"
                  className="text-base"
                >
                  Pekerjaan
                </Label>
                <Input
                  id="pekerjaanPemohonTidakMampu"
                  placeholder="Masukkan pekerjaan"
                  className={`text-base ${
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
                  className={`text-base ${
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
                  className={`text-base ${
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
                onClick={() => setIsTidakMampuFormDialogOpen(false)}
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

      {/* Template Preview Dialog */}
      {previewService && (
        <TemplatePreviewDialog
          open={isPreviewDialogOpen}
          onOpenChange={setIsPreviewDialogOpen}
          title={previewService.title}
          category={previewService.category}
          googleDriveUrl={
            previewService.id === "domisili"
              ? "https://docs.google.com/document/d/1VNWZgmVvHC0HWbGXy92nvCtiFTflJlZW/edit"
              : previewService.id === "pengantar-desa"
              ? "https://docs.google.com/document/d/17QoC3EGBAfcJK_6-Y8Keke4fXNTzmF2u/edit"
              : previewService.id === "izin-keramaian"
              ? "https://docs.google.com/document/d/1BijWyHFzuxUJfaLa6cSJlTQUk2ybfY_d/edit"
              : previewService.id === "kelahiran"
              ? "https://docs.google.com/document/d/18jD9y82RSUWBYFBxvDd896UzrMsUfH4Y/edit"
              : previewService.id === "kematian"
              ? "https://docs.google.com/document/d/1ANlR4Hs0-JPdnWkybG1iwpLGO2GZ0ORp/edit"
              : previewService.id === "usaha"
              ? "https://docs.google.com/document/d/17N_RDvdRmuaQxz6Zj4lkT4kPoAwttdU_/edit"
              : previewService.id === "tidak-mampu"
              ? "https://docs.google.com/document/d/1MHLYmGWXXuVtRi77zDupsbKJ8xn-YHFF/edit"
              : "https://drive.google.com/drive/folders/1234567890"
          }
          pdfUrl={
            previewService.id === "domisili"
              ? "/pdf_preview/Surat_Keterangan_Domisili_Preview.pdf"
              : previewService.id === "pengantar-desa"
              ? "/pdf_preview/Surat_Keterangan_Pengantar_Desa_Preview.pdf"
              : previewService.id === "izin-keramaian"
              ? "/pdf_preview/Surat_Permohonan_Izin_Keramaian_Preview.pdf"
              : previewService.id === "kelahiran"
              ? "/pdf_preview/Surat_Keterangan_Kelahiran_Preview.pdf"
              : previewService.id === "kematian"
              ? "/pdf_preview/Surat_Keterangan_Kematian_Preview.pdf"
              : previewService.id === "usaha"
              ? "/pdf_preview/Surat_Keterangan_Usaha_Preview.pdf"
              : previewService.id === "tidak-mampu"
              ? "/pdf_preview/Surat_Keterangan_Tidak_Mampu_Preview.pdf"
              : "https://drive.google.com/file/d/1234567890/view"
          }
          requirements={previewService.requirements} // Pass the requirements specific to this surat
          serviceId={previewService.id} // Pass the service ID to display the correct icon
          onUseTemplate={() => {
            setIsPreviewDialogOpen(false);
            handleServiceSelect(previewService.id);
          }}
        />
      )}
    </div>
  );
};

export default LayananSurat;
