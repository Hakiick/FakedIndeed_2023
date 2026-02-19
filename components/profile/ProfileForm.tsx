'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import type { UserPublic } from '@/types/user';

interface ProfileFormProps {
  user: UserPublic;
  onSave: () => void;
}

interface FormErrors {
  name?: string;
  lastname?: string;
  email?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export default function ProfileForm({ user, onSave }: ProfileFormProps) {
  const { addToast } = useToast();

  const [name, setName] = useState(user.name ?? '');
  const [lastname, setLastname] = useState(user.lastname ?? '');
  const [email, setEmail] = useState(user.email ?? '');
  const [phone, setPhone] = useState(user.phone ?? '');
  const [website, setWebsite] = useState(user.website ?? '');

  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Le prénom est requis';
    }
    if (!lastname.trim()) {
      newErrors.lastname = 'Le nom est requis';
    }
    if (!email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "L'email n'est pas valide";
    }
    if (showPasswordSection && newPassword) {
      if (newPassword.length < 8) {
        newErrors.newPassword = 'Le mot de passe doit contenir au moins 8 caractères';
      }
      if (newPassword !== confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    try {
      const payload: Record<string, unknown> = {
        id: user.id,
        name: name.trim(),
        lastname: lastname.trim(),
        email: email.trim(),
        phone: phone.trim(),
        website: website.trim(),
      };

      if (showPasswordSection && newPassword) {
        payload.password = newPassword;
      }

      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to update profile');
      }

      addToast('Profil mis à jour', 'success');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordSection(false);
      onSave();
    } catch {
      addToast('Erreur lors de la mise à jour du profil', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="Prénom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          required
          placeholder="John"
          error={errors.name}
        />
        <Input
          label="Nom"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          type="text"
          required
          placeholder="Doe"
          error={errors.lastname}
        />
      </div>

      <Input
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        required
        placeholder="john.doe@example.com"
        error={errors.email}
      />

      <Input
        label="Téléphone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        type="tel"
        placeholder="+33612345678"
      />

      <Input
        label="Site web"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        type="url"
        placeholder="https://johndoe.com"
      />

      {/* Password section toggle */}
      <div>
        <button
          type="button"
          onClick={() => setShowPasswordSection((prev) => !prev)}
          className="min-h-[44px] text-sm font-medium text-[#2557a7] hover:text-[#1d4690] underline underline-offset-2 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2557a7] focus-visible:ring-offset-2 rounded"
          aria-expanded={showPasswordSection}
        >
          {showPasswordSection ? 'Annuler le changement de mot de passe' : 'Changer le mot de passe'}
        </button>
      </div>

      {showPasswordSection && (
        <Card className="bg-slate-50 border-slate-200">
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-gray-700">Nouveau mot de passe</h3>
            <Input
              label="Nouveau mot de passe"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
              placeholder="Min. 8 caractères"
              error={errors.newPassword}
              helperText="Au moins 8 caractères"
            />
            <Input
              label="Confirmation du mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              placeholder="Répétez le mot de passe"
              error={errors.confirmPassword}
            />
          </div>
        </Card>
      )}

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isLoading}
          className="w-full md:w-auto"
        >
          Enregistrer le profil
        </Button>
      </div>
    </form>
  );
}
