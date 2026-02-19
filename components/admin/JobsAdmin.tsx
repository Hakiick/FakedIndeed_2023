'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { HiLocationMarker, HiPencil, HiTrash } from 'react-icons/hi';
import { Badge, Button, Skeleton } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import type { Job } from '@/types/job';
import type { Company } from '@/types/company';

function formatDate(value: Date | string): string {
  return new Date(value).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function positionBadgeVariant(pos: string): 'primary' | 'success' | 'warning' {
  if (pos === 'Full-Remote') return 'success';
  if (pos === 'Semi-Remote') return 'warning';
  return 'primary';
}

export default function JobsAdmin() {
  const { addToast } = useToast();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterCompany, setFilterCompany] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmingId, setConfirmingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [jobsRes, companiesRes] = await Promise.all([
          fetch('/api/ads', { cache: 'no-store' }),
          fetch('/api/company', { cache: 'no-store' }),
        ]);

        if (jobsRes.ok) {
          const data = (await jobsRes.json()) as Job[];
          setJobs([...data].reverse());
        }
        if (companiesRes.ok) {
          const data = (await companiesRes.json()) as Company[];
          setCompanies(data);
        }
      } catch {
        addToast('Erreur lors du chargement', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchData();
  }, [addToast]);

  const handleDelete = useCallback(
    async (id: number) => {
      if (confirmingId !== id) {
        setConfirmingId(id);
        return;
      }
      setDeletingId(id);
      try {
        const res = await fetch('/api/ads', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });
        if (!res.ok) throw new Error('Erreur suppression');
        addToast('Offre supprimée', 'success');
        setJobs((prev) => prev.filter((j) => j.id !== id));
      } catch {
        addToast('Erreur lors de la suppression', 'error');
      } finally {
        setDeletingId(null);
        setConfirmingId(null);
      }
    },
    [confirmingId, addToast],
  );

  const filteredJobs = filterCompany
    ? jobs.filter((j) => j.company === filterCompany)
    : jobs;

  if (isLoading) {
    return (
      <div className="space-y-3" aria-label="Chargement des offres">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} variant="card" className="h-24" />
        ))}
      </div>
    );
  }

  return (
    <section aria-label="Gestion des offres">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <p className="text-sm text-gray-500">{filteredJobs.length} offre(s)</p>
        <div className="flex items-center gap-2">
          <label htmlFor="filter-company" className="text-sm text-gray-600 whitespace-nowrap">
            Filtrer :
          </label>
          <select
            id="filter-company"
            value={filterCompany}
            onChange={(e) => setFilterCompany(e.target.value)}
            className="min-h-[44px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-gray-700
              hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2557a7] focus:ring-offset-1
              transition-colors"
          >
            <option value="">Toutes les entreprises</option>
            {companies.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <p className="text-center text-gray-500 py-8">Aucune offre</p>
      ) : (
        <div className="space-y-3">
          {filteredJobs.map((job) => {
            const isDeleting = deletingId === job.id;
            const isConfirming = confirmingId === job.id;

            return (
              <div
                key={job.id}
                className="rounded-xl border border-slate-200 bg-white shadow-sm p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 text-base truncate">
                        {job.title}
                      </h3>
                      <Badge variant={positionBadgeVariant(job.positionLocation)} size="sm">
                        {job.positionLocation}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{job.company}</p>
                    {job.location && (
                      <p className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                        <HiLocationMarker size={14} aria-hidden="true" />
                        {job.location}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">{formatDate(job.createdAt)}</p>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <Link href={`/jobs/${job.id}/edit`} passHref>
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<HiPencil size={14} />}
                        aria-label={`Modifier l'offre ${job.title}`}
                      >
                        Modifier
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      size="sm"
                      isLoading={isDeleting}
                      onClick={() => handleDelete(job.id)}
                      leftIcon={!isDeleting ? <HiTrash size={14} /> : undefined}
                      aria-label={`Supprimer l'offre ${job.title}`}
                    >
                      {isConfirming ? 'Confirmer ?' : 'Supprimer'}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
