import React from 'react';
import type { Metadata, Viewport } from 'next';
import { DM_Sans, Archivo_Black } from 'next/font/google';
import '../styles/tailwind.css';
import ToastProvider from './components/ToastProvider';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const archivoblack = Archivo_Black({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-archivo-black',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'CineHub — Real-Time Movie Night Voting',
  description: 'CineHub lets film clubs and watch parties run live bracket-style voting events to pick the perfect movie to watch together.',
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${archivoblack.variable}`}>
      <body className={dmSans.className}>
        {children}
        <ToastProvider />

        <script type="module" async src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Fcinehub9990back.builtwithrocket.new&_be=https%3A%2F%2Fappanalytics.rocket.new&_v=0.1.20" />
        <script type="module" defer src="https://static.rocket.new/rocket-shot.js?v=0.0.2" /></body>
    </html>
  );
}