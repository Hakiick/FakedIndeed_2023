import './globals.css';
import AuthProvider from '@/components/AuthProvider';
import { ToastProvider } from '@/components/ui/Toast';
import DesktopNav from '@/components/layout/DesktopNav';
import MobileNav from '@/components/layout/MobileNav';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'FakedIndeed',
  description: 'Created by Fixari Lucas using Nextjs',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ToastProvider>
            <DesktopNav />
            <main className="min-h-screen pb-20 md:pb-0 md:pt-16 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
              {children}
            </main>
            <Footer />
            <MobileNav />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
