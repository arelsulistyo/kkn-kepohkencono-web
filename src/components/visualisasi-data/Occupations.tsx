import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Briefcase, TrendingUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell } from "recharts";

interface OccupationData {
  [key: string]: number | string;
}

interface ProcessedOccupation {
  name: string;
  value: number;
  percentage: number;
  color: string;
  male: number;
  female: number;
  malePercentage: number;
  femalePercentage: number;
}

const Occupations = () => {
  const [occupationData, setOccupationData] = useState<ProcessedOccupation[]>(
    []
  );
  const [totalEmployed, setTotalEmployed] = useState(0);

  useEffect(() => {
    const loadOccupationData = async () => {
      try {
        const response = await fetch("/data/Jenis_Pekerjaan.json");
        const data: OccupationData[] = await response.json();

        if (data && data.length > 0) {
          const occupationData = data[0];

          // Define occupation categories and their colors
          const occupationCategories = [
            {
              name: "PETANI",
              color: "#10B981",
              keys: [
                "PETANI/PEKEBUN L",
                "PETANI/PEKEBUN P",
                "BURUH TANI/PERKEBUNAN L",
                "BURUH TANI/PERKEBUNAN P",
              ],
            },
            {
              name: "WIRASWASTA",
              color: "#F59E0B",
              keys: [
                "WIRASWASTA L",
                "WIRASWASTA P",
                "PEDAGANG L",
                "PEDAGANG P",
                "PERDAGANGAN L",
                "PERDAGANGAN P",
              ],
            },
            {
              name: "PNS",
              color: "#3B82F6",
              keys: [
                "PEGAWAI NEGERI SIPIL (PNS) L",
                "PEGAWAI NEGERI SIPIL (PNS) P",
                "GURU L",
                "GURU P",
                "PERANGKAT DESA L",
                "PERANGKAT DESA P",
                "KEPALA DESA L",
                "KEPALA DESA P",
              ],
            },
            {
              name: "SWASTA",
              color: "#8B5CF6",
              keys: [
                "KARYAWAN SWASTA L",
                "KARYAWAN SWASTA P",
                "BURUH HARIAN LEPAS L",
                "BURUH HARIAN LEPAS P",
              ],
            },
            {
              name: "TNI/POLRI",
              color: "#06B6D4",
              keys: [
                "TENTARA NASIONAL INDONESIA (TNI) L",
                "TENTARA NASIONAL INDONESIA (TNI) P",
                "KEPOLISIAN RI (POLRI) L",
                "KEPOLISIAN RI (POLRI) P",
              ],
            },
            {
              name: "IBU RUMAH TANGGA",
              color: "#F97316",
              keys: ["MENGURUS RUMAH TANGGA L", "MENGURUS RUMAH TANGGA P"],
            },
            {
              name: "BELUM BEKERJA",
              color: "#6B7280",
              keys: ["BELUM/TIDAK BEKERJA L", "BELUM/TIDAK BEKERJA P"],
            },
            {
              name: "TUKANG",
              color: "#EF4444",
              keys: [
                "TUKANG CUKUR L",
                "TUKANG CUKUR P",
                "TUKANG LISTRIK L",
                "TUKANG LISTRIK P",
                "TUKANG BATU L",
                "TUKANG BATU P",
                "TUKANG KAYU L",
                "TUKANG KAYU P",
                "TUKANG SOL SEPATU L",
                "TUKANG SOL SEPATU P",
                "TUKANG LAS/PANDAI BESI L",
                "TUKANG LAS/PANDAI BESI P",
                "TUKANG JAHIT L",
                "TUKANG JAHIT P",
                "TUKANG GIGI L",
                "TUKANG GIGI P",
                "MEKANIK L",
                "MEKANIK P",
              ],
            },
            {
              name: "PENSIUNAN",
              color: "#A855F7",
              keys: ["PENSIUNAN L", "PENSIUNAN P"],
            },
          ];

          // Process occupation data
          const processedData: ProcessedOccupation[] = [];
          let totalCount = 0;

          occupationCategories.forEach((category) => {
            let male = 0;
            let female = 0;

            category.keys.forEach((key) => {
              const value = Number(occupationData[key]) || 0;
              if (key.endsWith(" L")) {
                male += value;
              } else if (key.endsWith(" P")) {
                female += value;
              }
            });

            const total = male + female;
            if (total > 0) {
              totalCount += total;
              // Format name to title case with special handling for acronyms
              let formattedName;
              if (category.name === "PNS") {
                formattedName = "PNS";
              } else if (category.name === "TNI/POLRI") {
                formattedName = "TNI/Polri";
              } else {
                formattedName = category.name
                  .toLowerCase()
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ");
              }

              processedData.push({
                name: formattedName,
                value: total,
                percentage: 0, // Will be calculated after we have total
                color: category.color,
                male,
                female,
                malePercentage:
                  total > 0 ? Math.round((male / total) * 100) : 0,
                femalePercentage:
                  total > 0 ? Math.round((female / total) * 100) : 0,
              });
            }
          });

          // Calculate percentages and sort by value
          const finalData = processedData
            .map((item) => ({
              ...item,
              percentage:
                totalCount > 0
                  ? Math.round((item.value / totalCount) * 100)
                  : 0,
            }))
            .sort((a, b) => b.value - a.value);

          setOccupationData(finalData);
          setTotalEmployed(totalCount);
        }
      } catch (error) {
        console.error("Error loading occupation data:", error);
        // Fallback data
        setOccupationData([
          {
            name: "Petani",
            value: 735,
            percentage: 45,
            color: "#10B981",
            male: 574,
            female: 161,
            malePercentage: 78,
            femalePercentage: 22,
          },
          {
            name: "Wiraswasta",
            value: 548,
            percentage: 33,
            color: "#F59E0B",
            male: 522,
            female: 26,
            malePercentage: 95,
            femalePercentage: 5,
          },
          {
            name: "PNS",
            value: 28,
            percentage: 2,
            color: "#3B82F6",
            male: 27,
            female: 1,
            malePercentage: 96,
            femalePercentage: 4,
          },
          {
            name: "Swasta",
            value: 112,
            percentage: 7,
            color: "#8B5CF6",
            male: 107,
            female: 7,
            malePercentage: 95,
            femalePercentage: 6,
          },
          {
            name: "Ibu Rumah Tangga",
            value: 41,
            percentage: 2,
            color: "#F97316",
            male: 0,
            female: 41,
            malePercentage: 0,
            femalePercentage: 100,
          },
          {
            name: "Belum Bekerja",
            value: 23,
            percentage: 1,
            color: "#6B7280",
            male: 11,
            female: 12,
            malePercentage: 48,
            femalePercentage: 52,
          },
          {
            name: "Tukang",
            value: 4,
            percentage: 0,
            color: "#EF4444",
            male: 3,
            female: 1,
            malePercentage: 75,
            femalePercentage: 25,
          },
        ]);
        setTotalEmployed(1494);
      }
    };

    loadOccupationData();
  }, []);

  return (
    <div className="space-y-4 md:space-y-8">
      {/* Enhanced Occupation Analysis */}
      <Card>
        <CardHeader className="pb-3 md:pb-6">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <Briefcase className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
            Distribusi Pekerjaan
          </CardTitle>
          <CardDescription className="text-sm md:text-base">
            Rincian pekerjaan di berbagai sektor
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
            <ChartContainer
              config={{
                farmers: { label: "Petani", color: "#10B981" },
                entrepreneurs: { label: "Wiraswasta", color: "#F59E0B" },
                civilServants: { label: "PNS", color: "#3B82F6" },
                privateWorkers: { label: "Swasta", color: "#8B5CF6" },
                artisans: { label: "Tukang", color: "#EF4444" },
                others: { label: "Lainnya", color: "#6B7280" },
              }}
              className="h-[250px] md:h-[400px]"
            >
              <PieChart>
                <Pie
                  data={occupationData}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="none"
                  label={({ name, percentage }) => {
                    // Find Belum Bekerja percentage to use as threshold
                    const belumBekerjaItem = occupationData.find((item) =>
                      item.name.includes("Belum Bekerja")
                    );
                    const threshold = belumBekerjaItem
                      ? belumBekerjaItem.percentage
                      : 1;

                    // Hide labels for Tukang and categories below threshold
                    if (name.includes("Tukang") || percentage < threshold) {
                      return "";
                    }

                    return `${name}: ${percentage}%`;
                  }}
                >
                  {occupationData.map((entry, index) => {
                    // Make stroke transparent for segments with 1% or lower, except for "Belum Bekerja"
                    const isBelumBekerja = entry.name.includes("Belum Bekerja");
                    const hasTransparentStroke =
                      entry.percentage <= 1 && !isBelumBekerja;

                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke={
                          hasTransparentStroke ? "transparent" : "#ffffff"
                        }
                        strokeWidth={hasTransparentStroke ? 0 : 1}
                      />
                    );
                  })}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>

            <div className="space-y-3 md:space-y-4">
              {occupationData.map((occupation) => (
                <div key={occupation.name} className="space-y-1 md:space-y-2">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      {occupation.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {occupation.value}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({occupation.percentage}%)
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 md:h-3">
                    <div
                      className="h-2 md:h-3 rounded-full transition-all duration-700"
                      style={{
                        width: `${occupation.percentage}%`,
                        backgroundColor: occupation.color,
                      }}
                    ></div>
                  </div>
                </div>
              ))}

              <div className="pt-3 md:pt-4 border-t">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                  <span className="text-sm font-semibold text-gray-800">
                    Total yang Bekerja
                  </span>
                  <span className="text-sm font-semibold text-gray-800">
                    {totalEmployed.toLocaleString()} orang
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Occupations;
