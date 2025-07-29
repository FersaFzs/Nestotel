'use client';
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
  isLoading: boolean;
  progress?: number;
}

export default function LoadingScreen({
  onLoadingComplete,
  isLoading,
  progress = 0,
}: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    if (isLoading && !hasShown) {
      setHasShown(true);
      setIsAnimating(true);

      // Animación de entrada
      gsap.set(containerRef.current, { opacity: 0 });
      gsap.set(logoRef.current, { y: 50, opacity: 0 });
      gsap.set(progressRef.current, { scaleX: 0 });

      const tl = gsap.timeline({
        onComplete: () => setIsAnimating(false),
      });

      tl.to(containerRef.current, {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
      })
        .to(
          logoRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
          },
          '-=0.3',
        )
        .to(
          progressRef.current,
          {
            scaleX: 1,
            duration: 0.8,
            ease: 'power2.out',
          },
          '-=0.5',
        );
    }
  }, [isLoading, hasShown]);

  useEffect(() => {
    if (!isLoading && hasShown && !isAnimating) {
      setIsAnimating(true);

      // Animación de salida
      const tl = gsap.timeline({
        onComplete: () => {
          onLoadingComplete();
          setIsAnimating(false);
          setHasShown(false);
        },
      });

      tl.to(containerRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut',
      }).to(
        containerRef.current,
        {
          y: '-100%',
          duration: 0.6,
          ease: 'power2.inOut',
        },
        '-=0.4',
      );
    }
  }, [isLoading, hasShown, isAnimating, onLoadingComplete]);

  useEffect(() => {
    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        scaleX: progress / 100,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, [progress]);

  if (!isLoading && !isAnimating && !hasShown) return null;

  return (
    <div
      ref={containerRef}
      className='fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black'
    >
      {/* Fondo con patrón sutil */}
      <div className='absolute inset-0 opacity-10'>
        <div className='absolute inset-0 bg-gradient-to-br from-gold/20 via-transparent to-gold/10' />
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(201,168,107,0.1)_0%,transparent_50%)]' />
      </div>

      {/* Logo y texto */}
      <div ref={logoRef} className='relative z-10 text-center mb-12'>
        <div className='text-6xl font-serif tracking-widest text-gold font-bold mb-4'>
          GRANADA INN
        </div>
        <div className='text-lg text-gold/80 font-light tracking-wide'>
          Experiencia única en el corazón de Granada
        </div>
      </div>

      {/* Barra de progreso */}
      <div
        ref={progressRef}
        className='relative z-10 w-80 h-1 bg-gold/20 rounded-full overflow-hidden'
      >
        <div
          ref={progressBarRef}
          className='h-full bg-gold rounded-full origin-left'
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      {/* Elementos decorativos */}
      <div className='absolute top-1/4 left-1/4 w-2 h-2 bg-gold/30 rounded-full animate-pulse' />
      <div className='absolute top-1/3 right-1/4 w-1 h-1 bg-gold/20 rounded-full animate-pulse delay-300' />
      <div className='absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-gold/25 rounded-full animate-pulse delay-500' />
      <div className='absolute bottom-1/3 right-1/3 w-1 h-1 bg-gold/15 rounded-full animate-pulse delay-700' />

      {/* Líneas decorativas */}
      <div className='absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent' />
      <div className='absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent' />
      <div className='absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-gold/20 to-transparent' />
      <div className='absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-gold/20 to-transparent' />
    </div>
  );
}
