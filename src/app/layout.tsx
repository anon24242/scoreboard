import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/header';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Cricket Central',
  description: 'Live cricket scores and updates',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const session = cookieStore.get('session')?.value;
  const isLoggedIn = session === 'admin-logged-in';

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn('min-h-screen bg-background antialiased', 'font-body')}
      >
        {isLoggedIn ? <Header /> : null}
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
