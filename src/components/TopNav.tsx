'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import { Menu, X, Shield, Monitor, Vote } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const navItems = [
  { label: 'Admin Panel', href: '/', icon: Shield },
  { label: 'Voter Screen', href: '/voter-screen', icon: Vote },
  { label: 'Dashboard', href: '/dashboard', icon: Monitor },
];

export default function TopNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-16 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <AppLogo size={44} />
          <span className="font-display text-sm tracking-widest uppercase hidden sm:block" style={{ color: 'var(--foreground)' }}>
            CineHub
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems?.map((item) => {
            const Icon = item?.icon;
            const isActive = pathname === item?.href;
            return (
              <Link
                key={`nav-${item?.href}`}
                href={item?.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all-150 ${
                  isActive
                    ? 'tab-active' :'hover:bg-muted'
                }`}
                style={{
                  color: isActive ? 'var(--primary)' : 'var(--muted-foreground)',
                }}
              >
                <Icon size={15} />
                {item?.label}
              </Link>
            );
          })}
        </nav>

        {/* Phase Pill */}
        <div
          className="hidden md:flex items-center gap-2 text-xs tracking-widest uppercase px-3 py-1.5 rounded-full border"
          style={{ color: 'var(--muted-foreground)', borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}
        >
          <span className="w-2 h-2 rounded-full pulse-dot" style={{ backgroundColor: 'var(--accent)' }} />
          Live Event
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded-lg transition-all-150 hover:bg-muted"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X size={20} style={{ color: 'var(--foreground)' }} /> : <Menu size={20} style={{ color: 'var(--foreground)' }} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className="md:hidden border-t px-4 py-3 flex flex-col gap-1 fade-in"
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
        >
          {navItems?.map((item) => {
            const Icon = item?.icon;
            const isActive = pathname === item?.href;
            return (
              <Link
                key={`mobile-nav-${item?.href}`}
                href={item?.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all-150 ${
                  isActive ? 'tab-active' : 'hover:bg-muted'
                }`}
                style={{ color: isActive ? 'var(--primary)' : 'var(--muted-foreground)' }}
              >
                <Icon size={16} />
                {item?.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
