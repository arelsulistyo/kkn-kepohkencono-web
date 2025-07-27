import { useState, useEffect } from 'react';

interface UseImagePreloaderProps {
  imageUrls: string[];
  onAllImagesLoaded?: () => void;
}

interface ImageLoadStatus {
  [url: string]: boolean;
}

export const useImagePreloader = ({ imageUrls, onAllImagesLoaded }: UseImagePreloaderProps) => {
  const [loadedImages, setLoadedImages] = useState<ImageLoadStatus>({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    if (imageUrls.length === 0) {
      setIsLoading(false);
      setLoadProgress(100);
      onAllImagesLoaded?.();
      return;
    }

    const imagePromises = imageUrls.map((url) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        
        img.onload = () => {
          setLoadedImages(prev => {
            const updated = { ...prev, [url]: true };
            const loadedCount = Object.values(updated).filter(Boolean).length;
            const progress = Math.round((loadedCount / imageUrls.length) * 100);
            setLoadProgress(progress);
            return updated;
          });
          resolve();
        };
        
        img.onerror = () => {
          console.warn(`Failed to load image: ${url}`);
          setLoadedImages(prev => {
            const updated = { ...prev, [url]: true }; // Mark as "loaded" even if failed to prevent infinite loading
            const loadedCount = Object.values(updated).filter(Boolean).length;
            const progress = Math.round((loadedCount / imageUrls.length) * 100);
            setLoadProgress(progress);
            return updated;
          });
          resolve(); // Resolve anyway to not block other images
        };
        
        img.src = url;
      });
    });

    Promise.all(imagePromises).then(() => {
      setIsLoading(false);
      onAllImagesLoaded?.();
    });
  }, [imageUrls, onAllImagesLoaded]);

  const allImagesLoaded = Object.keys(loadedImages).length === imageUrls.length && 
                         Object.values(loadedImages).every(Boolean);

  return {
    isLoading,
    loadProgress,
    allImagesLoaded,
    loadedImages
  };
};