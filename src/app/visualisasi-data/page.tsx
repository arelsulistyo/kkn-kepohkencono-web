"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  BarChart3,
  Users,
  PieChart,
  LineChart,
  Briefcase,
  GraduationCap,
  FileText,
  Home,
} from "lucide-react";
import { Badge as BadgeComponent } from "@/components/ui/badge";
import {
  Demographics,
  Occupations,
  Education,
  Administration,
} from "@/components/visualisasi-data/";
import SpecialNavbar from "@/components/layout/SpecialNavbar";

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
      <SpecialNavbar
        title="Visualisasi Data"
        description="Data Insights dan Statistik Desa Kepohkencono"
        icon={<BarChart3 className="w-6 h-6 text-white" />}
        gradientFrom="from-teal-600"
        gradientTo="to-cyan-600"
        showAuth={false}
        responsive={true}
      />

      {/* Main Content */}
      <div className="pt-32 sm:pt-40 pb-8 sm:pb-12">
        <div className="container mx-auto px-4 sm:px-6">
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
                      ? "bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white"
                      : "hover:bg-teal-50 border-teal-200"
                  }`}
                >
                  <span className="w-3 h-3 sm:w-4 sm:h-4">{category.icon}</span>
                  <span className="hidden sm:inline">{category.name}</span>
                  <span className="sm:hidden text-xs">
                    {category.name.slice(0, 4)}
                  </span>
                </Button>
              ))}
            </div>
          </div>

          {/* Data Category Content */}
          {selectedCategory === "demographics" && <Demographics />}
          {selectedCategory === "occupation" && <Occupations />}
          {selectedCategory === "education" && <Education />}
          {selectedCategory === "health" && <Administration />}
        </div>
      </div>
    </div>
  );
};

export default VisualisasiData;
