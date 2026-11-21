'use client';

import { supabase } from '@/lib/supabaseClient';

export interface ImageOptimizationResult {
  file: File;
  previewUrl: string;
  originalSizeKb: number;
  optimizedSizeKb: number;
}

/**
 * Mengompresi dan mengonversi gambar (PNG/JPEG) otomatis menjadi format WebP
 * Target: Max Width 1440px, Quality 80%, Ukuran file < 200 KB
 */
export async function compressImageToWebP(
  file: File,
  maxWidth = 1440,
  initialQuality = 0.8
): Promise<ImageOptimizationResult> {
  return new Promise((resolve, reject) => {
    // Validasi file tipe gambar
    if (!file.type.startsWith('image/')) {
      return reject(new Error('File yang diunggah harus berformat gambar.'));
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Downscale rasio proporsional jika melebihi batas maxWidth
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Gagal mendapatkan konteks 2D Canvas.'));
        }

        // Gambar ke canvas dengan interpolasi halus
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Fungsi rekursif untuk memastikan ukuran < 200 KB jika memungkinkan
        const exportBlob = (quality: number) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                return reject(new Error('Konversi Blob Canvas ke WebP gagal.'));
              }

              const sizeKb = Math.round(blob.size / 1024);

              // Jika ukuran masih > 200 KB dan quality masih bisa diturunkan
              if (sizeKb > 200 && quality > 0.55) {
                exportBlob(quality - 0.1);
                return;
              }

              const cleanBaseName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
              const finalFileName = `${cleanBaseName}_${Date.now()}.webp`;

              const optimizedFile = new File([blob], finalFileName, {
                type: 'image/webp',
                lastModified: Date.now(),
              });

              const previewUrl = URL.createObjectURL(optimizedFile);

              resolve({
                file: optimizedFile,
                previewUrl,
                originalSizeKb: Math.round(file.size / 1024),
                optimizedSizeKb: sizeKb,
              });
            },
            'image/webp',
            quality
          );
        };

        exportBlob(initialQuality);
      };

      img.onerror = (err) => reject(new Error('Gagal memproses aset gambar: ' + err));
    };

    reader.onerror = (err) => reject(new Error('Gagal membaca file gambar: ' + err));
  });
}

/**
 * Mengunggah file WebP hasil kompresi ke Supabase Storage bucket 'project-media'
 */
export async function uploadProjectMediaToStorage(
  file: File,
  projectSlug: string,
  slotIndex: number
): Promise<string> {
  const filePath = `projects/${projectSlug}/slot_${slotIndex}_${Date.now()}.webp`;

  const { data, error } = await supabase.storage
    .from('project-media')
    .upload(filePath, file, {
      cacheControl: '31536000', // 1 tahun cache
      upsert: true,
      contentType: 'image/webp',
    });

  if (error) {
    throw new Error(`Gagal upload media ke Supabase Storage: ${error.message}`);
  }

  // Dapatkan URL publik file
  const { data: publicUrlData } = supabase.storage
    .from('project-media')
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}
