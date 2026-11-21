'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { ProjectWithMedia } from '@/lib/types';
import ProjectListTable from './components/ProjectListTable';
import ProjectForm from './components/ProjectForm';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  const [projects, setProjects] = useState<ProjectWithMedia[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);

  // Mode View: 'list' | 'create' | 'edit'
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
  const [editingProject, setEditingProject] = useState<ProjectWithMedia | null>(null);

  // 1. Cek sesi autentikasi Supabase
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/admin/login');
      } else {
        setSessionUser(session.user);
        setIsAuthChecking(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace('/admin/login');
      } else {
        setSessionUser(session.user);
        setIsAuthChecking(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  // 2. Fetch data proyek beserta relasi project_media
  const fetchAllProjects = useCallback(async () => {
    setIsLoadingProjects(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_media (*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching admin projects:', error);
      } else if (data) {
        // Urutkan media berdasarkan display_order
        const formatted = data.map((proj: any) => ({
          ...proj,
          project_media: (proj.project_media || []).sort(
            (a: any, b: any) => a.display_order - b.display_order
          ),
        }));
        setProjects(formatted);
      }
    } catch (err) {
      console.error('Unexpected fetch error:', err);
    } finally {
      setIsLoadingProjects(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthChecking) {
      fetchAllProjects();
    }
  }, [isAuthChecking, fetchAllProjects]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace('/admin/login');
  };

  const handleOpenCreateForm = () => {
    setEditingProject(null);
    setViewMode('form');
  };

  const handleOpenEditForm = (proj: ProjectWithMedia) => {
    setEditingProject(proj);
    setViewMode('form');
  };

  const handleFormSuccess = () => {
    setViewMode('list');
    setEditingProject(null);
    fetchAllProjects();
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#07090E] flex items-center justify-center font-mono text-cyan-400 text-xs">
        <span className="animate-pulse">[VERIFYING ROOT ADMIN ACCESS LEVEL...]</span>
      </div>
    );
  }

  // Perhitungan Metrik Ringkasan
  const totalCount = projects.length;
  const publishedCount = projects.filter((p) => p.is_published).length;
  const totalMediaUploaded = projects.reduce(
    (acc, curr) => acc + (curr.project_media?.length || 0),
    0
  );

  return (
    <main className="min-h-screen bg-[#07090E] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* Top Admin Navbar */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-6 md:px-10 py-4 bg-slate-950/90 backdrop-blur-sm border-b border-white/10 font-mono text-xs">
        <div className="flex items-center space-x-3">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#22d3ee]" />
          <span className="px-2.5 py-1 rounded bg-cyan-950/80 border border-cyan-700 text-cyan-300 font-bold tracking-wider">
            COMMAND OS &bull; ADMIN CMS v1.0
          </span>
          <span className="hidden md:inline text-slate-400">
            OPERATOR: {sessionUser?.email || 'ROOT_USER'}
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="text-slate-400 hover:text-cyan-400 transition-colors hidden sm:inline"
          >
            [3D STUDIO ROAM]
          </Link>
          <Link
            href="/categories"
            className="text-slate-400 hover:text-cyan-400 transition-colors hidden sm:inline"
          >
            [BENTO CATALOG]
          </Link>
          <button
            onClick={handleSignOut}
            className="px-3.5 py-1.5 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 hover:bg-rose-900 transition-colors"
          >
            TERMINATE SESSION
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-8 md:py-10">
        
        {/* Metrik Bar Telemetri */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
              Total Workstation Entries
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-white font-mono">{totalCount}</span>
              <span className="text-xs text-slate-400">Kegiatan Terdaftar</span>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5">
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block mb-1">
              Active Published Feeds
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-emerald-400 font-mono">{publishedCount}</span>
              <span className="text-xs text-slate-400">Siap Ditampilkan di 3D &amp; Bento</span>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-1">
              Optimized WebP Feeds
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-cyan-400 font-mono">{totalMediaUploaded}</span>
              <span className="text-xs text-slate-400">Aset Matriks Kamera</span>
            </div>
          </div>

        </div>

        {/* Konten Berdasarkan viewMode */}
        {viewMode === 'list' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Studio Portfolio Records</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Kelola dan perbarui data yang dirender pada 5 zona workstation MCR secara real-time.
                </p>
              </div>
              <button
                onClick={handleOpenCreateForm}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-colors duration-150 shadow-[0_0_15px_rgba(6,182,212,0.35)] flex items-center space-x-2"
              >
                <span>+ ADD NEW PROJECT ENTRY</span>
              </button>
            </div>

            {isLoadingProjects ? (
              <div className="py-20 text-center font-mono text-xs text-slate-500">
                LOADING PORTFOLIO ENTRIES FROM SUPABASE...
              </div>
            ) : (
              <ProjectListTable
                projects={projects}
                onEdit={handleOpenEditForm}
                onRefresh={fetchAllProjects}
              />
            )}
          </div>
        ) : (
          <ProjectForm
            initialData={editingProject}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setViewMode('list');
              setEditingProject(null);
            }}
          />
        )}

      </div>

    </main>
  );
}
