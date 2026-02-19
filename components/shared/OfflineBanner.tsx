'use client';

import { useOnline } from '@/hooks/useOnline';

export default function OfflineBanner() {
  const isOnline = useOnline();

  if (isOnline) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed top-0 left-0 right-0 z-[60] bg-amber-500 text-white text-center py-2 text-sm font-medium animate-[slideDown_0.3s_ease-out]"
    >
      <span>Vous etes hors ligne — les donnees affichees proviennent du cache</span>
    </div>
  );
}
