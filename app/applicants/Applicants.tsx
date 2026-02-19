'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import ApplicantCard from '@/components/apply/ApplicantCard';
import type { Application } from '@/types/application';

interface CompanyOption {
  email: string;
  name: string;
}

interface CompanyData {
  id: number;
  name: string;
}

export default function Applicants() {
  const { user } = useAuth();
  const email = user?.email ?? null;
  const userType = user?.userType ?? null;

  const [companyNames, setCompanyNames] = useState<string[]>([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);
  const [isLoadingApplicants, setIsLoadingApplicants] = useState(true);

  // Fetch available company names for selector
  useEffect(() => {
    if (!email) return;

    const fetchCompanyOptions = async () => {
      setIsLoadingCompanies(true);
      try {
        if (userType === 'admin') {
          const res = await fetch('/api/company', { cache: 'no-store' });
          if (!res.ok) throw new Error('Failed to fetch companies');
          const data = await res.json() as CompanyData[];
          const names = data.map((c) => c.name).filter(Boolean);
          setCompanyNames(names);
          if (names.length > 0) setSelectedCompany(names[0]);
        } else {
          const res = await fetch('/api/companyOptions', { cache: 'no-store' });
          if (!res.ok) throw new Error('Failed to fetch company options');
          const data = await res.json() as CompanyOption[];
          const matching = data.filter((item) => item.email === email);
          const names = matching.map((u) => u.name).filter(Boolean);
          setCompanyNames(names);
          if (names.length > 0) setSelectedCompany(names[0]);
        }
      } catch {
        // silently handle
      } finally {
        setIsLoadingCompanies(false);
      }
    };

    void fetchCompanyOptions();
  }, [email, userType]);

  // Fetch all applicants once
  useEffect(() => {
    const fetchApplicants = async () => {
      setIsLoadingApplicants(true);
      try {
        const res = await fetch('/api/apply', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch applicants');
        const data = await res.json() as Application[];
        setApplicants(data);
      } catch {
        // silently handle
      } finally {
        setIsLoadingApplicants(false);
      }
    };

    void fetchApplicants();
  }, []);

  const filteredApplicants = useMemo(
    () => (selectedCompany ? applicants.filter((a) => a.company_name === selectedCompany) : []),
    [applicants, selectedCompany]
  );

  // Group applicants by ad_id to compute counts
  const adCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    filteredApplicants.forEach((a) => {
      counts[a.ad_id] = (counts[a.ad_id] ?? 0) + 1;
    });
    return counts;
  }, [filteredApplicants]);

  const adIds = Object.keys(adCounts).map(Number);

  const isLoading = isLoadingCompanies || isLoadingApplicants;

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Candidatures</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gérez les candidatures reçues pour vos offres d&apos;emploi
        </p>
      </div>

      {/* Company selector */}
      {!isLoadingCompanies && companyNames.length > 1 && (
        <Card>
          <label
            htmlFor="company-selector"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Sélectionner une entreprise
          </label>
          <select
            id="company-selector"
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="w-full min-h-[44px] rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-base
              focus:outline-none focus:ring-2 focus:ring-[#2557a7] focus:ring-offset-1 transition-colors
              hover:border-slate-400"
          >
            <option value="">--- Sélectionner une entreprise ---</option>
            {companyNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </Card>
      )}

      {/* Applicants count summary */}
      {!isLoading && selectedCompany && filteredApplicants.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-gray-600 font-medium">
            {filteredApplicants.length} candidature{filteredApplicants.length !== 1 ? 's' : ''}
            {' '}pour{' '}
            <span className="font-semibold text-gray-900">{selectedCompany}</span>
          </span>
          {adIds.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {adIds.map((adId) => (
                <Badge key={adId} variant="primary" size="sm">
                  Offre #{adId} — {adCounts[adId]} candidat{(adCounts[adId] ?? 0) > 1 ? 's' : ''}
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="card" height="12rem" />
          ))}
        </div>
      )}

      {/* No company selected */}
      {!isLoading && companyNames.length > 0 && !selectedCompany && (
        <Card>
          <p className="text-sm text-gray-500 text-center py-6">
            Sélectionnez une entreprise pour voir les candidatures.
          </p>
        </Card>
      )}

      {/* No companies found */}
      {!isLoading && companyNames.length === 0 && (
        <Card>
          <p className="text-sm text-gray-500 text-center py-6">
            Aucune entreprise associée à votre compte.
          </p>
        </Card>
      )}

      {/* Empty state */}
      {!isLoading && selectedCompany && filteredApplicants.length === 0 && (
        <Card>
          <p className="text-sm text-gray-500 text-center py-6">
            Aucune candidature reçue pour <span className="font-medium">{selectedCompany}</span>.
          </p>
        </Card>
      )}

      {/* Applicant cards */}
      {!isLoading && filteredApplicants.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredApplicants.map((applicant, index) => (
            <ApplicantCard key={applicant.id} applicant={applicant} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
