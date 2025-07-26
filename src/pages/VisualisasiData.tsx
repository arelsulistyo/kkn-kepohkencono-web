import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  Users,
  Building,
  PieChart,
  LineChart,
  Briefcase,
  GraduationCap,
  FileText,
  Home,
  Badge,
} from "lucide-react";
import { Badge as BadgeComponent } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Demographics,
  Occupations,
  Education,
  Administration,
} from "@/components/data-categories";

const VisualisasiData = () => {
  const [selectedCategory, setSelectedCategory] = useState("demographics");

  const categories = [
    {
      id: "demographics",
      name: "Demografi",
      icon: <Users className="h-4 w-4" />,
    },
    {
      id: "occupation",
      name: "Pekerjaan",
      icon: <Briefcase className="h-4 w-4" />,
    },
    {
      id: "education",
      name: "Pendidikan",
      icon: <GraduationCap className="h-4 w-4" />,
    },
    {
      id: "health",
      name: "Administrasi",
      icon: <FileText className="h-4 w-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-[2px] fixed w-full z-50 shadow-xl top-0 left-0">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:grid sm:grid-cols-3 items-center gap-3 sm:gap-0">
            <div className="flex justify-start w-full sm:w-auto">
              <Link
                to="/"
                className="flex items-center space-x-2 text-green-800 hover:text-green-900"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-semibold text-sm sm:text-base">Kembali ke Beranda</span>
              </Link>
            </div>
            <div className="flex flex-col items-center justify-center col-span-1">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-1.5 sm:p-2 rounded-md mr-2">
                  <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-poppins">
                  Visualisasi Data
                </h1>
              </div>
              <p className="text-xs sm:text-md text-gray-600 mt-1 max-w-md text-center px-2">
                Data Insights dan Statistik Desa Kepohkencono
              </p>
            </div>
            <div className="hidden sm:flex justify-end">
              {/* Empty space - no login/logout buttons as requested */}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-32 sm:pt-40 pb-8 sm:pb-12">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Header Section */}
          {/* <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Data Insights Desa Kepohkencono
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Visualisasi data dan statistik untuk memahami kondisi dan
              perkembangan desa
            </p>
          </div> */}

          {/* Key Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Users className="h-8 w-8 text-blue-600" />
                  <BadgeComponent
                    variant="secondary"
                    className="bg-blue-200 text-blue-800"
                  >
                    Total
                  </BadgeComponent>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">4,212</div>
                <p className="text-sm text-blue-700">Penduduk Desa</p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-xs text-gray-600">
                    Jumlah Total Penduduk Desa
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Home className="h-8 w-8 text-green-600" />
                  <BadgeComponent
                    variant="secondary"
                    className="bg-green-200 text-green-800"
                  >
                    Keluarga
                  </BadgeComponent>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900">1,593</div>
                <p className="text-sm text-green-700">Kepala Keluarga</p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-xs text-gray-600">
                    Jumlah Total Kepala Keluarga
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <PieChart className="h-8 w-8 text-purple-600" />
                  <BadgeComponent
                    variant="secondary"
                    className="bg-purple-200 text-purple-800"
                  >
                    Wilayah
                  </BadgeComponent>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-900">-- km²</div>
                <p className="text-sm text-purple-700">Luas Wilayah</p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-xs text-gray-600">Area Total Desa</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <LineChart className="h-8 w-8 text-orange-600" />
                  <BadgeComponent
                    variant="secondary"
                    className="bg-orange-200 text-orange-800"
                  >
                    KTP
                  </BadgeComponent>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-900">78.6%</div>
                <p className="text-sm text-orange-700">
                  Tingkat Kepemilikan KTP
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-xs text-gray-600">
                    Kepemilikan Dokumen Resmi
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Navigation */}
          <div className="mb-6 sm:mb-8">
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={
                    selectedCategory === category.id ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-2 ${
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                      : "hover:bg-blue-50 border-blue-200"
                  }`}
                >
                  <span className="w-3 h-3 sm:w-4 sm:h-4">{category.icon}</span>
                  <span className="hidden sm:inline">{category.name}</span>
                  <span className="sm:hidden text-xs">{category.name.slice(0, 4)}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Data Category Content */}
          {selectedCategory === "demographics" && <Demographics />}
          {selectedCategory === "occupation" && <Occupations />}
          {selectedCategory === "education" && <Education />}
          {selectedCategory === "health" && <Administration />}

          {/* Charts Section */}
          {/* <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Distribusi Usia Penduduk
                </CardTitle>
                <CardDescription>
                  Breakdown populasi berdasarkan kelompok usia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">
                      Chart akan ditampilkan di sini
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Perkembangan Ekonomi
                </CardTitle>
                <CardDescription>
                  Tren pertumbuhan ekonomi desa dalam 5 tahun terakhir
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <LineChart className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <p className="text-gray-600">
                      Chart akan ditampilkan di sini
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div> */}

          {/* Additional Insights */}
          {/* <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900">
                  Pendidikan
                </CardTitle>
                <CardDescription>Tingkat pendidikan masyarakat</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">SD</span>
                    <span className="text-sm font-semibold">35%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">SMP</span>
                    <span className="text-sm font-semibold">28%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">SMA</span>
                    <span className="text-sm font-semibold">25%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Perguruan Tinggi
                    </span>
                    <span className="text-sm font-semibold">12%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900">
                  Mata Pencaharian
                </CardTitle>
                <CardDescription>Distribusi pekerjaan penduduk</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Petani</span>
                    <span className="text-sm font-semibold">45%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Pedagang</span>
                    <span className="text-sm font-semibold">20%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Buruh</span>
                    <span className="text-sm font-semibold">18%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Lainnya</span>
                    <span className="text-sm font-semibold">17%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900">
                  Fasilitas Umum
                </CardTitle>
                <CardDescription>
                  Ketersediaan infrastruktur desa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sekolah</span>
                    <span className="text-sm font-semibold text-green-600">
                      3 unit
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Puskesmas</span>
                    <span className="text-sm font-semibold text-green-600">
                      1 unit
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Masjid</span>
                    <span className="text-sm font-semibold text-green-600">
                      5 unit
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Jalan Aspal</span>
                    <span className="text-sm font-semibold text-green-600">
                      85%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default VisualisasiData;
