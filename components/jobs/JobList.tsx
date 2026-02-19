'use client';

import React from 'react';
import { HiBriefcase } from 'react-icons/hi';
import JobCard from './JobCard';
import Skeleton from '@/components/ui/Skeleton';
import type { Job } from '@/types/job';

interface JobListProps {
  jobs: Job[];
  isLoading: boolean;
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 md:p-6 flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <Skeleton variant="text" height="1.5rem" width="75%" />
        <Skeleton variant="text" height="1rem" width="50%" />
      </div>
      <div className="flex gap-2">
        <Skeleton variant="text" height="1.5rem" width="4rem" className="rounded-full" />
        <Skeleton variant="text" height="1.5rem" width="5rem" className="rounded-full" />
      </div>
      <Skeleton variant="text" height="1rem" width="60%" />
      <Skeleton variant="text" />
      <Skeleton variant="text" width="90%" />
      <div className="flex items-center justify-between pt-2">
        <Skeleton variant="text" height="1rem" width="5rem" />
        <Skeleton variant="text" height="2.75rem" width="6rem" className="rounded-lg" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <HiBriefcase size={32} className="text-gray-400" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">Aucune offre trouvée</h3>
      <p className="text-gray-500 text-sm max-w-xs">
        Essayez de modifier vos filtres ou votre recherche pour trouver plus d&apos;offres.
      </p>
    </div>
  );
}

export default function JobList({ jobs, isLoading }: JobListProps) {
  if (isLoading) {
    return (
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
        aria-busy="true"
        aria-label="Chargement des offres d'emploi"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="grid grid-cols-1">
        <EmptyState />
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
      role="list"
      aria-label="Liste des offres d'emploi"
    >
      {jobs.map((job, index) => (
        <div key={job.id} role="listitem">
          <JobCard job={job} index={index} />
        </div>
      ))}
    </div>
  );
}
