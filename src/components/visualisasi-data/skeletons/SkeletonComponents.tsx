import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Enhanced Skeleton component with darker gray
const EnhancedSkeleton = ({ className, ...props }: React.ComponentProps<typeof Skeleton>) => (
  <Skeleton className={cn("bg-gray-300 animate-pulse", className)} {...props} />
);
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, GraduationCap, Briefcase, FileText } from "lucide-react";

// Demographics Skeleton Components
export const AgeDistributionSkeleton = () => (
  <Card>
    <CardHeader className="pb-3 md:pb-6">
      <CardTitle className="flex items-center gap-2 text-base md:text-lg">
        <Users className="h-4 w-4 md:h-5 md:w-5 text-orange-600" />
        Distribusi Usia berdasarkan Jenis Kelamin
      </CardTitle>
      <CardDescription className="text-sm md:text-base">
        Rincian populasi berdasarkan kelompok usia dengan analisis jenis kelamin
      </CardDescription>
    </CardHeader>
    <CardContent className="px-3 md:px-6">
      <div className="space-y-4 md:space-y-6">
        {[1, 2, 3, 4, 5].map((index) => (
          <div key={index} className="space-y-2 md:space-y-3">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
              <EnhancedSkeleton className="h-4 w-20" />
              <div className="flex items-center gap-2">
                <EnhancedSkeleton className="h-4 w-16" />
                <EnhancedSkeleton className="h-4 w-12" />
              </div>
            </div>
            <EnhancedSkeleton className="w-full h-2 md:h-3 rounded-full" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mt-2 md:mt-3">
              <div className="space-y-1 md:space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1 md:gap-2">
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-xs font-medium">Laki-laki</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <EnhancedSkeleton className="h-3 w-8" />
                    <EnhancedSkeleton className="h-3 w-10" />
                  </div>
                </div>
                <EnhancedSkeleton className="w-full h-1.5 md:h-2 rounded-full" />
              </div>
              <div className="space-y-1 md:space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1 md:gap-2">
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-pink-500 rounded-full"></div>
                    <span className="text-xs font-medium">Perempuan</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <EnhancedSkeleton className="h-3 w-8" />
                    <EnhancedSkeleton className="h-3 w-10" />
                  </div>
                </div>
                <EnhancedSkeleton className="w-full h-1.5 md:h-2 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export const GenderDistributionSkeleton = () => (
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
        <div className="h-[200px] md:h-[300px] flex items-center justify-center">
          <EnhancedSkeleton className="w-[200px] h-[200px] md:w-[300px] md:h-[300px] rounded-full" />
        </div>
        <div className="space-y-3 md:space-y-4">
          {[1, 2].map((index) => (
            <div key={index} className="space-y-1 md:space-y-2">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                <EnhancedSkeleton className="h-4 w-20" />
                <div className="flex items-center gap-2">
                  <EnhancedSkeleton className="h-4 w-16" />
                  <EnhancedSkeleton className="h-4 w-12" />
                </div>
              </div>
              <EnhancedSkeleton className="w-full h-2 md:h-3 rounded-full" />
            </div>
          ))}
          <div className="pt-2 border-t">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
              <span className="text-sm font-semibold text-gray-800">Total Populasi</span>
              <EnhancedSkeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const ReligionDistributionSkeleton = () => (
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
        <div className="h-[200px] md:h-[300px] flex items-center justify-center">
          <EnhancedSkeleton className="w-[200px] h-[200px] md:w-[300px] md:h-[300px] rounded-full" />
        </div>
        <div className="space-y-3 md:space-y-4">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="space-y-1 md:space-y-2">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                <EnhancedSkeleton className="h-4 w-16" />
                <div className="flex items-center gap-2">
                  <EnhancedSkeleton className="h-4 w-12" />
                  <EnhancedSkeleton className="h-4 w-12" />
                </div>
              </div>
              <EnhancedSkeleton className="w-full h-2 md:h-3 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

export const FamilyRelationshipSkeleton = () => (
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
        <div className="h-[200px] md:h-[300px] flex items-center justify-center">
          <EnhancedSkeleton className="w-[200px] h-[200px] md:w-[300px] md:h-[300px] rounded-full" />
        </div>
        <div className="space-y-3 md:space-y-4">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="space-y-1 md:space-y-2">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                <EnhancedSkeleton className="h-4 w-20" />
                <div className="flex items-center gap-2">
                  <EnhancedSkeleton className="h-4 w-12" />
                  <EnhancedSkeleton className="h-4 w-12" />
                </div>
              </div>
              <EnhancedSkeleton className="w-full h-2 md:h-3 rounded-full" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1 md:mt-2">
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Laki-laki</span>
                    </div>
                    <EnhancedSkeleton className="h-3 w-8" />
                  </div>
                  <EnhancedSkeleton className="w-full h-1 md:h-1.5 rounded-full" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                      <span>Perempuan</span>
                    </div>
                    <EnhancedSkeleton className="h-3 w-8" />
                  </div>
                  <EnhancedSkeleton className="w-full h-1 md:h-1.5 rounded-full" />
                </div>
              </div>
            </div>
          ))}
          <div className="pt-2 border-t">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
              <span className="text-sm font-semibold text-gray-800">Total Kepala Keluarga</span>
              <EnhancedSkeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Education Skeleton Components
export const EducationDistributionSkeleton = () => (
  <Card>
    <CardHeader className="pb-3 md:pb-6">
      <CardTitle className="flex items-center gap-2 text-base md:text-lg">
        <GraduationCap className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
        Distribusi Tingkat Pendidikan
      </CardTitle>
      <CardDescription className="text-sm md:text-base">
        Komposisi penduduk berdasarkan tingkat pendidikan
      </CardDescription>
    </CardHeader>
    <CardContent className="px-3 md:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        <div className="h-[200px] md:h-[300px] flex items-center justify-center">
          <EnhancedSkeleton className="w-[200px] h-[200px] md:w-[300px] md:h-[300px] rounded-full" />
        </div>
        <div className="space-y-3 md:space-y-4">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div key={index} className="space-y-1 md:space-y-2">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                <EnhancedSkeleton className="h-4 w-24" />
                <div className="flex items-center gap-2">
                  <EnhancedSkeleton className="h-4 w-12" />
                  <EnhancedSkeleton className="h-4 w-12" />
                </div>
              </div>
              <EnhancedSkeleton className="w-full h-2 md:h-3 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

export const EducationGenderSkeleton = () => (
  <Card>
    <CardHeader className="pb-3 md:pb-6">
      <CardTitle className="flex items-center gap-2 text-base md:text-lg">
        <GraduationCap className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
        Perbandingan Pendidikan berdasarkan Jenis Kelamin
      </CardTitle>
      <CardDescription className="text-sm md:text-base">
        Distribusi tingkat pendidikan antara laki-laki dan perempuan
      </CardDescription>
    </CardHeader>
    <CardContent className="px-3 md:px-6">
      <div className="h-[300px] md:h-[400px] flex items-center justify-center">
        <EnhancedSkeleton className="w-full h-full rounded-lg" />
      </div>
    </CardContent>
  </Card>
);

// Occupation Skeleton Components
export const OccupationDistributionSkeleton = () => (
  <Card>
    <CardHeader className="pb-3 md:pb-6">
      <CardTitle className="flex items-center gap-2 text-base md:text-lg">
        <Briefcase className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
        Distribusi Jenis Pekerjaan
      </CardTitle>
      <CardDescription className="text-sm md:text-base">
        Komposisi penduduk berdasarkan jenis pekerjaan
      </CardDescription>
    </CardHeader>
    <CardContent className="px-3 md:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        <div className="h-[200px] md:h-[300px] flex items-center justify-center">
          <EnhancedSkeleton className="w-[200px] h-[200px] md:w-[300px] md:h-[300px] rounded-full" />
        </div>
        <div className="space-y-3 md:space-y-4">
          {[1, 2, 3, 4, 5].map((index) => (
            <div key={index} className="space-y-1 md:space-y-2">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                <EnhancedSkeleton className="h-4 w-20" />
                <div className="flex items-center gap-2">
                  <EnhancedSkeleton className="h-4 w-12" />
                  <EnhancedSkeleton className="h-4 w-12" />
                </div>
              </div>
              <EnhancedSkeleton className="w-full h-2 md:h-3 rounded-full" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1 md:mt-2">
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Laki-laki</span>
                    </div>
                    <EnhancedSkeleton className="h-3 w-8" />
                  </div>
                  <EnhancedSkeleton className="w-full h-1 md:h-1.5 rounded-full" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                      <span>Perempuan</span>
                    </div>
                    <EnhancedSkeleton className="h-3 w-8" />
                  </div>
                  <EnhancedSkeleton className="w-full h-1 md:h-1.5 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

export const OccupationStatsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
    {[1, 2, 3, 4].map((index) => (
      <Card key={index}>
        <CardHeader className="pb-2 md:pb-4">
          <CardTitle className="text-sm md:text-lg">
            <EnhancedSkeleton className="h-4 w-20" />
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <EnhancedSkeleton className="h-8 w-16" />
            <EnhancedSkeleton className="h-3 w-24" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

// Administration Skeleton Components
export const AdministrationKTPSkeleton = () => (
  <Card>
    <CardHeader className="pb-3 md:pb-6">
      <CardTitle className="flex items-center gap-2 text-base md:text-lg">
        <FileText className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
        Status Kepemilikan KTP
      </CardTitle>
      <CardDescription className="text-sm md:text-base">
        Distribusi kepemilikan KTP berdasarkan usia wajib KTP
      </CardDescription>
    </CardHeader>
    <CardContent className="px-3 md:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        <div className="h-[200px] md:h-[300px] flex items-center justify-center">
          <EnhancedSkeleton className="w-[200px] h-[200px] md:w-[300px] md:h-[300px] rounded-full" />
        </div>
        <div className="space-y-3 md:space-y-4">
          {[1, 2].map((index) => (
            <div key={index} className="space-y-1 md:space-y-2">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                <EnhancedSkeleton className="h-4 w-20" />
                <div className="flex items-center gap-2">
                  <EnhancedSkeleton className="h-4 w-12" />
                  <EnhancedSkeleton className="h-4 w-12" />
                </div>
              </div>
              <EnhancedSkeleton className="w-full h-2 md:h-3 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

export const AdministrationAktaSkeleton = () => (
  <Card>
    <CardHeader className="pb-3 md:pb-6">
      <CardTitle className="flex items-center gap-2 text-base md:text-lg">
        <FileText className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
        Status Kepemilikan Akta Kelahiran
      </CardTitle>
      <CardDescription className="text-sm md:text-base">
        Distribusi kepemilikan akta kelahiran anak usia di bawah 17 tahun
      </CardDescription>
    </CardHeader>
    <CardContent className="px-3 md:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        <div className="h-[200px] md:h-[300px] flex items-center justify-center">
          <EnhancedSkeleton className="w-[200px] h-[200px] md:w-[300px] md:h-[300px] rounded-full" />
        </div>
        <div className="space-y-3 md:space-y-4">
          {[1, 2].map((index) => (
            <div key={index} className="space-y-1 md:space-y-2">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                <EnhancedSkeleton className="h-4 w-24" />
                <div className="flex items-center gap-2">
                  <EnhancedSkeleton className="h-4 w-12" />
                  <EnhancedSkeleton className="h-4 w-12" />
                </div>
              </div>
              <EnhancedSkeleton className="w-full h-2 md:h-3 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

export const AdministrationStatsSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
      {[1, 2, 3, 4, 5, 6].map((index) => (
        <Card key={index}>
          <CardHeader className="pb-2 md:pb-4">
            <CardTitle className="text-sm md:text-lg">
              <EnhancedSkeleton className="h-4 w-20" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <EnhancedSkeleton className="h-8 w-16" />
              <EnhancedSkeleton className="h-3 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

// Combined Skeleton Components for each section
export const DemographicsSkeleton = () => (
  <div className="space-y-4 md:space-y-8">
    <AgeDistributionSkeleton />
    <GenderDistributionSkeleton />
    <ReligionDistributionSkeleton />
    <FamilyRelationshipSkeleton />
  </div>
);

export const EducationSkeleton = () => (
  <div className="space-y-4 md:space-y-8">
    <EducationDistributionSkeleton />
    <EducationGenderSkeleton />
  </div>
);

export const OccupationSkeleton = () => (
  <div className="space-y-4 md:space-y-8">
    <OccupationDistributionSkeleton />
    <OccupationStatsSkeleton />
  </div>
);

export const AdministrationSkeleton = () => (
  <div className="space-y-4 md:space-y-8">
    <AdministrationKTPSkeleton />
    <AdministrationAktaSkeleton />
    <AdministrationStatsSkeleton />
  </div>
);