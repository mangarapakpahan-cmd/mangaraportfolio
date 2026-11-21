import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Master Control Room (MCR) | Mangara Ferdianto Pakpahan',
  description: 'Interactive 3D Gaming Portfolio Experience (GTA VI Style Free-Roam) & Command Center Hub.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
