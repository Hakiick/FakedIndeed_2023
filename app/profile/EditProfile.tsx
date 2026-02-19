'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/types/user';

interface EditProfileProps {
  user: User;
}

export default function EditProfile({ user }: EditProfileProps) {
  const { id, email, name, lastname, phone, website } = user;

  const [newEmail, setNewEmail] = useState(email ?? '');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState(name ?? '');
  const [newLastname, setNewLastname] = useState(lastname ?? '');
  const [newPhone, setNewPhone] = useState(phone ?? '');
  const [newWebsite, setNewWebsite] = useState(website ?? '');

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const updatePayload: Record<string, unknown> = {
        id,
        email: newEmail,
        name: newName,
        lastname: newLastname,
        phone: newPhone,
        website: newWebsite,
      };

      if (newPassword.length > 0) {
        updatePayload.password = newPassword;
      }

      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(updatePayload),
      });

      if (!res.ok) {
        throw new Error('Failed to update user');
      }

      router.refresh();
      router.push('/');
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label>
          Name: <span className="text-red-600">*</span>
        </label>
        <input
          onChange={(e) => setNewName(e.target.value)}
          value={newName}
          className="border border-slate-500 px-8 py-2 required-custom-input"
          type="text"
          required
          placeholder="Doe"
        />
        <label htmlFor="lastname">
          Lastname: <span className="text-red-600">*</span>
        </label>
        <input
          onChange={(e) => setNewLastname(e.target.value)}
          value={newLastname}
          className="border border-slate-500 px-8 py-2 required-custom-input"
          type="text"
          required
          placeholder="John"
        />
        <label>
          Email: <span className="text-red-600">*</span>
        </label>
        <input
          onChange={(e) => setNewEmail(e.target.value)}
          value={newEmail}
          className="border border-slate-500 px-8 py-2 required-custom-input"
          type="email"
          required
          placeholder="john.doe@example.com"
        />
        <label>Password (leave empty to keep current):</label>
        <input
          onChange={(e) => setNewPassword(e.target.value)}
          value={newPassword}
          className="border border-slate-500 px-8 py-2 required-custom-input"
          type="password"
          placeholder="New password"
        />
        <label>Phone:</label>
        <input
          onChange={(e) => setNewPhone(e.target.value)}
          value={newPhone}
          className="border border-slate-500 px-8 py-2 required-custom-input"
          type="tel"
          minLength={12}
          maxLength={12}
          placeholder="+33612345678"
        />
        <label>Website:</label>
        <input
          onChange={(e) => setNewWebsite(e.target.value)}
          value={newWebsite}
          className="border border-slate-500 px-8 py-2 required-custom-input"
          type="url"
          pattern="http.*"
          placeholder="https://johndoe.com"
        />
        <div className="flex flex-col py-8 items-center justify-center">
          <div className="w-1/2">
            <button
              type="submit"
              className={`bg-green-600 rounded-lg font-bold text-white py-3 px-6 w-full ${
                isLoading ? 'cursor-not-allowed opacity-50' : ''
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Save Profile'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
