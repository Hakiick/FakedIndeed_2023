'use client';

import React, { useRef } from 'react';

interface AdminTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface Tab {
  id: string;
  label: string;
}

const TABS: Tab[] = [
  { id: 'stats', label: 'Statistiques' },
  { id: 'users', label: 'Utilisateurs' },
  { id: 'companies', label: 'Entreprises' },
  { id: 'jobs', label: 'Offres' },
];

export default function AdminTabs({ activeTab, onTabChange }: AdminTabsProps) {
  const tabListRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const tabs = tabListRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    if (!tabs) return;

    let nextIndex = index;
    if (e.key === 'ArrowRight') {
      nextIndex = (index + 1) % TABS.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (index - 1 + TABS.length) % TABS.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = TABS.length - 1;
    } else {
      return;
    }

    e.preventDefault();
    tabs[nextIndex]?.focus();
    onTabChange(TABS[nextIndex].id);
  };

  return (
    <div
      ref={tabListRef}
      role="tablist"
      aria-label="Navigation admin"
      className="flex overflow-x-auto gap-1 border-b border-slate-200 mb-6 scrollbar-hide"
    >
      {TABS.map((tab, index) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={[
              'flex-shrink-0 min-h-[44px] px-4 text-sm font-medium transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2557a7] focus-visible:ring-inset',
              'rounded-t-lg',
              isActive
                ? 'text-[#2557a7] font-bold border-b-2 border-[#2557a7] bg-[#2557a7]/5'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
            ].join(' ')}
          >
            {tab.label}
          </button>
        );
      })}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
