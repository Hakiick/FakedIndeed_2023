'use client';

import { HiSearch } from 'react-icons/hi';

interface SearchBarProps {
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  className = '',
  value,
  onChange,
  placeholder = 'Search jobs, companies...',
}: SearchBarProps) {
  return (
    <div className={`relative w-full ${className}`}>
      <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <HiSearch className="text-gray-400" size={20} aria-hidden="true" />
      </span>
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className="w-full h-11 pl-10 pr-4 rounded-full bg-gray-100 border border-transparent focus:outline-none focus:border-[#2557a7] focus:ring-2 focus:ring-[#2557a7]/20 text-sm text-gray-700 placeholder-gray-400 transition-all duration-200"
        aria-label="Rechercher des offres et entreprises"
      />
    </div>
  );
}
