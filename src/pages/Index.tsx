import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MapPin,
  Users,
  Briefcase,
  Camera,
  ArrowRight,
  Play,
  Heart,
  Mountain,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const Index = () => {
  const [activeSection, setActiveSection] = useState("");
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["budaya", "gallery"];
      const scrollPosition = window.scrollY;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          if (top <= 100 && bottom >= 100) {
            setActiveSection(section);
            return;
          }
        }
      }

      // If no section is in view, set active to home if at top
      if (scrollPosition < 100) {
        setActiveSection("home");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/90 fixed w-full z-50 shadow-xl backdrop-blur-[2px]">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-green-900 font-poppins">
              Desa Kepohkencono
            </h1>
            <div className="hidden md:flex space-x-8 items-center font-poppins">
              <a
                href="#"
                className={`text-green-900 hover:text-green-900 relative group py-1 ${
                  activeSection === "home" ? "font-semibold" : ""
                }`}
              >
                Beranda
                <span
                  className={`absolute -bottom-[2px] left-0 w-full h-0.5 bg-green-900 transform transition-transform duration-200 ease-out ${
                    activeSection === "home"
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                ></span>
              </a>
              <a
                href="#budaya"
                className={`text-green-900 hover:text-green-900 relative group py-1 ${
                  activeSection === "budaya" ? "font-semibold" : ""
                }`}
              >
                Budaya
                <span
                  className={`absolute -bottom-[2px] left-0 w-full h-0.5 bg-green-900 transform transition-transform duration-200 ease-out ${
                    activeSection === "budaya"
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                ></span>
              </a>
              <a
                href="#gallery"
                className={`text-green-900 hover:text-green-900 relative group py-1 ${
                  activeSection === "gallery" ? "font-semibold" : ""
                }`}
              >
                Galeri
                <span
                  className={`absolute -bottom-[2px] left-0 w-full h-0.5 bg-green-900 transform transition-transform duration-200 ease-out ${
                    activeSection === "gallery"
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                ></span>
              </a>
              <Link
                to="/team"
                className={`text-green-900 hover:text-green-900 relative group py-1 ${
                  location.pathname === "/team" ? "font-semibold" : ""
                }`}
              >
                Tentang Tim Kami
                <span
                  className={`absolute -bottom-[2px] left-0 w-full h-0.5 bg-green-900 transform transition-transform duration-200 ease-out ${
                    location.pathname === "/team"
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                ></span>
              </Link>
              <Link to="/layanan-surat">
                <Button className="bg-green-900 hover:bg-green-900">
                  Layanan Surat
                </Button>
              </Link>
              <Link to="/visualisasi-data">
                <Button className="bg-blue-900 hover:bg-blue-900">
                  Visualisasi Data
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden pt-16">
        <img
          src="/kepoh_gate.jpeg"
          alt="Gerbang Desa"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-green-900 mb-6">
                Tentang Desa Kepohkencono
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Desa Kepohkencono adalah permata tersembunyi yang terletak di
                antara perbukitan hijau dan aliran sungai jernih. Dengan sejarah
                yang kaya dan tradisi yang dilestarikan turun-temurun, desa ini
                kini mengembangkan diri dengan teknologi modern untuk memberikan
                pelayanan terbaik bagi warganya.
              </p>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Melalui program KKN yang inovatif, kami berkomitmen untuk
                membangun jembatan antara kearifan lokal dan kemajuan digital,
                menciptakan harmoni yang berkelanjutan untuk generasi mendatang.
              </p>
              <Button className="bg-green-900 hover:bg-green-900">
                Pelajari Lebih Lanjut
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Pemandangan Desa dari Atas"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg shadow-lg">
                <p className="text-2xl font-bold text-green-900">500+</p>
                <p className="text-gray-600">Kepala Keluarga</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Budaya Section */}
      <section id="budaya" className="py-20 bg-amber-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-amber-800 mb-4">
              Budaya & Tradisi
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Kekayaan warisan budaya yang dilestarikan turun-temurun di Desa
              Makmur
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative aspect-video bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white/80 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-white transition-colors cursor-pointer">
                      <Play className="w-8 h-8 text-amber-600 ml-1" />
                    </div>
                    <p className="text-amber-800 font-semibold">
                      Video Budaya Desa
                    </p>
                    <p className="text-amber-600 text-sm mt-1">
                      Klik untuk memutar
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-amber-800 mb-2">
                    Upacara Adat & Kesenian
                  </h3>
                  <p className="text-gray-600">
                    Saksikan keindahan upacara adat dan kesenian tradisional
                    yang masih dilestarikan hingga kini.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-amber-800 mb-2">
                    Tarian Tradisional
                  </h4>
                  <p className="text-gray-700">
                    Tarian khas desa yang dipentaskan pada acara-acara penting
                    dan perayaan tradisional.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-amber-800 mb-2">
                    Gotong Royong
                  </h4>
                  <p className="text-gray-700">
                    Tradisi bergotong royong yang masih kuat dalam kehidupan
                    sehari-hari masyarakat desa.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-amber-800 mb-2">
                    Kerajinan Lokal
                  </h4>
                  <p className="text-gray-700">
                    Kerajinan tangan tradisional yang menjadi kebanggaan dan
                    sumber penghasilan warga desa.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-green-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-green-900 mb-4">
              Keunggulan Desa Kami
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Temukan berbagai aspek menarik yang membuat Desa Makmur istimewa
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-green-900">
                  Budaya & Warisan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 leading-relaxed">
                  Kekayaan tradisi lokal yang dilestarikan melalui upacara adat,
                  kerajinan tangan, dan seni budaya yang unik dan autentik.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-green-900">
                  Wisata & Destinasi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 leading-relaxed">
                  Air terjun yang memukau, sawah terasering yang indah, dan
                  pemandangan alam yang menenangkan jiwa setiap pengunjung.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-orange-600" />
                </div>
                <CardTitle className="text-green-900">
                  Produk Lokal UMKM
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 leading-relaxed">
                  Kopi berkualitas tinggi, kerajinan bambu, dan produk olahan
                  makanan tradisional yang mendukung ekonomi masyarakat lokal.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section id="gallery" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-green-900 mb-4">
              Galeri Desa
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Saksikan keindahan dan kehidupan sehari-hari di Desa Makmur
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-4">
              <img
                src="https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Pemandangan Gunung"
                className="w-full h-48 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
              />
              <img
                src="https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Sungai"
                className="w-full h-64 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="space-y-4">
              <img
                src="https://images.unsplash.com/photo-1433086966358-54859d0ed716?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Jembatan"
                className="w-full h-64 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
              />
              <img
                src="https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Hutan"
                className="w-full h-48 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="space-y-4 hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Sawah"
                className="w-full h-48 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
              />
              <img
                src="https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Pegunungan"
                className="w-full h-64 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="space-y-4 hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Air Terjun"
                className="w-full h-64 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
              />
              <img
                src="https://images.unsplash.com/photo-1433086966358-54859d0ed716?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Pemandangan"
                className="w-full h-48 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              className="border-green-900 text-green-900 hover:bg-green-900 hover:text-white"
            >
              <Camera className="mr-2" />
              Lihat Semua Foto
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-white">
                Desa Makmur
              </h3>
              <p className="text-green-200 leading-relaxed">
                Membangun masa depan yang berkelanjutan dengan memadukan
                kearifan lokal dan teknologi modern untuk kesejahteraan
                masyarakat.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">
                Tautan Cepat
              </h4>
              <ul className="space-y-2 text-green-200">
                <li>
                  <a
                    href="#about"
                    className="hover:text-white transition-colors"
                  >
                    Tentang Desa
                  </a>
                </li>
                <li>
                  <Link
                    to="/team"
                    className="hover:text-white transition-colors"
                  >
                    Tim KKN
                  </Link>
                </li>
                <li>
                  <Link
                    to="/layanan-surat"
                    className="hover:text-white transition-colors"
                  >
                    Layanan Surat
                  </Link>
                </li>
                <li>
                  <a
                    href="#gallery"
                    className="hover:text-white transition-colors"
                  >
                    Galeri
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Kontak</h4>
              <div className="text-green-200 space-y-2">
                <p>Jl. Desa Makmur No. 123</p>
                <p>Kecamatan Sejahtera</p>
                <p>Kabupaten Bahagia</p>
                <p>Email: info@desamakmur.id</p>
              </div>
            </div>
          </div>
          <div className="border-t border-green-700 mt-8 pt-8 text-center text-green-200">
            <p>&copy; 2025 Dikembangkan oleh Tim KKN Jelajah Pucakwangi</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
