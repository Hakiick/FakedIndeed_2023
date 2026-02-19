'use client';

import React, { useEffect, useRef, useState } from 'react';
import { HiBriefcase, HiDocumentText } from 'react-icons/hi';

interface ProfileStatsProps {
  activeJobs: number;
  totalApplications: number;
}

interface StatCardProps {
  icon: React.ReactNode;
  count: number;
  label: string;
  colorClass: string;
  bgClass: string;
}

function useCountUp(target: number, duration = 800): number {
  const [count, setCount] = useState(0);
  const startTime = useRef<number | null>(null);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    if (target === 0) {
      setCount(0);
      return;
    }

    startTime.current = null;

    const animate = (timestamp: number) => {
      if (startTime.current === null) {
        startTime.current = timestamp;
      }
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));

      if (progress < 1) {
        rafId.current = requestAnimationFrame(animate);
      }
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [target, duration]);

  return count;
}

function StatCard({ icon, count, label, colorClass, bgClass }: StatCardProps) {
  const animatedCount = useCountUp(count);

  return (
    <div
      className="flex-shrink-0 flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm
        opacity-0 animate-[fadeSlideIn_0.4s_ease-out_forwards]
        min-w-[10rem] md:min-w-0"
    >
      <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${bgClass} flex-shrink-0`}>
        <span className={`text-2xl ${colorClass}`} aria-hidden="true">
          {icon}
        </span>
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 tabular-nums leading-none">
          {animatedCount}
        </p>
        <p className="mt-0.5 text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

export default function ProfileStats({ activeJobs, totalApplications }: ProfileStatsProps) {
  return (
    <div
      className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide
        md:grid md:grid-cols-2 md:overflow-visible md:pb-0
        lg:grid-cols-3"
      role="region"
      aria-label="Statistiques du tableau de bord"
    >
      <StatCard
        icon={<HiBriefcase />}
        count={activeJobs}
        label="Offres actives"
        colorClass="text-[#2557a7]"
        bgClass="bg-[#2557a7]/10"
      />
      <StatCard
        icon={<HiDocumentText />}
        count={totalApplications}
        label="Candidatures reçues"
        colorClass="text-emerald-600"
        bgClass="bg-emerald-50"
      />

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
