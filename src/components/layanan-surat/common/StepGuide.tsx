import React from "react";
import StepItem from "./StepItem";

const StepGuide: React.FC = () => {
  const steps = [
    {
      stepNumber: 1,
      title: "Pilih Surat",
      description: "Pilih jenis surat yang ingin dibuat dari berbagai template yang tersedia",
      icon: (
        <svg
          className="h-8 w-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      gradientFrom: "from-green-500",
      gradientTo: "to-green-600",
      badgeColor: "bg-green-100 text-green-800",
      showArrow: true,
    },
    {
      stepNumber: 2,
      title: "Isi Formulir",
      description: "Lengkapi data dan informasi yang diperlukan sesuai dengan jenis surat",
      icon: (
        <svg
          className="h-8 w-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      ),
      gradientFrom: "from-emerald-500",
      gradientTo: "to-emerald-600",
      badgeColor: "bg-emerald-100 text-emerald-800",
      showArrow: true,
    },
    {
      stepNumber: 3,
      title: "Unduh Surat",
      description: "Klik tombol \"Unduh Surat\" untuk menghasilkan dokumen final",
      icon: (
        <svg
          className="h-8 w-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
          />
        </svg>
      ),
      gradientFrom: "from-teal-500",
      gradientTo: "to-teal-600",
      badgeColor: "bg-teal-100 text-teal-800",
      showArrow: true,
    },
    {
      stepNumber: 4,
      title: "Cetak Surat",
      description: "Cetak surat dan serahkan kepada warga yang membutuhkan",
      icon: (
        <svg
          className="h-8 w-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
          />
        </svg>
      ),
      gradientFrom: "from-green-600",
      gradientTo: "to-green-700",
      badgeColor: "bg-green-100 text-green-800",
      showArrow: false,
    },
  ];

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 pt-28">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Cara Membuat Surat
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ikuti langkah-langkah sederhana berikut untuk membuat surat resmi
            dengan mudah dan cepat
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <StepItem
                key={index}
                stepNumber={step.stepNumber}
                title={step.title}
                description={step.description}
                icon={step.icon}
                gradientFrom={step.gradientFrom}
                gradientTo={step.gradientTo}
                badgeColor={step.badgeColor}
                showArrow={step.showArrow}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default StepGuide;