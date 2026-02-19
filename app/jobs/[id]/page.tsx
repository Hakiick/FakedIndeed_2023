'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import JobDetail from '@/components/jobs/JobDetail';
import ApplyForm from '@/components/apply/ApplyForm';
import Skeleton from '@/components/ui/Skeleton';
import type { Job } from '@/types/job';

interface JobDetailPageProps {
  params: { id: string };
}

function JobDetailSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-busy="true" aria-label="Chargement de l'offre...">
      {/* Card 1 — header skeleton */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 md:p-6 flex flex-col gap-4">
        <Skeleton variant="text" className="w-3/4 h-8" />
        <Skeleton variant="text" className="w-1/3 h-5" />
        <Skeleton variant="text" className="w-1/2 h-4" />
        <div className="flex gap-2">
          <Skeleton variant="text" className="w-16 h-6" />
          <Skeleton variant="text" className="w-20 h-6" />
          <Skeleton variant="text" className="w-24 h-6" />
        </div>
        <Skeleton variant="text" className="w-24 h-4" />
      </div>

      {/* Card 2 — description skeleton */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 md:p-6 flex flex-col gap-3">
        <Skeleton variant="text" className="w-1/3 h-6" />
        <Skeleton variant="text" className="w-full" />
        <Skeleton variant="text" className="w-full" />
        <Skeleton variant="text" className="w-5/6" />
        <Skeleton variant="text" className="w-full" />
        <Skeleton variant="text" className="w-4/6" />
      </div>

      {/* Card 3 — company skeleton */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 md:p-6 flex flex-col gap-3">
        <Skeleton variant="text" className="w-1/3 h-6" />
        <div className="flex items-center gap-3">
          <Skeleton variant="circle" width="3rem" height="3rem" />
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton variant="text" className="w-1/2 h-4" />
            <Skeleton variant="text" className="w-1/4 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="py-16 text-center">
      <p className="text-6xl font-bold text-gray-200 mb-4">404</p>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Offre introuvable</h2>
      <p className="text-gray-500 mb-8">
        Cette offre d&apos;emploi n&apos;existe pas ou a été supprimée.
      </p>
      <Link
        href="/jobs"
        className="inline-flex items-center gap-2 text-[#2557a7] hover:text-[#1d4690] font-medium transition-colors duration-150"
      >
        <FaArrowLeft size={14} aria-hidden="true" />
        Retour aux offres
      </Link>
    </div>
  );
}

export default function JobDetailPage({ params }: JobDetailPageProps) {
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const applyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchJob = async () => {
      setIsLoading(true);
      setNotFound(false);
      try {
        const res = await fetch(`/api/ads/${params.id}`, { cache: 'no-store' });
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        if (!res.ok) {
          throw new Error('Failed to fetch job');
        }
        const data = await res.json() as Job;
        setJob(data);
      } catch {
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchJob();
  }, [params.id]);

  const handleApplyClick = () => {
    setShowApplyForm(true);
    setTimeout(() => {
      applyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  if (!isLoading && notFound) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <NotFound />
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-6">
      {isLoading ? (
        <JobDetailSkeleton />
      ) : job ? (
        <JobDetail job={job} onApplyClick={handleApplyClick} />
      ) : null}

      {showApplyForm && job && (
        <div ref={applyRef} className="mt-6">
          <ApplyForm
            jobId={job.id}
            companyName={job.company}
            jobTitle={job.title}
            onSuccess={() => {
              setShowApplyForm(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>
      )}
    </main>
  );
}
