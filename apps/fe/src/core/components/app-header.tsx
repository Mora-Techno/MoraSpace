'use client';

import { Leaf, Menu, Moon, User, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useTheme } from '@/core/providers/theme.provider';
import { cn } from '@/utils/classname';

interface AppHeaderProps {
  state?: {
    isScrolled: boolean;
    setIsScrolled: React.Dispatch<React.SetStateAction<boolean>>;
    pathname: string;
  };
}

export default function AppHeader({ state }: AppHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const currentPathname = usePathname();

  const isScrolled = state ? state.isScrolled : scrolled;

  useEffect(() => {
    const handleScroll = () => {
      const isTop = window.scrollY > 20;
      setScrolled(isTop);
      if (state?.setIsScrolled) {
        state.setIsScrolled(isTop);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [state]);

  const navLinks = [
    { title: 'Beranda', href: '/home' },
    { title: 'Harga', href: '/pricing' },
    { title: 'Blog', href: '/blogs' },
    { title: 'Sumber Daya', href: '/resource' },
  ];

  const isLinkActive = (href: string) => {
    if (href === '/home') {
      return currentPathname === '/' || currentPathname === '/home';
    }
    return currentPathname?.startsWith(href);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-8 py-3.5',
        isScrolled || mobileMenuOpen
          ? 'bg-background/90 backdrop-blur-md border-b border-border/50 shadow-sm'
          : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Brand Logo */}
        <Link href="/home" className="flex items-center gap-2.5 group">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
            <Image
              src="/images/logo.png"
              alt="Spaces Logo"
              width={24}
              height={24}
              className="rounded-full aspect-square"
            />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-lg tracking-tight text-foreground">Spaces</span>
            <span className="text-xs font-medium text-muted-foreground">by Mora</span>
          </div>
        </Link>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium bg-muted/40 border border-border/50 rounded-full px-2 py-1 shadow-xs backdrop-blur-sm">
          {navLinks.map((item) => {
            const active = isLinkActive(item.href);
            return (
              <Link
                key={item.title}
                href={item.href}
                className={cn(
                  'rounded-full px-3.5 py-1.5 transition-all text-xs font-semibold',
                  active
                    ? 'bg-card text-foreground shadow-xs border border-border/60'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card/50',
                )}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Pill Indicator & Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-1.5 rounded-full border border-border/70 bg-card/70 px-3 py-1.5 text-xs font-semibold text-foreground transition-all hover:bg-muted/80 shadow-xs cursor-pointer select-none"
            title={theme === 'dark' ? 'Beralih ke Botanical Light' : 'Beralih ke Midnight Calm'}
          >
            {theme === 'dark' ? (
              <>
                <Moon className="size-3.5 text-primary" />
                <span className="hidden sm:inline">Midnight Calm</span>
              </>
            ) : (
              <>
                <Leaf className="size-3.5 text-primary" />
                <span className="hidden sm:inline">Botanical</span>
              </>
            )}
          </button>

          {/* User profile icon */}
          <Link
            href="/login"
            className="hidden sm:flex size-8 items-center justify-center rounded-full border border-border/70 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Akun Saya"
          >
            <User className="size-4" />
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex size-9 items-center justify-center rounded-full border border-border/70 bg-card/70 text-foreground transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 rounded-2xl border border-border/70 bg-card/95 p-4 shadow-xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
          <nav className="flex flex-col gap-1">
            {navLinks.map((item) => {
              const active = isLinkActive(item.href);
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'rounded-xl px-4 py-2.5 text-sm font-medium transition-colors flex items-center justify-between',
                    active
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  <span>{item.title}</span>
                  {active && <span className="size-1.5 rounded-full bg-primary" />}
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 pt-3 border-t border-border/50 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Masuk
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
