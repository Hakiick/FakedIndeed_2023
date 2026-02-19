'use client';

import React from 'react';
import Link from 'next/link';
import {
  FaMapMarkerAlt,
  FaMoneyBillAlt,
  FaBriefcase,
  FaClock,
  FaArrowLeft,
  FaBuilding,
  FaCheckCircle,
} from 'react-icons/fa';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import type { Job } from '@/types/job';

interface JobDetailProps {
  job: Job;
  onApplyClick: () => void;
}

type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'neutral';

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

function parseAdvantages(advantagesStr: string): string[] {
  if (!advantagesStr || advantagesStr.trim() === '') return [];
  try {
    const parsed = JSON.parse(advantagesStr) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === 'string');
    }
  } catch {
    // fall through to split by comma/newline
  }
  return advantagesStr
    .split(/[,\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function getContractBadgeVariant(type: string): BadgeVariant {
  switch (type) {
    case 'CDI':
      return 'success';
    case 'CDD':
      return 'warning';
    case 'Stage':
    case 'Alternance':
      return 'primary';
    case 'Freelance':
      return 'neutral';
    default:
      return 'neutral';
  }
}

function getRemoteBadgeVariant(positionLocation: string): BadgeVariant {
  switch (positionLocation) {
    case 'Full-Remote':
      return 'success';
    case 'Semi-Remote':
      return 'warning';
    case 'On-Site':
      return 'neutral';
    default:
      return 'neutral';
  }
}

function formatSalary(min: number, max: number): string {
  const formatK = (n: number) => `${Math.round(n / 1000)}k€`;
  if (min && max) return `${formatK(min)} – ${formatK(max)}`;
  if (min) return `${formatK(min)}+`;
  if (max) return `Jusqu'à ${formatK(max)}`;
  return '';
}

function getTimeAgo(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return "À l'instant";
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  const diffMonths = Math.floor(diffDays / 30);
  return `Il y a ${diffMonths} mois`;
}

export default function JobDetail({ job, onApplyClick }: JobDetailProps) {
  const jobTypes = parseJobTypes(job.jobTypes);
  const advantages = parseAdvantages(job.advantages);
  const salaryStr = formatSalary(job.minSalary, job.maxSalary);
  const timeAgo = getTimeAgo(job.updatedAt !== job.createdAt ? job.updatedAt : job.createdAt);

  return (
    <div className="relative pb-24 md:pb-0">
      {/* Back link */}
      <Link
        href="/jobs"
        className="inline-flex items-center gap-2 text-[#2557a7] hover:text-[#1d4690] font-medium text-sm mb-6 transition-colors duration-150 min-h-[44px]"
        aria-label="Retour à la liste des offres"
      >
        <FaArrowLeft size={14} aria-hidden="true" />
        Retour aux offres
      </Link>

      <Card className="mb-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              {job.title}
            </h1>
            <p className="mt-1.5 text-lg text-gray-600 font-medium">{job.company}</p>
          </div>

          {job.location && (
            <div className="flex items-center gap-1.5 text-gray-500 text-sm">
              <FaMapMarkerAlt size={14} aria-hidden="true" className="flex-shrink-0 text-gray-400" />
              <span>{job.location}</span>
            </div>
          )}

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {jobTypes.map((type) => (
              <Badge key={type} variant={getContractBadgeVariant(type)} size="sm">
                <FaBriefcase size={10} className="mr-1" aria-hidden="true" />
                {type}
              </Badge>
            ))}
            <Badge variant={getRemoteBadgeVariant(job.positionLocation)} size="sm">
              {job.positionLocation}
            </Badge>
          </div>

          {/* Salary */}
          {salaryStr && (
            <div className="flex items-center gap-2 text-gray-700 text-sm font-medium">
              <FaMoneyBillAlt size={16} aria-hidden="true" className="text-green-600 flex-shrink-0" />
              <span>{salaryStr}</span>
            </div>
          )}

          {/* Time ago */}
          <div className="flex items-center gap-1.5 text-gray-400 text-xs">
            <FaClock size={12} aria-hidden="true" />
            <span>Publié {timeAgo}</span>
          </div>

          {/* Desktop apply button */}
          <div className="hidden md:block mt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={onApplyClick}
              aria-label={`Postuler pour ${job.title}`}
              className="w-full sm:w-auto"
            >
              Postuler à cette offre
            </Button>
          </div>
        </div>
      </Card>

      {/* Description */}
      <Card className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Description du poste</h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
          {job.description}
        </p>
      </Card>

      {/* Advantages */}
      {advantages.length > 0 && (
        <Card className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Avantages</h2>
          <ul className="flex flex-col gap-2" role="list">
            {advantages.map((advantage, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm md:text-base text-gray-700">
                <FaCheckCircle
                  size={16}
                  className="text-green-500 flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span>{advantage}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* About company */}
      <Card className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">À propos de l&apos;entreprise</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#2557a7]/10 flex-shrink-0">
            <FaBuilding size={20} className="text-[#2557a7]" aria-hidden="true" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{job.company}</p>
            <p className="text-sm text-gray-500 mt-0.5">{job.positionLocation}</p>
          </div>
        </div>
      </Card>

      {/* Mobile sticky apply button — fixed above MobileNav */}
      <div
        className="fixed bottom-20 left-0 right-0 z-30 px-4 md:hidden"
        aria-hidden="false"
      >
        <Button
          variant="primary"
          size="lg"
          onClick={onApplyClick}
          aria-label={`Postuler pour ${job.title}`}
          className="w-full shadow-lg"
        >
          Postuler à cette offre
        </Button>
      </div>
    </div>
  );
}
