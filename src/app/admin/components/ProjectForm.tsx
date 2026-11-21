'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { WorkstationCategory, ProjectWithMedia } from '@/lib/types';
import { compressImageToWebP, uploadProjectMediaToStorage } from '@/hooks/useImageOptimizer';

interface MediaSlotState {
  display_order: number;
  camera_tag: string;
  caption: string;
  image_url: string;
  file?: File;
  originalSizeKb?: number;
  optimizedSizeKb?: number;
  isUploading?: boolean;
}

const DEFAULT_SLOTS: MediaSlotState[] = [
  { display_order: 1, camera_tag: 'CAM 01: HERO ACTION', caption: '', image_url: '' },
  { display_order: 2, camera_tag: 'CAM 02: STAGE VIEW', caption: '', image_url: '' },
  { display_order: 3, camera_tag: 'CAM 03: CONSOLE RACK', caption: '', image_url: '' },
  { display_order: 4, camera_tag: 'CAM 04: BACKSTAGE RIG', caption: '', image_url: '' },
  { display_order: 5, camera_tag: 'CAM 05: AUDIENCE ANGLE', caption: '', image_url: '' },
];

interface ProjectFormProps {
  initialData?: ProjectWithMedia | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProjectForm({ initialData, onSuccess, onCancel }: ProjectFormProps) {
  const [workstation, setWorkstation] = useState<WorkstationCategory>('foh_av');
  const [title, setTitle] = useState('');
  const [role, setRole] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [summary, setSummary] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  const [mediaSlots, setMediaSlots] = useState<MediaSlotState[]>(DEFAULT_SLOTS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Prefill jika mode edit
  useEffect(() => {
    if (initialData) {
      setWorkstation(initialData.workstation);
      setTitle(initialData.title);
      setRole(initialData.role);
      setEventDate(initialData.event_date);
      setSummary(initialData.summary);
      setTechStackInput(initialData.tech_stack.join(', '));
      setIsPublished(initialData.is_published);

      if (initialData.project_media && initialData.project_media.length > 0) {
        const mapped = DEFAULT_SLOTS.map((defSlot) => {
          const found = initialData.project_media.find((m) => m.display_order === defSlot.display_order);
          if (found) {
            return {
              display_order: found.display_order,
              camera_tag: found.camera_tag,
              caption: found.caption || '',
              image_url: found.image_url,
            };
          }
          return defSlot;
        });
        setMediaSlots(mapped);
      }
    }
  }, [initialData]);

  // Handle upload & kompresi foto per slot
  const handleFileChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    try {
      setStatusMessage(`Mengompresi slot ${index + 1} ke format WebP...`);
      const { file, previewUrl, originalSizeKb, optimizedSizeKb } = await compressImageToWebP(rawFile);

      setMediaSlots((prev) => {
        const next = [...prev];
        next[index] = {
          ...next[index],
          file,
          image_url: previewUrl,
          originalSizeKb,
          optimizedSizeKb,
        };
        return next;
      });
      setStatusMessage('');
    } catch (err: any) {
      alert(`Error kompresi gambar: ${err.message}`);
      setStatusMessage('');
    }
  };

  // Reorder urutan slot (Swap up/down)
  const moveSlot = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= mediaSlots.length) return;

    setMediaSlots((prev) => {
      const next = [...prev];
      const temp = { ...next[index] };
      next[index] = { ...next[targetIndex], display_order: index + 1 };
      next[targetIndex] = { ...temp, display_order: targetIndex + 1 };
      return next;
    });
  };

  // Hapus foto di slot tertentu
  const clearSlot = (index: number) => {
    setMediaSlots((prev) => {
      const next = [...prev];
      next[index] = {
        ...DEFAULT_SLOTS[index],
        display_order: index + 1,
      };
      return next;
    });
  };

  // Simpan data ke Supabase (tabel projects dan project_media)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !role || !summary) {
      alert('Mohon lengkapi judul, role, dan ringkasan proyek.');
      return;
    }

    setIsSubmitting(true);
    setStatusMessage('Menyimpan data proyek ke Supabase...');

    try {
      const techArray = techStackInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const projectPayload = {
        workstation,
        title,
        role,
        event_date: eventDate,
        summary,
        tech_stack: techArray,
        is_published: isPublished,
      };

      let projectId = initialData?.id;

      if (projectId) {
        // Mode Update
        const { error: updateError } = await supabase
          .from('projects')
          .update(projectPayload)
          .eq('id', projectId);

        if (updateError) throw updateError;
      } else {
        // Mode Insert
        const { data: newProj, error: insertError } = await supabase
          .from('projects')
          .insert(projectPayload)
          .select('id')
          .single();

        if (insertError) throw insertError;
        projectId = newProj.id;
      }

      // Upload media file baru ke Supabase Storage & perbarui tabel project_media
      setStatusMessage('Mengunggah & menyinkronkan aset matriks gambar...');

      const activeSlots = mediaSlots.filter((slot) => slot.image_url);

      // Hapus media lama jika update
      if (initialData?.id) {
        await supabase.from('project_media').delete().eq('project_id', projectId);
      }

      for (const slot of activeSlots) {
        let finalImageUrl = slot.image_url;

        // Jika ada file baru yang perlu diupload ke storage
        if (slot.file) {
          const slug = title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30);
          finalImageUrl = await uploadProjectMediaToStorage(slot.file, slug, slot.display_order);
        }

        const { error: mediaError } = await supabase.from('project_media').insert({
          project_id: projectId,
          image_url: finalImageUrl,
          camera_tag: slot.camera_tag || `CAM 0${slot.display_order}`,
          caption: slot.caption || null,
          display_order: slot.display_order,
        });

        if (mediaError) {
          console.error('Error insert project_media:', mediaError);
        }
      }

      setStatusMessage('Data berhasil disinkronkan ke MCR Studio!');
      setTimeout(() => {
        onSuccess();
      }, 500);

    } catch (err: any) {
      console.error('Submit failure:', err);
      alert(`Gagal menyimpan proyek: ${err.message || 'Kesalahan tak terduga'}`);
    } finally {
      setIsSubmitting(false);
      setStatusMessage('');
    }
  };

  return (
    <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 md:p-8 font-sans text-slate-100 shadow-2xl">
      
      {/* Header Form */}
      <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-6">
        <div>
          <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest block mb-1">
            COMMAND OS &bull; PROJECT CMS PIPELINE
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            {initialData ? 'Edit Portfolio Entry' : 'Create New Portfolio Workstation Entry'}
          </h2>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-slate-300 hover:text-white transition-colors"
        >
          [ESC] CANCEL
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Row 1: Target Workstation & Status Publish */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-mono uppercase text-slate-400 mb-2">
              Target Workstation Pillar (Zona MCR Hangar)
            </label>
            <select
              value={workstation}
              onChange={(e) => setWorkstation(e.target.value as WorkstationCategory)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white font-mono text-xs focus:border-cyan-500 outline-none"
            >
              <option value="foh_av">Zona 2: FOH Audio-Visual &amp; Stage (Meja Konsol X32)</option>
              <option value="led_broadcast">Zona 1: Operator LED &amp; Broadcast (Main LED Wall)</option>
              <option value="uiux_motion">Zona 3: Designer / UI/UX &amp; Motion (Portrait Displays)</option>
              <option value="web_dev">Zona 4: Web Dev &amp; Software Lab (Dual Curved CLI)</option>
              <option value="data_analytics">Zona 5: Data Analytics Hub (Telemetry Wall)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-2">
              Publish Status
            </label>
            <button
              type="button"
              onClick={() => setIsPublished(!isPublished)}
              className={`w-full py-3 px-4 rounded-xl font-mono text-xs font-bold transition-colors duration-150 border flex items-center justify-center space-x-2 ${
                isPublished
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                  : 'bg-amber-950/60 border-amber-500 text-amber-300'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isPublished ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span>{isPublished ? 'LIVE PUBLISHED' : 'DRAFT MODE'}</span>
            </button>
          </div>
        </div>

        {/* Row 2: Judul Proyek & Role */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-2">
              Judul Kegiatan / Proyek
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Live Production Wisuda ITPLN ke-46"
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-cyan-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-2">
              Peran Teknis (Role)
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Contoh: Lead FOH &amp; Live Event Technical Operator"
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-cyan-500 outline-none"
            />
          </div>
        </div>

        {/* Row 3: Periode & Tech Stack Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-2">
              Periode / Tanggal Pelaksanaan
            </label>
            <input
              type="text"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              placeholder="Contoh: Oktober 2024"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-cyan-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-2">
              Tech Stack &amp; Hardware Rig (Pisahkan Koma)
            </label>
            <input
              type="text"
              value={techStackInput}
              onChange={(e) => setTechStackInput(e.target.value)}
              placeholder="Behringer X32, Dante, OBS Studio, Sony A7 III"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-cyan-500 outline-none"
            />
          </div>
        </div>

        {/* Row 4: Summary */}
        <div>
          <label className="block text-xs font-mono uppercase text-slate-400 mb-2">
            Ringkasan Eksekusi Teknis &amp; Dampak
          </label>
          <textarea
            rows={3}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Rangkuman tantangan sinyal, routing kabel, manajemen multi-cam, dan keandalan operasional..."
            required
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white text-xs leading-relaxed focus:border-cyan-500 outline-none"
          />
        </div>

        {/* Row 5: Dedicated 5-Slot Media Matrix Uploader */}
        <div className="pt-4 border-t border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                Dedicated 5-Slot Media Matrix (Auto WebP &lt; 200 KB)
              </span>
              <p className="text-[11px] text-slate-400">
                Slot 1: Hero Action Shot &bull; Slot 2–5: Supporting Angles (Panggung, Konsol, Rack Rigging)
              </p>
            </div>
            {statusMessage && (
              <span className="text-xs font-mono text-amber-400 animate-pulse">
                {statusMessage}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {mediaSlots.map((slot, idx) => (
              <div
                key={slot.display_order}
                className="bg-slate-950/90 border border-white/10 rounded-2xl p-3.5 flex flex-col justify-between space-y-3 relative group"
              >
                {/* Header Slot & Reorder Buttons */}
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-[10px] font-mono text-cyan-300 font-bold">
                    SLOT 0{slot.display_order}
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => moveSlot(idx, 'up')}
                      disabled={idx === 0}
                      className="w-5 h-5 flex items-center justify-center rounded bg-black/40 hover:bg-slate-800 text-[10px] text-slate-300 disabled:opacity-20 transition-colors"
                      title="Geser Prioritas Naik"
                    >
                      &uarr;
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSlot(idx, 'down')}
                      disabled={idx === mediaSlots.length - 1}
                      className="w-5 h-5 flex items-center justify-center rounded bg-black/40 hover:bg-slate-800 text-[10px] text-slate-300 disabled:opacity-20 transition-colors"
                      title="Geser Prioritas Turun"
                    >
                      &darr;
                    </button>
                    {slot.image_url && (
                      <button
                        type="button"
                        onClick={() => clearSlot(idx)}
                        className="w-5 h-5 flex items-center justify-center rounded bg-rose-950/80 hover:bg-rose-900 text-[10px] text-rose-300 ml-1"
                        title="Hapus Foto"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                </div>

                {/* Image Preview Box */}
                <div className="relative aspect-video rounded-xl bg-white/[0.02] border border-dashed border-white/20 overflow-hidden flex items-center justify-center">
                  {slot.image_url ? (
                    <img src={slot.image_url} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-2">
                      <span className="text-[10px] font-mono text-slate-500 block">NO MEDIA</span>
                    </div>
                  )}

                  {slot.optimizedSizeKb && (
                    <span className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-[8px] font-mono text-emerald-300">
                      {slot.optimizedSizeKb} KB WebP
                    </span>
                  )}
                </div>

                {/* Input Camera Tag */}
                <div>
                  <label className="block text-[9px] font-mono uppercase text-slate-400 mb-1">
                    Camera Feed Tag
                  </label>
                  <input
                    type="text"
                    value={slot.camera_tag}
                    onChange={(e) => {
                      const next = [...mediaSlots];
                      next[idx].camera_tag = e.target.value;
                      setMediaSlots(next);
                    }}
                    placeholder="CAM 01: SETUP"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-[10px] font-mono text-cyan-300 focus:border-cyan-500 outline-none"
                  />
                </div>

                {/* Input Caption */}
                <div>
                  <label className="block text-[9px] font-mono uppercase text-slate-400 mb-1">
                    Caption
                  </label>
                  <input
                    type="text"
                    value={slot.caption}
                    onChange={(e) => {
                      const next = [...mediaSlots];
                      next[idx].caption = e.target.value;
                      setMediaSlots(next);
                    }}
                    placeholder="Perspektif konsol mixer..."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-[10px] text-slate-200 focus:border-cyan-500 outline-none"
                  />
                </div>

                {/* File Picker */}
                <div>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={(e) => handleFileChange(idx, e)}
                    className="w-full text-[9px] text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[9px] file:bg-cyan-950 file:text-cyan-300 file:font-mono cursor-pointer"
                  />
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-white/10">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-xl bg-black/40 hover:bg-slate-800 font-mono text-xs text-slate-300 transition-colors"
          >
            CANCEL
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-colors duration-150 shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-50"
          >
            {isSubmitting ? 'SYNCING TO STUDIO...' : initialData ? 'UPDATE ENTRY' : 'PUBLISH ENTRY'}
          </button>
        </div>

      </form>
    </div>
  );
}
