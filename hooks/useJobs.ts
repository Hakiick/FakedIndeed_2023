'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Job } from '@/types/job';
import { useDebounce } from './useDebounce';

export interface JobFilters {
  keyword: string;
  location: string;
  contractTypes: string[];
  positionLocation: string;
  salaryMin: number | null;
  salaryMax: number | null;
}

export type JobSort = 'recent' | 'salary-asc' | 'salary-desc';

const DEFAULT_FILTERS: JobFilters = {
  keyword: '',
  location: '',
  contractTypes: [],
  positionLocation: '',
  salaryMin: null,
  salaryMax: null,
};

const PAGE_SIZE = 12;

function parseJobTypes(jobTypesStr: string): string[] {
  try {
    const parsed = JSON.parse(jobTypesStr) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === 'string');
    }
    return [];
  } catch {
    return [];
  }
}

function matchesKeyword(job: Job, keyword: string): boolean {
  if (!keyword.trim()) return true;
  const lower = keyword.toLowerCase();
  return (
    job.title.toLowerCase().includes(lower) ||
    job.company.toLowerCase().includes(lower) ||
    job.description.toLowerCase().includes(lower)
  );
}

function matchesLocation(job: Job, location: string): boolean {
  if (!location.trim()) return true;
  return job.location.toLowerCase().includes(location.toLowerCase());
}

function matchesContractTypes(job: Job, contractTypes: string[]): boolean {
  if (contractTypes.length === 0) return true;
  const jobTypes = parseJobTypes(job.jobTypes);
  return contractTypes.some((ct) => jobTypes.includes(ct));
}

function matchesPositionLocation(job: Job, positionLocation: string): boolean {
  if (!positionLocation) return true;
  return job.positionLocation === positionLocation;
}

function matchesSalary(job: Job, salaryMin: number | null, salaryMax: number | null): boolean {
  if (salaryMin !== null && job.maxSalary < salaryMin) return false;
  if (salaryMax !== null && job.minSalary > salaryMax) return false;
  return true;
}

function sortJobs(jobs: Job[], sort: JobSort): Job[] {
  const sorted = [...jobs];
  switch (sort) {
    case 'recent':
      return sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case 'salary-asc':
      return sorted.sort((a, b) => a.minSalary - b.minSalary);
    case 'salary-desc':
      return sorted.sort((a, b) => b.maxSalary - a.maxSalary);
    default:
      return sorted;
  }
}

export function useJobs() {
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<JobFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<JobSort>('recent');
  const [page, setPage] = useState(1);

  const debouncedKeyword = useDebounce(filters.keyword, 300);
  const debouncedLocation = useDebounce(filters.location, 300);

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/ads', { cache: 'no-store' });
        if (!res.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const data = (await res.json()) as Job[];
        setAllJobs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchJobs();
  }, []);

  const filteredAndSorted = useMemo(() => {
    const effectiveFilters: JobFilters = {
      ...filters,
      keyword: debouncedKeyword,
      location: debouncedLocation,
    };

    const filtered = allJobs.filter((job) => {
      return (
        matchesKeyword(job, effectiveFilters.keyword) &&
        matchesLocation(job, effectiveFilters.location) &&
        matchesContractTypes(job, effectiveFilters.contractTypes) &&
        matchesPositionLocation(job, effectiveFilters.positionLocation) &&
        matchesSalary(job, effectiveFilters.salaryMin, effectiveFilters.salaryMax)
      );
    });

    return sortJobs(filtered, sort);
  }, [allJobs, debouncedKeyword, debouncedLocation, filters, sort]);

  const totalJobs = filteredAndSorted.length;
  const totalPages = Math.max(1, Math.ceil(totalJobs / PAGE_SIZE));

  const jobs = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredAndSorted.slice(start, start + PAGE_SIZE);
  }, [filteredAndSorted, page]);

  const handleSetFilters = (newFilters: Partial<JobFilters> | ((prev: JobFilters) => JobFilters)) => {
    if (typeof newFilters === 'function') {
      setFilters(newFilters);
    } else {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    }
    setPage(1);
  };

  const handleSetSort = (newSort: JobSort) => {
    setSort(newSort);
    setPage(1);
  };

  return {
    jobs,
    isLoading,
    error,
    filters,
    setFilters: handleSetFilters,
    sort,
    setSort: handleSetSort,
    page,
    setPage,
    totalPages,
    totalJobs,
  };
}
