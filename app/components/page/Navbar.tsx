'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthButtons from '../AuthButtons';
import Sidebar from '../Sidebar';
import LogoutButtons from '../LogoutButtons';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const { isAuthenticated, logout, isLoading } = useAuth();
  const router = useRouter();

  const logoutClick = async () => {
    await logout();
    router.push('/');
    router.refresh();
  };

  return (
    <nav className="flex justify-between items-center px-8 py-3">
      <Link className="text-white font-bold" href="/">
        <img className="h-5 lg:h-10" src="fakedindeed.png" alt="FakedIndeed" />
      </Link>
      <div className="flex items-center space-x-4">
        {!isLoading && !isAuthenticated && <AuthButtons />}
        {!isLoading && isAuthenticated && <LogoutButtons Logout={logoutClick} />}
        <Sidebar />
      </div>
    </nav>
  );
}
