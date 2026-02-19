'use client';

import { useInstallPrompt } from '@/hooks/useInstallPrompt';

export default function InstallPrompt() {
  const { canInstall, install } = useInstallPrompt();

  if (!canInstall) return null;

  return (
    <div
      role="complementary"
      aria-label="Install FakedIndeed application"
      className="fixed bottom-20 left-4 right-4 z-50 md:bottom-6 md:left-auto md:right-6 md:w-auto"
    >
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 flex items-center gap-4">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">Installer FakedIndeed</p>
          <p className="text-xs text-gray-500 mt-0.5">Acces rapide depuis votre ecran d&apos;accueil</p>
        </div>
        <button
          onClick={install}
          aria-label="Installer l'application FakedIndeed"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium rounded-lg px-4 min-h-[44px] min-w-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <svg
            aria-hidden="true"
            className="w-4 h-4 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          <span>Installer</span>
        </button>
      </div>
    </div>
  );
}
