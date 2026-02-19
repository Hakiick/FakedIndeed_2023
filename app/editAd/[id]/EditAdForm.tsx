'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import type { Job } from '@/types/job';

interface EditAdFormProps {
  ad: Job;
}

interface CompanyOption {
  email: string;
  name: string;
}

interface CompanyData {
  id: number;
  name: string;
}

const JOB_TYPES_OPTIONS = ['Full Time', 'Part Time', 'CDI', 'CDD'] as const;
const POSITION_LOCATION_OPTIONS = ['On-Site Work', 'Semi-Remote Work', 'Full-Remote Work'] as const;
type PositionLocationOption = typeof POSITION_LOCATION_OPTIONS[number];

export default function EditAdForm({ ad }: EditAdFormProps) {
  const { user } = useAuth();
  const email = user?.email ?? null;
  const userType = user?.userType ?? null;
  const [matchingNames, setMatchingNames] = useState<string[]>([]);

  const getUsersOptions = async (): Promise<CompanyOption[] | undefined> => {
    try {
      const res = await fetch('/api/companyOptions', { cache: 'no-store' });
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

  const { id, title, company, location, description, minSalary, maxSalary, positionLocation, advantages } = ad;

  const [newTitle, setNewTitle] = useState(title);
  const [newCompany, setNewCompany] = useState(company);
  const [newLocation, setNewLocation] = useState(location);
  const [newDescription, setNewDescription] = useState(description);
  const [newSelectedTypes, setNewSelectedTypes] = useState<string[]>([]);
  const [newMinSalary, setNewMinSalary] = useState(minSalary);
  const [newMaxSalary, setNewMaxSalary] = useState(maxSalary);
  const [newPositionLocation, setNewPositionLocation] = useState<string>(positionLocation);
  const [newAdvantages, setNewAdvantages] = useState(advantages);

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newTitle || !newDescription || newSelectedTypes.length === 0) {
      alert('Title, description, and at least one job type are required.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch('/api/ads', {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          id,
          title: newTitle,
          company: newCompany,
          location: newLocation,
          description: newDescription,
          jobTypes: JSON.stringify(newSelectedTypes),
          minSalary: newMinSalary,
          maxSalary: newMaxSalary,
          positionLocation: newPositionLocation,
          advantages: newAdvantages,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update ad');
      }

      router.refresh();
      router.push('/');
    } catch {
      setIsLoading(false);
    }
  };

  const handleTypeChange = (type: string) => {
    if (newSelectedTypes.includes(type)) {
      setNewSelectedTypes(newSelectedTypes.filter((t) => t !== type));
    } else {
      setNewSelectedTypes([...newSelectedTypes, type]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label>
        Job Title: <span className="text-red-600">*</span>
      </label>
      <input
        onChange={(e) => setNewTitle(e.target.value)}
        value={newTitle}
        className="border border-slate-500 px-8 py-2 required-custom-input"
        type="text"
        minLength={5}
        maxLength={100}
        required
        placeholder="Job Title"
      />

      <label>
        Company name: <span className="text-red-600">*</span>
      </label>
      <select
        value={newCompany}
        onChange={(e) => setNewCompany(e.target.value)}
        className="border border-slate-500 px-3 py-2 required-custom-input"
      >
        {matchingNames.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <label>
        Company Location: <span className="text-red-600">*</span>
      </label>
      <input
        onChange={(e) => setNewLocation(e.target.value)}
        value={newLocation}
        className="border border-slate-500 px-8 py-2 required-custom-input"
        type="text"
        required
        placeholder="67000 Strasbourg"
      />

      <label>
        Job Description: <span className="text-red-600">*</span>
      </label>
      <textarea
        onChange={(e) => setNewDescription(e.target.value)}
        value={newDescription}
        className="border border-slate-500 px-8 py-2 required-custom-input"
        minLength={20}
        maxLength={5000}
        required
        placeholder="Job Description"
      />

      <label>
        Job Type(s): <span className="text-red-600">*</span>
      </label>
      <div className="border border-slate-500 px-8 py-2 required-custom-input">
        {JOB_TYPES_OPTIONS.map((type) => (
          <label key={type} className="block">
            <input type="checkbox" checked={newSelectedTypes.includes(type)} onChange={() => handleTypeChange(type)} />
            &#8206; {type}
          </label>
        ))}
      </div>

      <label>Job Salary: </label>
      <div>
        <label>
          Minimum Salary <span className="text-red-600">*</span>
        </label>
        <input
          onChange={(e) => setNewMinSalary(Number(e.target.value))}
          value={newMinSalary}
          className="border border-slate-500 px-8 py-2 required-custom-input"
          type="number"
          min="1"
          required
          placeholder="2500€"
        />
        <br />

        <label>Maximum Salary</label>
        <input
          onChange={(e) => setNewMaxSalary(Number(e.target.value))}
          value={newMaxSalary}
          className="border border-slate-500 px-8 py-2 required-custom-input"
          type="number"
          min="1"
          placeholder="5000€"
        />
      </div>

      <label>
        Job Location: <span className="text-red-600">*</span>
      </label>
      <select
        value={newPositionLocation}
        onChange={(e) => setNewPositionLocation(e.target.value)}
        className="border border-slate-500 px-3 py-2 required-custom-input"
      >
        {POSITION_LOCATION_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <label>Job Advantages: </label>
      <textarea
        onChange={(e) => setNewAdvantages(e.target.value)}
        value={newAdvantages}
        className="border border-slate-500 px-8 py-2 required-custom-input"
        minLength={20}
        maxLength={500}
        placeholder="Job Advantages"
      />

      <div className="flex flex-col py-8 items-center justify-center">
        <div className="w-1/2">
          <button
            type="submit"
            className={`bg-green-600 rounded-lg font-bold text-white py-3 px-6 w-full ${
              isLoading ? 'cursor-not-allowed opacity-50' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Update Job Ad'}
          </button>
        </div>
      </div>
    </form>
  );
}
