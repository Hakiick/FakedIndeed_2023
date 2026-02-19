'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const email = typeof window !== 'undefined' ? sessionStorage.getItem('yourEmail') : null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email ?? '', password);

      if (success) {
        router.push('/');
      } else {
        alert('Wrong password');
        setIsLoading(false);
      }
    } catch {
      setIsLoading(false);
    }
  };

  const handleForget = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    alert('Password reset is not available.');
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
              <h1>We&apos;re glad to see you again</h1>
            </div>
            <div className="font-light flex">
              <p>Login as</p> <b className="pl-1">{email}</b>.
              <Link className="text-blue-900 pl-1 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2557a7] focus-visible:ring-offset-1 rounded" href="/account">
                It is not you?
              </Link>
            </div>
            <hr className="h-px my-2 bg-gray-200" />
            <div>
              <form onSubmit={handleSubmit}>
                <label htmlFor="login-password" className="text-xl font-semibold">
                  Password: <span className="text-red-600" aria-hidden="true">*</span>
                </label>
                <input
                  id="login-password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className="border border-slate-500 px-8 py-2 required-custom-input min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2557a7]"
                  type="password"
                  required
                  aria-required="true"
                />
                <div className="flex flex-col pt-8 items-center justify-center">
                  <div className="w-full">
                    <button
                      type="submit"
                      className={`bg-green-600 rounded-lg font-bold text-white py-3 px-6 w-full min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 ${
                        isLoading ? 'cursor-not-allowed opacity-50' : ''
                      }`}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Loading...' : 'Login'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="flex flex-col pt-8 items-center justify-center">
              <div className="w-full">
                <button
                  onClick={handleForget}
                  className="text-blue-900 py-3 px-6 w-full min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2557a7] focus-visible:ring-offset-1 rounded"
                >
                  Forgot your password?
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
