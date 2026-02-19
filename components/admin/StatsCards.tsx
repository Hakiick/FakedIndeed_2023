'use client';

import React, { useEffect, useRef, useState } from 'react';
import { HiBriefcase, HiDocumentText, HiOfficeBuilding, HiUsers } from 'react-icons/hi';

interface StatsCardsProps {
  totalUsers: number;
  totalJobs: number;
  totalApplications: number;
  totalCompanies: number;
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
  const startTimeRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (target === 0) {
      setCount(0);
      return;
    }

    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));

      if (progress < 1) {
        rafIdRef.current = requestAnimationFrame(animate);
      }
    };

    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [target, duration]);

  return count;
}

function StatCard({ icon, count, label, colorClass, bgClass }: StatCardProps) {
  const animatedCount = useCountUp(count);

  return (
    <div
      className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm
        opacity-0 animate-[fadeSlideIn_0.4s_ease-out_forwards]"
    >
      <div
        className={`flex items-center justify-center w-12 h-12 rounded-xl flex-shrink-0 ${bgClass}`}
        aria-hidden="true"
      >
        <span className={`text-2xl ${colorClass}`}>{icon}</span>
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

export default function StatsCards({
  totalUsers,
  totalJobs,
  totalApplications,
  totalCompanies,
}: StatsCardsProps) {
  return (
    <div
      className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4 mb-6"
      role="region"
      aria-label="Statistiques admin"
    >
      <StatCard
        icon={<HiUsers />}
        count={totalUsers}
        label="Utilisateurs"
        colorClass="text-[#2557a7]"
        bgClass="bg-[#2557a7]/10"
      />
      <StatCard
        icon={<HiBriefcase />}
        count={totalJobs}
        label="Offres"
        colorClass="text-emerald-600"
        bgClass="bg-emerald-50"
      />
      <StatCard
        icon={<HiDocumentText />}
        count={totalApplications}
        label="Candidatures"
        colorClass="text-amber-600"
        bgClass="bg-amber-50"
      />
      <StatCard
        icon={<HiOfficeBuilding />}
        count={totalCompanies}
        label="Entreprises"
        colorClass="text-purple-600"
        bgClass="bg-purple-50"
      />

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
