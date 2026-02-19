'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface CompanyData {
  id: number;
  name: string;
  emails: string;
}

export default function AddCompany() {
  const [name, setName] = useState('');
  const [emails, setEmails] = useState('');

  const [newId, setNewId] = useState<number | null>(null);
  const [newName, setNewName] = useState('');
  const [newEmails, setNewEmails] = useState<string[]>([]);

  const [company, setCompany] = useState('.');
  const [companiesList, setCompaniesList] = useState<string[]>([]);
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [selectedCompanyData, setSelectedCompanyData] = useState<CompanyData | null>(null);

  const router = useRouter();

  const handleCompanyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmails(e.target.value);
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCompany = companies.find((c) => c.name === e.target.value);
    setCompany(e.target.value);
    if (selectedCompany) {
      setSelectedCompanyData(selectedCompany);
      setNewId(selectedCompany.id);
      setNewName(selectedCompany.name);
      try {
        setNewEmails(JSON.parse(selectedCompany.emails) as string[]);
      } catch {
        setNewEmails([]);
      }
    }
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
        setCompanies(data);
      }
    }

    fetchCompany();
  }, []);

  const addCompany = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/company', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          name,
          emails,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to create company');
      }

      router.refresh();
      router.push('/');
    } catch (error) {
      // silently handle
    }
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/company', {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          id: newId,
          name: newName,
          emails: JSON.stringify(newEmails),
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update company');
      }

      router.refresh();
      router.push('/');
    } catch (error) {
      // silently handle
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-new-2xl font-bold mb-4">Add a Company</h1>
      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          className="border border-slate-500 px-3 py-2 w-1/2 required-custom-input"
          placeholder="Company Name"
          value={name}
          required
          onChange={handleCompanyNameChange}
        />
        <input
          type="text"
          className="border border-slate-500 px-3 py-2 w-1/2 required-custom-input"
          placeholder="Email List (Separate with commas)"
          value={emails}
          required
          onChange={handleEmailsChange}
        />
      </div>
      <button className="bg-blue-500 text-white py-2 px-4 rounded-lg" onClick={addCompany}>
        Add Company
      </button>

      <div className="mt-4">
        <h1 className="text-new-2xl pt-3 font-bold mb-4">Edit a Company</h1>
        <label>Select a company name:</label>
        <select
          value={company}
          onChange={handleCompanyChange}
          className="border border-slate-500 px-3 py-2 required-custom-input"
        >
          <option value=".">--- Select a company ---</option>
          {companiesList.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {selectedCompanyData && (
        <div>
          <div className="pt-3" />
          <div className="flex space-x-4 mb-4">
            <input
              type="text"
              className="border border-slate-500 px-3 py-2 w-1/2 required-custom-input"
              placeholder="Company Name"
              value={newName}
              required
              onChange={(e) => setNewName(e.target.value)}
            />
            <input
              type="text"
              className="border border-slate-500 px-3 py-2 w-1/2 required-custom-input"
              placeholder="Email List (Separate with commas)"
              value={newEmails.join(', ')}
              required
              onChange={(e) => setNewEmails(e.target.value.split(',').map((email) => email.trim()))}
            />
          </div>
          <button className="bg-blue-500 text-white py-2 px-4 rounded-lg" onClick={handleSubmit}>
            Edit Company
          </button>
        </div>
      )}
    </div>
  );
}
