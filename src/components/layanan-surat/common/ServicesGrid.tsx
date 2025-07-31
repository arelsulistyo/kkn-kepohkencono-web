"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Home,
  Building,
  Award,
  ScrollText,
  UserCheck,
  Heart,
  Eye,
  FileText,
  CheckCircle,
  Users,
} from "lucide-react";
import { services, type Service } from "@/app/layanan-surat/data/services";

interface ServicesGridProps {
  onServiceSelect: (serviceId: string) => void;
  onPreviewClick: (service: Service) => void;
}

const ServicesGrid = ({
  onServiceSelect,
  onPreviewClick,
}: ServicesGridProps) => {
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    "all"
  );
  const [filteredServices, setFilteredServices] = useState<typeof services>([]);

  // Categories for filter
  const categories = [
    { id: "all", name: "All" },
    { id: "Personal", name: "Personal" },
    { id: "Administratif", name: "Administratif" },
    { id: "Bisnis", name: "Bisnis" },
    { id: "Izin", name: "Izin" },
  ];

  // Filter services based on search query and selected category
  useEffect(() => {
    let result = services;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (service) =>
          service.title.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter(
        (service) => service.category === selectedCategory
      );
    }

    setFilteredServices(result);
  }, [searchQuery, selectedCategory]);

  const handleServiceSelect = (serviceId: string) => {
    onServiceSelect(serviceId);
  };

  const handlePreviewClick = (service: Service) => {
    onPreviewClick(service);
  };

  return (
    <section className="pt-8 pb-16">
      <div className="container mx-auto px-6">
        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-500" />
              </div>
              <Input
                type="text"
                placeholder="Cari layanan surat..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={
                      selectedCategory === category.id ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className={`rounded-md ${
                      selectedCategory === category.id
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "hover:bg-green-50 hover:text-green-700 hover:border-green-300"
                    }`}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-500 mb-4">
          Menunjukkan {filteredServices.length} dari {services.length} template
        </div>

        {/* Templates Grid - Matching the image layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <Card
                key={service.id}
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white border border-gray-200"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg text-green-600">
                        {service.id === "domisili" && (
                          <Home className="w-6 h-6" />
                        )}
                        {service.id === "pengantar-desa" && (
                          <ScrollText className="w-6 h-6" />
                        )}
                        {service.id === "izin-keramaian" && (
                          <Users className="w-6 h-6" />
                        )}
                        {service.id === "usaha" && (
                          <Building className="w-6 h-6" />
                        )}
                        {service.id === "tidak-mampu" && (
                          <UserCheck className="w-6 h-6" />
                        )}
                        {service.id === "kelahiran" && (
                          <Heart className="w-6 h-6" />
                        )}
                        {service.id === "kematian" && (
                          <Award className="w-6 h-6" />
                        )}
                        {![
                          "domisili",
                          "pengantar-desa",
                          "izin-keramaian",
                          "usaha",
                          "tidak-mampu",
                          "kelahiran",
                          "kematian",
                        ].includes(service.id) && (
                          <FileText className="w-6 h-6" />
                        )}
                      </div>
                      <div className="flex-1 mr-3">
                        <CardTitle className="text-xl font-semibold text-gray-900 leading-tight">
                          {service.title}
                        </CardTitle>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs font-medium">
                      {service.status}
                    </Badge>
                  </div>
                  <Badge
                    variant="outline"
                    className={`${service.categoryColor} border-0 text-xs font-medium w-fit rounded-full px-3 py-1`}
                  >
                    {service.category}
                  </Badge>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="mb-4 text-sm leading-relaxed text-gray-600">
                    {service.description}
                  </CardDescription>

                  {/* Requirements Section */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      Syarat:
                    </h4>
                    <div className="space-y-2">
                      {service.requirements.map((req, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreviewClick(service);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleServiceSelect(service.id);
                      }}
                    >
                      Buat Surat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <div className="flex flex-col items-center justify-center">
                <Search className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Tidak ada layanan yang ditemukan
                </h3>
                <p className="text-gray-500 mb-4">
                  Coba ubah kata kunci pencarian atau filter kategori
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                >
                  Reset Pencarian
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
