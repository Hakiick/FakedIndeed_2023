import './globals.css';
import AuthProvider from '@/components/AuthProvider';
import { ToastProvider } from '@/components/ui/Toast';
import DesktopNav from '@/components/layout/DesktopNav';
import MobileNav from '@/components/layout/MobileNav';
import Footer from '@/components/layout/Footer';
import OfflineBanner from '@/components/shared/OfflineBanner';
import InstallPrompt from '@/components/shared/InstallPrompt';
import ServiceWorkerRegistration from '@/components/shared/ServiceWorkerRegistration';

export const metadata = {
  title: 'FakedIndeed',
  description: 'Created by Fixari Lucas using Nextjs',
  themeColor: '#2557a7',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default' as const,
    title: 'FakedIndeed',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#2557a7" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="FakedIndeed" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body>
        <AuthProvider>
          <ToastProvider>
            <OfflineBanner />
            <DesktopNav />
            <main className="min-h-screen pb-20 md:pb-0 md:pt-16 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
              {children}
            </main>
            <Footer />
            <MobileNav />
            <InstallPrompt />
            <ServiceWorkerRegistration />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
