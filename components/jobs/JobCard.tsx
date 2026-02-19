'use client';

import React from 'react';
import Link from 'next/link';
import { FaMapMarkerAlt, FaMoneyBillAlt, FaBriefcase, FaClock } from 'react-icons/fa';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import type { Job } from '@/types/job';

interface JobCardProps {
  job: Job;
  index?: number;
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

export default function JobCard({ job, index = 0 }: JobCardProps) {
  const jobTypes = parseJobTypes(job.jobTypes);
  const salaryStr = formatSalary(job.minSalary, job.maxSalary);
  const timeAgo = getTimeAgo(job.updatedAt !== job.createdAt ? job.updatedAt : job.createdAt);
  const animationDelay = `${index * 50}ms`;

  return (
    <div
      className="opacity-0 animate-[fadeSlideIn_0.4s_ease-out_forwards]"
      style={{ animationDelay }}
    >
      <Link href={`/jobs/${job.id}`} className="block group" aria-label={`${job.title} chez ${job.company}`}>
        <Card
          className="h-full transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-lg"
          hoverable
        >
          <div className="flex flex-col gap-3">
            <div>
              <h3 className="font-bold text-lg text-gray-900 leading-snug line-clamp-2 group-hover:text-[#2557a7] transition-colors duration-150">
                {job.title}
              </h3>
              <p className="mt-1 text-gray-600 font-medium text-sm">{job.company}</p>
            </div>

            {job.location && (
              <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                <FaMapMarkerAlt size={13} aria-hidden="true" className="flex-shrink-0 text-gray-400" />
                <span>{job.location}</span>
              </div>
            )}

            <div className="flex flex-wrap gap-1.5">
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

            {salaryStr && (
              <div className="flex items-center gap-1.5 text-gray-700 text-sm font-medium">
                <FaMoneyBillAlt size={14} aria-hidden="true" className="text-green-600 flex-shrink-0" />
                <span>{salaryStr}</span>
              </div>
            )}

            <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
              {job.description}
            </p>

            <div className="flex items-center justify-between pt-1 mt-auto">
              <div className="flex items-center gap-1 text-gray-400 text-xs">
                <FaClock size={11} aria-hidden="true" />
                <span>{timeAgo}</span>
              </div>

              <Button
                variant="primary"
                size="sm"
                className="min-h-[44px]"
                onClick={(e) => e.preventDefault()}
                aria-label={`Postuler pour ${job.title}`}
              >
                Postuler
              </Button>
            </div>
          </div>
        </Card>
      </Link>

    </div>
  );
}
