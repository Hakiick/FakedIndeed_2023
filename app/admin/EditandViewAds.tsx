'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HiPencilAlt } from 'react-icons/hi';
import { FaMapMarkerAlt, FaMoneyBillAlt, FaBriefcase } from 'react-icons/fa';
import RemoveBtn from '../components/RemoveBtn';
import type { Job } from '@/types/job';

interface CompanyData {
  id: number;
  name: string;
}

const getCompanyList = async (): Promise<CompanyData[] | undefined> => {
  try {
    const res = await fetch('/api/company', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch company');
    return res.json() as Promise<CompanyData[]>;
  } catch {
    return undefined;
  }
};

const getAds = async (): Promise<Job[] | undefined> => {
  try {
    const res = await fetch('/api/ads', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch ads');
    return res.json() as Promise<Job[]>;
  } catch {
    return undefined;
  }
};

export default function EditandViewAds() {
  const [company, setCompany] = useState('');
  const [companiesList, setCompaniesList] = useState<string[]>([]);
  const [ads, setAds] = useState<Job[]>([]);

  useEffect(() => {
    void (async () => {
      const data = await getCompanyList();
      if (data?.length) {
        setCompaniesList(data.map((c) => c.name));
      }
    })();
  }, []);

  useEffect(() => {
    void (async () => {
      const data = await getAds();
      if (data?.length) {
        setAds([...data].reverse());
      }
    })();
  }, []);

  const filteredAds = ads.filter((ad) => !company || ad.company === company);

  return (
    <div className="p-6">
      <h1 className="text-2xl pt-3 font-bold mb-4">See ads</h1>
      <div className="mb-4">
        <label htmlFor="company-select">Select a company name:</label>
        <select
          id="company-select"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="border border-slate-500 px-3 py-2 required-custom-input ml-2"
        >
          <option value="">--- Select a company ---</option>
          {companiesList.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        {filteredAds.map((ad) => {
          let jobTypesArray: string[] = [];
          try {
            jobTypesArray = JSON.parse(ad.jobTypes) as string[];
          } catch {
            jobTypesArray = [];
          }

          return (
            <div
              key={ad.id}
              className="p-4 border border-slate-300 rounded-lg my-3 flex justify-between gap-5 items-start"
            >
              <div>
                <div className="text-blue-800 text-xs">ad n°{ad.id}</div>
                <h2 className="font-bold text-xl break-words">{ad.title}</h2>
                <div className="text-base">{ad.company}</div>
                {ad.location && (
                  <div className="flex text-base items-center">
                    <FaMapMarkerAlt className="mr-2" />
                    {ad.location}
                  </div>
                )}
                {ad.minSalary && (
                  <div className="flex text-base items-center">
                    <FaMoneyBillAlt className="mr-2" />
                    {ad.minSalary}€{ad.maxSalary ? ` – ${ad.maxSalary}€` : ''}
                  </div>
                )}
                {jobTypesArray.length > 0 && (
                  <div className="flex text-base items-center">
                    <FaBriefcase className="mr-2" />
                    {jobTypesArray.map((jobType, i) => (
                      <span key={i} className="bg-gray-200 rounded-lg p-2 text-sm mr-2">
                        {jobType}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <RemoveBtn id={ad.id} />
                <Link href={`/editAd/${ad.id}`} passHref>
                  <div className="relative group">
                    <div className="group-hover:opacity-100 opacity-80 text-sky-600">
                      <HiPencilAlt size={24} />
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
