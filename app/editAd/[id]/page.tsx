'use client';

import EditAdForm from './EditAdForm';
import { useState, useEffect } from 'react';
import type { Job } from '@/types/job';

interface EditAdParams {
  params: { id: string };
}

const getAds = async (): Promise<Job[] | undefined> => {
  try {
    const res = await fetch('/api/ads', {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch ads');
    }

    return res.json() as Promise<Job[]>;
  } catch (error) {
    return undefined;
  }
};

export default function EditAd({ params }: EditAdParams) {
  const [ad, setAd] = useState<Job | null>(null);
  const id = +params.id;

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const data = await getAds();
        if (data) {
          const matchingAd = data.find((item) => item.id === id);

          if (matchingAd) {
            setAd(matchingAd);
          } else {
            setAd(null);
          }
        }
      } catch (error) {
        // silently handle
      }
    };

    fetchAd();
  }, [id]);

  if (ad === null) {
    return <p className="text-2xl font-light">Loading ad...</p>;
  }

  return (
    <div className="max-w-8xl mx-16 p-2 flex-1">
      <EditAdForm ad={ad} />
    </div>
  );
}
