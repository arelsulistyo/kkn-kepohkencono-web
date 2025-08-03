"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, Search, Lightbulb, Info } from "lucide-react";
import ExcelUploadModal from "@/components/layanan-surat/ExcelUploadModal";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import type { SpecialNavbarRef } from "@/components/layout/SpecialNavbar";

interface DatabaseLookupInfoProps {
  isVisible?: boolean;
  navbarRef?: React.RefObject<SpecialNavbarRef | null>;
}

const DatabaseLookupInfo: React.FC<DatabaseLookupInfoProps> = ({
  isVisible = true,
  navbarRef,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAutoFillSectionExpanded, setIsAutoFillSectionExpanded] =
    useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchStatus, setSearchStatus] = useState<
    "idle" | "loading" | "success"
  >("idle");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setSearchStatus("loading");
      // Simulate search delay
      setTimeout(() => {
        setSearchStatus("success");
      }, 1000);
    }
  };

  const handleUploadExcelClick = () => {
    if (!user) {
      toast({
        title: "Login Diperlukan",
        description:
          "Silakan login terlebih dahulu untuk menggunakan fitur upload Excel.",
        variant: "destructive",
        className: "border-0",
      });
      // Open the login dialog using the navbar ref
      navbarRef?.current?.openLoginDialog();
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div
            className={`bg-gray-50 rounded-xl border-2 border-gray-200 transition-all duration-500 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-100 transition-colors duration-200 rounded-t-xl"
              onClick={() =>
                setIsAutoFillSectionExpanded(!isAutoFillSectionExpanded)
              }
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                  <Info className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Fitur Auto-Fill Database
                  </h3>
                  <p className="text-gray-700 text-sm">
                    Sistem pencarian otomatis untuk mempercepat pengisian
                    formulir
                  </p>
                </div>
              </div>
              <div
                className={`transform transition-transform duration-200 ${
                  isAutoFillSectionExpanded ? "rotate-180" : ""
                }`}
              >
                <svg
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Content */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                isAutoFillSectionExpanded
                  ? "max-h-[800px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="p-6 pt-4 border-t border-gray-200 mt-4">
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Left Column: Features */}
                  <div className="space-y-6">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <svg
                          className="h-5 w-5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Pencarian Otomatis
                        </h4>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          Ketik nama atau NIK untuk mencari data warga secara
                          otomatis. Sistem akan menampilkan saran yang sesuai.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <svg
                          className="h-5 w-5 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Pengisian Cepat
                        </h4>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          Pilih dari hasil pencarian untuk mengisi formulir
                          secara otomatis. Hemat waktu dan hindari kesalahan
                          input.
                        </p>
                      </div>
                    </div>

                    {/* Perbarui Data Database section */}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <svg
                          className="h-5 w-5 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Perbarui Data Database
                        </h4>
                        <p className="text-gray-700 text-sm leading-relaxed mb-4">
                          Perbarui data warga secara massal dengan mengupload
                          file Excel.
                        </p>
                        <Button
                          onClick={handleUploadExcelClick}
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 text-sm"
                        >
                          <Upload className="h-4 w-4" />
                          Upload Data Excel
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Mini Form with Search */}
                  <div>
                    {/* Mini Example Form with Integrated Search */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
                      {/* Search Section */}
                      <div className="mb-4 pb-4 border-b border-gray-200">
                        <div className="flex items-center gap-2 mb-3">
                          <Search className="h-4 w-4 text-gray-600" />
                          <h4 className="text-sm font-semibold text-gray-900">
                            Pencarian Data Penduduk
                          </h4>
                        </div>
                        <div className="relative mb-3">
                          {/* Special Search Bar with animated border */}
                          <div className="relative">
                            <Input
                              type="text"
                              placeholder="Cari nama, NIK, atau No. KK..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              onBlur={handleSearch}
                              className="w-full px-3 py-2 text-sm border border-gray-300 focus:border-blue-500 focus:ring-0 rounded-md pr-8 bg-gray-50 shadow-sm hover:shadow-md transition-all duration-300 hover:bg-white"
                              readOnly
                            />
                            {/* Animated border overlay */}
                            <div className="absolute inset-0 ring-2 ring-blue-400 ring-opacity-50 rounded-md animate-pulse pointer-events-none"></div>
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-400">
                              {searchStatus === "loading" ? (
                                <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <svg
                                  className="h-3 w-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                                  />
                                </svg>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-gray-600">
                          <Lightbulb className="h-3 w-3 text-yellow-500 flex-shrink-0 mt-0.5" />
                          <p>
                            Data akan otomatis terisi ke form di bawah setelah
                            pencarian.
                          </p>
                        </div>
                      </div>

                      {/* Form Fields */}
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Nama Lengkap
                          </label>
                          <Input
                            type="text"
                            placeholder="Akan terisi otomatis"
                            className="w-full bg-gray-50 border-gray-300 text-sm py-2"
                            disabled
                            readOnly
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            NIK
                          </label>
                          <Input
                            type="text"
                            placeholder="Akan terisi otomatis"
                            className="w-full bg-gray-50 border-gray-300 text-sm py-2"
                            disabled
                            readOnly
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Alamat
                          </label>
                          <Input
                            type="text"
                            placeholder="Akan terisi otomatis"
                            className="w-full bg-gray-50 border-gray-300 text-sm py-2"
                            disabled
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ExcelUploadModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
};

export default DatabaseLookupInfo;
