'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { FaEnvelope, FaGlobe, FaPhone } from 'react-icons/fa';
import JobList from '../components/jobs/JobList';
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
  const [matchingNames, setMatchingNames] = useState<string[]>([]);

  const getUsersOptions = async (): Promise<CompanyOption[] | undefined> => {
    try {
      const res = await fetch('/api/companyOptions', {
        cache: 'no-store',
      });

      if (!res.ok) throw new Error('Failed to fetch company options');
      return res.json() as Promise<CompanyOption[]>;
    } catch {
      return undefined;
    }
  };

  useEffect(() => {
    if (!email) return;

    const fetchUsersOptions = async () => {
      try {
        const data = await getUsersOptions();
        if (data) {
          const matchingUsers = data.filter((item) => item.email === email);

          if (matchingUsers.length > 0) {
            const names = matchingUsers.map((u) => u.name).filter(Boolean);

            if (names.length > 0) {
              setMatchingNames(names);
            }
          }
        }
      } catch {
        // silently handle
      }
    };

    fetchUsersOptions();
  }, [email]);

  useEffect(() => {
    if (userType === 'admin') {
      const fetchCompany = async () => {
        try {
          const res = await fetch('/api/company', { cache: 'no-store' });
          if (!res.ok) throw new Error('Failed to fetch company');
          const data = await res.json() as CompanyData[];

          if (data && data.length) {
            const companyNames = data.map((company) => company.name);
            setMatchingNames(companyNames);
          }
        } catch {
          // silently handle
        }
      };

      fetchCompany();
    }
  }, [userType]);

  const [applicants, setApplicants] = useState<Application[]>([]);

  const getApplicants = async (): Promise<Application[] | undefined> => {
    try {
      const res = await fetch('/api/apply', {
        cache: 'no-store',
      });

      if (!res.ok) throw new Error('Failed to fetch applicants');
      return res.json() as Promise<Application[]>;
    } catch {
      return undefined;
    }
  };

  useEffect(() => {
    async function fetchApplicants() {
      const data = await getApplicants();

      if (data && data.length) {
        setApplicants(data);
      }
    }

    fetchApplicants();
  }, []);

  const [company, setCompany] = useState('.');

  const handleCompanyChange = (newCompany: string) => {
    setCompany(newCompany);
  };

  return (
    <div>
      <div>
        <label>Select your company name:</label>
        <select
          value={company}
          onChange={(e) => handleCompanyChange(e.target.value)}
          className="border border-slate-500 px-3 py-2 required-custom-input"
        >
          <option value=".">--- Select your company ---</option>
          {matchingNames.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="lg:flex">
        <div className="lg:max-w-6xl text-new-base overflow-y-auto h-screen mx-4 p-2 flex-1">
          {applicants.map((ap) => {
            if (ap.company_name === company) {
              const createdAtDate = new Date(ap.createdAt).toLocaleString();
              return (
                <div
                  key={ap.id}
                  className="p-4 border border-slate-300 rounded-lg my-3 flex justify-between gap-5 items-start"
                >
                  <div>
                    <div className="text-blue-800 text-new-xs">Applied for the ad n°{ap.ad_id}</div>
                    <div className="p-2" />
                    <h2 className="font-bold text-new-2xl">
                      {ap.name} {ap.lastname}
                    </h2>
                    <div className="p-2" />
                    <div className="flex items-center text-new-xl font-light">
                      <FaEnvelope className="mr-2" />
                      {ap.email}
                    </div>
                    <div className="p-1" />
                    <div className="flex items-center font-light">
                      <FaPhone className="mr-2" />
                      {ap.phone}
                    </div>

                    <hr className="h-px my-4 bg-gray-200" />

                    <h3 className="font-bold text-new-2xl">Motivations</h3>
                    <div className="text-gray-800 text-new-sm" style={{ whiteSpace: 'pre-line' }}>
                      {ap.motivations}
                    </div>

                    <hr className="h-px my-4 bg-gray-200" />

                    <div className="flex items-center font-light">
                      <FaGlobe className="mr-2" />
                      {ap.website}
                    </div>

                    <div className="p-2" />

                    <div className="text-gray-600 text-new-xs">Applied the {createdAtDate}</div>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
        <div className="lg:max-w-2xl overflow-y-auto h-screen mx-4 p-2 flex-1">
          <JobList selectedCompany={company} />
        </div>
      </div>
    </div>
  );
}
