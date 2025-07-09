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
  const [namaPeminta, setNamaPeminta] = useState("");
  const [alamatDomisili, setAlamatDomisili] = useState("");
  const [namaPemintaError, setNamaPemintaError] = useState("");
  const [alamatDomisiliError, setAlamatDomisiliError] = useState("");

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
      // Generate PDF (async operation)
      const pdfGenerated = await generatePDF();

      // Process form submission if PDF was generated successfully
      if (pdfGenerated) {
        toast({
          title: "Pengajuan Berhasil",
          description:
            "Surat Keterangan Domisili Anda sedang diproses dan telah diunduh",
        });
        setIsFormDialogOpen(false);
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
              >
                Buat Surat
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LayananSurat;
