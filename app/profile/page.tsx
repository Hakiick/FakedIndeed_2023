'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { HiPencil, HiTrash } from 'react-icons/hi';
import { useAuth } from '@/hooks/useAuth';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import ProfileForm from '@/components/profile/ProfileForm';
import ProfileStats from '@/components/profile/ProfileStats';
import ApplicantCard from '@/components/apply/ApplicantCard';
import type { UserPublic } from '@/types/user';
import type { Job } from '@/types/job';
import type { Application } from '@/types/application';

function getInitials(name: string, lastname: string): string {
  const first = name?.charAt(0)?.toUpperCase() ?? '';
  const last = lastname?.charAt(0)?.toUpperCase() ?? '';
  return `${first}${last}` || '?';
}

function getUserTypeBadgeVariant(userType: string): 'primary' | 'success' | 'neutral' {
  switch (userType) {
    case 'admin':
      return 'success';
    case 'company':
      return 'primary';
    default:
      return 'neutral';
  }
}

function getUserTypeLabel(userType: string): string {
  switch (userType) {
    case 'admin':
      return 'Administrateur';
    case 'company':
      return 'Entreprise';
    default:
      return 'Candidat';
  }
}

export default function ProfilePage() {
  const { user: authUser, refresh: refreshAuth } = useAuth();
  const { addToast } = useToast();
  const email = authUser?.email ?? null;
  const authUserType = authUser?.userType ?? null;

  const [user, setUser] = useState<UserPublic | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [isLoadingApplicants, setIsLoadingApplicants] = useState(false);
  const [deletingJobId, setDeletingJobId] = useState<number | null>(null);

  const isCompanyOrAdmin = authUserType === 'company' || authUserType === 'admin';

  const fetchUser = useCallback(async () => {
    if (!email) return;
    setIsLoadingUser(true);
    try {
      const res = await fetch('/api/users', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json() as UserPublic[];
      const found = data.find((u) => u.email === email);
      if (found) setUser(found);
    } catch {
      // silently handle
    } finally {
      setIsLoadingUser(false);
    }
  }, [email]);

  const fetchJobs = useCallback(async (companyName: string) => {
    setIsLoadingJobs(true);
    try {
      const res = await fetch('/api/ads', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch ads');
      const data = await res.json() as Job[];
      const filtered = data.filter((j) => j.company === companyName);
      setJobs(filtered);
    } catch {
      // silently handle
    } finally {
      setIsLoadingJobs(false);
    }
  }, []);

  const fetchApplicants = useCallback(async (companyName: string) => {
    setIsLoadingApplicants(true);
    try {
      const res = await fetch('/api/apply', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch applicants');
      const data = await res.json() as Application[];
      const filtered = data.filter((a) => a.company_name === companyName);
      setApplicants(filtered);
    } catch {
      // silently handle
    } finally {
      setIsLoadingApplicants(false);
    }
  }, []);

  useEffect(() => {
    void fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (user && isCompanyOrAdmin) {
      const companyName = user.name;
      void fetchJobs(companyName);
      void fetchApplicants(companyName);
    }
  }, [user, isCompanyOrAdmin, fetchJobs, fetchApplicants]);

  const handleProfileSave = async () => {
    await fetchUser();
    void refreshAuth();
  };

  const handleDeleteJob = async (jobId: number) => {
    setDeletingJobId(jobId);
    try {
      const res = await fetch('/api/ads', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: jobId }),
      });
      if (!res.ok) throw new Error('Failed to delete job');
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
      addToast("Offre supprimée", 'success');
    } catch {
      addToast("Erreur lors de la suppression de l'offre", 'error');
    } finally {
      setDeletingJobId(null);
    }
  };

  if (isLoadingUser) {
    return (
      <div className="max-w-4xl mx-auto py-6 px-4 space-y-8">
        {/* Header skeleton */}
        <div className="flex items-center gap-4">
          <Skeleton variant="circle" width="4rem" height="4rem" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="12rem" />
            <Skeleton variant="text" width="6rem" />
          </div>
        </div>
        {/* Stats skeleton */}
        <div className="grid grid-cols-2 gap-4">
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </div>
        {/* Form skeleton */}
        <Skeleton variant="card" height="16rem" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-6 px-4">
        <Card>
          <p className="text-gray-500 text-center py-8">
            Impossible de charger le profil. Veuillez vous reconnecter.
          </p>
        </Card>
      </div>
    );
  }

  const initials = getInitials(user.name, user.lastname);
  const badgeVariant = getUserTypeBadgeVariant(user.userType);
  const userTypeLabel = getUserTypeLabel(user.userType);

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6 md:space-y-8">
      {/* Profile header */}
      <div className="flex items-center gap-4">
        <div
          className="w-16 h-16 rounded-full bg-[#2557a7] text-white flex items-center justify-center text-xl font-bold flex-shrink-0 select-none"
          aria-hidden="true"
        >
          {initials}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user.name} {user.lastname}
          </h1>
          <div className="mt-1">
            <Badge variant={badgeVariant} size="sm">
              {userTypeLabel}
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats dashboard (company/admin only) */}
      {isCompanyOrAdmin && (
        <section aria-label="Statistiques">
          <h2 className="text-base font-semibold text-gray-700 mb-3">Tableau de bord</h2>
          <ProfileStats
            activeJobs={jobs.length}
            totalApplications={applicants.length}
          />
        </section>
      )}

      {/* Profile form */}
      <section aria-label="Informations personnelles">
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h2>
          <ProfileForm user={user} onSave={handleProfileSave} />
        </Card>
      </section>

      {/* Company jobs section */}
      {isCompanyOrAdmin && (
        <section aria-label="Mes offres">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Mes offres
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({jobs.length})
                </span>
              </h2>
              <Link href="/jobs/new">
                <Button variant="primary" size="sm">
                  + Nouvelle offre
                </Button>
              </Link>
            </div>

            {isLoadingJobs ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} variant="text" className="h-16" />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">
                Aucune offre publiée pour le moment.
              </p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {jobs.map((job) => (
                  <li
                    key={job.id}
                    className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{job.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {job.location} &middot; {job.positionLocation}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Link href={`/jobs/${job.id}/edit`} aria-label={`Modifier l'offre ${job.title}`}>
                        <Button variant="ghost" size="sm" leftIcon={<HiPencil size={14} aria-hidden="true" />}>
                          Modifier
                        </Button>
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        isLoading={deletingJobId === job.id}
                        leftIcon={<HiTrash size={14} aria-hidden="true" />}
                        onClick={() => void handleDeleteJob(job.id)}
                        aria-label={`Supprimer l'offre ${job.title}`}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </section>
      )}

      {/* Applicants section */}
      {isCompanyOrAdmin && (
        <section aria-label="Candidatures reçues">
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              Candidatures reçues
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              {applicants.length} candidature{applicants.length !== 1 ? 's' : ''}
            </p>

            {isLoadingApplicants ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <Skeleton key={i} variant="card" />
                ))}
              </div>
            ) : applicants.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">
                Aucune candidature reçue pour le moment.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {applicants.map((applicant, index) => (
                  <ApplicantCard key={applicant.id} applicant={applicant} index={index} />
                ))}
              </div>
            )}
          </Card>
        </section>
      )}
    </div>
  );
}
