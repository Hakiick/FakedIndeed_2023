'use client';

import React, { useState, useEffect, useCallback, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/useBreakpoint';
import { useToast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import JobCard from '@/components/jobs/JobCard';
import { jobCreateSchema } from '@/lib/validators';
import type { Job } from '@/types/job';

// ─── Types ────────────────────────────────────────────────────────────────────

interface JobFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<Job>;
  onSuccess?: () => void;
}

interface CompanyOption {
  email: string;
  name: string;
}

interface CompanyData {
  id: number;
  name: string;
}

type FormFields = {
  title: string;
  company: string;
  location: string;
  description: string;
  jobTypes: string[];
  minSalary: string;
  maxSalary: string;
  positionLocation: 'On-Site' | 'Semi-Remote' | 'Full-Remote';
  advantages: string[];
};

type FormErrors = Partial<Record<keyof FormFields | 'general', string>>;

// ─── Constants ────────────────────────────────────────────────────────────────

const JOB_TYPES = ['CDI', 'CDD', 'Stage', 'Alternance', 'Freelance', 'Full Time', 'Part Time'] as const;
const POSITION_LOCATION_OPTIONS = ['On-Site', 'Semi-Remote', 'Full-Remote'] as const;

const STEP_LABELS = [
  'Informations',
  'Description',
  'Détails',
  'Aperçu',
] as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseAdvantages(raw: string | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === 'string');
    }
  } catch {
    // not JSON — treat as plain comma-separated list
    return raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function parseJobTypes(raw: string | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === 'string');
    }
  } catch {
    return [];
  }
  return [];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressBar({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="flex items-center gap-2 mb-6" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={totalSteps} aria-label={`Étape ${currentStep} sur ${totalSteps}`}>
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const isDone = step < currentStep;
        const isActive = step === currentStep;
        return (
          <React.Fragment key={step}>
            <div
              className={[
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 transition-all duration-200',
                isDone ? 'bg-[#2557a7] text-white' : isActive ? 'bg-[#2557a7] text-white ring-2 ring-[#2557a7] ring-offset-2' : 'bg-gray-200 text-gray-500',
              ].join(' ')}
            >
              {isDone ? '✓' : step}
            </div>
            {step < totalSteps && (
              <div className={['flex-1 h-0.5 transition-all duration-200', isDone ? 'bg-[#2557a7]' : 'bg-gray-200'].join(' ')} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function StepLabel({ currentStep }: { currentStep: number }) {
  return (
    <p className="text-sm font-medium text-gray-500 mb-4">
      {STEP_LABELS[currentStep - 1]}
    </p>
  );
}

interface TagsInputProps {
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
  placeholder?: string;
  label: string;
  error?: string;
}

function TagsInput({ tags, onAdd, onRemove, placeholder = 'Ajouter...', label, error }: TagsInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && inputValue.trim()) {
      e.preventDefault();
      onAdd(inputValue.trim());
      setInputValue('');
    }
  };

  const inputId = label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1 w-full">
      <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <div
        className={[
          'w-full min-h-[44px] rounded-lg border px-4 py-2 flex flex-wrap gap-1.5 items-center',
          error ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-white hover:border-slate-400',
        ].join(' ')}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 bg-[#2557a7]/10 text-[#2557a7] text-sm px-2 py-0.5 rounded-full border border-[#2557a7]/20"
          >
            {tag}
            <button
              type="button"
              onClick={() => onRemove(tag)}
              aria-label={`Supprimer ${tag}`}
              className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-[#2557a7]/20 transition-colors"
            >
              ×
            </button>
          </span>
        ))}
        <input
          id={inputId}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[8rem] min-h-[36px] outline-none bg-transparent text-sm text-gray-700 placeholder-gray-400"
        />
      </div>
      {error && (
        <p className="text-sm text-red-600" role="alert">{error}</p>
      )}
      <p className="text-xs text-gray-400">Appuyer sur Entrée ou virgule pour ajouter</p>
    </div>
  );
}

interface ContractToggleProps {
  selected: string[];
  onChange: (types: string[]) => void;
  error?: string;
}

function ContractToggle({ selected, onChange, error }: ContractToggleProps) {
  const toggle = (type: string) => {
    if (selected.includes(type)) {
      onChange(selected.filter((t) => t !== type));
    } else {
      onChange([...selected, type]);
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <span className="text-sm font-medium text-gray-700">
        Type de contrat <span className="ml-1 text-red-600" aria-hidden="true">*</span>
      </span>
      <div className="flex flex-wrap gap-2">
        {JOB_TYPES.map((type) => {
          const isActive = selected.includes(type);
          return (
            <button
              key={type}
              type="button"
              onClick={() => toggle(type)}
              aria-pressed={isActive}
              className={[
                'min-h-[44px] px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2557a7] focus-visible:ring-offset-1',
                isActive
                  ? 'bg-[#2557a7] text-white border-[#2557a7]'
                  : 'bg-white text-gray-700 border-slate-300 hover:border-[#2557a7] hover:text-[#2557a7]',
              ].join(' ')}
            >
              {type}
            </button>
          );
        })}
      </div>
      {error && (
        <p className="text-sm text-red-600" role="alert">{error}</p>
      )}
    </div>
  );
}

// ─── Preview ─────────────────────────────────────────────────────────────────

function JobPreview({ fields }: { fields: FormFields }) {
  const previewJob: Job = {
    id: 0,
    title: fields.title || 'Titre du poste',
    company: fields.company || 'Entreprise',
    location: fields.location || 'Localisation',
    description: fields.description || 'Description du poste...',
    jobTypes: JSON.stringify(fields.jobTypes),
    minSalary: fields.minSalary ? parseInt(fields.minSalary, 10) : 0,
    maxSalary: fields.maxSalary ? parseInt(fields.maxSalary, 10) : 0,
    advantages: JSON.stringify(fields.advantages),
    positionLocation: fields.positionLocation,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return (
    <div>
      <p className="text-sm text-gray-500 mb-3">Aperçu de votre annonce :</p>
      <JobCard job={previewJob} />
      {fields.advantages.length > 0 && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs font-medium text-gray-600 mb-2">Avantages :</p>
          <div className="flex flex-wrap gap-1.5">
            {fields.advantages.map((adv) => (
              <Badge key={adv} variant="success" size="sm">{adv}</Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Section divider ─────────────────────────────────────────────────────────

function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 my-6">
      <div className="flex-1 h-px bg-slate-200" />
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</span>
      <div className="flex-1 h-px bg-slate-200" />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function JobForm({ mode, initialData, onSuccess }: JobFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { addToast } = useToast();
  const isMobile = useIsMobile();

  // Wizard state (mobile only)
  const [currentStep, setCurrentStep] = useState(1);
  const TOTAL_STEPS = 4;

  // Company options
  const [companyOptions, setCompanyOptions] = useState<string[]>([]);

  // Form state
  const [fields, setFields] = useState<FormFields>({
    title: initialData?.title ?? '',
    company: initialData?.company ?? '',
    location: initialData?.location ?? '',
    description: initialData?.description ?? '',
    jobTypes: parseJobTypes(initialData?.jobTypes),
    minSalary: initialData?.minSalary ? String(initialData.minSalary) : '',
    maxSalary: initialData?.maxSalary ? String(initialData.maxSalary) : '',
    positionLocation: initialData?.positionLocation ?? 'On-Site',
    advantages: parseAdvantages(initialData?.advantages),
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update fields from initialData when it changes (edit mode)
  useEffect(() => {
    if (initialData) {
      setFields({
        title: initialData.title ?? '',
        company: initialData.company ?? '',
        location: initialData.location ?? '',
        description: initialData.description ?? '',
        jobTypes: parseJobTypes(initialData.jobTypes),
        minSalary: initialData.minSalary ? String(initialData.minSalary) : '',
        maxSalary: initialData.maxSalary ? String(initialData.maxSalary) : '',
        positionLocation: initialData.positionLocation ?? 'On-Site',
        advantages: parseAdvantages(initialData.advantages),
      });
    }
  }, [initialData]);

  // Fetch company options
  const fetchCompanyOptions = useCallback(async () => {
    const userType = user?.userType;
    const email = user?.email;
    if (!userType || !email) return;

    try {
      if (userType === 'admin') {
        const res = await fetch('/api/company', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch companies');
        const data = await res.json() as CompanyData[];
        const names = data.map((c) => c.name).filter(Boolean);
        setCompanyOptions(names);
      } else {
        const res = await fetch('/api/companyOptions', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch company options');
        const data = await res.json() as CompanyOption[];
        const matching = data.filter((c) => c.email === email).map((c) => c.name).filter(Boolean);
        setCompanyOptions(matching);
        // Auto-fill if only one company (use functional update to avoid stale closure)
        if (matching.length === 1) {
          setFields((prev) => prev.company ? prev : { ...prev, company: matching[0] });
        }
      }
    } catch {
      // silently ignore
    }
  }, [user]);

  useEffect(() => {
    void fetchCompanyOptions();
  }, [fetchCompanyOptions]);

  // Field update helper
  const updateField = <K extends keyof FormFields>(key: K, value: FormFields[K]) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  // Validate all fields using Zod schema
  const validateAll = (): boolean => {
    const payload = {
      title: fields.title,
      company: fields.company,
      location: fields.location,
      description: fields.description,
      jobTypes: JSON.stringify(fields.jobTypes),
      minSalary: fields.minSalary ? parseInt(fields.minSalary, 10) : undefined,
      maxSalary: fields.maxSalary ? parseInt(fields.maxSalary, 10) : undefined,
      advantages: fields.advantages.length > 0 ? JSON.stringify(fields.advantages) : undefined,
      positionLocation: fields.positionLocation,
    };

    const result = jobCreateSchema.safeParse(payload);
    if (result.success) {
      setErrors({});
      return true;
    }

    const newErrors: FormErrors = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof FormFields;
      if (key) newErrors[key] = issue.message;
    }
    // Extra: validate jobTypes array length
    if (fields.jobTypes.length === 0) {
      newErrors.jobTypes = 'Sélectionnez au moins un type de contrat';
    }
    setErrors(newErrors);
    return false;
  };

  // Validate step (mobile wizard)
  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      if (!fields.title.trim() || fields.title.trim().length < 5) {
        newErrors.title = 'Le titre doit faire au moins 5 caractères';
      }
      if (!fields.company) {
        newErrors.company = 'Sélectionnez une entreprise';
      }
      if (!fields.location.trim()) {
        newErrors.location = 'La localisation est requise';
      }
    }

    if (step === 2) {
      if (!fields.description.trim() || fields.description.trim().length < 20) {
        newErrors.description = 'La description doit faire au moins 20 caractères';
      }
    }

    if (step === 3) {
      if (fields.jobTypes.length === 0) {
        newErrors.jobTypes = 'Sélectionnez au moins un type de contrat';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS));
    }
  };

  const handleBack = () => {
    setCurrentStep((s) => Math.max(s - 1, 1));
    setErrors({});
  };

  // Submit
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!validateAll()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        ...(mode === 'edit' && initialData?.id ? { id: initialData.id } : {}),
        title: fields.title,
        company: fields.company,
        location: fields.location,
        description: fields.description,
        jobTypes: JSON.stringify(fields.jobTypes),
        minSalary: fields.minSalary ? parseInt(fields.minSalary, 10) : undefined,
        maxSalary: fields.maxSalary ? parseInt(fields.maxSalary, 10) : undefined,
        advantages: fields.advantages.length > 0 ? JSON.stringify(fields.advantages) : '',
        positionLocation: fields.positionLocation,
      };

      const res = await fetch('/api/ads', {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Failed to ${mode === 'create' ? 'create' : 'update'} job`);
      }

      addToast(mode === 'create' ? 'Offre créée !' : 'Offre mise à jour !', 'success');

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/jobs');
        router.refresh();
      }
    } catch {
      addToast("Une erreur est survenue. Veuillez réessayer.", 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Sections (shared between mobile steps and desktop) ──────────────────

  const sectionGeneralInfo = (
    <div className="flex flex-col gap-5">
      <Input
        label="Titre du poste"
        required
        value={fields.title}
        onChange={(e) => updateField('title', e.target.value)}
        error={errors.title}
        placeholder="ex: Développeur React Senior"
        minLength={5}
        maxLength={100}
      />

      <div className="flex flex-col gap-1 w-full">
        <label htmlFor="company-select" className="text-sm font-medium text-gray-700">
          Entreprise <span className="ml-1 text-red-600" aria-hidden="true">*</span>
        </label>
        <select
          id="company-select"
          value={fields.company}
          onChange={(e) => updateField('company', e.target.value)}
          aria-invalid={errors.company ? 'true' : undefined}
          className={[
            'w-full min-h-[44px] rounded-lg border px-4 py-2.5 text-base transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-[#2557a7] focus:ring-offset-1',
            errors.company
              ? 'border-red-500 bg-red-50'
              : 'border-slate-300 bg-white hover:border-slate-400',
          ].join(' ')}
        >
          <option value="">--- Sélectionnez votre entreprise ---</option>
          {companyOptions.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        {errors.company && (
          <p className="text-sm text-red-600" role="alert">{errors.company}</p>
        )}
      </div>

      <Input
        label="Localisation"
        required
        value={fields.location}
        onChange={(e) => updateField('location', e.target.value)}
        error={errors.location}
        placeholder="67000 Strasbourg"
      />
    </div>
  );

  const descriptionCharCount = fields.description.length;
  const sectionDescription = (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1 w-full">
        <label htmlFor="description" className="text-sm font-medium text-gray-700">
          Description <span className="ml-1 text-red-600" aria-hidden="true">*</span>
        </label>
        <textarea
          id="description"
          value={fields.description}
          onChange={(e) => updateField('description', e.target.value)}
          aria-invalid={errors.description ? 'true' : undefined}
          placeholder="Décrivez le poste, les responsabilités, le profil recherché..."
          minLength={20}
          maxLength={5000}
          rows={8}
          className={[
            'w-full rounded-lg border px-4 py-2.5 text-base transition-colors duration-150 resize-y',
            'focus:outline-none focus:ring-2 focus:ring-[#2557a7] focus:ring-offset-1',
            errors.description
              ? 'border-red-500 bg-red-50 placeholder-red-400'
              : 'border-slate-300 bg-white placeholder-gray-400 hover:border-slate-400',
          ].join(' ')}
        />
        <div className="flex justify-between">
          {errors.description ? (
            <p className="text-sm text-red-600" role="alert">{errors.description}</p>
          ) : (
            <span />
          )}
          <p className={['text-xs', descriptionCharCount > 4800 ? 'text-amber-600' : 'text-gray-400'].join(' ')}>
            {descriptionCharCount}/5000
          </p>
        </div>
      </div>

      <TagsInput
        label="Avantages"
        tags={fields.advantages}
        onAdd={(tag) => updateField('advantages', [...fields.advantages, tag])}
        onRemove={(tag) => updateField('advantages', fields.advantages.filter((a) => a !== tag))}
        placeholder="Ex: Tickets restaurant, Mutuelle, RTT..."
        error={errors.advantages}
      />
    </div>
  );

  const sectionDetails = (
    <div className="flex flex-col gap-5">
      <ContractToggle
        selected={fields.jobTypes}
        onChange={(types) => updateField('jobTypes', types)}
        error={errors.jobTypes}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Salaire min (€)"
          type="number"
          value={fields.minSalary}
          onChange={(e) => updateField('minSalary', e.target.value)}
          error={errors.minSalary}
          placeholder="30000"
          min={0}
        />
        <Input
          label="Salaire max (€)"
          type="number"
          value={fields.maxSalary}
          onChange={(e) => updateField('maxSalary', e.target.value)}
          error={errors.maxSalary}
          placeholder="50000"
          min={0}
        />
      </div>

      <div className="flex flex-col gap-1 w-full">
        <label htmlFor="position-location" className="text-sm font-medium text-gray-700">
          Type de remote <span className="ml-1 text-red-600" aria-hidden="true">*</span>
        </label>
        <select
          id="position-location"
          value={fields.positionLocation}
          onChange={(e) => updateField('positionLocation', e.target.value as 'On-Site' | 'Semi-Remote' | 'Full-Remote')}
          className={[
            'w-full min-h-[44px] rounded-lg border px-4 py-2.5 text-base transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-[#2557a7] focus:ring-offset-1',
            'border-slate-300 bg-white hover:border-slate-400',
          ].join(' ')}
        >
          {POSITION_LOCATION_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    </div>
  );

  // ─── Submit button ────────────────────────────────────────────────────────

  const submitButton = (
    <Button
      type="submit"
      variant="primary"
      size="lg"
      isLoading={isSubmitting}
      className="w-full"
    >
      {mode === 'create' ? 'Publier l\'offre' : 'Mettre à jour l\'offre'}
    </Button>
  );

  // ─── Mobile Wizard ────────────────────────────────────────────────────────

  if (isMobile) {
    return (
      <form onSubmit={handleSubmit} noValidate>
        <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
        <StepLabel currentStep={currentStep} />

        <div className="pb-24">
          {currentStep === 1 && sectionGeneralInfo}
          {currentStep === 2 && sectionDescription}
          {currentStep === 3 && sectionDetails}
          {currentStep === 4 && <JobPreview fields={fields} />}
        </div>

        {/* Sticky navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-3 flex gap-3 z-30">
          {currentStep > 1 && (
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleBack}
              className="flex-1"
            >
              Précédent
            </Button>
          )}

          {currentStep < TOTAL_STEPS ? (
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleNext}
              className="flex-1"
            >
              Suivant
            </Button>
          ) : (
            <div className="flex-1">
              {submitButton}
            </div>
          )}
        </div>
      </form>
    );
  }

  // ─── Desktop One-Page ─────────────────────────────────────────────────────

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main form */}
      <form onSubmit={handleSubmit} noValidate className="lg:col-span-2 space-y-2">
        <Card>
          <h2 className="text-base font-semibold text-gray-800 mb-4">Informations générales</h2>
          {sectionGeneralInfo}
        </Card>

        <SectionDivider title="" />

        <Card>
          <h2 className="text-base font-semibold text-gray-800 mb-4">Description et avantages</h2>
          {sectionDescription}
        </Card>

        <SectionDivider title="" />

        <Card>
          <h2 className="text-base font-semibold text-gray-800 mb-4">Détails du poste</h2>
          {sectionDetails}
        </Card>

        {errors.general && (
          <p className="text-sm text-red-600 px-1" role="alert">{errors.general}</p>
        )}

        <div className="pt-2">
          {submitButton}
        </div>
      </form>

      {/* Preview sidebar */}
      <aside className="lg:col-span-1">
        <div className="sticky top-20">
          <Card>
            <h2 className="text-base font-semibold text-gray-800 mb-4">Aperçu</h2>
            <JobPreview fields={fields} />
          </Card>
        </div>
      </aside>
    </div>
  );
}
