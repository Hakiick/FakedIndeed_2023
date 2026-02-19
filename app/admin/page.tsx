'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui';
import StatsCards from '@/components/admin/StatsCards';
import AdminTabs from '@/components/admin/AdminTabs';
import UserTable from '@/components/admin/UserTable';
import CompanyManager from '@/components/admin/CompanyManager';
import JobsAdmin from '@/components/admin/JobsAdmin';
import type { UserPublic } from '@/types/user';
import type { Company } from '@/types/company';
import type { Application } from '@/types/application';
import type { Job } from '@/types/job';

interface AdminData {
  users: UserPublic[];
  jobs: Job[];
  applications: Application[];
  companies: Company[];
}

function AdminSkeleton() {
  return (
    <div aria-label="Chargement" className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} variant="card" className="h-20" />
        ))}
      </div>
      <div className="flex gap-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} variant="text" className="h-10 w-24" />
        ))}
      </div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} variant="card" className="h-16" />
        ))}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('stats');
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<AdminData>({
    users: [],
    jobs: [],
    applications: [],
    companies: [],
  });

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const [usersRes, jobsRes, applicationsRes, companiesRes] = await Promise.all([
        fetch('/api/users', { cache: 'no-store' }),
        fetch('/api/ads', { cache: 'no-store' }),
        fetch('/api/apply', { cache: 'no-store' }),
        fetch('/api/company', { cache: 'no-store' }),
      ]);

      const users = usersRes.ok ? ((await usersRes.json()) as UserPublic[]) : [];
      const jobs = jobsRes.ok ? ((await jobsRes.json()) as Job[]) : [];
      const applications = applicationsRes.ok
        ? ((await applicationsRes.json()) as Application[])
        : [];
      const companies = companiesRes.ok ? ((await companiesRes.json()) as Company[]) : [];

      setData({ users, jobs, applications, companies });
    } catch {
      // Leave data at empty defaults on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  const handleDeleteUser = useCallback((id: number) => {
    setData((prev) => ({
      ...prev,
      users: prev.users.filter((u) => u.id !== id),
    }));
  }, []);

  const handleRefreshCompanies = useCallback(() => {
    void fetchAll();
  }, [fetchAll]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Administration</h1>

      {isLoading ? (
        <AdminSkeleton />
      ) : (
        <>
          <StatsCards
            totalUsers={data.users.length}
            totalJobs={data.jobs.length}
            totalApplications={data.applications.length}
            totalCompanies={data.companies.length}
          />

          <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <div>
            {activeTab === 'stats' && (
              <section
                id="panel-stats"
                role="tabpanel"
                aria-labelledby="tab-stats"
              >
                <StatsCards
                  totalUsers={data.users.length}
                  totalJobs={data.jobs.length}
                  totalApplications={data.applications.length}
                  totalCompanies={data.companies.length}
                />
                <div className="grid gap-4 sm:grid-cols-2 mt-4">
                  <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
                    <h2 className="font-semibold text-gray-900 mb-2">Derniers utilisateurs</h2>
                    {data.users.length === 0 ? (
                      <p className="text-sm text-gray-500">Aucun utilisateur</p>
                    ) : (
                      <ul className="space-y-2">
                        {[...data.users].slice(0, 5).map((u) => (
                          <li key={u.id} className="text-sm text-gray-700">
                            {[u.name, u.lastname].filter(Boolean).join(' ') || u.email}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
                    <h2 className="font-semibold text-gray-900 mb-2">Dernières offres</h2>
                    {data.jobs.length === 0 ? (
                      <p className="text-sm text-gray-500">Aucune offre</p>
                    ) : (
                      <ul className="space-y-2">
                        {[...data.jobs].slice(0, 5).map((j) => (
                          <li key={j.id} className="text-sm text-gray-700">
                            {j.title} — {j.company}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'users' && (
              <section
                id="panel-users"
                role="tabpanel"
                aria-labelledby="tab-users"
              >
                <UserTable users={data.users} onDeleteUser={handleDeleteUser} />
              </section>
            )}

            {activeTab === 'companies' && (
              <section
                id="panel-companies"
                role="tabpanel"
                aria-labelledby="tab-companies"
              >
                <CompanyManager
                  companies={data.companies}
                  onRefresh={handleRefreshCompanies}
                />
              </section>
            )}

            {activeTab === 'jobs' && (
              <section
                id="panel-jobs"
                role="tabpanel"
                aria-labelledby="tab-jobs"
              >
                <JobsAdmin />
              </section>
            )}
          </div>
        </>
      )}
    </main>
  );
}
