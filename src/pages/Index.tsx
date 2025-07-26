import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  Briefcase,
  Camera,
  ArrowRight,
  Play,
  Heart,
  Leaf,
  FileText,
  BarChart3,
  MapPin,
  Instagram,
  Phone,
  Mail,
} from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const Index = () => {
  const [activeSection, setActiveSection] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [showNavbar, setShowNavbar] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const scrollToContent = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => {
      setScrollY(window.scrollY);

      // Show navbar when scrolled past the about section
      const aboutSection = document.getElementById("about");
      if (aboutSection) {
        const rect = aboutSection.getBoundingClientRect();
        setShowNavbar(rect.top <= 0);
      }

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
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg transition-transform duration-300 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-green-600" />
              <span className="text-xl font-bold text-gray-900 font-sans">
                Kepohkencono
              </span>
            </div>

            <div className="hidden xl:flex items-center space-x-8">
              <a
                href="#about"
                className="text-gray-700 hover:text-green-600 transition-colors font-medium font-sans"
              >
                Beranda
              </a>
              <a
                href="#budaya"
                className="text-gray-700 hover:text-green-600 transition-colors font-medium font-sans"
              >
                Budaya
              </a>
              <a
                href="#gallery"
                className="text-gray-700 hover:text-green-600 transition-colors font-medium font-sans"
              >
                Galeri
              </a>
              <Link
                to="/team"
                className="text-gray-700 hover:text-green-600 transition-colors font-medium font-sans"
              >
                Tentang Kami
              </Link>

              {/* Special Letter Templates Navigation */}
              <Link
                to="/layanan-surat"
                className="relative group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-sans"
              >
                <FileText className="h-4 w-4" />
                Layanan Surat
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </Link>

              {/* Special Data Visualization Navigation */}
              <Link
                to="/visualisasi-data"
                className="relative group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-sans"
              >
                <BarChart3 className="h-4 w-4" />
                Visualisasi Data
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
              </Link>
            </div>

            <div className="xl:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
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
                    d={
                      isMobileMenuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="xl:hidden bg-white/95 backdrop-blur-md border-t border-gray-200">
            <div className="px-4 py-4 space-y-4">
              <a
                href="#about"
                className="block text-gray-700 hover:text-green-600 transition-colors font-medium font-sans py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Beranda
              </a>
              <a
                href="#budaya"
                className="block text-gray-700 hover:text-green-600 transition-colors font-medium font-sans py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Budaya
              </a>
              <a
                href="#gallery"
                className="block text-gray-700 hover:text-green-600 transition-colors font-medium font-sans py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Galeri
              </a>
              <Link
                to="/team"
                className="block text-gray-700 hover:text-green-600 transition-colors font-medium font-sans py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Tentang Kami
              </Link>

              <div className="pt-4 space-y-3">
                <Link
                  to="/layanan-surat"
                  className="block w-full text-center px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-sans"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center justify-center gap-2">
                    <FileText className="h-4 w-4" />
                    Layanan Surat
                  </div>
                </Link>

                <Link
                  to="/visualisasi-data"
                  className="block w-full text-center px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-sans"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center justify-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Visualisasi Data
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/images/sunset_kepohkencono_centered.jpg"
            alt="Sunset over Desa Kepohkencono fields"
            className="w-full h-full object-cover object-center"
          />
          {/* Gradient overlay - darker at bottom, lighter at top to work with sunset */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20"></div>
        </div>

        {/* Main Content - Structured to frame the sun */}
        <div className="relative z-10 min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {/* Top Section - Badge */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2 shadow-lg border border-white/20">
                <Leaf className="h-4 w-4 text-green-300" />
                <span className="text-xs sm:text-sm font-medium text-white font-sans">
                  Jelajahi Warisan Kami
                </span>
              </div>
            </div>

            {/* Upper Text - Headline positioned above the sun */}
            <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight font-sans px-2">
                <span className="drop-shadow-2xl block">Selamat Datang di</span>
                <span className="bg-gradient-to-r from-green-300 via-emerald-300 to-green-400 bg-clip-text text-transparent drop-shadow-2xl font-extrabold block mt-1 sm:mt-2">
                  Desa Kepohkencono
                </span>
              </h1>
            </div>

            {/* Sun Space - Larger space for mobile to show sun between text elements */}
            <div className="h-16 sm:h-12 md:h-16 lg:h-36 xl:h-40"></div>

            {/* Lower Text - Description positioned below the sun */}
            <div className="text-center mb-8 sm:mb-12 md:mb-12">
              <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed drop-shadow-lg font-medium max-w-4xl mx-auto font-sans px-4">
                Sebuah desa di mana waktu mengalir perlahan, kehidupan tumbuh
                bersama, dan senja bercerita di antara hamparan rumput dan sawah
                yang membentang.
              </p>
            </div>

            {/* Button Section - Hidden on mobile and tablet, visible on larger screens */}
            <div className="hidden lg:flex flex-row gap-4 justify-center mb-8 sm:mb-12 px-4">
              <Button
                size="lg"
                className="bg-white text-green-600 border-2 border-green-600 hover:bg-green-50 hover:text-green-700 hover:border-green-700 px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-lg"
                onClick={scrollToContent}
              >
                Jelajahi Desa Kami
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <a href="/layanan-surat">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 border border-white/20 text-lg"
                >
                  <FileText className="h-5 w-5" />
                  Layanan Surat
                </Button>
              </a>

              <a href="/visualisasi-data">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 border border-white/20 text-lg"
                >
                  <BarChart3 className="h-5 w-5" />
                  Visualisasi Data
                </Button>
              </a>
            </div>
          </div>
        </div>
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
                  {/* <MapPin className="w-8 h-8 text-blue-600" /> */}
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
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-3">
            {/* Column 1: Village Title and Social Media */}
            <div className="space-y-4 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3">
                 <Leaf className="h-7 w-7 text-emerald-500" />
                 <span className="text-3xl font-bold bg-gradient-to-r from-green-300 via-emerald-300 to-green-400 bg-clip-text text-transparent">
                   Kepohkencono
                 </span>
               </div>
              <p className="text-gray-400 text-lg leading-relaxed">
                Menjaga tradisi, merangkul masa depan. Sebuah komunitas yang harmonis di tengah keindahan alam.
              </p>
              <div className="flex justify-center md:justify-start space-x-6 pt-4">
                 <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                   <Instagram className="h-6 w-6" />
                 </a>
                 <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                   <FaTiktok className="h-6 w-6" />
                 </a>
               </div>
            </div>

            {/* Column 2: Tautan Cepat (Quick Links) */}
            <div className="space-y-4 text-center md:text-left">
              <h3 className="text-xl font-semibold mb-4 text-white">Tautan Cepat</h3>
              <ul className="space-y-2 text-gray-400">
                 <li>
                   <a href="#about" className="hover:text-emerald-400 transition-colors">
                     Beranda
                   </a>
                 </li>
                 <li>
                   <a href="#budaya" className="hover:text-emerald-400 transition-colors">
                     Budaya
                   </a>
                 </li>
                 <li>
                   <a href="#gallery" className="hover:text-emerald-400 transition-colors">
                     Galeri
                   </a>
                 </li>
                 <li>
                   <Link to="/team" className="hover:text-emerald-400 transition-colors">
                     Tentang Kami
                   </Link>
                 </li>
                 <li>
                   <Link to="/layanan-surat" className="hover:text-emerald-400 transition-colors">
                     Layanan Surat
                   </Link>
                 </li>
                 <li>
                   <Link to="/visualisasi-data" className="hover:text-emerald-400 transition-colors">
                     Visualisasi Data
                   </Link>
                 </li>
               </ul>
            </div>

            {/* Column 3: Contact Information */}
            <div className="space-y-4 text-center md:text-left">
              <h3 className="text-xl font-semibold mb-4 text-white">Punya Pertanyaan?</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-center md:justify-start gap-3 text-gray-400">
                  <MapPin className="h-5 w-5 text-emerald-500" />
                  <span>Desa Kepohkencono, Kec. Pucakwangi</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-3 text-gray-400">
                  <Phone className="h-5 w-5 text-emerald-500" />
                  <span>+62 812-3456-7890</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-3 text-gray-400">
                  <Mail className="h-5 w-5 text-emerald-500" />
                  <span>info@kepohkencono.desa.id</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Desa Kepohkencono. Dikembangkan oleh Tim KKN Jelajah Pucakwangi</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
