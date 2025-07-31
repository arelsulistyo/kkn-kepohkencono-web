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
import { Users } from "lucide-react";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell } from "recharts";

interface DemographicData {
  [key: string]: number | string;
}

interface AgeGroupData {
  group: string;
  count: number;
  percentage: number;
  male: number;
  female: number;
  malePercentage: number;
  femalePercentage: number;
}

interface ReligionData {
  [key: string]: number | string;
}

interface ProcessedReligion {
  name: string;
  value: number;
  percentage: number;
  color: string;
  male: number;
  female: number;
}

interface KepalaKeluargaData {
  KABUPATEN: string;
  KECAMATAN: string;
  KODE: string;
  WILAYAH: string;
  "KEPALA KELUARGA L": number;
  "KEPALA KELUARGA P": number;
  "KEPALA KELUARGA JML": number;
}

interface ProcessedKepalaKeluarga {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

interface HubunganKeluargaData {
  [key: string]: number | string;
}

interface ProcessedHubunganKeluarga {
  name: string;
  value: number;
  percentage: number;
  color: string;
  male: number;
  female: number;
}

const Demographics = () => {
  const [ageGroupData, setAgeGroupData] = useState<AgeGroupData[]>([]);
  const [totalPopulation, setTotalPopulation] = useState(0);
  const [totalMale, setTotalMale] = useState(0);
  const [totalFemale, setTotalFemale] = useState(0);
  const [religionData, setReligionData] = useState<ProcessedReligion[]>([]);
  const [hubunganKeluargaData, setHubunganKeluargaData] = useState<
    ProcessedHubunganKeluarga[]
  >([]);
  const [totalHubunganKeluarga, setTotalHubunganKeluarga] = useState(0);

  useEffect(() => {
    const loadDemographicData = async () => {
      try {
        // Load age demographic data
        const response = await fetch("/data/Demografi_Umur.json");
        const data: DemographicData[] = await response.json();

        // Load religion data
        const religionResponse = await fetch("/data/Jenis_Agama.json");
        const religionDataRaw: ReligionData[] = await religionResponse.json();

        // Load hubungan keluarga data
        const hubunganKeluargaResponse = await fetch(
          "/data/Hubungan_Keluarga.json"
        );
        const hubunganKeluargaDataRaw: HubunganKeluargaData[] =
          await hubunganKeluargaResponse.json();

        if (data && data.length > 0) {
          const demographicData = data[0];

          // Group age ranges as requested: 0-19, 20-34, 35-54, 55-74, 75+
          const ageGroups = [
            {
              group: "0-19",
              ageRanges: ["00-04", "05-09", "10-14", "15-19"],
            },
            {
              group: "20-34",
              ageRanges: ["20-24", "25-29", "30-34"],
            },
            {
              group: "35-54",
              ageRanges: ["35-39", "40-44", "45-49", "50-54"],
            },
            {
              group: "55-74",
              ageRanges: ["55-59", "60-64", "65-69", "70-74"],
            },
            {
              group: "75+",
              ageRanges: [">75"],
            },
          ];

          let totalPop = 0;
          let totalM = 0;
          let totalF = 0;

          const processedData = ageGroups.map(({ group, ageRanges }) => {
            let male = 0;
            let female = 0;

            ageRanges.forEach((range) => {
              const maleKey = `${range} L`;
              const femaleKey = `${range} P`;
              male += Number(demographicData[maleKey]) || 0;
              female += Number(demographicData[femaleKey]) || 0;
            });

            const count = male + female;
            totalPop += count;
            totalM += male;
            totalF += female;

            return {
              group,
              count,
              percentage: 0, // Will be calculated after we have total
              male,
              female,
              malePercentage: count > 0 ? Math.round((male / count) * 100) : 0,
              femalePercentage:
                count > 0 ? Math.round((female / count) * 100) : 0,
            };
          });

          // Calculate percentages based on total population
          const finalData = processedData.map((item) => ({
            ...item,
            percentage:
              totalPop > 0 ? Math.round((item.count / totalPop) * 100) : 0,
          }));

          setAgeGroupData(finalData);
          setTotalPopulation(totalPop);
          setTotalMale(totalM);
          setTotalFemale(totalF);
        }

        // Process religion data
        if (religionDataRaw && religionDataRaw.length > 0) {
          const religionDataItem = religionDataRaw[0];

          // Define religion categories with their keys and colors
          const religionCategories = [
            {
              name: "Islam",
              maleKey: "ISLAM L",
              femaleKey: "ISLAM P",
              color: "#22c55e",
            },
            {
              name: "Kristen",
              maleKey: "KRISTEN L",
              femaleKey: "KRISTEN P",
              color: "#3b82f6",
            },
            {
              name: "Katolik",
              maleKey: "KATHOLIK L",
              femaleKey: "KATHOLIK P",
              color: "#8b5cf6",
            },
            {
              name: "Hindu",
              maleKey: "HINDU L",
              femaleKey: "HINDU P",
              color: "#f97316",
            },
            {
              name: "Buddha",
              maleKey: "BUDHA L",
              femaleKey: "BUDHA P",
              color: "#eab308",
            },
            {
              name: "Khonghucu",
              maleKey: "KHONGHUCU L",
              femaleKey: "KHONGHUCU P",
              color: "#ef4444",
            },
            {
              name: "Kepercayaan",
              maleKey: "KEPERCAYAAN L",
              femaleKey: "KEPERCAYAAN P",
              color: "#06b6d4",
            },
          ];

          const processedReligionData: ProcessedReligion[] = [];
          let totalReligionPop = 0;

          religionCategories.forEach((category) => {
            const male = Number(religionDataItem[category.maleKey]) || 0;
            const female = Number(religionDataItem[category.femaleKey]) || 0;
            const categoryTotal = male + female;

            // Only include categories with non-zero values
            if (categoryTotal > 0) {
              processedReligionData.push({
                name: category.name,
                value: categoryTotal,
                percentage: 0, // Will be calculated after getting total
                color: category.color,
                male,
                female,
              });
              totalReligionPop += categoryTotal;
            }
          });

          // Calculate percentages
          const finalReligionData = processedReligionData.map((item) => ({
            ...item,
            percentage: parseFloat(
              ((item.value / totalReligionPop) * 100).toFixed(1)
            ),
          }));

          setReligionData(finalReligionData);
        }

        // Process hubungan keluarga data
        if (hubunganKeluargaDataRaw && hubunganKeluargaDataRaw.length > 0) {
          const hubunganKeluargaInfo = hubunganKeluargaDataRaw[0];

          const relationshipCategories = [
            {
              name: "Kepala Keluarga",
              maleKey: "KEPALA KELUARGA L",
              femaleKey: "KEPALA KELUARGA P",
              color: "#059669",
            },
            {
              name: "Istri",
              maleKey: "ISTERI L",
              femaleKey: "ISTERI P",
              color: "#dc2626",
            },
            {
              name: "Anak",
              maleKey: "ANAK L",
              femaleKey: "ANAK P",
              color: "#3b82f6",
            },
            {
              name: "Orang Tua",
              maleKey: "ORANG TUA L",
              femaleKey: "ORANG TUA P",
              color: "#8b5cf6",
            },
          ];

          const processedHubunganKeluargaData: ProcessedHubunganKeluarga[] = [];
          let totalHubunganPop = 0;

          relationshipCategories.forEach((category) => {
            const male =
              Number(hubunganKeluargaInfo[category.maleKey]) || 0;
            const female =
              Number(hubunganKeluargaInfo[category.femaleKey]) || 0;
            const categoryTotal = male + female;

            // Only include categories with non-zero values
            if (categoryTotal > 0) {
              processedHubunganKeluargaData.push({
                name: category.name,
                value: categoryTotal,
                percentage: 0, // Will be calculated after getting total
                color: category.color,
                male,
                female,
              });
              totalHubunganPop += categoryTotal;
            }
          });

          // Calculate percentages
          const finalHubunganKeluargaData = processedHubunganKeluargaData.map(
            (item) => ({
              ...item,
              percentage: parseFloat(
                ((item.value / totalHubunganPop) * 100).toFixed(1)
              ),
            })
          );

          setHubunganKeluargaData(finalHubunganKeluargaData);
          // Calculate total from Kepala Keluarga only
          const kepalaKeluargaTotal =
            (Number(hubunganKeluargaInfo["KEPALA KELUARGA L"]) || 0) +
            (Number(hubunganKeluargaInfo["KEPALA KELUARGA P"]) || 0);
          setTotalHubunganKeluarga(kepalaKeluargaTotal);
        }
      } catch (error) {
        console.error("Error loading demographic data:", error);
        // Fallback to dummy data if loading fails
        setAgeGroupData([
          {
            group: "0-19",
            count: 468,
            percentage: 20,
            male: 240,
            female: 228,
            malePercentage: 51,
            femalePercentage: 49,
          },
          {
            group: "20-34",
            count: 655,
            percentage: 28,
            male: 315,
            female: 340,
            malePercentage: 48,
            femalePercentage: 52,
          },
          {
            group: "35-54",
            count: 983,
            percentage: 42,
            male: 468,
            female: 515,
            malePercentage: 48,
            femalePercentage: 52,
          },
          {
            group: "55-74",
            count: 421,
            percentage: 18,
            male: 195,
            female: 226,
            malePercentage: 46,
            femalePercentage: 54,
          },
          {
            group: "75+",
            count: 280,
            percentage: 12,
            male: 125,
            female: 155,
            malePercentage: 45,
            femalePercentage: 55,
          },
        ]);
        setTotalPopulation(2807);
        setTotalMale(1343);
        setTotalFemale(1464);
      }
    };

    loadDemographicData();
  }, []);

  return (
    <div className="space-y-4 md:space-y-8">
      {/* Age Distribution by Gender */}
      <Card>
        <CardHeader className="pb-3 md:pb-6">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <Users className="h-4 w-4 md:h-5 md:w-5 text-orange-600" />
            Distribusi Usia berdasarkan Jenis Kelamin
          </CardTitle>
          <CardDescription className="text-sm md:text-base">
            Rincian populasi berdasarkan kelompok usia dengan analisis jenis
            kelamin
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 md:px-6">
          <div className="space-y-4 md:space-y-6">
            {ageGroupData.map((group) => (
              <div key={group.group} className="space-y-2 md:space-y-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    Usia {group.group}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {group.count} orang
                    </span>
                    <span className="text-xs text-gray-500">
                      ({group.percentage}%)
                    </span>
                  </div>
                </div>

                {/* Total Age Group Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 md:h-3">
                  <div
                    className="h-2 md:h-3 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-700"
                    style={{ width: `${group.percentage}%` }}
                  ></div>
                </div>

                {/* Gender Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mt-2 md:mt-3">
                  {/* Male */}
                  <div className="space-y-1 md:space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1 md:gap-2">
                        <div className="w-2 h-2 md:w-3 md:h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-xs font-medium">Laki-laki</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600">
                          {group.male}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({group.malePercentage}%)
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2">
                      <div
                        className="h-1.5 md:h-2 bg-blue-500 rounded-full transition-all duration-700"
                        style={{ width: `${group.malePercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Female */}
                  <div className="space-y-1 md:space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1 md:gap-2">
                        <div className="w-2 h-2 md:w-3 md:h-3 bg-pink-500 rounded-full"></div>
                        <span className="text-xs font-medium">Perempuan</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600">
                          {group.female}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({group.femalePercentage}%)
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2">
                      <div
                        className="h-1.5 md:h-2 bg-pink-500 rounded-full transition-all duration-700"
                        style={{ width: `${group.femalePercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gender Distribution */}
      <Card>
        <CardHeader className="pb-3 md:pb-6">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <Users className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
            Distribusi Jenis Kelamin
          </CardTitle>
          <CardDescription className="text-sm md:text-base">
            Rincian populasi berdasarkan jenis kelamin
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
            <ChartContainer
              config={{
                male: { label: "Male", color: "#3B82F6" },
                female: { label: "Female", color: "#EC4899" },
              }}
              className="h-[200px] md:h-[300px]"
            >
              <PieChart>
                <Pie
                  data={[
                    { name: "Laki-laki", value: totalMale, color: "#3B82F6" },
                    { name: "Perempuan", value: totalFemale, color: "#EC4899" },
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {[
                    { name: "Laki-laki", value: totalMale, color: "#3B82F6" },
                    { name: "Perempuan", value: totalFemale, color: "#EC4899" },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>

            <div className="space-y-3 md:space-y-4">
              <div className="space-y-1 md:space-y-2">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    Laki-laki
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {totalMale.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500">
                      (
                      {totalPopulation > 0
                        ? Math.round((totalMale / totalPopulation) * 100)
                        : 0}
                      %)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 md:h-3">
                  <div
                    className="h-2 md:h-3 bg-blue-500 rounded-full transition-all duration-700"
                    style={{
                      width: `${
                        totalPopulation > 0
                          ? Math.round((totalMale / totalPopulation) * 100)
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="space-y-1 md:space-y-2">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    Perempuan
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {totalFemale.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500">
                      (
                      {totalPopulation > 0
                        ? Math.round((totalFemale / totalPopulation) * 100)
                        : 0}
                      %)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 md:h-3">
                  <div
                    className="h-2 md:h-3 bg-pink-500 rounded-full transition-all duration-700"
                    style={{
                      width: `${
                        totalPopulation > 0
                          ? Math.round((totalFemale / totalPopulation) * 100)
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="pt-2 border-t">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                  <span className="text-sm font-semibold text-gray-800">
                    Total Populasi
                  </span>
                  <span className="text-sm font-semibold text-gray-800">
                    {totalPopulation.toLocaleString()} orang
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Religion Distribution */}
      <Card>
        <CardHeader className="pb-3 md:pb-6">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <Users className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
            Distribusi Agama
          </CardTitle>
          <CardDescription className="text-sm md:text-base">
            Komposisi penduduk berdasarkan agama yang dianut
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
            <ChartContainer
              config={{
                islam: { label: "Islam", color: "#22c55e" },
                kristen: { label: "Kristen", color: "#3b82f6" },
                katolik: { label: "Katolik", color: "#8b5cf6" },
                hindu: { label: "Hindu", color: "#f97316" },
                buddha: { label: "Buddha", color: "#eab308" },
                khonghucu: { label: "Khonghucu", color: "#ef4444" },
                kepercayaan: { label: "Kepercayaan", color: "#06b6d4" },
              }}
              className="h-[200px] md:h-[300px]"
            >
              <PieChart>
                <Pie
                  data={religionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {religionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>

            <div className="space-y-3 md:space-y-4">
              {religionData.map((religion) => (
                <div key={religion.name} className="space-y-1 md:space-y-2">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      {religion.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {religion.value}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({religion.percentage}%)
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 md:h-3">
                    <div
                      className="h-2 md:h-3 rounded-full transition-all duration-700"
                      style={{
                        width: `${religion.percentage}%`,
                        backgroundColor: religion.color,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Family Relationship Distribution */}
      <Card>
        <CardHeader className="pb-3 md:pb-6">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <Users className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
            Distribusi Hubungan Keluarga
          </CardTitle>
          <CardDescription className="text-sm md:text-base">
            Komposisi penduduk berdasarkan hubungan dalam keluarga
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
            <ChartContainer
              config={{
                kepalaKeluarga: { label: "Kepala Keluarga", color: "#059669" },
                istri: { label: "Istri", color: "#dc2626" },
                anak: { label: "Anak", color: "#3b82f6" },
                orangTua: { label: "Orang Tua", color: "#8b5cf6" },
                mertua: { label: "Mertua", color: "#f59e0b" },
                cucu: { label: "Cucu", color: "#10b981" },
                familiLain: { label: "Famili Lain", color: "#ef4444" },
                lainnya: { label: "Lainnya", color: "#06b6d4" },
              }}
              className="h-[200px] md:h-[300px]"
            >
              <PieChart>
                <Pie
                  data={hubunganKeluargaData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {hubunganKeluargaData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>

            <div className="space-y-3 md:space-y-4">
              {hubunganKeluargaData.map((hubungan) => (
                <div key={hubungan.name} className="space-y-1 md:space-y-2">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      {hubungan.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {hubungan.value}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({hubungan.percentage}%)
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 md:h-3">
                    <div
                      className="h-2 md:h-3 rounded-full transition-all duration-700"
                      style={{
                        width: `${hubungan.percentage}%`,
                        backgroundColor: hubungan.color,
                      }}
                    ></div>
                  </div>

                  {/* Gender Breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1 md:mt-2">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span>Laki-laki</span>
                        </div>
                        <span className="text-gray-600">{hubungan.male}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1 md:h-1.5">
                        <div
                          className="h-1 md:h-1.5 bg-blue-400 rounded-full transition-all duration-700"
                          style={{
                            width: `${
                              hubungan.value > 0
                                ? (hubungan.male / hubungan.value) * 100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                          <span>Perempuan</span>
                        </div>
                        <span className="text-gray-600">{hubungan.female}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1 md:h-1.5">
                        <div
                          className="h-1 md:h-1.5 bg-pink-400 rounded-full transition-all duration-700"
                          style={{
                            width: `${
                              hubungan.value > 0
                                ? (hubungan.female / hubungan.value) * 100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                  <span className="text-sm font-semibold text-gray-800">
                    Total Kepala Keluarga
                  </span>
                  <span className="text-sm font-semibold text-gray-800">
                    {totalHubunganKeluarga.toLocaleString()} orang
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

export default Demographics;
