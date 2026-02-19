'use client';

import React from 'react';
import { HiDotsVertical } from 'react-icons/hi';
import { useRouter } from 'next/navigation';

interface LearnMoreBtnProps {
  id: number;
  reloadJobComponent: () => void;
}

function setLastAdViewCookie(id: number): void {
  const maxAge = Math.round(0.1 * 24 * 60 * 60);
  document.cookie = `LastAdView=${encodeURIComponent(id)}; max-age=${maxAge}; path=/; SameSite=Lax`;
}

export default function LearnMoreBtn({ id, reloadJobComponent }: LearnMoreBtnProps) {
  const router = useRouter();

  const handleLearnMore = () => {
    setLastAdViewCookie(id);
    reloadJobComponent();
    router.refresh();
  };

  return (
    <>
      <div className="relative group">
        <button onClick={handleLearnMore} className="group-hover:opacity-100 opacity-50">
          <HiDotsVertical size={24} />
        </button>
        <div
          className="tooltip group-hover:opacity-100 opacity-0 bg-gray-800 text-white px-2 py-1 text-sm rounded absolute top-8 left-1/2 transform -translate-x-1/2 transition-opacity duration-200 pointer-events-none"
        >
          Learn More
        </div>
      </div>
    </>
  );
}
