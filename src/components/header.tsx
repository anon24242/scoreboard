"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CricketBallIcon, CricketBatIcon } from './cricket-icons';

const Logo = () => (
  <Link href="/" className="flex items-center gap-2" aria-label="Cricket Central Home">
    <div className="relative h-8 w-8">
      <CricketBatIcon className="absolute h-8 w-8 origin-center -rotate-45 text-primary" />
      <CricketBallIcon className="absolute bottom-0 right-0 h-4 w-4 text-accent" />
    </div>
    <span className="text-xl font-bold tracking-tight text-primary">
      Cricket Central
    </span>
  </Link>
);

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Scoreboard' },
    { href: '/admin', label: 'Admin' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Logo />
        <nav className="ml-auto flex items-center space-x-2 sm:space-x-4">
          {navItems.map((item) => (
            <Button
              key={item.href}
              asChild
              variant="ghost"
              className={cn(
                'text-sm font-medium',
                pathname === item.href
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>
      </div>
    </header>
  );
}
