"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Leaf, FileText, BarChart3 } from "lucide-react";
import { Button } from "./ui/button";

interface NavbarProps {
  currentPage?: string;
  showNavbar?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({
  currentPage = "",
  showNavbar = true,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLayananSuratLoading, setIsLayananSuratLoading] = useState(false);
  const [isVisualisasiDataLoading, setIsVisualisasiDataLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (page: string) => currentPage === page;

  const scrollToSection = (sectionId: string) => {
    const scrollWithOffset = (element: HTMLElement) => {
      const navbarHeight = 80; // Account for navbar height + some padding
      const elementPosition = element.offsetTop - navbarHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    };

    // If we're not on the home page, navigate to home first
    if (pathname !== "/") {
      window.location.href = "/";
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          scrollWithOffset(element);
        }
      }, 100);
    } else {
      // If we're already on home page, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        scrollWithOffset(element);
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
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
            <Link
              href="/#about"
              className={`transition-colors font-medium font-sans ${
                isActive("home")
                  ? "text-green-600 hover:text-green-700"
                  : "text-gray-700 hover:text-green-600"
              }`}
            >
              Beranda
            </Link>
            <button
              onClick={() => scrollToSection("budaya")}
              className={`transition-colors font-medium font-sans ${
                isActive("budaya")
                  ? "text-green-600 hover:text-green-700"
                  : "text-gray-700 hover:text-green-600"
              }`}
            >
              Budaya
            </button>
            <button
              onClick={() => scrollToSection("gallery")}
              className={`transition-colors font-medium font-sans ${
                isActive("gallery")
                  ? "text-green-600 hover:text-green-700"
                  : "text-gray-700 hover:text-green-600"
              }`}
            >
              Galeri
            </button>
            <Link
              href="/team"
              className={`transition-colors font-medium font-sans ${
                isActive("team")
                  ? "text-green-600 hover:text-green-700"
                  : "text-gray-700 hover:text-green-600"
              }`}
            >
              Tentang Kami
            </Link>

            {/* Special Letter Templates Navigation */}
            <button
              className={`relative group flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg font-sans disabled:opacity-70 disabled:cursor-not-allowed ${
                isActive("layanan-surat")
                  ? "bg-gradient-to-r from-green-600 to-emerald-700 text-white"
                  : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
              }`}
              disabled={isLayananSuratLoading}
              onClick={() => {
                setIsLayananSuratLoading(true);
                router.push('/layanan-surat');
              }}
            >
              {isLayananSuratLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Memuat...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  Layanan Surat
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                </>
              )}
            </button>

            {/* Special Data Visualization Navigation */}
            <button
              className={`relative group flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg font-sans disabled:opacity-70 disabled:cursor-not-allowed ${
                isActive("visualisasi-data")
                  ? "bg-gradient-to-r from-teal-700 to-cyan-700 text-white"
                  : "bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:from-teal-700 hover:to-cyan-700"
              }`}
              disabled={isVisualisasiDataLoading}
              onClick={() => {
                setIsVisualisasiDataLoading(true);
                router.push('/visualisasi-data');
              }}
            >
              {isVisualisasiDataLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Memuat...
                </>
              ) : (
                <>
                  <BarChart3 className="h-4 w-4" />
                  Visualisasi Data
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                </>
              )}
            </button>
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
            <Link
              href="/#about"
              className={`block transition-colors font-medium font-sans py-2 ${
                isActive("home")
                  ? "text-green-600 hover:text-green-700"
                  : "text-gray-700 hover:text-green-600"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Beranda
            </Link>
            <button
              onClick={() => scrollToSection("budaya")}
              className={`block transition-colors font-medium font-sans py-2 ${
                isActive("budaya")
                  ? "text-green-600 hover:text-green-700"
                  : "text-gray-700 hover:text-green-600"
              }`}
            >
              Budaya
            </button>
            <button
              onClick={() => scrollToSection("gallery")}
              className={`block transition-colors font-medium font-sans py-2 ${
                isActive("gallery")
                  ? "text-green-600 hover:text-green-700"
                  : "text-gray-700 hover:text-green-600"
              }`}
            >
              Galeri
            </button>
            <Link
              href="/team"
              className={`block transition-colors font-medium font-sans py-2 ${
                isActive("team")
                  ? "text-green-600 hover:text-green-700"
                  : "text-gray-700 hover:text-green-600"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Tentang Kami
            </Link>

            <div className="pt-4 space-y-3">
              <button
                className={`block w-full text-center px-4 py-3 rounded-lg font-medium transition-all duration-300 font-sans disabled:opacity-70 disabled:cursor-not-allowed ${
                  isActive("layanan-surat")
                    ? "bg-gradient-to-r from-green-600 to-emerald-700 text-white"
                    : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
                }`}
                disabled={isLayananSuratLoading}
                onClick={() => {
                  setIsLayananSuratLoading(true);
                  setIsMobileMenuOpen(false);
                  router.push('/layanan-surat');
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  {isLayananSuratLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Memuat...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4" />
                      Layanan Surat
                    </>
                  )}
                </div>
              </button>

              <button
                className={`block w-full text-center px-4 py-3 rounded-lg font-medium transition-all duration-300 font-sans disabled:opacity-70 disabled:cursor-not-allowed ${
                  isActive("visualisasi-data")
                    ? "bg-gradient-to-r from-teal-700 to-cyan-700 text-white"
                    : "bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:from-teal-700 hover:to-cyan-700"
                }`}
                disabled={isVisualisasiDataLoading}
                onClick={() => {
                  setIsVisualisasiDataLoading(true);
                  setIsMobileMenuOpen(false);
                  router.push('/visualisasi-data');
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  {isVisualisasiDataLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Memuat...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="h-4 w-4" />
                      Visualisasi Data
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
