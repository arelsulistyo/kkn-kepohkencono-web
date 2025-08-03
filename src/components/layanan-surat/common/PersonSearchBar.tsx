"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { PersonSearch, type PersonData } from "@/components/ui/person-search";
import { Search, Lightbulb } from "lucide-react";

interface PersonSearchBarProps {
  selectedPerson?: PersonData | null;
  onPersonSelect: (person: PersonData) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  title?: string;
  description?: string;
}

const PersonSearchBar: React.FC<PersonSearchBarProps> = ({
  selectedPerson,
  onPersonSelect,
  placeholder = "Cari nama, NIK, atau No. KK untuk mengisi data otomatis...",
  className = "",
  disabled = false,
  title = "Pencarian Data Penduduk",
  description = "Gunakan pencarian di atas untuk memilih data penduduk dari database. Data akan otomatis terisi ke form di bawah.",
}) => {
  return (
    <div className="relative bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 shadow-lg">
      {/* Animated border overlay */}
      <div className="absolute inset-0 rounded-lg ring-2 ring-blue-300 ring-opacity-50 animate-pulse pointer-events-none transition-all duration-300 hover:ring-blue-400 hover:animate-none"></div>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Search className="h-4 w-4 text-gray-600" />
        <Label className="text-base font-semibold text-gray-800">
          {title}
        </Label>
      </div>
      
      {/* Search Component */}
      <PersonSearch
        value={selectedPerson?.NAMA}
        onPersonSelect={onPersonSelect}
        placeholder={placeholder}
        className={`border-gray-300 focus:border-gray-500 ${className}`}
        disabled={disabled}
      />
      
      {/* Help Text */}
      <div className="flex items-start gap-2 text-sm text-black mt-2">
        <Lightbulb className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
        <p>{description}</p>
      </div>
    </div>
  );
};

export default PersonSearchBar;