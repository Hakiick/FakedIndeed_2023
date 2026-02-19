'use client';

import React from 'react';
import { FaEnvelope, FaPhone, FaGlobe, FaFilePdf } from 'react-icons/fa';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import type { Application } from '@/types/application';

interface ApplicantCardProps {
  applicant: Application;
  index?: number;
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

function openCv(cv: string): void {
  if (cv.startsWith('data:')) {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(`<iframe src="${cv}" style="width:100%;height:100%;border:none;" />`);
    }
  } else {
    window.open(cv, '_blank', 'noopener,noreferrer');
  }
}

export default function ApplicantCard({ applicant, index = 0 }: ApplicantCardProps) {
  const animationDelay = `${index * 50}ms`;
  const timeAgo = getTimeAgo(applicant.createdAt);

  return (
    <div
      className="opacity-0 animate-[fadeSlideIn_0.4s_ease-out_forwards]"
      style={{ animationDelay }}
    >
      <Card className="flex flex-col gap-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-snug">
              {applicant.name} {applicant.lastname}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">{timeAgo}</p>
          </div>
          <Badge variant="primary" size="sm">
            Ad #{applicant.ad_id}
          </Badge>
        </div>

        {/* Contact info */}
        <div className="flex flex-col gap-1.5">
          <a
            href={`mailto:${applicant.email}`}
            className="flex items-center gap-2 text-sm text-[#2557a7] hover:text-[#1d4690] transition-colors min-h-[44px] rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2557a7] focus-visible:ring-offset-1"
            aria-label={`Envoyer un email à ${applicant.name} ${applicant.lastname}`}
          >
            <FaEnvelope size={13} aria-hidden="true" className="flex-shrink-0 text-gray-400" />
            <span>{applicant.email}</span>
          </a>

          {applicant.phone && (
            <a
              href={`tel:${applicant.phone}`}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors min-h-[44px] rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2557a7] focus-visible:ring-offset-1"
              aria-label={`Appeler ${applicant.name} ${applicant.lastname}`}
            >
              <FaPhone size={13} aria-hidden="true" className="flex-shrink-0 text-gray-400" />
              <span>{applicant.phone}</span>
            </a>
          )}

          {applicant.website && (
            <a
              href={applicant.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors min-h-[44px] rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2557a7] focus-visible:ring-offset-1"
              aria-label={`Visiter le site de ${applicant.name} ${applicant.lastname}`}
            >
              <FaGlobe size={13} aria-hidden="true" className="flex-shrink-0 text-gray-400" />
              <span className="truncate">{applicant.website}</span>
            </a>
          )}
        </div>

        {/* Motivations preview */}
        {applicant.motivations && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Motivation</p>
            <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">
              {applicant.motivations}
            </p>
          </div>
        )}

        {/* CV button */}
        {applicant.cv && (
          <div className="pt-1">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<FaFilePdf size={13} aria-hidden="true" />}
              onClick={() => openCv(applicant.cv)}
              aria-label={`Voir le CV de ${applicant.name} ${applicant.lastname}`}
            >
              Voir le CV
            </Button>
          </div>
        )}
      </Card>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
