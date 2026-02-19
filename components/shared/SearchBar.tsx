'use client';

import { HiSearch } from 'react-icons/hi';

interface SearchBarProps {
  className?: string;
}

export default function SearchBar({ className = '' }: SearchBarProps) {
  return (
    <div className={`relative w-full ${className}`}>
      <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <HiSearch className="text-gray-400" size={20} aria-hidden="true" />
      </span>
      <input
        type="search"
        placeholder="Search jobs, companies..."
        className="w-full max-w-md h-11 pl-10 pr-4 rounded-full bg-gray-100 border border-transparent focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm text-gray-700 placeholder-gray-400 transition-all duration-200"
        aria-label="Search jobs and companies"
      />
    </div>
  );
}
