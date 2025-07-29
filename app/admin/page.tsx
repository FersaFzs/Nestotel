'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir a la ruta correcta del admin
    router.replace('/admin/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
      <div className="text-center">
        <div className="text-gold text-xl mb-4">Redirigiendo al panel de administración...</div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto" />
      </div>
    </div>
  );
}
