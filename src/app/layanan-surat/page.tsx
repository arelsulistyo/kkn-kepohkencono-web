"use client";

import { useState, useRef } from "react";
import "@/app/globals.css";
import type { SuratTemplateType } from "@/components/layanan-surat/surat-templates";
import { FileText } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { TemplatePreviewDialog } from "@/components/layanan-surat/preview";
import {
  SuratDomisiliForm,
  SuratKeteranganUsahaForm,
  SuratTidakMampuForm,
  SuratKematianForm,
  SuratKelahiranForm,
  SuratPengantarDesaForm,
  SuratIzinKeramaianForm,
  type TidakMampuFormData,
  type KematianFormData,
  type KelahiranFormData,
} from "@/components/layanan-surat/surat-forms";
import { services } from "@/app/layanan-surat/data/services";
import SpecialNavbar, {
  type SpecialNavbarRef,
} from "@/components/layout/SpecialNavbar";
import StepGuide from "@/components/layanan-surat/common/StepGuide";
import ServicesGrid from "@/components/layanan-surat/common/ServicesGrid";

const LayananSurat = () => {
  const navbarRef = useRef<SpecialNavbarRef>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Search and filter state is now handled by ServicesGrid component

  // Preview dialog state
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [previewService, setPreviewService] = useState<
    (typeof services)[0] | null
  >(null);

  // Preview dialog handler
  const handlePreviewClick = (service: (typeof services)[0]) => {
    setPreviewService(service);
    setIsPreviewDialogOpen(true);
  };

  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isUsahaFormDialogOpen, setIsUsahaFormDialogOpen] = useState(false);
  const [isPengantarDesaFormDialogOpen, setIsPengantarDesaFormDialogOpen] =
    useState(false);
  const [isIzinKeramaianFormDialogOpen, setIsIzinKeramaianFormDialogOpen] =
    useState(false);
  const [isKematianFormDialogOpen, setIsKematianFormDialogOpen] =
    useState(false);
  const [isKelahiranFormDialogOpen, setIsKelahiranFormDialogOpen] =
    useState(false);
  const [isTidakMampuFormDialogOpen, setIsTidakMampuFormDialogOpen] =
    useState(false);
  const [namaPeminta, setNamaPeminta] = useState("");
  const [namaPemintaError, setNamaPemintaError] = useState("");

  // State untuk form Surat Keterangan Usaha
  const [alamat, setAlamat] = useState("");

  // Error state untuk form Surat Keterangan Usaha
  const [alamatError, setAlamatError] = useState("");

  // State untuk form Surat Keterangan Pengantar Desa - moved to SuratPengantarDesaForm component
  // State untuk form Surat Izin Keramaian - moved to SuratIzinKeramaianForm component
  // Error state untuk form Surat Keterangan Pengantar Desa - moved to SuratPengantarDesaForm component

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);

    // Check if user is logged in before allowing service access
    if (!user) {
      toast({
        title: "Login Diperlukan",
        description:
          "Anda harus login terlebih dahulu untuk menggunakan layanan surat.",
        variant: "destructive",
      });
      // Open the login dialog
      navbarRef.current?.openLoginDialog();
      return;
    }

    // Reset form fields when opening the form
    if (serviceId === "domisili") {
      setIsFormDialogOpen(true);
    } else if (serviceId === "usaha") {
      // Reset form fields for Surat Keterangan Usaha
      setNamaPeminta("");
      setAlamat("");

      // Reset error states
      setNamaPemintaError("");
      setAlamatError("");

      setIsUsahaFormDialogOpen(true);
    } else if (serviceId === "pengantar-desa") {
      // Form reset is now handled in SuratPengantarDesaForm component
      setIsPengantarDesaFormDialogOpen(true);
    } else if (serviceId === "izin-keramaian") {
      // Form reset is now handled in SuratIzinKeramaianForm component
      setIsIzinKeramaianFormDialogOpen(true);
    } else if (serviceId === "kematian") {
      setIsKematianFormDialogOpen(true);
    } else if (serviceId === "kelahiran") {
      setIsKelahiranFormDialogOpen(true);
    } else if (serviceId === "tidak-mampu") {
      setIsTidakMampuFormDialogOpen(true);
    } else {
      // Untuk layanan surat lainnya yang belum diimplementasikan
      toast({
        title: "Layanan Belum Tersedia",
        description: `Layanan ${serviceId} sedang dalam pengembangan. Silakan coba lagi nanti.`,
        variant: "default",
      });
      console.log(`Selected service: ${serviceId}`);
    }
  };

  // Fungsi untuk mengkonversi URL gambar ke base64 telah dipindahkan ke komponen template surat

  // Fungsi untuk menghasilkan PDF menggunakan template surat yang sesuai
  const generatePDF = async (
    formData?: TidakMampuFormData | KematianFormData | KelahiranFormData
  ) => {
    try {
      if (!selectedService) {
        throw new Error("Tidak ada layanan surat yang dipilih");
      }

      // Import fungsi untuk mendapatkan template surat
      const { getSuratTemplate } = await import(
        "@/components/layanan-surat/surat-templates"
      );

      // Dapatkan template surat berdasarkan tipe yang dipilih
      const generateSurat = await getSuratTemplate(
        selectedService as SuratTemplateType
      );

      // Siapkan data yang akan dikirim ke template surat
      const suratData: any = {};

      // Tambahkan data sesuai dengan tipe surat
      // Data for 'pengantar-desa' and 'izin-keramaian' are now handled by their respective form components
      if (selectedService === "pengantar-desa") {
        // Data handled by SuratPengantarDesaForm component
      } else if (selectedService === "izin-keramaian") {
        // Data is now handled by SuratIzinKeramaianForm component
      } else if (selectedService === "kematian" && formData) {
        const kematianData = formData as KematianFormData;
        suratData.nama = kematianData.namaKematian;
        suratData.tempatLahir = kematianData.tempatLahirKematian;
        suratData.tanggalLahir = kematianData.tanggalLahirKematian;
        suratData.jenisKelamin = kematianData.jenisKelaminKematian;
        suratData.pekerjaan = kematianData.pekerjaanKematian;
        suratData.alamat = kematianData.alamatKematian;
        suratData.agama = kematianData.agamaKematian;
        suratData.hariTanggalKematian = kematianData.hariTanggalKematian;
        suratData.jamKematian = kematianData.jamKematian;
        suratData.sebabKematian = kematianData.sebabKematian;
        suratData.yangMenerangkan = kematianData.yangMenerangkan;
        suratData.tempatKematian = kematianData.tempatKematian;
      } else if (selectedService === "kelahiran" && formData) {
        const kelahiranData = formData as KelahiranFormData;
        suratData.namaPemohon = kelahiranData.namaPemohon;
        suratData.tempatLahirPemohon = kelahiranData.tempatLahirPemohon;
        suratData.tanggalLahirPemohon = kelahiranData.tanggalLahirPemohon;
        suratData.jenisKelaminPemohon = kelahiranData.jenisKelaminPemohon;
        suratData.pekerjaanPemohon = kelahiranData.pekerjaanPemohon;
        suratData.alamatPemohon = kelahiranData.alamatPemohon;
        suratData.namaAnak = kelahiranData.namaAnak;
        suratData.tempatLahirAnak = kelahiranData.tempatLahirAnak;
        suratData.tanggalLahirAnak = kelahiranData.tanggalLahirAnak;
        suratData.jenisKelaminAnak = kelahiranData.jenisKelaminAnak;
        suratData.agamaAnak = kelahiranData.agamaAnak;
        suratData.alamatAnak = kelahiranData.alamatAnak;
        suratData.namaAyah = kelahiranData.namaAyah;
        suratData.namaIbu = kelahiranData.namaIbu;
      } else if (selectedService === "tidak-mampu" && formData) {
        const tidakMampuData = formData as TidakMampuFormData;
        suratData.namaPemohon = tidakMampuData.namaPemohonTidakMampu;
        suratData.tempatLahirPemohon =
          tidakMampuData.tempatLahirPemohonTidakMampu;
        suratData.tanggalLahirPemohon =
          tidakMampuData.tanggalLahirPemohonTidakMampu;
        suratData.jenisKelaminPemohon =
          tidakMampuData.jenisKelaminPemohonTidakMampu;
        suratData.pekerjaanPemohon = tidakMampuData.pekerjaanPemohonTidakMampu;
        suratData.alamatPemohon = tidakMampuData.alamatPemohonTidakMampu;
        suratData.persyaratan = tidakMampuData.persyaratanTidakMampu;
      }
      // Tambahkan kondisi untuk tipe surat lainnya di masa depan

      // Gunakan template surat dengan data yang sesuai
      const result = await generateSurat(suratData);

      if (!result) {
        throw new Error("Gagal membuat PDF");
      }

      // Return success
      return true;
    } catch (error) {
      console.error("Gagal membuat PDF:", error);
      toast({
        title: "Gagal membuat PDF",
        description: "Terjadi kesalahan saat membuat PDF. Silakan coba lagi.",
        variant: "destructive",
      });
      return false;
    }
  };

  // handleSubmitPengantarDesaForm moved to SuratPengantarDesaForm component

  const handleSubmitKematianForm = async (data: KematianFormData) => {
    try {
      // Set loading state to true
      setIsLoading(true);

      // Generate PDF with form data
      const pdfGenerated = await generatePDF(data);

      // Process form submission if PDF was generated successfully
      if (pdfGenerated) {
        toast({
          title: "Surat Berhasil Dibuat",
          description:
            "Surat Keterangan Kematian telah berhasil dibuat dan diunduh",
        });
        setIsKematianFormDialogOpen(false);
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Gagal Membuat Surat",
        description: "Terjadi kesalahan saat membuat surat. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      // Set loading state back to false
      setIsLoading(false);
    }
  };

  const handleSubmitKelahiranForm = async (data: KelahiranFormData) => {
    try {
      // Set loading state to true
      setIsLoading(true);

      // Generate PDF with form data
      const pdfGenerated = await generatePDF(data);

      // Process form submission if PDF was generated successfully
      if (pdfGenerated) {
        toast({
          title: "Surat Berhasil Dibuat",
          description:
            "Surat Keterangan Kelahiran telah berhasil dibuat dan diunduh",
        });
        setIsKelahiranFormDialogOpen(false);
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Gagal Membuat Surat",
        description: "Terjadi kesalahan saat membuat surat. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      // Set loading state back to false
      setIsLoading(false);
    }
  };

  // handleSubmitIzinKeramaianForm removed - now handled in SuratIzinKeramaianForm component

  const handleSubmitTidakMampuForm = async (data: TidakMampuFormData) => {
    // Set loading state to true
    setIsLoading(true);

    try {
      // Generate PDF (async operation) using the form data
      const pdfGenerated = await generatePDF(data);

      // Process form submission if PDF was generated successfully
      if (pdfGenerated) {
        toast({
          title: "Surat Berhasil Dibuat",
          description:
            "Surat Keterangan Tidak Mampu telah berhasil dibuat dan diunduh",
        });
        setIsTidakMampuFormDialogOpen(false);
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Gagal Membuat Surat",
        description: "Terjadi kesalahan saat membuat surat. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      // Set loading state back to false
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      {/* Navigation */}
      <SpecialNavbar
        ref={navbarRef}
        title="Layanan Surat Desa"
        description="Template Siap Pakai untuk Administrasi Desa Kepohkencono"
        icon={<FileText className="w-6 h-6 text-white" />}
        gradientFrom="from-green-600"
        gradientTo="to-emerald-600"
        showAuth={true}
      />
      {/* How to Create Letters - Step by Step Guide */}
      <StepGuide />

      {/* Services Grid */}
      <ServicesGrid
        onServiceSelect={handleServiceSelect}
        onPreviewClick={handlePreviewClick}
      />

      {/* Form Dialog for Surat Keterangan Domisili */}
      <SuratDomisiliForm
        isOpen={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        namaPeminta={namaPeminta}
        setNamaPeminta={setNamaPeminta}
        namaPemintaError={namaPemintaError}
        setNamaPemintaError={setNamaPemintaError}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
      {/* Form Dialog for Surat Keterangan Usaha */}
      <SuratKeteranganUsahaForm
        isOpen={isUsahaFormDialogOpen}
        onOpenChange={setIsUsahaFormDialogOpen}
        namaPeminta={namaPeminta}
        setNamaPeminta={setNamaPeminta}
        namaPemintaError={namaPemintaError}
        setNamaPemintaError={setNamaPemintaError}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
      {/* Form Dialog for Surat Keterangan Pengantar Desa */}
      <SuratPengantarDesaForm
        isOpen={isPengantarDesaFormDialogOpen}
        onOpenChange={setIsPengantarDesaFormDialogOpen}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        onSubmitSuccess={() => {
          toast({
            title: "Surat Berhasil Dibuat",
            description:
              "Surat Keterangan Pengantar Desa telah berhasil dibuat dan diunduh",
          });
        }}
      />
      {/* Form Dialog for Surat Izin Keramaian */}
      {/* Form Dialog for Surat Izin Keramaian */}
      <SuratIzinKeramaianForm
        isOpen={isIzinKeramaianFormDialogOpen}
        onOpenChange={setIsIzinKeramaianFormDialogOpen}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        onSubmitSuccess={() => {
          toast({
            title: "Surat Berhasil Dibuat",
            description:
              "Surat Permohonan Izin Keramaian telah berhasil dibuat dan diunduh",
          });
        }}
      />

      {/* Form Dialog for Surat Keterangan Tidak Mampu */}
      <SuratTidakMampuForm
        open={isTidakMampuFormDialogOpen}
        onOpenChange={setIsTidakMampuFormDialogOpen}
        onSubmit={handleSubmitTidakMampuForm}
        isLoading={isLoading}
      />

      {/* Form Dialog for Surat Keterangan Kematian */}
      <SuratKematianForm
        open={isKematianFormDialogOpen}
        onOpenChange={setIsKematianFormDialogOpen}
        onSubmit={handleSubmitKematianForm}
        isLoading={isLoading}
      />

      {/* Form Dialog for Surat Keterangan Kelahiran */}
      <SuratKelahiranForm
        open={isKelahiranFormDialogOpen}
        onOpenChange={setIsKelahiranFormDialogOpen}
        onSubmit={handleSubmitKelahiranForm}
        isLoading={isLoading}
      />

      {/* Template Preview Dialog */}
      {previewService && (
        <TemplatePreviewDialog
          open={isPreviewDialogOpen}
          onOpenChange={setIsPreviewDialogOpen}
          title={previewService.title}
          category={previewService.category}
          googleDriveUrl={
            previewService.id === "domisili"
              ? "https://docs.google.com/document/d/1VNWZgmVvHC0HWbGXy92nvCtiFTflJlZW/edit"
              : previewService.id === "pengantar-desa"
              ? "https://docs.google.com/document/d/17QoC3EGBAfcJK_6-Y8Keke4fXNTzmF2u/edit"
              : previewService.id === "izin-keramaian"
              ? "https://docs.google.com/document/d/1BijWyHFzuxUJfaLa6cSJlTQUk2ybfY_d/edit"
              : previewService.id === "kelahiran"
              ? "https://docs.google.com/document/d/18jD9y82RSUWBYFBxvDd896UzrMsUfH4Y/edit"
              : previewService.id === "kematian"
              ? "https://docs.google.com/document/d/1ANlR4Hs0-JPdnWkybG1iwpLGO2GZ0ORp/edit"
              : previewService.id === "usaha"
              ? "https://docs.google.com/document/d/17N_RDvdRmuaQxz6Zj4lkT4kPoAwttdU_/edit"
              : previewService.id === "tidak-mampu"
              ? "https://docs.google.com/document/d/1MHLYmGWXXuVtRi77zDupsbKJ8xn-YHFF/edit"
              : "https://drive.google.com/drive/folders/1234567890"
          }
          pdfUrl={
            previewService.id === "domisili"
              ? "/pdf_preview/Surat_Keterangan_Domisili_Preview.pdf"
              : previewService.id === "pengantar-desa"
              ? "/pdf_preview/Surat_Keterangan_Pengantar_Desa_Preview.pdf"
              : previewService.id === "izin-keramaian"
              ? "/pdf_preview/Surat_Permohonan_Izin_Keramaian_Preview.pdf"
              : previewService.id === "kelahiran"
              ? "/pdf_preview/Surat_Keterangan_Kelahiran_Preview.pdf"
              : previewService.id === "kematian"
              ? "/pdf_preview/Surat_Keterangan_Kematian_Preview.pdf"
              : previewService.id === "usaha"
              ? "/pdf_preview/Surat_Keterangan_Usaha_Preview.pdf"
              : previewService.id === "tidak-mampu"
              ? "/pdf_preview/Surat_Keterangan_Tidak_Mampu_Preview.pdf"
              : "https://drive.google.com/file/d/1234567890/view"
          }
          requirements={previewService.requirements} // Pass the requirements specific to this surat
          serviceId={previewService.id} // Pass the service ID to display the correct icon
          onUseTemplate={() => {
            setIsPreviewDialogOpen(false);
            handleServiceSelect(previewService.id);
          }}
        />
      )}
    </div>
  );
};

export default LayananSurat;
