'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function Footer() {
  const { user } = useAuth();
  const userType = user?.userType ?? null;

  return (
    <footer className="bg-gray-800 text-white mt-auto mb-16 md:mb-0">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h2 className="text-base font-semibold mb-3 text-gray-100">À propos</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              FakedIndeed est une plateforme de recherche d&apos;emploi conçue pour connecter
              les candidats aux meilleures opportunités professionnelles.
            </p>
          </div>

          {/* Links */}
          <div>
            <h2 className="text-base font-semibold mb-3 text-gray-100">Liens</h2>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Offres d&apos;emploi
                </Link>
              </li>
              {userType !== null && (
                <li>
                  <Link
                    href="/profile"
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    Profil
                  </Link>
                </li>
              )}
              {userType === 'admin' && (
                <li>
                  <Link
                    href="/admin"
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    Admin
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-base font-semibold mb-3 text-gray-100">Contact</h2>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:contact@fakedindeed.com"
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  contact@fakedindeed.com
                </a>
              </li>
              <li>
                <span className="text-sm text-gray-400">Bruxelles, Belgique</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-700 text-center">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} FakedIndeed. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
