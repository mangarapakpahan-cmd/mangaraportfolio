'use client';

import React, { useState } from 'react';
import { ProjectWithMedia } from '@/lib/types';

interface DownloadPdfButtonProps {
  projects: ProjectWithMedia[];
  activeCategoryName?: string;
  isFullPortfolio?: boolean;
  label?: string;
  className?: string;
}

export default function DownloadPdfButton({
  projects,
  activeCategoryName = 'Technical Dossier',
  isFullPortfolio = false,
  label,
  className = '',
}: DownloadPdfButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDownload = async () => {
    if (isGenerating || projects.length === 0) return;
    setIsGenerating(true);
    setProgress(15);

    try {
      // Lazy-load @react-pdf/renderer dan komponen dokumen secara dinamis di browser
      setProgress(35);
      const { pdf } = await import('@react-pdf/renderer');
      const { default: CategoryDeckDocument } = await import('./CategoryDeckDocument');

      setProgress(65);
      const blob = await pdf(
        <CategoryDeckDocument
          projects={projects}
          activeCategoryName={activeCategoryName}
          isFullPortfolio={isFullPortfolio}
        />
      ).toBlob();

      setProgress(90);
      // Buat anchor element dan picu download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const cleanName = activeCategoryName.replace(/[^a-zA-Z0-9]/g, '_');
      const filename = isFullPortfolio
        ? `Mangara_Pakpahan_Full_Portfolio_Deck.pdf`
        : `Mangara_Pakpahan_${cleanName}_Brief.pdf`;

      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF Generation Failure:', error);
      alert('Gagal menghasilkan dokumen PDF. Pastikan aset gambar aktif.');
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const defaultText = isFullPortfolio
    ? 'Export Full Portfolio (PDF)'
    : 'Export Category Brief ↓';

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating || projects.length === 0}
      className={`relative inline-flex items-center justify-center font-mono text-xs font-semibold transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isGenerating ? (
        <span className="flex items-center space-x-2 text-cyan-400">
          <svg className="animate-spin h-3.5 w-3.5 text-cyan-400" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span>[GENERATING PDF... {progress}%]</span>
        </span>
      ) : (
        <span>{label || defaultText}</span>
      )}
    </button>
  );
}
