'use client';

import React, { useState, useEffect, useRef } from 'react';
import { z } from 'zod';
import { FaUpload, FaFilePdf, FaTimes } from 'react-icons/fa';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/hooks/useAuth';
import { applicationCreateSchema } from '@/lib/validators';
import type { UserPublic } from '@/types/user';

interface ApplyFormProps {
  jobId: number;
  companyName: string;
  jobTitle: string;
  onSuccess?: () => void;
}

type FormErrors = Partial<Record<string, string>>;

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('File read error'));
    reader.readAsDataURL(file);
  });
}

export default function ApplyForm({ jobId, companyName, jobTitle, onSuccess }: ApplyFormProps) {
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();

  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [motivations, setMotivations] = useState('');
  const [website, setWebsite] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvBase64, setCvBase64] = useState<string | undefined>(undefined);
  const [fileError, setFileError] = useState<string | undefined>(undefined);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userFetched, setUserFetched] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pre-fill from authenticated user
  useEffect(() => {
    if (!isAuthenticated || !user || userFetched) return;

    const prefillFromJwt = () => {
      setName(user.name ?? '');
      setLastname(user.lastname ?? '');
      setEmail(user.email ?? '');
    };

    // Fetch full user details from /api/users to get phone and website
    const fetchFullUser = async () => {
      try {
        const res = await fetch('/api/users', { cache: 'no-store' });
        if (res.ok) {
          const users = await res.json() as UserPublic[];
          const fullUser = users.find((u) => u.email === user.email);
          if (fullUser) {
            setName(fullUser.name ?? '');
            setLastname(fullUser.lastname ?? '');
            setEmail(fullUser.email ?? '');
            setPhone(fullUser.phone ?? '');
            setWebsite(fullUser.website ?? '');
          } else {
            prefillFromJwt();
          }
        } else {
          prefillFromJwt();
        }
      } catch {
        prefillFromJwt();
      } finally {
        setUserFetched(true);
      }
    };

    void fetchFullUser();
  }, [isAuthenticated, user, userFetched]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError(undefined);
    setCvFile(null);
    setCvBase64(undefined);

    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setFileError(`Le fichier dépasse la limite de ${MAX_FILE_SIZE_MB}MB`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const allowed = ['.pdf', '.doc', '.docx'];
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!allowed.includes(ext)) {
      setFileError('Format accepté : PDF, DOC, DOCX uniquement');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      setCvFile(file);
      setCvBase64(base64);
    } catch {
      setFileError('Impossible de lire le fichier');
    }
  };

  const removeFile = () => {
    setCvFile(null);
    setCvBase64(undefined);
    setFileError(undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validateForm = (): boolean => {
    const payload = {
      ad_id: jobId,
      company_name: companyName,
      name: name.trim(),
      lastname: lastname.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      motivations: motivations.trim(),
      website: website.trim() || undefined,
      cv: cvBase64,
    };

    const result = applicationCreateSchema.safeParse(payload);

    if (!result.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (typeof field === 'string') {
          fieldErrors[field] = issue.message;
        }
      }
      // Apply human-readable labels for specific fields
      const labelMap: Record<string, string> = {
        name: 'Le prénom est requis',
        lastname: 'Le nom est requis',
        email: 'Email invalide',
        motivations: 'Les motivations sont requises',
        website: 'URL invalide (doit commencer par http)',
        company_name: 'Entreprise manquante',
        ad_id: 'Offre invalide',
      };
      const humanErrors: FormErrors = {};
      for (const [key, _] of Object.entries(fieldErrors)) {
        humanErrors[key] = labelMap[key] ?? fieldErrors[key];
      }
      setErrors(humanErrors);
      return false;
    }

    if (motivations.trim().length < 20) {
      setErrors({ motivations: 'Les motivations doivent comporter au moins 20 caractères' });
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        ad_id: jobId,
        company_name: companyName,
        name: name.trim(),
        lastname: lastname.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        motivations: motivations.trim(),
        website: website.trim() || undefined,
        cv: cvBase64,
      };

      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error ?? 'Échec de l\'envoi');
      }

      toast.addToast('Candidature envoyée avec succès !', 'success');
      onSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue';
      toast.addToast(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="animate-[slideUp_0.3s_ease-out]"
      role="region"
      aria-label={`Formulaire de candidature pour ${jobTitle}`}
    >
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Postuler</h2>
        <p className="text-sm text-gray-500 mb-6">
          {jobTitle} chez {companyName}
        </p>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          {/* Name row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Prénom"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              required
              placeholder="Jean"
              autoComplete="given-name"
            />
            <Input
              label="Nom"
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              error={errors.lastname}
              required
              placeholder="Dupont"
              autoComplete="family-name"
            />
          </div>

          {/* Email */}
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            required
            placeholder="jean.dupont@example.com"
            autoComplete="email"
          />

          {/* Phone */}
          <Input
            label="Téléphone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={errors.phone}
            placeholder="+33 6 12 34 56 78"
            autoComplete="tel"
            helperText="Optionnel"
          />

          {/* Motivations */}
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="motivations" className="text-sm font-medium text-gray-700">
              Lettre de motivation
              <span className="ml-1 text-red-600" aria-hidden="true">*</span>
            </label>
            <textarea
              id="motivations"
              value={motivations}
              onChange={(e) => setMotivations(e.target.value)}
              required
              minLength={20}
              maxLength={500}
              rows={5}
              placeholder="Décrivez vos motivations pour ce poste... (20 caractères minimum)"
              aria-describedby={errors.motivations ? 'motivations-error' : 'motivations-helper'}
              aria-invalid={errors.motivations ? 'true' : undefined}
              className={[
                'w-full rounded-lg border px-4 py-2.5 text-base transition-colors duration-150 resize-none',
                'focus:outline-none focus:ring-2 focus:ring-[#2557a7] focus:ring-offset-1',
                errors.motivations
                  ? 'border-red-500 bg-red-50 placeholder-red-400'
                  : 'border-slate-300 bg-white placeholder-gray-400 hover:border-slate-400',
              ].join(' ')}
            />
            <div className="flex justify-between items-start">
              {errors.motivations ? (
                <p id="motivations-error" className="text-sm text-red-600" role="alert">
                  {errors.motivations}
                </p>
              ) : (
                <p id="motivations-helper" className="text-sm text-gray-500">
                  Minimum 20 caractères
                </p>
              )}
              <span
                className={[
                  'text-xs ml-2 flex-shrink-0',
                  motivations.length > 450 ? 'text-amber-600' : 'text-gray-400',
                ].join(' ')}
                aria-live="polite"
              >
                {motivations.length}/500
              </span>
            </div>
          </div>

          {/* Website */}
          <Input
            label="Site web / Portfolio"
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            error={errors.website}
            placeholder="https://monportfolio.com"
            autoComplete="url"
            helperText="Optionnel"
          />

          {/* CV upload */}
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-700">
              CV <span className="text-gray-400 font-normal">(optionnel, max {MAX_FILE_SIZE_MB}MB)</span>
            </span>

            {cvFile ? (
              <div className="flex items-center gap-3 p-3 rounded-lg border border-green-200 bg-green-50">
                <FaFilePdf size={20} className="text-green-600 flex-shrink-0" aria-hidden="true" />
                <span className="text-sm text-green-800 font-medium flex-1 truncate">
                  {cvFile.name}
                </span>
                <button
                  type="button"
                  onClick={removeFile}
                  aria-label="Supprimer le CV"
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-green-700 hover:text-red-600 transition-colors"
                >
                  <FaTimes size={16} aria-hidden="true" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="cv-upload"
                className={[
                  'flex flex-col items-center justify-center gap-2 p-6 rounded-lg border-2 border-dashed',
                  'cursor-pointer transition-colors duration-150 min-h-[100px]',
                  fileError
                    ? 'border-red-400 bg-red-50'
                    : 'border-slate-300 bg-gray-50 hover:border-[#2557a7] hover:bg-[#2557a7]/5',
                ].join(' ')}
              >
                <FaUpload
                  size={20}
                  className={fileError ? 'text-red-400' : 'text-gray-400'}
                  aria-hidden="true"
                />
                <span className="text-sm text-gray-600 text-center">
                  Glissez votre CV ou{' '}
                  <span className="text-[#2557a7] font-medium underline">cliquez pour sélectionner</span>
                </span>
                <span className="text-xs text-gray-400">PDF, DOC, DOCX — max {MAX_FILE_SIZE_MB}MB</span>
                <input
                  ref={fileInputRef}
                  id="cv-upload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="sr-only"
                  aria-describedby={fileError ? 'cv-error' : undefined}
                />
              </label>
            )}

            {fileError && (
              <p id="cv-error" className="text-sm text-red-600" role="alert">
                {fileError}
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full"
              aria-label="Envoyer ma candidature"
            >
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma candidature'}
            </Button>
          </div>
        </form>
      </Card>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(1.5rem); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
