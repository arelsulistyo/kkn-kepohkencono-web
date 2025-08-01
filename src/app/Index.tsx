"use client";

import { Button } from "@/components/ui/button";
import {
  Users,
  Briefcase,
  ArrowRight,
  Play,
  Heart,
  MapPin,
  Instagram,
  Phone,
  Mail,
  GraduationCap,
  BarChart3,
  Leaf,
  FileText,
} from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import Link from "next/link";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";

const Index = () => {
  const [activeSection, setActiveSection] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [showNavbar, setShowNavbar] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [populationData, setPopulationData] = useState({
    total: 0,
    households: 0,
  });

  const scrollToContent = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    setIsVisible(true);

    // Load population data
    const loadPopulationData = async () => {
      try {
        // Load demographic data for total population
        const demographicResponse = await fetch("/data/Demografi_Umur.json");
        const demographicData = await demographicResponse.json();

        // Load household data
        const householdResponse = await fetch("/data/Kepala_Keluarga.json");
        const householdData = await householdResponse.json();

        if (demographicData && demographicData.length > 0) {
          const data = demographicData[0];

          // Calculate total population by summing all age groups
          let totalPopulation = 0;
          const ageRanges = [
            "00-04",
            "05-09",
            "10-14",
            "15-19",
            "20-24",
            "25-29",
            "30-34",
            "35-39",
            "40-44",
            "45-49",
            "50-54",
            "55-59",
            "60-64",
            "65-69",
            "70-74",
            ">75",
          ];

          ageRanges.forEach((range) => {
            totalPopulation +=
              (data[`${range} L`] || 0) + (data[`${range} P`] || 0);
          });

          // Get household data
          const totalHouseholds =
            householdData && householdData.length > 0
              ? householdData[0]["KEPALA KELUARGA JML"] || 0
              : 0;

          setPopulationData({
            total: totalPopulation,
            households: totalHouseholds,
          });
        }
      } catch (error) {
        console.error("Error loading population data:", error);
        // Fallback to hardcoded values if data loading fails
        setPopulationData({ total: 4212, households: 1593 });
      }
    };

    loadPopulationData();

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
      <Navbar currentPage={activeSection} showNavbar={showNavbar} />

      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/images/home/sunset_kepohkencono_centered.jpg"
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
            <div className="text-center mb-8 sm:mb-6 md:mb-4">
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
                <span className="bg-gradient-to-r from-green-300 via-emerald-300 to-green-400 bg-clip-text text-transparent drop-shadow-2xl font-extrabold block -mt-2 sm:-mt-3 md:-mt-4">
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

              <Link href="/layanan-surat">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 border border-white/20 text-lg"
                >
                  <FileText className="h-5 w-5" />
                  Layanan Surat
                </Button>
              </Link>

              <Link href="/visualisasi-data">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 border border-white/20 text-lg"
                >
                  <BarChart3 className="h-5 w-5" />
                  Visualisasi Data
                </Button>
              </Link>
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
              <p className="text-lg text-gray-700 mb-6 leading-relaxed text-justify">
                Desa Kepohkencono adalah permata tersembunyi yang terletak di
                antara perbukitan hijau dan aliran sungai jernih. Dengan sejarah
                yang kaya dan tradisi yang dilestarikan turun-temurun, desa ini
                kini mengembangkan diri dengan teknologi modern untuk memberikan
                pelayanan terbaik bagi warganya.
              </p>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed text-justify">
                Melalui program KKN yang inovatif, kami berkomitmen untuk
                membangun jembatan antara kearifan lokal dan kemajuan digital,
                menciptakan harmoni yang berkelanjutan untuk generasi mendatang.
              </p>

              {/* Key Features Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Leaf className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-900">
                      Lingkungan Asri
                    </h4>
                    <p className="text-sm text-gray-600">
                      Udara segar & pemandangan hijau
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900">
                      Komunitas Solid
                    </h4>
                    <p className="text-sm text-gray-600">
                      Gotong royong & kekeluargaan
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="/images/home/baldes_kepohkencono.jpg"
                alt="Baldes Kepohkencono"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-xl font-bold text-emerald-600">
                      {populationData.total.toLocaleString()}
                    </p>
                    <p className="text-gray-600 text-xs">Penduduk</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-teal-600">
                      {populationData.households.toLocaleString()}
                    </p>
                    <p className="text-gray-600 text-xs">Kepala Keluarga</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dukuh-dukuh Desa Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-green-900 mb-4">
              Dukuh-dukuh Desa Kepohkencono
            </h2>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto">
              Desa Kepohkencono terdiri dari enam dukuh (dusun) yang
              masing-masing memiliki karakteristik dan pesona unik, membentuk
              mozaik kehidupan desa yang kaya.
            </p>
          </div>

          <div className="grid sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
            {[
              {
                name: "Dukuh Manding",
                kepalaDukuh: "-",
                mapLink: "https://maps.app.goo.gl/69K3brhnb2fCAeYG9",
                embedUrl:
                  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15845.282238606706!2d111.13487324999998!3d-6.852124999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e77337a065a0ca9%3A0x402f608a3a862ff!2sManding%2C%20Kepohkencono%2C%20Pucakwangi%2C%20Pati%20Regency%2C%20Central%20Java!5e0!3m2!1sen!2sid!4v1753696946278!5m2!1sen!2sid",
              },
              {
                name: "Dukuh Panggang",
                kepalaDukuh: "Bapak Pardi",
                mapLink: "https://maps.app.goo.gl/2dxwjwUrxk3MrXMDA",
                embedUrl:
                  "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15845.570175924187!2d111.1301171!3d-6.8434551!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e77347c2f18d4e9%3A0xb5a29788e3c841b!2sPanggang%2C%20Kepohkencono%2C%20Pucakwangi%2C%20Pati%20Regency%2C%20Central%20Java!5e0!3m2!1sen!2sid!4v1753697081840!5m2!1sen!2sid",
              },
              {
                name: "Dukuh Prau",
                kepalaDukuh: "Bapak Ngasmani",
                mapLink: "https://maps.app.goo.gl/D4Zv955qhTAHaqLZ7",
                embedUrl:
                  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.4776241579593!2d111.1516987!3d-6.8331938!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e77334abf4a08bd%3A0x865f9762969b0383!2sDk.%20Prahu%20Ds.%20kepohkencono%20Kec.%20Pucakwangi%20Kab.%20Pati%20Jawa%20Tengah%20Indonesia!5e0!3m2!1sen!2sid!4v1753697107468!5m2!1sen!2sid",
              },
              {
                name: "Dukuh Ngepoh",
                kepalaDukuh: "Bapak Zamzuri",
                mapLink: "https://maps.app.goo.gl/965Cm1wVJyUFyQMVA",
                embedUrl:
                  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15845.570172605165!2d111.14043835!3d-6.8434552!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7733756e2640f3%3A0x436d0d32ed3f7eb4!2sKepoh%2C%20Kepohkencono%2C%20Pucakwangi%2C%20Pati%20Regency%2C%20Central%20Java!5e0!3m2!1sen!2sid!4v1753697121727!5m2!1sen!2sid",
              },
              {
                name: "Dukuh Jatikebo",
                kepalaDukuh: "Bapak Muntono",
                mapLink: "https://maps.app.goo.gl/WgCyGsxMdCPLsSj29",
                embedUrl:
                  "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15845.520969435069!2d111.1459171!3d-6.8449375!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e773399f1c7880f%3A0x62c00c74b263e449!2sJati%20Kebo%2C%20Kepohkencono%2C%20Pucakwangi%2C%20Pati%20Regency%2C%20Central%20Java!5e0!3m2!1sen!2sid!4v1753697134464!5m2!1sen!2sid",
              },
              {
                name: "Dukuh Dangklik",
                kepalaDukuh: "Bapak Moh Santoso Edi",
                mapLink: "https://maps.app.goo.gl/krLRQB5LBxvuKf489",
                embedUrl:
                  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15845.740101319167!2d111.15134735000001!3d-6.8383334499999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7733a31c434147%3A0x263764942683a661!2sDangklik%2C%20Kepohkencono%2C%20Pucakwangi%2C%20Pati%20Regency%2C%20Central%20Java!5e0!3m2!1sen!2sid!4v1753697149731!5m2!1sen!2sid",
              },
            ].map((dukuh, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
              >
                <h4 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                  {dukuh.name}
                </h4>
                <p className="text-gray-600 text-sm mb-4 text-center">
                  Kepala Dukuh: {dukuh.kepalaDukuh}
                </p>

                {/* Embedded Google Map */}
                <div className="mb-4 rounded-lg overflow-hidden">
                  <iframe
                    src={dukuh.embedUrl}
                    width="100%"
                    height="200"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Map of ${dukuh.name}`}
                  ></iframe>
                </div>

                <a
                  href={dukuh.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 transition-colors shadow-md"
                >
                  <MapPin className="h-4 w-4" />
                  Lihat di Peta
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Budaya Section */}
      <section id="budaya" className="py-12 bg-amber-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative aspect-video group">
                  <video
                    id="budaya-video"
                    className="w-full h-full object-cover"
                    poster="/images/home/baldes_kepohkencono.jpg"
                  >
                    <source
                      src="/video/video_profil_kepohkencono.mp4"
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                  <div
                    id="video-overlay"
                    className="absolute inset-0 bg-black/30 flex items-center justify-center cursor-pointer group-hover:bg-black/50 transition-all duration-300 ease-in-out"
                    onClick={(event) => {
                      const video = document.getElementById(
                        "budaya-video"
                      ) as HTMLVideoElement;
                      const overlay = document.getElementById(
                        "video-overlay"
                      ) as HTMLElement;
                      if (video.paused) {
                        video.play();
                        video.controls = true;
                        overlay.style.display = "none";
                      }
                    }}
                  >
                    <div className="text-center transform group-hover:scale-110 transition-transform duration-300 ease-in-out">
                      <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-white hover:scale-105 transition-all duration-200 shadow-lg group-hover:shadow-xl">
                        <Play className="w-8 h-8 text-amber-600 ml-1" />
                      </div>
                      <p className="text-white font-semibold text-lg group-hover:text-amber-100 transition-colors duration-300">
                        Klik untuk Memutar
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-amber-800 mb-2">
                    Video Profil Desa Kepohkencono
                  </h3>
                  <p className="text-gray-600">
                    Saksikan keindahan dan kehidupan sehari-hari di Desa
                    Kepohkencono melalui video profil ini.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="text-left mb-8">
                <h2 className="text-4xl font-bold text-amber-800 mb-4">
                  Budaya & Tradisi
                </h2>
                <p className="text-xl text-gray-700 mb-6">
                  Kekayaan warisan budaya yang dilestarikan turun-temurun di
                  Desa Kepohkencono
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-gray-700 text-justify leading-relaxed">
                  Desa Kepohkencono memiliki kekayaan budaya dan tradisi yang
                  telah diwariskan secara turun-temurun dari generasi ke
                  generasi. Nilai-nilai luhur yang terkandung dalam setiap
                  tradisi mencerminkan kearifan lokal masyarakat yang masih
                  sangat dijaga dan dilestarikan hingga saat ini.
                </p>

                <p className="text-gray-700 text-justify leading-relaxed">
                  Keberagaman tradisi yang ada di desa ini tidak hanya menjadi
                  identitas budaya, tetapi juga menjadi perekat sosial yang
                  memperkuat rasa kebersamaan dan gotong royong antarwarga.
                  Setiap upacara dan kegiatan budaya selalu melibatkan
                  partisipasi aktif seluruh masyarakat.
                </p>

                <p className="text-gray-700 text-justify leading-relaxed">
                  Melalui berbagai kegiatan budaya dan tradisi, masyarakat
                  Kepohkencono terus menjaga hubungan harmonis dengan alam,
                  sesama, dan Sang Pencipta. Hal ini tercermin dalam setiap
                  ritual dan upacara adat yang dilaksanakan dengan penuh khidmat
                  dan kebersamaan.
                </p>
              </div>
            </div>
          </div>

          {/* Sedekah Bumi Section */}
          <div className="mt-16 bg-amber-50 rounded-2xl p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Content */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-amber-900 mb-4">
                  Sedekah Bumi
                </h3>
                <p className="text-gray-700 text-justify leading-relaxed">
                  Sedekah Bumi adalah sebuah tradisi adat masyarakat yang
                  dilakukan sebagai bentuk rasa syukur kepada Tuhan atas hasil
                  panen dan rezeki yang diberikan melalui bumi. Dalam
                  pelaksanaannya, warga desa biasanya membawa hasil bumi ke
                  tempat sakral seperti punden atau balai desa, lalu menggelar
                  doa bersama, makan bersama (banca'an), serta pertunjukan
                  kesenian seperti ketoprak dan campursari. Tradisi ini juga
                  menjadi ajang mempererat kebersamaan antarwarga dan menjaga
                  warisan budaya yang telah ada secara turun-temurun.
                </p>

                {/* Three Events Decoration */}
                <div className="bg-white rounded-lg p-4 border-l-4 border-amber-500">
                  <h4 className="font-semibold text-amber-900 mb-3">
                    Rangkaian Acara Sedekah Bumi:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex items-center space-x-2 bg-amber-100 rounded-lg p-3">
                      <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                      <span className="text-sm font-medium text-amber-800">
                        Banca'an
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 bg-amber-100 rounded-lg p-3">
                      <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                      <span className="text-sm font-medium text-amber-800">
                        Ketoprak
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 bg-amber-100 rounded-lg p-3">
                      <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                      <span className="text-sm font-medium text-amber-800">
                        Campursari
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image */}
              <div className="relative">
                <img
                  src="/images/sedekah-bumi.jpg"
                  alt="Sedekah Bumi"
                  className="w-full h-64 object-cover rounded-xl shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
              </div>
            </div>
          </div>

          {/* Traditional Events Section - 3 Grid */}
          <div className="mt-16">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Sedekah Bumi */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-amber-100 to-orange-100">
                  <img
                    src="/images/home/sedekah_bumi.jpg"
                    alt="Sedekah Bumi"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                      (
                        e.target as HTMLImageElement
                      ).parentElement!.classList.add(
                        "flex",
                        "items-center",
                        "justify-center"
                      );
                      (e.target as HTMLImageElement).parentElement!.innerHTML =
                        '<div class="text-amber-600 text-center"><Heart class="w-12 h-12 mx-auto mb-2" /><p class="font-semibold">Sedekah Bumi</p></div>';
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-amber-800 mb-3">
                    Banca'an di Punden
                  </h3>
                  <p className="text-gray-700 text-justify leading-relaxed">
                    Banca'an di punden melambangkan rasa syukur dan penghormatan
                    kepada leluhur. Warga membawa hasil bumi dan makanan
                    tradisional, berdoa bersama, lalu makan bersama. Ini
                    mencerminkan nilai gotong royong, persatuan, dan penghargaan
                    terhadap warisan spiritual desa.
                  </p>
                </div>
              </div>

              {/* Banca'an di Punden */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-amber-100 to-orange-100">
                  <img
                    src="/images/home/bancaan_punden.jpg"
                    alt="Banca'an di Punden"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                      (
                        e.target as HTMLImageElement
                      ).parentElement!.classList.add(
                        "flex",
                        "items-center",
                        "justify-center"
                      );
                      (e.target as HTMLImageElement).parentElement!.innerHTML =
                        '<div class="text-amber-600 text-center"><Users class="w-12 h-12 mx-auto mb-2" /><p class="font-semibold">Banca\'an di Punden</p></div>';
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-amber-800 mb-3">
                    Kesenian Ketoprak
                  </h3>
                  <p className="text-gray-700 text-justify leading-relaxed">
                    Ketoprak adalah seni pertunjukan rakyat yang menyampaikan
                    nilai moral, sejarah, dan budaya melalui cerita dan dialog.
                    Dalam Sedekah Bumi, ketoprak menjadi hiburan sekaligus
                    sarana pendidikan budaya yang mempererat hubungan sosial
                    antarwarga.
                  </p>
                </div>
              </div>

              {/* Kesenian Ketoprak */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-amber-100 to-orange-100">
                  <img
                    src="/images/home/ketoprak.jpg"
                    alt="Kesenian Ketoprak"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                      (
                        e.target as HTMLImageElement
                      ).parentElement!.classList.add(
                        "flex",
                        "items-center",
                        "justify-center"
                      );
                      (e.target as HTMLImageElement).parentElement!.innerHTML =
                        '<div class="text-amber-600 text-center"><GraduationCap class="w-12 h-12 mx-auto mb-2" /><p class="font-semibold">Kesenian Ketoprak</p></div>';
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-amber-800 mb-3">
                    Campursari
                  </h3>
                  <p className="text-gray-700 text-justify leading-relaxed">
                    Campursari adalah musik perpaduan tradisional dan modern
                    yang digemari berbagai kalangan. Dalam Sedekah Bumi,
                    campursari memperkuat suasana kebersamaan dan menjadi media
                    pelestarian budaya lokal yang mudah diterima lintas
                    generasi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Visualization Preview Section */}
      <section id="features" className="py-20 bg-green-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-green-900 mb-4">
              Data Desa Terkini
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Jelajahi wawasan komprehensif tentang komunitas kami melalui
              visualisasi data interaktif
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Age Distribution Preview */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Users className="h-4 w-4 text-orange-600" />
                </div>
                Kelompok Usia
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">0-19 tahun</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div className="w-12 h-2 bg-orange-500 rounded-full"></div>
                    </div>
                    <span className="text-xs text-gray-500">24%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">20-34 tahun</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div className="w-14 h-2 bg-orange-500 rounded-full"></div>
                    </div>
                    <span className="text-xs text-gray-500">19%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">35-54 tahun</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div className="w-10 h-2 bg-orange-500 rounded-full"></div>
                    </div>
                    <span className="text-xs text-gray-500">31%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Occupation Distribution Preview */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="h-4 w-4 text-blue-600" />
                </div>
                Pekerjaan Utama
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Petani</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div className="w-12 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-xs text-gray-500">51%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Wiraswasta</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div className="w-10 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                    <span className="text-xs text-gray-500">35%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Karyawan Swasta</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div className="w-3 h-2 bg-purple-500 rounded-full"></div>
                    </div>
                    <span className="text-xs text-gray-500">7%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Education Level Preview */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-4 w-4 text-green-600" />
                </div>
                Tingkat Pendidikan
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">SD/Sederajat</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div className="w-12 h-2 bg-[#eab308] rounded-full"></div>
                    </div>
                    <span className="text-xs text-gray-500">28%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">SLTP/Sederajat</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div className="w-10 h-2 bg-[#22c55e] rounded-full"></div>
                    </div>
                    <span className="text-xs text-gray-500">21%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">SLTA/Sederajat</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div className="w-8 h-2 bg-[#3b82f6] rounded-full"></div>
                    </div>
                    <span className="text-xs text-gray-500">16%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Button */}
          <div className="text-center mt-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={() => (window.location.href = "/visualisasi-data")}
            >
              <BarChart3 className="h-5 w-5 mr-2" />
              Jelajahi Dashboard Data Lengkap
            </Button>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section id="gallery" className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-green-900 mb-4">
              Galeri Desa
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Saksikan keindahan dan kehidupan sehari-hari di Desa Kepohkencono
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

          {/* <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              className="border-green-900 text-green-900 hover:bg-green-900 hover:text-white"
            >
              <Camera className="mr-2" />
              Lihat Semua Foto
            </Button>
          </div> */}
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
                Menjaga tradisi, merangkul masa depan. Sebuah komunitas yang
                harmonis di tengah keindahan alam.
              </p>
              <div className="flex justify-center md:justify-start space-x-6 pt-4">
                <a
                  href="https://www.instagram.com/jelajah.pucakwangi?igsh=MTA3c3ZxejVyb3o0Mg%3D%3D&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  <Instagram className="h-6 w-6" />
                </a>
                <a
                  href="https://www.tiktok.com/@jelajahpucakwangi_?_t=ZS-8yObUMdgxa3&_r=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  <FaTiktok className="h-6 w-6" />
                </a>
              </div>
            </div>

            {/* Column 2: Tautan Cepat (Quick Links) */}
            <div className="space-y-4 text-center md:text-left">
              <h3 className="text-xl font-semibold mb-4 text-white">
                Tautan Cepat
              </h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#about"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Beranda
                  </a>
                </li>
                <li>
                  <a
                    href="#budaya"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Budaya
                  </a>
                </li>
                <li>
                  <a
                    href="#gallery"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Galeri
                  </a>
                </li>
                <li>
                  <Link
                    href="/team"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Tentang Kami
                  </Link>
                </li>
                <li>
                  <Link
                    href="/layanan-surat"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Layanan Surat
                  </Link>
                </li>
                <li>
                  <Link
                    href="/visualisasi-data"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Visualisasi Data
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact Information */}
            <div className="space-y-4 text-center md:text-left">
              <h3 className="text-xl font-semibold mb-4 text-white">
                Punya Pertanyaan?
              </h3>
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
                  <span>jelajahpucakwangi@gmail.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} Desa Kepohkencono. Dikembangkan
              oleh Tim KKN Jelajah Pucakwangi
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
