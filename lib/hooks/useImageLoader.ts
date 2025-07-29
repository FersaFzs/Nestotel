import { useState, useEffect } from 'react';

interface UseImageLoaderProps {
  imageUrls: string[];
  onComplete?: () => void;
}

export function useImageLoader({ imageUrls, onComplete }: UseImageLoaderProps) {
  const [loadedImages, setLoadedImages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('useImageLoader: Starting with', imageUrls.length, 'images');
    
    if (imageUrls.length === 0) {
      console.log('useImageLoader: No images, completing immediately');
      setIsLoading(false);
      onComplete?.();
      return;
    }

    setLoadedImages(0);
    setIsLoading(true);

    let loadedCount = 0;
    const totalImages = imageUrls.length;

    const completeLoading = () => {
      console.log('useImageLoader: Completing loading');
      setTimeout(() => {
        console.log('useImageLoader: Setting loading to false');
        setIsLoading(false);
        onComplete?.();
      }, 1000);
    };

    const handleImageLoad = () => {
      loadedCount++;
      console.log('useImageLoader: Image loaded', loadedCount, '/', totalImages);
      setLoadedImages(loadedCount);

      if (loadedCount >= totalImages) {
        completeLoading();
      }
    };

    const handleImageError = () => {
      loadedCount++;
      console.log('useImageLoader: Image error', loadedCount, '/', totalImages);
      setLoadedImages(loadedCount);

      if (loadedCount >= totalImages) {
        completeLoading();
      }
    };

    // Precargar todas las imágenes
    imageUrls.forEach((url, index) => {
      console.log('useImageLoader: Loading image', index + 1, url);
      const img = new Image();
      img.onload = handleImageLoad;
      img.onerror = handleImageError;
      img.src = url;
    });

    // Fallback: si después de 3 segundos no se han cargado todas, completar de todas formas
    const fallbackTimer = setTimeout(() => {
      console.log('useImageLoader: Fallback timer triggered');
      if (isLoading) {
        console.log('useImageLoader: Force completing due to timeout');
        setIsLoading(false);
        onComplete?.();
      }
    }, 3000);

    return () => {
      clearTimeout(fallbackTimer);
    };
  }, [imageUrls, onComplete]);

  const progress = imageUrls.length > 0 ? (loadedImages / imageUrls.length) * 100 : 0;
  console.log('useImageLoader: Current state', { isLoading, loadedImages, totalImages: imageUrls.length, progress });

  return {
    isLoading,
    loadedImages,
    totalImages: imageUrls.length,
    progress,
  };
} 