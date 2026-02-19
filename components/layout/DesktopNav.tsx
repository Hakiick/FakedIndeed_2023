'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { HiUser, HiLogout, HiLogin, HiBriefcase } from 'react-icons/hi';
import { useAuth } from '@/hooks/useAuth';
import SearchBar from '@/components/shared/SearchBar';

export default function DesktopNav() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const userType = user?.userType ?? null;

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    router.push('/');
    router.refresh();
  };

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const closeDropdown = () => setDropdownOpen(false);

  return (
    <header className="hidden md:flex fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm h-16 items-center px-6 lg:px-8">
      {/* Logo */}
      <Link
        href="/"
        className="flex-shrink-0 flex items-center mr-6"
        aria-label="FakedIndeed — Accueil"
      >
        <img
          src="/fakedindeed.png"
          alt="FakedIndeed"
          className="h-8 lg:h-10 w-auto"
        />
      </Link>

      {/* SearchBar — centre */}
      <div className="flex-1 flex justify-center px-4">
        <SearchBar className="max-w-md" />
      </div>

      {/* Navigation links — droite */}
      <nav className="flex items-center space-x-2 flex-shrink-0" aria-label="Navigation principale">
        {/* Offres */}
        <Link
          href="/"
          className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 min-h-[44px] transition-colors duration-200"
        >
          <HiBriefcase size={18} aria-hidden="true" />
          <span>Offres</span>
        </Link>

        {/* Post a Job — company ou admin */}
        {(userType === 'company' || userType === 'admin') && (
          <Link
            href="/addAd"
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 min-h-[44px] transition-colors duration-200"
          >
            Post a Job
          </Link>
        )}

        {/* Admin */}
        {userType === 'admin' && (
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 min-h-[44px] transition-colors duration-200"
          >
            Admin
          </Link>
        )}

        {!isLoading && !isAuthenticated && (
          <Link
            href="/account"
            className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary-dark min-h-[44px] transition-colors duration-200"
          >
            <HiLogin size={18} aria-hidden="true" />
            <span>Login</span>
          </Link>
        )}

        {/* Avatar dropdown — connecté */}
        {!isLoading && isAuthenticated && (
          <div className="relative">
            <button
              onClick={toggleDropdown}
              aria-label="Menu utilisateur"
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
              className="flex items-center justify-center w-11 h-11 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              {user?.name?.[0]?.toUpperCase() ?? <HiUser size={20} />}
            </button>

            {dropdownOpen && (
              <>
                {/* Overlay pour fermer le dropdown */}
                <div
                  className="fixed inset-0 z-10"
                  aria-hidden="true"
                  onClick={closeDropdown}
                />
                <div className="absolute right-0 top-12 z-20 w-48 rounded-lg bg-white border border-gray-200 shadow-lg py-1">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-500">Connecté en tant que</p>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <Link
                    href="/profile"
                    onClick={closeDropdown}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <HiUser size={16} aria-hidden="true" />
                    Mon profil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    <HiLogout size={16} aria-hidden="true" />
                    Se déconnecter
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
