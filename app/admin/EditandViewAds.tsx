'use client';

import JobList from '../components/jobs/JobList';
import { useState, useEffect } from 'react';

interface CompanyData {
  id: number;
  name: string;
}

export default function EditandViewAds() {
  const [company, setCompany] = useState('');
  const [companiesList, setCompaniesList] = useState<string[]>([]);

  const handleCompanyChange = (newCompany: string) => {
    setCompany(newCompany);
  };

  const getCompany = async (): Promise<CompanyData[] | undefined> => {
    try {
      const res = await fetch('/api/company', {
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error('Failed to fetch company');
      }

      return res.json() as Promise<CompanyData[]>;
    } catch (error) {
      return undefined;
    }
  };

  useEffect(() => {
    async function fetchCompany() {
      const data = await getCompany();

      if (data && data.length) {
        const companyNames = data.map((c) => c.name);

        setCompaniesList(companyNames);
      }
    }

    fetchCompany();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl pt-3 font-bold mb-4">See ads</h1>
      <div>
        <label>Select a company name:</label>
        <select
          value={company}
          onChange={(e) => handleCompanyChange(e.target.value)}
          className="border border-slate-500 px-3 py-2 required-custom-input"
        >
          <option value="">--- Select a company ---</option>
          {companiesList.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <JobList selectedCompany={company} />
    </div>
  );
}
