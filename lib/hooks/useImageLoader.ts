import { useState, useEffect } from 'react';

interface UseImageLoaderProps {
  imageUrls: string[];
  onComplete?: () => void;
}

export function useImageLoader({ imageUrls, onComplete }: UseImageLoaderProps) {
  const [loadedImages, setLoadedImages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // useImageLoader: Starting with images - silent in production

    if (imageUrls.length === 0) {
      // useImageLoader: No images, completing immediately - silent in production
      setIsLoading(false);
      onComplete?.();
      return;
    }

    setLoadedImages(0);
    setIsLoading(true);

    let loadedCount = 0;
    const totalImages = imageUrls.length;

    const completeLoading = () => {
      // useImageLoader: Completing loading - silent in production
      setTimeout(() => {
        // useImageLoader: Setting isLoading to false - silent in production
        setIsLoading(false);
        onComplete?.();
      }, 100);
    };

    const checkComplete = () => {
      // useImageLoader: Checking completion - silent in production
      if (loadedCount >= totalImages) {
        completeLoading();
      }
    };

    // Set fallback timer
    const fallbackTimer = setTimeout(() => {
      // useImageLoader: Fallback timer triggered - silent in production
      if (isLoading) {
        completeLoading();
      }
    }, 4000);

    // Load each image
    imageUrls.forEach((url, index) => {
      const img = new Image();

      img.onload = () => {
        loadedCount++;
        setLoadedImages(loadedCount);
        // useImageLoader: Image loaded - silent in production
        checkComplete();
      };

      img.onerror = () => {
        loadedCount++;
        setLoadedImages(loadedCount);
        // useImageLoader: Image failed - silent in production
        checkComplete();
      };

      img.src = url;
    });

    return () => {
      clearTimeout(fallbackTimer);
    };
  }, [imageUrls, onComplete]);

  // Dependency array issue fix
  useEffect(() => {
    if (!isLoading) {
      // Loading complete - silent in production
    }
  }, [isLoading]);

  const progress = imageUrls.length > 0 ? Math.round((loadedImages / imageUrls.length) * 100) : 0;
  // Current progress - silent in production

  return {
    isLoading,
    progress,
    loadedImages,
    totalImages: imageUrls.length,
  };
}
