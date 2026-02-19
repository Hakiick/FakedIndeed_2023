'use client';

import React, { useState } from 'react';
import { HiFilter, HiRefresh } from 'react-icons/hi';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { useIsMobile } from '@/hooks/useBreakpoint';
import type { JobFilters, JobSort } from '@/hooks/useJobs';

const CONTRACT_TYPES = ['CDI', 'CDD', 'Stage', 'Alternance', 'Freelance'];
const POSITION_LOCATIONS = [
  { value: '', label: 'Tous' },
  { value: 'On-Site', label: 'Présentiel' },
  { value: 'Semi-Remote', label: 'Semi-remote' },
  { value: 'Full-Remote', label: 'Full remote' },
];
const SORT_OPTIONS: { value: JobSort; label: string }[] = [
  { value: 'recent', label: 'Plus récent' },
  { value: 'salary-asc', label: 'Salaire croissant' },
  { value: 'salary-desc', label: 'Salaire décroissant' },
];

interface JobFiltersProps {
  filters: JobFilters;
  sort: JobSort;
  totalJobs: number;
  onFiltersChange: (filters: Partial<JobFilters>) => void;
  onSortChange: (sort: JobSort) => void;
  onReset: () => void;
}

function FilterContent({
  filters,
  sort,
  onFiltersChange,
  onSortChange,
  onReset,
}: Omit<JobFiltersProps, 'totalJobs'>) {
  const toggleContractType = (type: string) => {
    const current = filters.contractTypes;
    const updated = current.includes(type)
      ? current.filter((ct) => ct !== type)
      : [...current, type];
    onFiltersChange({ contractTypes: updated });
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2">Type de contrat</p>
        <div className="flex flex-wrap gap-2">
          {CONTRACT_TYPES.map((type) => {
            const active = filters.contractTypes.includes(type);
            return (
              <button
                key={type}
                onClick={() => toggleContractType(type)}
                aria-pressed={active}
                className={[
                  'min-h-[44px] px-3 py-1 rounded-lg border text-sm font-medium transition-colors duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2557a7] focus-visible:ring-offset-1',
                  active
                    ? 'bg-[#2557a7] text-white border-[#2557a7]'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-[#2557a7] hover:text-[#2557a7]',
                ].join(' ')}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label htmlFor="position-location" className="text-sm font-semibold text-gray-700 mb-2 block">
          Localisation
        </label>
        <select
          id="position-location"
          value={filters.positionLocation}
          onChange={(e) => onFiltersChange({ positionLocation: e.target.value })}
          className="w-full min-h-[44px] px-3 rounded-lg border border-gray-300 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#2557a7] focus:border-[#2557a7] transition-colors"
          aria-label="Filtrer par type de localisation"
        >
          {POSITION_LOCATIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2">Fourchette salariale</p>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label htmlFor="salary-min" className="sr-only">
              Salaire minimum
            </label>
            <input
              id="salary-min"
              type="number"
              min={0}
              step={1000}
              placeholder="Min (€)"
              value={filters.salaryMin ?? ''}
              onChange={(e) =>
                onFiltersChange({
                  salaryMin: e.target.value ? Number(e.target.value) : null,
                })
              }
              className="w-full min-h-[44px] px-3 rounded-lg border border-gray-300 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2557a7] focus:border-[#2557a7] transition-colors"
            />
          </div>
          <span className="text-gray-400 text-sm">–</span>
          <div className="flex-1">
            <label htmlFor="salary-max" className="sr-only">
              Salaire maximum
            </label>
            <input
              id="salary-max"
              type="number"
              min={0}
              step={1000}
              placeholder="Max (€)"
              value={filters.salaryMax ?? ''}
              onChange={(e) =>
                onFiltersChange({
                  salaryMax: e.target.value ? Number(e.target.value) : null,
                })
              }
              className="w-full min-h-[44px] px-3 rounded-lg border border-gray-300 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2557a7] focus:border-[#2557a7] transition-colors"
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="sort-select" className="text-sm font-semibold text-gray-700 mb-2 block">
          Trier par
        </label>
        <select
          id="sort-select"
          value={sort}
          onChange={(e) => onSortChange(e.target.value as JobSort)}
          className="w-full min-h-[44px] px-3 rounded-lg border border-gray-300 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#2557a7] focus:border-[#2557a7] transition-colors"
          aria-label="Trier les offres"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onReset}
        leftIcon={<HiRefresh size={16} aria-hidden="true" />}
        className="self-start"
      >
        Réinitialiser les filtres
      </Button>
    </div>
  );
}

export default function JobFilters({
  filters,
  sort,
  totalJobs,
  onFiltersChange,
  onSortChange,
  onReset,
}: JobFiltersProps) {
  const isMobile = useIsMobile();
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const activeFilterCount =
    filters.contractTypes.length +
    (filters.positionLocation ? 1 : 0) +
    (filters.salaryMin !== null ? 1 : 0) +
    (filters.salaryMax !== null ? 1 : 0);

  if (isMobile) {
    return (
      <div className="flex items-center justify-between gap-3 py-3">
        <p className="text-sm text-gray-500 font-medium">
          <span className="font-semibold text-gray-900">{totalJobs}</span> offre{totalJobs !== 1 ? 's' : ''} trouvée{totalJobs !== 1 ? 's' : ''}
        </p>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsBottomSheetOpen(true)}
          leftIcon={<HiFilter size={16} aria-hidden="true" />}
          aria-label={`Ouvrir les filtres${activeFilterCount > 0 ? ` (${activeFilterCount} actifs)` : ''}`}
        >
          Filtres
          {activeFilterCount > 0 && (
            <span className="ml-1 bg-[#2557a7] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </Button>

        <Modal
          isOpen={isBottomSheetOpen}
          onClose={() => setIsBottomSheetOpen(false)}
          title="Filtres"
          size="lg"
        >
          <FilterContent
            filters={filters}
            sort={sort}
            onFiltersChange={onFiltersChange}
            onSortChange={onSortChange}
            onReset={() => {
              onReset();
            }}
          />
          <div className="sticky bottom-0 pt-4 mt-4 border-t border-gray-100 bg-white">
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsBottomSheetOpen(false)}
              className="w-full"
            >
              Voir les {totalJobs} offre{totalJobs !== 1 ? 's' : ''}
            </Button>
          </div>
        </Modal>
      </div>
    );
  }

  return (
    <div className="py-4 border-t border-b border-gray-100">
      <div className="flex items-start gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <FilterContent
            filters={filters}
            sort={sort}
            onFiltersChange={onFiltersChange}
            onSortChange={onSortChange}
            onReset={onReset}
          />
        </div>
      </div>
      <p className="mt-3 text-sm text-gray-500">
        <span className="font-semibold text-gray-900">{totalJobs}</span> offre{totalJobs !== 1 ? 's' : ''} trouvée{totalJobs !== 1 ? 's' : ''}
      </p>
    </div>
  );
}
