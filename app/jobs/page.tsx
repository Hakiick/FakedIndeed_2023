'use client';

import React from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import SearchBar from '@/components/shared/SearchBar';
import JobFilters from '@/components/jobs/JobFilters';
import JobList from '@/components/jobs/JobList';
import Button from '@/components/ui/Button';
import { useJobs } from '@/hooks/useJobs';

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pages.filter(
    (p) => p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)
  );

  const pagesWithEllipsis: (number | 'ellipsis-start' | 'ellipsis-end')[] = [];
  let prevPage: number | null = null;

  for (const p of visiblePages) {
    if (prevPage !== null && p - prevPage > 1) {
      pagesWithEllipsis.push(prevPage + 1 === page - 1 ? 'ellipsis-start' : 'ellipsis-end');
    }
    pagesWithEllipsis.push(p);
    prevPage = p;
  }

  return (
    <nav
      className="flex items-center justify-center gap-1 mt-8 pb-4"
      aria-label="Pagination des offres"
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Page précédente"
        leftIcon={<HiChevronLeft size={18} aria-hidden="true" />}
        className="min-h-[44px] min-w-[44px]"
      >
        <span className="hidden sm:inline">Précédent</span>
      </Button>

      <div className="flex items-center gap-1">
        {pagesWithEllipsis.map((item, idx) => {
          if (item === 'ellipsis-start' || item === 'ellipsis-end') {
            return (
              <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 text-sm">
                …
              </span>
            );
          }
          const isActive = item === page;
          return (
            <button
              key={item}
              onClick={() => onPageChange(item)}
              aria-label={`Page ${item}`}
              aria-current={isActive ? 'page' : undefined}
              className={[
                'min-h-[44px] min-w-[44px] rounded-lg text-sm font-medium transition-colors duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2557a7] focus-visible:ring-offset-1',
                isActive
                  ? 'bg-[#2557a7] text-white'
                  : 'text-gray-700 hover:bg-gray-100',
              ].join(' ')}
            >
              {item}
            </button>
          );
        })}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Page suivante"
        rightIcon={<HiChevronRight size={18} aria-hidden="true" />}
        className="min-h-[44px] min-w-[44px]"
      >
        <span className="hidden sm:inline">Suivant</span>
      </Button>
    </nav>
  );
}

export default function JobsPage() {
  const { jobs, isLoading, error, filters, setFilters, sort, setSort, page, setPage, totalPages, totalJobs } =
    useJobs();

  const handleReset = () => {
    setFilters({
      keyword: '',
      location: '',
      contractTypes: [],
      positionLocation: '',
      salaryMin: null,
      salaryMax: null,
    });
  };

  return (
    <div className="py-6 md:py-10">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Offres d&apos;emploi</h1>
        <p className="mt-1 text-gray-500 text-sm md:text-base">
          Trouvez votre prochain poste parmi nos offres
        </p>
      </header>

      <div className="mb-4">
        <SearchBar
          value={filters.keyword}
          onChange={(value) => setFilters({ keyword: value })}
          placeholder="Rechercher un poste, une entreprise..."
          className="max-w-full"
        />
      </div>

      <JobFilters
        filters={filters}
        sort={sort}
        totalJobs={totalJobs}
        onFiltersChange={setFilters}
        onSortChange={setSort}
        onReset={handleReset}
      />

      {error && (
        <div
          className="my-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
          role="alert"
        >
          <strong>Erreur :</strong> {error}
        </div>
      )}

      <div className="mt-6">
        <JobList jobs={jobs} isLoading={isLoading} />
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
