'use client';

import React, { useState, useCallback } from 'react';
import { HiChevronDown, HiChevronUp, HiSelector, HiTrash } from 'react-icons/hi';
import { useIsMobile } from '@/hooks/useBreakpoint';
import { useToast } from '@/components/ui/Toast';
import { Badge, Button } from '@/components/ui';
import type { UserPublic } from '@/types/user';

interface UserTableProps {
  users: UserPublic[];
  onDeleteUser: (id: number) => void;
}

type SortField = 'name' | 'email' | 'userType' | 'createdAt';
type SortDirection = 'asc' | 'desc';

const PAGE_SIZE = 10;

function userTypeBadgeVariant(userType: string): 'primary' | 'success' | 'warning' | 'neutral' {
  if (userType === 'admin') return 'warning';
  if (userType === 'company') return 'primary';
  return 'neutral';
}

function formatDate(value: Date | string): string {
  return new Date(value).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

interface MobileUserCardProps {
  user: UserPublic;
  onDelete: (id: number) => void;
}

function MobileUserCard({ user, onDelete }: MobileUserCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const { addToast } = useToast();

  const handleDelete = useCallback(async () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    try {
      const res = await fetch('/api/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id }),
      });
      if (!res.ok) throw new Error('Erreur suppression');
      addToast('Utilisateur supprimé', 'success');
      onDelete(user.id);
    } catch {
      addToast('Erreur lors de la suppression', 'error');
    } finally {
      setConfirming(false);
    }
  }, [confirming, user.id, onDelete, addToast]);

  const fullName = [user.name, user.lastname].filter(Boolean).join(' ') || '—';

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 p-4">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">{fullName}</p>
          <p className="text-sm text-gray-500 truncate">{user.email}</p>
        </div>
        <Badge variant={userTypeBadgeVariant(user.userType)} size="sm">
          {user.userType}
        </Badge>
        <button
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-label={expanded ? 'Réduire les détails' : 'Voir les détails'}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2557a7]"
        >
          {expanded ? <HiChevronUp size={20} /> : <HiChevronDown size={20} />}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-slate-100 px-4 pb-4 pt-3 space-y-2">
          {user.phone && (
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-700">Tél :</span> {user.phone}
            </p>
          )}
          {user.website && (
            <p className="text-sm text-gray-600 truncate">
              <span className="font-medium text-gray-700">Site :</span>{' '}
              <a
                href={user.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2557a7] underline"
              >
                {user.website}
              </a>
            </p>
          )}
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-700">Inscrit le :</span>{' '}
            {formatDate(user.createdAt)}
          </p>
          <div className="pt-2">
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
              leftIcon={<HiTrash size={16} />}
              className="w-full"
            >
              {confirming ? 'Confirmer la suppression' : 'Supprimer'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

interface SortHeaderProps {
  field: SortField;
  label: string;
  currentField: SortField;
  direction: SortDirection;
  onSort: (field: SortField) => void;
}

function SortHeader({ field, label, currentField, direction, onSort }: SortHeaderProps) {
  const isActive = field === currentField;
  const ariaSort = isActive ? (direction === 'asc' ? 'ascending' : 'descending') : 'none';

  return (
    <th
      scope="col"
      aria-sort={ariaSort}
      className="px-4 py-3 text-left"
    >
      <button
        onClick={() => onSort(field)}
        className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 uppercase tracking-wide hover:text-gray-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2557a7] rounded"
      >
        {label}
        <span className="text-gray-400" aria-hidden="true">
          {isActive ? (
            direction === 'asc' ? <HiChevronUp size={14} /> : <HiChevronDown size={14} />
          ) : (
            <HiSelector size={14} />
          )}
        </span>
      </button>
    </th>
  );
}

export default function UserTable({ users, onDeleteUser }: UserTableProps) {
  const isMobile = useIsMobile();
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmingId, setConfirmingId] = useState<number | null>(null);
  const { addToast } = useToast();

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setPage(1);
  };

  const sortedUsers = [...users].sort((a, b) => {
    let valA: string | number | Date = a[sortField] ?? '';
    let valB: string | number | Date = b[sortField] ?? '';

    if (sortField === 'createdAt') {
      valA = new Date(a.createdAt).getTime();
      valB = new Date(b.createdAt).getTime();
    } else {
      valA = String(valA).toLowerCase();
      valB = String(valB).toLowerCase();
    }

    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sortedUsers.length / PAGE_SIZE));
  const pagedUsers = sortedUsers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDesktopDelete = useCallback(
    async (id: number) => {
      if (confirmingId !== id) {
        setConfirmingId(id);
        return;
      }
      setDeletingId(id);
      try {
        const res = await fetch('/api/users', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });
        if (!res.ok) throw new Error('Erreur suppression');
        addToast('Utilisateur supprimé', 'success');
        onDeleteUser(id);
        if (pagedUsers.length === 1 && page > 1) setPage((p) => p - 1);
      } catch {
        addToast('Erreur lors de la suppression', 'error');
      } finally {
        setDeletingId(null);
        setConfirmingId(null);
      }
    },
    [confirmingId, onDeleteUser, addToast, pagedUsers.length, page],
  );

  if (isMobile) {
    return (
      <section aria-label="Liste des utilisateurs">
        <p className="text-sm text-gray-500 mb-3">{users.length} utilisateur(s)</p>
        <div className="space-y-3">
          {users.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Aucun utilisateur</p>
          ) : (
            users.map((user) => (
              <MobileUserCard key={user.id} user={user} onDelete={onDeleteUser} />
            ))
          )}
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Table des utilisateurs">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-500">{users.length} utilisateur(s)</p>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Page précédente"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border border-slate-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2557a7]"
            >
              &lsaquo;
            </button>
            <span className="text-sm text-gray-600">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label="Page suivante"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border border-slate-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2557a7]"
            >
              &rsaquo;
            </button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
        <table className="w-full text-sm" aria-label="Utilisateurs">
          <thead className="bg-gray-50 border-b border-slate-200">
            <tr>
              <SortHeader
                field="name"
                label="Nom"
                currentField={sortField}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortHeader
                field="email"
                label="Email"
                currentField={sortField}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortHeader
                field="userType"
                label="Type"
                currentField={sortField}
                direction={sortDirection}
                onSort={handleSort}
              />
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Téléphone
              </th>
              <SortHeader
                field="createdAt"
                label="Inscrit le"
                currentField={sortField}
                direction={sortDirection}
                onSort={handleSort}
              />
              <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pagedUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  Aucun utilisateur
                </td>
              </tr>
            ) : (
              pagedUsers.map((user) => {
                const fullName = [user.name, user.lastname].filter(Boolean).join(' ') || '—';
                const isDeleting = deletingId === user.id;
                const isConfirming = confirmingId === user.id;

                return (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{fullName}</td>
                    <td className="px-4 py-3 text-gray-600">{user.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant={userTypeBadgeVariant(user.userType)} size="sm">
                        {user.userType}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{user.phone || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(user.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="danger"
                        size="sm"
                        isLoading={isDeleting}
                        onClick={() => handleDesktopDelete(user.id)}
                        leftIcon={!isDeleting ? <HiTrash size={14} /> : undefined}
                      >
                        {isConfirming ? 'Confirmer ?' : 'Supprimer'}
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
