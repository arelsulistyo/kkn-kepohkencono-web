import { useState } from "react";
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
  Users,
  GraduationCap,
  Lightbulb,
  LayoutGrid,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import ImagePreloader from "../components/ImagePreloader";
import { useImagePreloader } from "../hooks/use-image-preloader";

const Team = () => {
  const [selectedDivision, setSelectedDivision] = useState("Semua");

  // Collect all image URLs used in this page
  const teamMemberPhotos = [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=300&h=300&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=300&h=300&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=300&fit=crop&crop=face",
  ];

  // Use image preloader hook
  const { isLoading, loadProgress } = useImagePreloader({
    imageUrls: teamMemberPhotos,
    onAllImagesLoaded: () => {
      console.log("All team images loaded successfully!");
    },
  });

  const divisions = [
    "Semua",
    "Kesehatan",
    "Pendidikan",
    "IT & Administrasi",
    "Ekonomi & UMKM",
    "Infrastruktur",
    "Sosial & Budaya",
    "Lingkungan",
    "Keamanan",
  ];

  const teamMembers = [
    {
      name: "Ahmad Rizki Pratama",
      nim: "2021110001",
      division: "IT & Administrasi",
      photo:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      quote: "Teknologi untuk memajukan desa",
    },
    {
      name: "Siti Nurhaliza",
      nim: "2021110002",
      division: "Kesehatan",
      photo:
        "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=300&h=300&fit=crop&crop=face",
      quote: "Kesehatan adalah kekayaan sesungguhnya",
    },
    {
      name: "Budi Santoso",
      nim: "2021110003",
      division: "Pendidikan",
      photo:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      quote: "Pendidikan adalah investasi terbaik",
    },
    {
      name: "Maya Sari Dewi",
      nim: "2021110004",
      division: "Ekonomi & UMKM",
      photo:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      quote: "Memberdayakan ekonomi lokal",
    },
    {
      name: "Fikri Hakim",
      nim: "2021110005",
      division: "Infrastruktur",
      photo:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
      quote: "Membangun untuk masa depan",
    },
    {
      name: "Dewi Lestari",
      nim: "2021110006",
      division: "Sosial & Budaya",
      photo:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face",
      quote: "Melestarikan budaya nusantara",
    },
    // Add more team members...
    {
      name: "Arief Rahman",
      nim: "2021110007",
      division: "Lingkungan",
      photo:
        "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=300&h=300&fit=crop&crop=face",
      quote: "Menjaga alam untuk generasi mendatang",
    },
    {
      name: "Rina Kusuma",
      nim: "2021110008",
      division: "Keamanan",
      photo:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=300&fit=crop&crop=face",
      quote: "Keamanan adalah fondasi kemajuan",
    },
  ];

  const programKerjaExamples = [
    {
      title: "Website Desa Kepohkencono",
      description:
        "Pengembangan website resmi desa untuk meningkatkan transparansi informasi dan pelayanan digital kepada masyarakat.",
      imageSrc: "/placeholder.svg",
    },
    {
      title: "Pelatihan Literasi Digital",
      description:
        "Program pelatihan komputer dan internet untuk meningkatkan kemampuan digital masyarakat, khususnya generasi muda dan pelaku UMKM.",
      imageSrc: "/placeholder.svg",
    },
    {
      title: "Sistem Administrasi Surat Digital",
      description:
        "Digitalisasi proses pembuatan surat-surat administrasi desa untuk mempercepat dan mempermudah pelayanan kepada warga.",
      imageSrc: "/placeholder.svg",
    },
    {
      title: "Program Bank Sampah Digital",
      description:
        "Implementasi sistem pencatatan dan pengelolaan bank sampah berbasis digital untuk mendukung program lingkungan berkelanjutan.",
      imageSrc: "/placeholder.svg",
    },
  ];

  const filteredMembers =
    selectedDivision === "Semua"
      ? teamMembers
      : teamMembers.filter((member) => member.division === selectedDivision);

  const getDivisionColor = (division: string) => {
    const colors = {
      Kesehatan: "bg-red-100 text-red-800",
      Pendidikan: "bg-blue-100 text-blue-800",
      "IT & Administrasi": "bg-purple-100 text-purple-800",
      "Ekonomi & UMKM": "bg-green-100 text-green-800",
      Infrastruktur: "bg-yellow-100 text-yellow-800",
      "Sosial & Budaya": "bg-pink-100 text-pink-800",
      Lingkungan: "bg-emerald-100 text-emerald-800",
      Keamanan: "bg-orange-100 text-orange-800",
    };
    return (
      colors[division as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  return (
    <ImagePreloader isLoading={isLoading} loadProgress={loadProgress}>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        {/* Navbar */}
        <Navbar currentPage="team" />

        {/* Hero Section */}
        <section
          className="relative min-h-screen text-center text-white flex items-end"
          style={{
            backgroundImage: "url(/images/tim_kkn.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center 80%",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="container mx-auto px-4 relative z-10 pb-[12vh]">
            <div className="mb-8 py-8 overflow-visible">
              <h1 className="text-2xl md:text-4xl font-bold drop-shadow-lg mb-2">
                Tim KKN-PPM UGM
              </h1>
              <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent leading-relaxed pb-4">
                Jelajah Pucakwangi
              </h1>
            </div>
            {/* <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90">
              Dedikasi kami untuk membangun dan memberdayakan masyarakat di
              Kecamatan Pucakwangi terkhususnya di Desa Kepohkencono dan
              Karangwotan.
            </p> */}
          </div>
        </section>

        {/* Theme Section */}
        <section id="theme" className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-12">
              <Lightbulb className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Tema KKN Kami:
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Optimalisasi Peran dan Pengembangan Kualitas Sumber Daya Manusia
                melalui Peternakan dan Pertanian Berbasis Pendekatan One Health
                untuk Mendukung Ketahanan Pangan Berkelanjutan dan Peningkatan
                Kesehatan Masyarakat dalam Mencapai Sustainable Development
                Goals (SDGs) di Desa Karangwotan dan Kepohkencono, Kecamatan
                Pucakwangi, Kabupaten Pati.
              </p>
            </div>
          </div>
        </section>

        {/* Sub-units Section */}
        <section id="sub-units" className="py-20 bg-gray-200">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-12">
              <LayoutGrid className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Subunit Tim KKN Jelajah Pucakwangi
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Tim kami terbagi menjadi 2 subunit yang berfokus pada
                aspek-aspek kunci pembangunan desa.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md border-2 border-gray-200 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Subunit Kepohkencono
                </h3>
                <p className="text-gray-600 text-sm">
                  Meningkatkan akses dan pemahaman masyarakat terhadap teknologi
                  informasi.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border-2 border-gray-200 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Subunit Karangwotan
                </h3>
                <p className="text-gray-600 text-sm">
                  Mendorong inovasi produk lokal dan pemasaran digital untuk
                  UMKM.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Program Kerja Examples Section */}
        <section id="program-kerja" className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-12">
              <CheckCircle className="h-12 w-12 text-teal-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Contoh Program Kerja yang Telah Selesai
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Beberapa inisiatif yang telah kami laksanakan untuk kemajuan
                Desa Kepohkencono.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {programKerjaExamples.map((program, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <img
                    src={program.imageSrc || "/placeholder.svg"}
                    alt={program.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {program.title}
                    </h3>
                    <p className="text-gray-700 text-base leading-relaxed">
                      {program.description}
                    </p>
                    <Button
                      variant="link"
                      className="mt-4 px-0 text-green-600 hover:text-green-700"
                    >
                      Lihat Detail
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Filter Section */}
        {/* <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {divisions.map((division) => (
              <Button
                key={division}
                variant={selectedDivision === division ? "default" : "outline"}
                onClick={() => setSelectedDivision(division)}
                className={`${
                  selectedDivision === division
                    ? "bg-green-600 hover:bg-green-700"
                    : "border-green-600 text-green-600 hover:bg-green-50"
                }`}
              >
                {division}
              </Button>
            ))}
          </div>
        </div>
      </section> */}

        {/* Team Members Grid */}
        {/* <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMembers.map((member, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md"
              >
                <CardHeader className="text-center pb-4">
                  <div className="relative mb-4">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
                    />
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <GraduationCap className="w-6 h-6 text-green-600 bg-white rounded-full p-1" />
                    </div>
                  </div>
                  <CardTitle className="text-lg text-green-800">
                    {member.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    NIM: {member.nim}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-3">
                  <Badge className={getDivisionColor(member.division)}>
                    {member.division}
                  </Badge>
                  <p className="text-sm text-gray-600 italic">
                    "{member.quote}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredMembers.length === 0 && (
            <div className="text-center py-16">
              <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg">
                Tidak ada anggota tim dalam divisi ini.
              </p>
            </div>
          )}
        </div>
      </section> */}

        {/* CTA Section */}
        {/* <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Bergabung dengan Misi Kami
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Tim KKN Desa Makmur berkomitmen untuk menciptakan perubahan positif
            dan berkelanjutan di masyarakat melalui kolaborasi dan inovasi.
          </p>
          <Link to="/">
            <Button
              size="lg"
              className="bg-white text-green-600 hover:bg-gray-100"
            >
              Kembali ke Beranda
            </Button>
          </Link>
        </div>
      </section> */}
      </div>
    </ImagePreloader>
  );
};

export default Team;
