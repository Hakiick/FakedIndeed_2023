'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiBriefcase, HiDocumentText, HiUser, HiCog } from 'react-icons/hi';
import { useAuth } from '@/hooks/useAuth';

interface NavTab {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  visible: boolean;
}

export default function MobileNav() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const userType = user?.userType ?? null;

  const tabs: NavTab[] = [
    {
      label: 'Offres',
      href: '/',
      icon: HiBriefcase,
      visible: true,
    },
    {
      label: 'Candidatures',
      href: '/applicants',
      icon: HiDocumentText,
      visible: userType === 'company' || userType === 'admin',
    },
    {
      label: 'Profil',
      href: isAuthenticated ? '/profile' : '/account',
      icon: HiUser,
      visible: true,
    },
    {
      label: 'Admin',
      href: '/admin',
      icon: HiCog,
      visible: userType === 'admin',
    },
  ];

  const visibleTabs = tabs.filter((tab) => tab.visible);

  const isActive = (href: string): boolean => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden bg-white border-t border-gray-200 shadow-lg pb-[env(safe-area-inset-bottom)]"
      aria-label="Navigation mobile"
    >
      {visibleTabs.map((tab) => {
        const active = isActive(tab.href);
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-1 flex-col items-center justify-center min-h-[64px] min-w-[44px] py-2 transition-all duration-200 ease-in-out ${
              active
                ? 'text-primary scale-105'
                : 'text-gray-500 hover:text-gray-700 active:scale-95'
            }`}
            aria-label={tab.label}
            aria-current={active ? 'page' : undefined}
          >
            <Icon
              size={24}
              className={`transition-colors duration-200 ${
                active ? 'text-primary' : 'text-gray-500'
              }`}
            />
            <span
              className={`text-[10px] mt-1 font-medium transition-colors duration-200 ${
                active ? 'text-primary' : 'text-gray-500'
              }`}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
