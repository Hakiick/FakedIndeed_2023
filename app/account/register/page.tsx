'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function RegisterPage() {
  const accountOptions: Array<'individual' | 'company'> = ['individual', 'company'];
  const router = useRouter();
  const { login } = useAuth();

  const [userType, setUserType] = useState<'individual' | 'company'>(accountOptions[0]);
  const [isLoading, setIsLoading] = useState(false);

  const email = typeof window !== 'undefined' ? sessionStorage.getItem('yourEmail') : null;
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          userType,
          name: '',
          lastname: '',
        }),
      });

      if (res.ok) {
        await login(email ?? '', password);
        router.push('/profile');
      } else {
        throw new Error('Failed to create an user');
      }
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center z-50 bg-gray-100 bg-opacity-100">
        <Link className="fixed top-44" href="/" aria-label="FakedIndeed — Retour à l'accueil">
          <Image src="/fakedindeed.png" alt="FakedIndeed" width={160} height={64} className="h-16 w-auto" />
        </Link>
        <div className="bg-white rounded-lg p-4 shadow-lg w-96 flex flex-col justify-between">
          <div>
            <div className="text-xl font-semibold pb-3">
              <h1>Welcome!</h1>
            </div>
            <div className="font-light flex">
              <p>Create an account as</p> <b className="pl-1">{email}</b>.
              <Link
                className="text-blue-900 pl-1 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2557a7] focus-visible:ring-offset-1 rounded"
                href="/account"
              >
                It is not you?
              </Link>
            </div>
            <hr className="h-px my-2 bg-gray-200" />
            <div>
              <form onSubmit={handleSubmit}>
                <label htmlFor="register-password" className="text-xl font-semibold">
                  Password: <span className="text-red-600" aria-hidden="true">*</span>
                </label>
                <input
                  id="register-password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className="border border-slate-500 px-8 py-2 required-custom-input min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2557a7]"
                  type="password"
                  required
                  aria-required="true"
                />
                <label htmlFor="register-account-type" className="text-xl font-semibold">
                  Create an account as: <span className="text-red-600" aria-hidden="true">*</span>
                </label>
                <select
                  id="register-account-type"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value as 'individual' | 'company')}
                  className="border border-slate-500 px-3 py-2 required-custom-input min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2557a7]"
                >
                  {accountOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <div className="font-light text-xs py-6">
                  <p>
                    By creating your account, you acknowledge and agree that the companies and advertisements on this
                    site are fictitious and are solely included for the purpose of a study project.
                  </p>
                </div>
                <div className="flex flex-col pt-8 items-center justify-center">
                  <div className="w-full">
                    <button
                      type="submit"
                      className={`bg-green-600 rounded-lg font-bold text-white py-3 px-6 w-full min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 ${
                        isLoading ? 'cursor-not-allowed opacity-50' : ''
                      }`}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Loading...' : 'Create an account'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
