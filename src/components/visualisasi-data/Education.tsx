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
import { GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface EducationData {
  [key: string]: any;
}

interface ProcessedEducation {
  name: string;
  total: number;
  percentage: number;
  color: string;
  male: number;
  female: number;
}

const Education = () => {
  const [educationData, setEducationData] = useState<ProcessedEducation[]>([]);
  const [totalPopulation, setTotalPopulation] = useState(0);

  useEffect(() => {
    const loadEducationData = async () => {
      try {
        const response = await fetch("/data/Jenis_Pendidikan.json");
        const data: EducationData[] = await response.json();

        if (data && data.length > 0) {
          const educationData = data[0];

          // Define education categories with their keys
          const educationCategories = [
            {
              name: "Tidak/Belum Sekolah",
              maleKey: "TIDAK/BLM SEKOLAH L",
              femaleKey: "TIDAK/BLM SEKOLAH P",
              color: "#ef4444",
            },
            {
              name: "Belum Tamat SD",
              maleKey: "BELUM TAMAT SD/SEDERAJAT L",
              femaleKey: "BELUM TAMAT SD/SEDERAJAT P",
              color: "#f97316",
            },
            {
              name: "Tamat SD",
              maleKey: "TAMAT SD/SEDERAJAT L",
              femaleKey: "TAMAT SD/SEDERAJAT P",
              color: "#eab308",
            },
            {
              name: "SLTP/Sederajat",
              maleKey: "SLTP/SEDERAJAT L",
              femaleKey: "SLTP/SEDERAJAT P",
              color: "#22c55e",
            },
            {
              name: "SLTA/Sederajat",
              maleKey: "SLTA/SEDERAJAT L",
              femaleKey: "SLTA/SEDERAJAT P",
              color: "#3b82f6",
            },
            {
              name: "Akademi/Diploma III",
              maleKey: "AKADEMI/DIPL.III/S. MUDA L",
              femaleKey: "AKADEMI/DIPL.III/S.MUDA P",
              color: "#8b5cf6",
            },
            {
              name: "Diploma IV/Strata I",
              maleKey: "DIPLOMA IV/STRATA I L",
              femaleKey: "DIPLOMA IV/STRATA I P",
              color: "#06b6d4",
            },
            {
              name: "Strata II",
              maleKey: "STRATA-II L",
              femaleKey: "STRATA-II P",
              color: "#84cc16",
            },
          ];

          const processedData: ProcessedEducation[] = [];
          let total = 0;

          educationCategories.forEach((category) => {
            const male = Number(educationData[category.maleKey]) || 0;
            const female = Number(educationData[category.femaleKey]) || 0;
            const categoryTotal = male + female;

            // Only include categories with non-zero values
            if (categoryTotal > 0) {
              processedData.push({
                name: category.name,
                total: categoryTotal,
                percentage: 0, // Will be calculated after getting total
                color: category.color,
                male,
                female,
              });
              total += categoryTotal;
            }
          });

          // Calculate percentages
          const finalData = processedData.map((item) => ({
            ...item,
            percentage: parseFloat(((item.total / total) * 100).toFixed(1)),
          }));

          setEducationData(finalData);
          setTotalPopulation(total);
        }
      } catch (error) {
        console.error("Error loading education data:", error);
      }
    };

    loadEducationData();
  }, []);

  return (
    <div className="space-y-4 md:space-y-8">
      {/* Education Level Distribution - Pie Chart */}
      <Card>
        <CardHeader className="pb-3 md:pb-6">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <GraduationCap className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
            Distribusi Tingkat Pendidikan
          </CardTitle>
          <CardDescription className="text-sm md:text-base">
            Distribusi tingkat pendidikan masyarakat secara keseluruhan
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
            <ChartContainer config={{}} className="h-[200px] md:h-[300px]">
              <PieChart>
                <Pie
                  data={educationData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="total"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {educationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>

            <div className="space-y-3 md:space-y-4">
              {educationData.map((education) => (
                <div key={education.name} className="space-y-1 md:space-y-2">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      {education.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {education.total.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({education.percentage}%)
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 md:h-3">
                    <div
                      className="h-2 md:h-3 rounded-full transition-all duration-700"
                      style={{
                        width: `${education.percentage}%`,
                        backgroundColor: education.color,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Education Levels by Gender - Bar Chart */}
      <Card>
        <CardHeader className="pb-3 md:pb-6">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <GraduationCap className="h-4 w-4 md:h-5 md:w-5 text-teal-600" />
            Tingkat Pendidikan berdasarkan Jenis Kelamin
          </CardTitle>
          <CardDescription className="text-sm md:text-base">
            Rincian tingkat pendidikan berdasarkan jenis kelamin di masyarakat
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 md:px-6">
          <ChartContainer
            config={{
              male: { label: "Laki-laki", color: "#3b82f6" },
              female: { label: "Perempuan", color: "#ec4899" },
            }}
            className="h-[300px] md:h-[400px] w-full"
          >
            <BarChart data={educationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
                className="text-xs md:text-sm"
              />
              <YAxis fontSize={12} className="text-xs md:text-sm" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="male" fill="#3b82f6" />
              <Bar dataKey="female" fill="#ec4899" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Education;
