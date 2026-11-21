'use client';

import React from 'react';
import { ProjectWithMedia, WorkstationCategory } from '@/lib/types';
import { supabase } from '@/lib/supabaseClient';

interface ProjectListTableProps {
  projects: ProjectWithMedia[];
  onEdit: (project: ProjectWithMedia) => void;
  onRefresh: () => void;
}

const WORKSTATION_LABELS: Record<WorkstationCategory, { label: string; color: string }> = {
  led_broadcast: { label: 'LED & Broadcast', color: 'bg-rose-950/80 border-rose-800 text-rose-300' },
  foh_av: { label: 'FOH Audio-Visual', color: 'bg-amber-950/80 border-amber-800 text-amber-300' },
  uiux_motion: { label: 'UI/UX & Motion', color: 'bg-purple-950/80 border-purple-800 text-purple-300' },
  web_dev: { label: 'Web & Software', color: 'bg-cyan-950/80 border-cyan-800 text-cyan-300' },
  data_analytics: { label: 'Data Analytics', color: 'bg-emerald-950/80 border-emerald-800 text-emerald-300' },
};

export default function ProjectListTable({ projects, onEdit, onRefresh }: ProjectListTableProps) {
  
  // Toggle status Draft vs Published instan
  const togglePublishStatus = async (project: ProjectWithMedia) => {
    const nextStatus = !project.is_published;
    const { error } = await supabase
      .from('projects')
      .update({ is_published: nextStatus })
      .eq('id', project.id);

    if (error) {
      alert(`Gagal mengubah status: ${error.message}`);
    } else {
      onRefresh();
    }
  };

  // Hapus entri proyek (otomatis cascade ke project_media)
  const handleDelete = async (projectId: string, title: string) => {
    const confirmDelete = window.confirm(
      `Apakah Anda yakin ingin menghapus proyek:\n"${title}"?\nSemua foto media terkait akan ikut dihapus.`
    );
    if (!confirmDelete) return;

    const { error } = await supabase.from('projects').delete().eq('id', projectId);

    if (error) {
      alert(`Gagal menghapus proyek: ${error.message}`);
    } else {
      onRefresh();
    }
  };

  if (projects.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-12 text-center font-mono">
        <span className="text-cyan-400 text-sm block mb-2">[NO ACTIVE DATABASE ENTRIES]</span>
        <p className="text-slate-400 text-xs">Belum ada proyek yang tersimpan di database Supabase.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left font-sans text-xs">
          
          {/* Table Header */}
          <thead className="bg-slate-950/90 border-b border-white/10 font-mono text-[10px] text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="py-4 px-6">Project &amp; Hero Feed</th>
              <th className="py-4 px-6">Workstation Pillar</th>
              <th className="py-4 px-6">Role &amp; Date</th>
              <th className="py-4 px-6 text-center">Media Feeds</th>
              <th className="py-4 px-6 text-center">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-white/5">
            {projects.map((project) => {
              const heroMedia = project.project_media?.[0]?.image_url;
              const workstationBadge = WORKSTATION_LABELS[project.workstation] || {
                label: project.workstation,
                color: 'bg-slate-800 text-slate-300',
              };

              return (
                <tr key={project.id} className="hover:bg-white/[0.02] transition-colors group">
                  
                  {/* Kolom 1: Thumbnail & Judul */}
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-14 h-9 rounded-lg bg-black border border-white/10 overflow-hidden flex-shrink-0">
                        {heroMedia ? (
                          <img src={heroMedia} alt={project.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[8px] font-mono text-slate-600">
                            NO PIC
                          </div>
                        )}
                      </div>
                      <div className="max-w-xs">
                        <h4 className="font-bold text-white text-sm line-clamp-1 group-hover:text-cyan-300 transition-colors">
                          {project.title}
                        </h4>
                        <span className="text-[10px] font-mono text-slate-400 line-clamp-1">
                          {project.tech_stack?.slice(0, 3).join(', ')}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Kolom 2: Workstation Pillar */}
                  <td className="py-4 px-6">
                    <span className={`inline-block px-2.5 py-1 rounded-full border text-[10px] font-mono font-bold ${workstationBadge.color}`}>
                      {workstationBadge.label}
                    </span>
                  </td>

                  {/* Kolom 3: Role & Date */}
                  <td className="py-4 px-6">
                    <div className="text-slate-200 font-medium line-clamp-1">{project.role}</div>
                    <div className="text-[10px] font-mono text-slate-400">{project.event_date}</div>
                  </td>

                  {/* Kolom 4: Media Count */}
                  <td className="py-4 px-6 text-center">
                    <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/80 font-mono text-[10px] text-cyan-300">
                      {project.project_media?.length || 0}/5 CAM
                    </span>
                  </td>

                  {/* Kolom 5: Status Toggle */}
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => togglePublishStatus(project)}
                      className={`px-3 py-1 rounded-full font-mono text-[10px] font-bold border transition-all ${
                        project.is_published
                          ? 'bg-emerald-950/70 border-emerald-500/80 text-emerald-300 hover:bg-emerald-900'
                          : 'bg-amber-950/70 border-amber-500/80 text-amber-300 hover:bg-amber-900'
                      }`}
                    >
                      {project.is_published ? '● PUBLISHED' : '○ DRAFT'}
                    </button>
                  </td>

                  {/* Kolom 6: Actions */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onEdit(project)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 font-mono text-xs text-cyan-400 transition-colors"
                      >
                        EDIT
                      </button>
                      <button
                        onClick={() => handleDelete(project.id, project.title)}
                        className="px-3 py-1.5 rounded-lg bg-rose-950/50 hover:bg-rose-900/80 border border-rose-800/80 font-mono text-xs text-rose-300 transition-colors"
                      >
                        DELETE
                      </button>
                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>

        </table>
      </div>
    </div>
  );
}
