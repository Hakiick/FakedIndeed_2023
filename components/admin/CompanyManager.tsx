'use client';

import React, { useState, useCallback } from 'react';
import { HiOfficeBuilding, HiPlus, HiTrash } from 'react-icons/hi';
import { Button, Card, Input, Modal } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import type { Company } from '@/types/company';

interface CompanyManagerProps {
  companies: Company[];
  onRefresh: () => void;
}

function parseEmails(emailsJson: string): string[] {
  try {
    const parsed = JSON.parse(emailsJson);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

export default function CompanyManager({ companies, onRefresh }: CompanyManagerProps) {
  const { addToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [formName, setFormName] = useState('');
  const [formEmails, setFormEmails] = useState('');
  const [nameError, setNameError] = useState('');

  const handleOpenModal = () => {
    setFormName('');
    setFormEmails('');
    setNameError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreate = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmedName = formName.trim();
      if (!trimmedName) {
        setNameError('Le nom est requis');
        return;
      }
      setNameError('');
      setIsSubmitting(true);
      try {
        const res = await fetch('/api/company', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: trimmedName, emails: formEmails }),
        });
        if (!res.ok) throw new Error('Erreur création');
        addToast('Entreprise créée avec succès', 'success');
        handleCloseModal();
        onRefresh();
      } catch {
        addToast('Erreur lors de la création', 'error');
      } finally {
        setIsSubmitting(false);
      }
    },
    [formName, formEmails, addToast, onRefresh],
  );

  const handleDelete = useCallback(
    async (id: number) => {
      if (confirmDeleteId !== id) {
        setConfirmDeleteId(id);
        return;
      }
      setDeletingId(id);
      try {
        const res = await fetch('/api/company', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });
        if (!res.ok) throw new Error('Erreur suppression');
        addToast('Entreprise supprimée', 'success');
        onRefresh();
      } catch {
        addToast('Erreur lors de la suppression', 'error');
      } finally {
        setDeletingId(null);
        setConfirmDeleteId(null);
      }
    },
    [confirmDeleteId, addToast, onRefresh],
  );

  return (
    <section aria-label="Gestion des entreprises">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{companies.length} entreprise(s)</p>
        <Button
          variant="primary"
          size="sm"
          onClick={handleOpenModal}
          leftIcon={<HiPlus size={16} />}
        >
          Ajouter
        </Button>
      </div>

      {companies.length === 0 ? (
        <p className="text-center text-gray-500 py-8">Aucune entreprise</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => {
            const emails = parseEmails(company.emails);
            const isDeleting = deletingId === company.id;
            const isConfirming = confirmDeleteId === company.id;

            return (
              <Card key={company.id} className="!p-4">
                <div className="flex items-start gap-3">
                  <div
                    className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-purple-50"
                    aria-hidden="true"
                  >
                    <HiOfficeBuilding className="text-purple-600 text-xl" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{company.name}</p>
                    {emails.length > 0 ? (
                      <ul className="mt-1 space-y-0.5">
                        {emails.map((email) => (
                          <li key={email} className="text-xs text-gray-500 truncate">
                            {email}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-gray-400 mt-1">Aucun email</p>
                    )}
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <Button
                    variant="danger"
                    size="sm"
                    isLoading={isDeleting}
                    onClick={() => handleDelete(company.id)}
                    leftIcon={!isDeleting ? <HiTrash size={14} /> : undefined}
                    className="w-full"
                  >
                    {isConfirming ? 'Confirmer la suppression ?' : 'Supprimer'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Ajouter une entreprise"
        size="md"
      >
        <form onSubmit={handleCreate} noValidate>
          <div className="space-y-4">
            <Input
              label="Nom de l'entreprise"
              type="text"
              value={formName}
              onChange={(e) => {
                setFormName(e.target.value);
                if (nameError) setNameError('');
              }}
              error={nameError}
              required
              autoFocus
              placeholder="Ex: Acme Corp"
            />
            <Input
              label="Emails"
              type="text"
              value={formEmails}
              onChange={(e) => setFormEmails(e.target.value)}
              placeholder="email1@ex.com, email2@ex.com"
              helperText="Séparez les emails par des virgules"
            />
          </div>
          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={handleCloseModal}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              className="flex-1"
            >
              Créer
            </Button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
