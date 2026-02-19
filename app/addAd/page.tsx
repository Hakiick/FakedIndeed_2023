'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface CompanyOption {
  email: string;
  name: string;
}

interface CompanyData {
  id: number;
  name: string;
}

const JOB_TYPES = ['Full Time', 'Part Time', 'CDI', 'CDD'] as const;
const POSITION_LOCATION_OPTIONS = ['On-Site Work', 'Semi-Remote Work', 'Full-Remote Work'] as const;
type PositionLocation = typeof POSITION_LOCATION_OPTIONS[number];

export default function AddAd() {
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

  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [positionLocation, setPositionLocation] = useState<PositionLocation>(POSITION_LOCATION_OPTIONS[0]);
  const [advantages, setAdvantages] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title || company === '' || !description || selectedTypes.length === 0) {
      alert('Title, company, description, and at least one job type are required. \nIf you don\'t have a company, contact an Admin.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch('/api/ads', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          title,
          company,
          location,
          description,
          jobTypes: JSON.stringify(selectedTypes),
          minSalary: Number(minSalary),
          maxSalary: Number(maxSalary),
          positionLocation,
          advantages,
        }),
      });

      if (res.ok) {
        router.push('/');
        router.refresh();
      } else {
        throw new Error('Failed to create an ad');
      }
    } catch {
      setIsLoading(false);
    }
  };

  const handleTypeChange = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  return (
    <div className="max-w-8xl mx-16 p-2 flex-1">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label>
          Job Title: <span className="text-red-600">*</span>
        </label>
        <input
          onChange={(e) => setTitle(e.target.value)}
          value={title}
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
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="border border-slate-500 px-3 py-2 required-custom-input"
        >
          <option value="">--- Select your company ---</option>
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
          onChange={(e) => setLocation(e.target.value)}
          value={location}
          className="border border-slate-500 px-8 py-2 required-custom-input"
          type="text"
          required
          placeholder="67000 Strasbourg"
        />

        <label>
          Job Description: <span className="text-red-600">*</span>
        </label>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
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
          {JOB_TYPES.map((type) => (
            <label key={type} className="block">
              <input
                type="checkbox"
                checked={selectedTypes.includes(type)}
                onChange={() => handleTypeChange(type)}
              />
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
            onChange={(e) => setMinSalary(e.target.value)}
            value={minSalary}
            className="border border-slate-500 px-8 py-2 required-custom-input"
            type="number"
            min="1"
            required
            placeholder="2500€"
          />
          <br />

          <label>
            Maximum Salary <span className="text-red-600">*</span>
          </label>
          <input
            onChange={(e) => setMaxSalary(e.target.value)}
            value={maxSalary}
            className="border border-slate-500 px-8 py-2 required-custom-input"
            type="number"
            min="1"
            required
            placeholder="5000€"
          />
        </div>

        <label>
          Job Location: <span className="text-red-600">*</span>
        </label>
        <select
          value={positionLocation}
          onChange={(e) => setPositionLocation(e.target.value as PositionLocation)}
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
          onChange={(e) => setAdvantages(e.target.value)}
          value={advantages}
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
              {isLoading ? 'Loading...' : 'Add Job Ad'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
