import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface KTPData {
  IDEM: number;
  KABUPATEN: string;
  KECAMATAN: string;
  KODE: string;
  WILAYAH: string;
  L: number;
  P: number;
  JML: number;
  L_WKTP: number;
  P_WKTP: number;
  JML_WKTP: number;
}

interface AktaData {
  KABUPATEN: string;
  KECAMATAN: string;
  KODE: string;
  WILAYAH: string;
  MEMILIKI: number;
  BELUM_MEMILIKI: number;
  PERSEN: string;
}

interface ProcessedData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

const Administration = () => {
  const [ktpData, setKtpData] = useState<ProcessedData[]>([]);
  const [aktaData, setAktaData] = useState<ProcessedData[]>([]);
  const [totalPopulation, setTotalPopulation] = useState(0);
  const [wajibKTP, setWajibKTP] = useState(0);
  const [belumWajibKTP, setBelumWajibKTP] = useState(0);
  const [memilikiAkta, setMemilikiAkta] = useState(0);
  const [belumMemilikiAkta, setBelumMemilikiAkta] = useState(0);
  const [totalAkta, setTotalAkta] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load KTP Data
        const ktpResponse = await fetch("/data/Wajib_KTP.json");
        const ktpData: KTPData[] = await ktpResponse.json();

        if (ktpData && ktpData.length > 0) {
          const ktpInfo = ktpData[0];
          const total = ktpInfo.JML;
          const wajib = ktpInfo.JML_WKTP;
          const belum = total - wajib;

          setTotalPopulation(total);
          setWajibKTP(wajib);
          setBelumWajibKTP(belum);

          const processedKTPData: ProcessedData[] = [
            {
              name: "Wajib KTP",
              value: wajib,
              percentage: Math.round((wajib / total) * 100),
              color: "#3B82F6",
            },
            {
              name: "Belum Wajib KTP",
              value: belum,
              percentage: Math.round((belum / total) * 100),
              color: "#10B981",
            },
          ];

          setKtpData(processedKTPData);
        }

        // Load Akta Data
        const aktaResponse = await fetch("/data/Akta_U17.json");
        const aktaDataRaw: AktaData[] = await aktaResponse.json();

        if (aktaDataRaw && aktaDataRaw.length > 0) {
          const aktaInfo = aktaDataRaw[0];
          const memiliki = aktaInfo.MEMILIKI;
          const belumMemiliki = aktaInfo.BELUM_MEMILIKI;
          const totalAktaCount = memiliki + belumMemiliki;

          setMemilikiAkta(memiliki);
          setBelumMemilikiAkta(belumMemiliki);
          setTotalAkta(totalAktaCount);

          const processedAktaData: ProcessedData[] = [
            {
              name: "Memiliki Akta",
              value: memiliki,
              percentage: Math.round((memiliki / totalAktaCount) * 100),
              color: "#8B5CF6",
            },
            {
              name: "Belum Memiliki Akta",
              value: belumMemiliki,
              percentage: Math.round((belumMemiliki / totalAktaCount) * 100),
              color: "#F59E0B",
            },
          ];

          setAktaData(processedAktaData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, []);

  return (
    <div className="space-y-4 md:space-y-8">
      {/* KTP Status Distribution */}
      <Card>
        <CardHeader className="pb-3 md:pb-6">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <FileText className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
            Status Kepemilikan KTP
          </CardTitle>
          <CardDescription className="text-sm md:text-base">
            Distribusi penduduk berdasarkan status wajib KTP
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
            <ChartContainer
              config={{
                wajibKTP: { label: "Wajib KTP", color: "#3B82F6" },
                belumWajibKTP: { label: "Belum Wajib KTP", color: "#10B981" },
              }}
              className="h-[200px] md:h-[300px]"
            >
              <PieChart>
                <Pie
                  data={ktpData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {ktpData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>

            <div className="space-y-3 md:space-y-4">
              {ktpData.map((ktp) => (
                <div key={ktp.name} className="space-y-1 md:space-y-2">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      {ktp.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{ktp.value}</span>
                      <span className="text-xs text-gray-500">
                        ({ktp.percentage}%)
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 md:h-3">
                    <div
                      className="h-2 md:h-3 rounded-full transition-all duration-700"
                      style={{
                        width: `${ktp.percentage}%`,
                        backgroundColor: ktp.color,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Birth Certificate Status Distribution */}
      <Card>
        <CardHeader className="pb-3 md:pb-6">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <FileText className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
            Status Kepemilikan Akta Kelahiran (U17)
          </CardTitle>
          <CardDescription className="text-sm md:text-base">
            Distribusi kepemilikan akta kelahiran untuk usia di bawah 17 tahun
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
            <ChartContainer
              config={{
                memilikiAkta: { label: "Memiliki Akta", color: "#8B5CF6" },
                belumMemilikiAkta: {
                  label: "Belum Memiliki Akta",
                  color: "#F59E0B",
                },
              }}
              className="h-[200px] md:h-[300px]"
            >
              <PieChart>
                <Pie
                  data={aktaData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {aktaData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>

            <div className="space-y-3 md:space-y-4">
              {aktaData.map((akta) => (
                <div key={akta.name} className="space-y-1 md:space-y-2">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      {akta.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {akta.value}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({akta.percentage}%)
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 md:h-3">
                    <div
                      className="h-2 md:h-3 rounded-full transition-all duration-700"
                      style={{
                        width: `${akta.percentage}%`,
                        backgroundColor: akta.color,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* KTP Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          <Card>
            <CardHeader className="pb-2 md:pb-4">
              <CardTitle className="text-sm md:text-lg">
                Total Penduduk
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xl md:text-3xl font-bold text-gray-900">
                {totalPopulation.toLocaleString()}
              </div>
              <p className="text-xs md:text-sm text-gray-600 mt-1">
                Jumlah total penduduk
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 md:pb-4">
              <CardTitle className="text-sm md:text-lg">Wajib KTP</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xl md:text-3xl font-bold text-blue-600">
                {wajibKTP.toLocaleString()}
              </div>
              <p className="text-xs md:text-sm text-gray-600 mt-1">
                Penduduk yang wajib memiliki KTP
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 md:pb-4">
              <CardTitle className="text-sm md:text-lg">
                Belum Wajib KTP
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xl md:text-3xl font-bold text-green-600">
                {belumWajibKTP.toLocaleString()}
              </div>
              <p className="text-xs md:text-sm text-gray-600 mt-1">
                Penduduk yang belum wajib memiliki KTP
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Akta Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          <Card>
            <CardHeader className="pb-2 md:pb-4">
              <CardTitle className="text-sm md:text-lg">
                Total Anak U17
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xl md:text-3xl font-bold text-gray-900">
                {totalAkta.toLocaleString()}
              </div>
              <p className="text-xs md:text-sm text-gray-600 mt-1">
                Jumlah anak di bawah 17 tahun
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 md:pb-4">
              <CardTitle className="text-sm md:text-lg">
                Memiliki Akta
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xl md:text-3xl font-bold text-purple-600">
                {memilikiAkta.toLocaleString()}
              </div>
              <p className="text-xs md:text-sm text-gray-600 mt-1">
                Anak yang sudah memiliki akta kelahiran
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 md:pb-4">
              <CardTitle className="text-sm md:text-lg">
                Belum Memiliki Akta
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xl md:text-3xl font-bold text-orange-600">
                {belumMemilikiAkta.toLocaleString()}
              </div>
              <p className="text-xs md:text-sm text-gray-600 mt-1">
                Anak yang belum memiliki akta kelahiran
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Administration;
