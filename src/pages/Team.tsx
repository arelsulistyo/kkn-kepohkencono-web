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
import { ArrowLeft, Users, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

const Team = () => {
  const [selectedDivision, setSelectedDivision] = useState("Semua");

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
              Tim KKN Desa Makmur
            </h1>
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <section className="pt-40 pb-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <div className="mb-8">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-90" />
            <h1 className="text-5xl font-bold mb-4">Tim KKN Desa Makmur</h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              30 mahasiswa terpilih dari 8 divisi yang berdedikasi untuk
              memajukan Desa Makmur melalui program Kuliah Kerja Nyata yang
              inovatif dan berkelanjutan.
            </p>
          </div>

          <div className="flex items-center justify-center space-x-8 text-center">
            <div>
              <div className="text-3xl font-bold">30</div>
              <div className="text-sm opacity-75">Mahasiswa</div>
            </div>
            <div>
              <div className="text-3xl font-bold">8</div>
              <div className="text-sm opacity-75">Divisi</div>
            </div>
            <div>
              <div className="text-3xl font-bold">60</div>
              <div className="text-sm opacity-75">Hari Program</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white border-b">
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
      </section>

      {/* Team Members Grid */}
      <section className="py-16">
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
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
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
      </section>
    </div>
  );
};

export default Team;
