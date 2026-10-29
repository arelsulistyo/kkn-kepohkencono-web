import React from 'react';
import { Leaf } from 'lucide-react';

interface ImagePreloaderProps {
  isLoading: boolean;
  loadProgress: number;
  children: React.ReactNode;
}

const ImagePreloader: React.FC<ImagePreloaderProps> = ({ 
  isLoading, 
  loadProgress, 
  children 
}) => {
  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center z-50">
      <div className="relative">
        <Leaf className="w-16 h-16 text-gray-300" />
        
        <div 
          className="absolute inset-0 overflow-hidden"
          style={{
            clipPath: `inset(${100 - loadProgress}% 0 0 0)`
          }}
        >
          <Leaf className="w-16 h-16 text-emerald-500" />
        </div>
      </div>
    </div>
  );
};

export default ImagePreloader;