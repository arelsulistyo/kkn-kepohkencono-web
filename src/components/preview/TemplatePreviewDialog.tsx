import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent as BaseDialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import {
  ExternalLink,
  Share2,
  Eye,
  Home,
  ScrollText,
  Users,
  IdCard,
  Building,
  UserCheck,
  Heart,
  Award,
  FileText,
  Pencil,
  Plus,
} from "lucide-react";

interface TemplatePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  category: string;
  googleDriveUrl: string;
  pdfUrl?: string; // Optional PDF URL for full view
  requirements?: string[]; // Document requirements specific to this surat
  onUseTemplate: () => void;
  serviceId?: string; // Added to determine which icon to display
}

const TemplatePreviewDialog: React.FC<TemplatePreviewDialogProps> = ({
  open,
  onOpenChange,
  title,
  category,
  googleDriveUrl,
  pdfUrl = "#", // Default to # if not provided
  requirements = ["KTP Asli", "Kartu Keluarga", "Surat Pengantar RT/RW"], // Default requirements
  onUseTemplate,
  serviceId = "default", // Default value if not provided
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-full max-w-[1000px] translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg p-0 overflow-hidden max-h-[90vh]"
          )}
        >
          <div className="flex flex-col h-full">
            {/* Header Section */}
            <div className="p-6 border-b bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg text-green-600 animate-pulse">
                    {serviceId === "domisili" && <Home className="w-6 h-6" />}
                    {serviceId === "pengantar-desa" && (
                      <ScrollText className="w-6 h-6" />
                    )}
                    {serviceId === "izin-keramaian" && (
                      <Users className="w-6 h-6" />
                    )}
                    {serviceId === "skck" && <IdCard className="w-6 h-6" />}
                    {serviceId === "usaha" && <Building className="w-6 h-6" />}
                    {serviceId === "tidak-mampu" && (
                      <UserCheck className="w-6 h-6" />
                    )}
                    {serviceId === "kelahiran" && <Heart className="w-6 h-6" />}
                    {serviceId === "kematian" && <Award className="w-6 h-6" />}
                    {![
                      "domisili",
                      "pengantar-desa",
                      "izin-keramaian",
                      "skck",
                      "usaha",
                      "tidak-mampu",
                      "kelahiran",
                      "kematian",
                    ].includes(serviceId) && <FileText className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {title}
                    </h3>
                    <p className="text-gray-600">{category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Buat Surat Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 border-green-600 text-green-600 hover:bg-green-50 bg-transparent transition-all duration-300 hover:scale-105"
                    onClick={onUseTemplate}
                  >
                    <Plus className="h-4 w-4" />
                    Buat Surat
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => onOpenChange(false)}
                    className="hover:bg-red-50 hover:text-red-600 transition-all duration-300 hover:scale-110"
                  >
                    ×
                  </Button>
                </div>
              </div>
            </div>

            {/* Main Content Section */}
            <div className="flex-1 overflow-auto p-6 flex">
              {/* PDF Preview (Left Side - 2/3) */}
              <div className="w-2/3 pr-4">
                <div className="bg-gray-100 rounded-lg h-[500px] overflow-hidden">
                  {serviceId === "domisili" ? (
                    <iframe
                      src="/pdf_preview/Surat_Keterangan_Domisili_Preview.pdf"
                      className="w-full h-full"
                      title="Surat Keterangan Domisili Preview"
                    />
                  ) : serviceId === "kelahiran" ? (
                    <iframe
                      src="/pdf_preview/Surat_Keterangan_Kelahiran_Preview.pdf"
                      className="w-full h-full"
                      title="Surat Keterangan Kelahiran Preview"
                    />
                  ) : serviceId === "kematian" ? (
                    <iframe
                      src="/pdf_preview/Surat_Keterangan_Kematian_Preview.pdf"
                      className="w-full h-full"
                      title="Surat Keterangan Kematian Preview"
                    />
                  ) : serviceId === "usaha" ? (
                    <iframe
                      src="/pdf_preview/Surat_Keterangan_Usaha_Preview.pdf"
                      className="w-full h-full"
                      title="Surat Keterangan Usaha Preview"
                    />
                  ) : serviceId === "tidak-mampu" ? (
                    <iframe
                      src="/pdf_preview/Surat_Keterangan_Tidak_Mampu_Preview.pdf"
                      className="w-full h-full"
                      title="Surat Keterangan Tidak Mampu Preview"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-gray-500">
                        PDF Preview akan ditampilkan di sini
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Details Section (Right Side - 1/3) */}
              <div className="w-1/3 pl-4">
                <div className="bg-white rounded-lg border p-4 h-full">
                  <h3 className="font-semibold text-lg mb-4">
                    Detail Template
                  </h3>

                  {/* Status */}
                  <div className="mb-4">
                    <h4 className="text-sm text-gray-500 mb-1">Status:</h4>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Tersedia
                    </span>
                  </div>

                  {/* Format */}
                  <div className="mb-4">
                    <h4 className="text-sm text-gray-500 mb-1">Format:</h4>
                    <p className="text-sm">PDF</p>
                  </div>

                  {/* Persyaratan Dokumen */}
                  <div className="mb-4">
                    <h4 className="text-sm text-gray-500 mb-1">
                      Persyaratan Dokumen:
                    </h4>
                    <ul className="text-sm space-y-2 mt-2">
                      {requirements.map((requirement, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <svg
                            className="h-4 w-4 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span>{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tautan Cepat */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Tautan Cepat
                    </h4>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start border-orange-600 text-orange-600 hover:bg-orange-50 bg-transparent"
                        onClick={() => window.open(googleDriveUrl, "_blank")}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Manual
                        <ExternalLink className="h-3 w-3 ml-auto" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
                        onClick={() =>
                          window.open(
                            "https://drive.google.com/drive/u/1/folders/1-jAAhp4eszNutZZOBImcUCHhTN95q6d2",
                            "_blank"
                          )
                        }
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Buka di Google Drive
                        <ExternalLink className="h-3 w-3 ml-auto" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start border-gray-600 text-gray-600 hover:bg-gray-50 bg-transparent"
                        onClick={() => {
                          if (serviceId === "domisili") {
                            window.open(
                              "/pdf_preview/Surat_Keterangan_Domisili_Preview.pdf",
                              "_blank"
                            );
                          } else if (serviceId === "kelahiran") {
                            window.open(
                              "/pdf_preview/Surat_Keterangan_Kelahiran_Preview.pdf",
                              "_blank"
                            );
                          } else if (serviceId === "kematian") {
                            window.open(
                              "/pdf_preview/Surat_Keterangan_Kematian_Preview.pdf",
                              "_blank"
                            );
                          } else if (serviceId === "usaha") {
                            window.open(
                              "/pdf_preview/Surat_Keterangan_Usaha_Preview.pdf",
                              "_blank"
                            );
                          } else {
                            window.open(pdfUrl, "_blank");
                          }
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Lihat PDF Penuh
                        <ExternalLink className="h-3 w-3 ml-auto" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Section */}
            <DialogFooter className="p-6 border-t">
              <Button
                variant="default"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={onUseTemplate}
              >
                Gunakan Template
              </Button>
            </DialogFooter>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
};

export default TemplatePreviewDialog;
