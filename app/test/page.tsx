'use client';

import React, { useEffect, useState } from 'react';
import type { Job } from '@/types/job';

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

export default function TestJobList() {
  const [ads, setAds] = useState<Job[]>([]);

  useEffect(() => {
    async function fetchAds() {
      const data = await getAds();

      if (data && data.length) {
        setAds([...data].reverse());
      }
    }

    fetchAds();
  }, []);

  return (
    <>
      {ads.map((ad) => (
        <div key={ad.id} className="p-4 border border-slate-300 rounded-lg my-3 flex justify-between gap-5 items-start">
          <h1>{ad.id}</h1>
          {ad.title}
          {ad.description}
        </div>
      ))}
    </>
  );
}
