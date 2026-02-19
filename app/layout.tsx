import './globals.css';
import Navbar from './components/page/Navbar';
import AuthProvider from '@/components/AuthProvider';
import { ToastProvider } from '@/components/ui/Toast';

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
            <div className="max-w-8xl mx-auto p-4">
              <Navbar />
              <hr className="h-px my-2 bg-gray-200" />
              <div className="max-w-8xl mx-auto p-2">{children}</div>
            </div>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
