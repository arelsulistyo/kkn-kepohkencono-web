"use client";

import { Leaf } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-6">
        {/* Animated Logo */}
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center animate-pulse">
            <Leaf className="w-8 h-8 text-white animate-bounce" />
          </div>
          {/* Ripple effect */}
          <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-green-300 animate-ping opacity-75"></div>
          <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-blue-300 animate-ping opacity-50 animation-delay-200"></div>
        </div>
        
        {/* Loading Text */}
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold text-gray-700 font-poppins">
            Memuat Halaman
          </h2>
          <p className="text-sm text-gray-500">
            Mohon tunggu sebentar...
          </p>
        </div>
        
        {/* Loading Bar */}
        <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full animate-loading-bar"></div>
        </div>
      </div>
    </div>
  );
}