'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import JobForm from '@/components/jobs/JobForm';
import Skeleton from '@/components/ui/Skeleton';
import Card from '@/components/ui/Card';
import type { Job } from '@/types/job';

export default function EditJobPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/ads/${params.id}`, { cache: 'no-store' });
        if (res.status === 404) {
          setError("Cette offre n'existe pas.");
          return;
        }
        if (!res.ok) {
          throw new Error('Failed to fetch job');
        }
        const data = await res.json() as Job;
        setJob(data);
      } catch {
        setError("Impossible de charger l'offre. Veuillez réessayer.");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchJob();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">
        <Skeleton variant="text" width="16rem" height="2rem" />
        <div className="space-y-4">
          <Skeleton variant="card" height="6rem" />
          <Skeleton variant="card" height="12rem" />
          <Skeleton variant="card" height="8rem" />
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-3xl mx-auto py-6 px-4">
        <Card>
          <p className="text-gray-500 text-center py-8">
            {error ?? "Offre introuvable."}
          </p>
          <div className="flex justify-center mt-4">
            <button
              onClick={() => router.back()}
              className="text-[#2557a7] text-sm font-medium hover:underline min-h-[44px] px-4"
            >
              Retour
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Modifier l&apos;offre</h1>
      <JobForm mode="edit" initialData={job} />
    </div>
  );
}
