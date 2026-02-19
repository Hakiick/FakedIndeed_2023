'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { HiArrowRight, HiBriefcase, HiLocationMarker, HiSearch } from 'react-icons/hi';
import JobCard from '@/components/jobs/JobCard';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import type { Job } from '@/types/job';

function HeroSection() {
  return (
    <section className="relative py-12 md:py-20 text-center overflow-hidden" aria-labelledby="hero-heading">
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[#2557a7]/5 via-white to-white"
        aria-hidden="true"
      />

      <div className="max-w-2xl mx-auto px-2">
        <div className="inline-flex items-center gap-2 bg-[#2557a7]/10 text-[#2557a7] text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          <HiBriefcase size={14} aria-hidden="true" />
          Plateforme d&apos;emploi
        </div>

        <h1
          id="hero-heading"
          className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-4"
        >
          Trouvez votre{' '}
          <span className="text-[#2557a7]">prochain poste</span>
        </h1>

        <p className="text-base md:text-lg text-gray-500 mb-8 max-w-lg mx-auto">
          Des centaines d&apos;offres d&apos;emploi sélectionnées pour vous. Recherchez, filtrez, et postulez directement.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/jobs" aria-label="Voir toutes les offres d'emploi">
            <Button
              variant="primary"
              size="lg"
              rightIcon={<HiArrowRight size={20} aria-hidden="true" />}
            >
              Voir les offres
            </Button>
          </Link>
          <Link href="/jobs" aria-label="Rechercher des offres d'emploi">
            <Button
              variant="outline"
              size="lg"
              leftIcon={<HiSearch size={18} aria-hidden="true" />}
            >
              Rechercher
            </Button>
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1.5">
            <HiBriefcase size={16} className="text-[#2557a7]" aria-hidden="true" />
            <span>CDI, CDD, Stage, Alternance</span>
          </div>
          <div className="flex items-center gap-1.5">
            <HiLocationMarker size={16} className="text-[#2557a7]" aria-hidden="true" />
            <span>Présentiel &amp; Remote</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function SkeletonPreviewCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3">
      <Skeleton variant="text" height="1.25rem" width="70%" />
      <Skeleton variant="text" height="1rem" width="45%" />
      <div className="flex gap-2">
        <Skeleton variant="text" height="1.5rem" width="3.5rem" className="rounded-full" />
        <Skeleton variant="text" height="1.5rem" width="5rem" className="rounded-full" />
      </div>
      <Skeleton variant="text" />
      <div className="flex justify-between items-center pt-1">
        <Skeleton variant="text" height="1rem" width="4rem" />
        <Skeleton variant="text" height="2.75rem" width="5.5rem" className="rounded-lg" />
      </div>
    </div>
  );
}

export default function Home() {
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentJobs = async () => {
      try {
        const res = await fetch('/api/ads', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch');
        const data = (await res.json()) as Job[];
        const sorted = [...data].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setRecentJobs(sorted.slice(0, 6));
      } catch {
        setRecentJobs([]);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchRecentJobs();
  }, []);

  return (
    <>
      <HeroSection />

      <section className="py-8 md:py-12" aria-labelledby="recent-jobs-heading">
        <div className="flex items-center justify-between mb-6">
          <h2 id="recent-jobs-heading" className="text-xl md:text-2xl font-bold text-gray-900">
            Offres récentes
          </h2>
          <Link href="/jobs" aria-label="Voir toutes les offres">
            <Button
              variant="ghost"
              size="sm"
              rightIcon={<HiArrowRight size={16} aria-hidden="true" />}
            >
              Tout voir
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6" aria-busy="true" aria-label="Chargement des offres récentes">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonPreviewCard key={i} />
            ))}
          </div>
        ) : recentJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {recentJobs.map((job, index) => (
              <JobCard key={job.id} job={job} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <HiBriefcase size={40} className="mx-auto mb-3 text-gray-300" aria-hidden="true" />
            <p>Aucune offre disponible pour l&apos;instant.</p>
          </div>
        )}

        {!isLoading && recentJobs.length > 0 && (
          <div className="text-center mt-8">
            <Link href="/jobs" aria-label="Voir toutes les offres d'emploi">
              <Button
                variant="outline"
                size="lg"
                rightIcon={<HiArrowRight size={18} aria-hidden="true" />}
              >
                Voir toutes les offres
              </Button>
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
