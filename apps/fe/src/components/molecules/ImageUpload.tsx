'use client';

import {
  AlertCircle,
  Building2,
  Check,
  CheckCircle2,
  Image as ImageIcon,
  Link as LinkIcon,
  Loader2,
  Pencil,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react';
import React, { useRef, useState } from 'react';

import { Button, Input, Label } from '@/components/atoms';
import { showAlertToast } from '@/core/components/alert-toast';
import { cn } from '@/utils/classname';
import { deleteObject, uploadAvatar } from '@/utils/r2-utils';

export interface ImageUploadProps {
  /** Nilai URL gambar saat ini */
  value?: string;
  /** Callback saat upload berhasil atau nilai URL berubah */
  onChange: (url: string) => void;
  /** Callback saat gambar dihapus */
  onRemove?: () => void;
  /** Folder target penyimpanan di R2 (default: 'company-logos') */
  folder?: string;
  /** Label header komponen */
  label?: string;
  /** Deskripsi petunjuk upload */
  description?: string;
  /** Teks placeholder pada dropzone */
  placeholderText?: string;
  /** Apakah input dinonaktifkan (misal saat form submitting) */
  disabled?: boolean;
  /** Batas ukuran file maksimal dalam Megabytes (default: 2) */
  maxSizeMB?: number;
  /** Tipe MIME yang diizinkan (default: PNG, JPG, WebP, SVG) */
  acceptedTypes?: string[];
  /** Bentuk preview (default: 'rounded') */
  shape?: 'circle' | 'square' | 'rounded';
  /** Ukuran preview gambar (default: 'md') */
  previewSize?: 'sm' | 'md' | 'lg' | 'xl';
  /** Tampilkan opsi alternatif untuk input URL manual (default: true) */
  showUrlInput?: boolean;
  /** Otomatis menghapus file lama dari R2 saat diganti atau dihapus (default: false) */
  autoDeleteOld?: boolean;
  /** Custom class styling container */
  className?: string;
}

const DEFAULT_ACCEPTED_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/svg+xml',
];

const PREVIEW_SIZES = {
  sm: 'size-16', // 64px
  md: 'size-24', // 96px
  lg: 'size-32', // 128px
  xl: 'size-40', // 160px
};

const SHAPES = {
  circle: 'rounded-full',
  square: 'rounded-none',
  rounded: 'rounded-2xl',
};

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value = '',
  onChange,
  onRemove,
  folder = 'company-logos',
  label,
  description = 'Format: PNG, JPG, WebP, atau SVG. Maksimal 2MB.',
  placeholderText = 'Tarik & lepas file di sini, atau klik untuk memilih',
  disabled = false,
  maxSizeMB = 2,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES,
  shape = 'rounded',
  previewSize = 'md',
  showUrlInput = true,
  autoDeleteOld = false,
  className,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [urlDraft, setUrlDraft] = useState('');

  const displayImage = previewUrl || value;

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `Format file "${file.type || file.name}" tidak didukung. Harap gunakan format gambar yang valid.`;
    }
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      return `Ukuran file (${(file.size / (1024 * 1024)).toFixed(1)}MB) melebihi batas maksimal ${maxSizeMB}MB.`;
    }
    return null;
  };

  const handleUpload = async (file: File) => {
    const errorMsg = validateFile(file);
    if (errorMsg) {
      showAlertToast({
        title: 'File Tidak Valid',
        message: errorMsg,
        icon: 'error',
      });
      return;
    }

    // Tampilkan preview lokal secara instan (optimistic preview)
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    setIsUploading(true);
    setUploadProgress('Mengunggah ke penyimpanan cloud...');

    const previousUrl = value;

    try {
      // Bungkus dalam FormData untuk kompatibilitas Next.js Server Action
      const formData = new FormData();
      formData.append('file', file);

      const uploadedUrl = await uploadAvatar(formData, folder);

      if (!uploadedUrl) {
        throw new Error('Gagal mendapatkan URL publik hasil upload.');
      }

      // Bersihkan preview lokal
      URL.revokeObjectURL(localPreview);
      setPreviewUrl(null);

      // Callback nilai baru
      onChange(uploadedUrl);

      // Hapus file lama di R2 jika autoDeleteOld aktif
      if (autoDeleteOld && previousUrl && previousUrl.includes('.r2.cloudflarestorage.com')) {
        deleteObject(previousUrl).catch((err) =>
          console.warn('[ImageUpload] Gagal menghapus file lama dari R2:', err),
        );
      }

      showAlertToast({
        title: 'Berhasil Diunggah',
        message: 'Gambar berhasil diupload dan diperbarui.',
        icon: 'success',
      });
    } catch (err: any) {
      console.error('[ImageUpload] Upload error:', err);
      URL.revokeObjectURL(localPreview);
      setPreviewUrl(null);
      showAlertToast({
        title: 'Gagal Mengunggah',
        message: err?.message || 'Terjadi kesalahan saat mengunggah file. Silakan coba lagi.',
        icon: 'error',
      });
    } finally {
      setIsUploading(false);
      setUploadProgress('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled || isUploading) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleUpload(files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled || isUploading) return;

    const currentUrl = value;
    onChange('');
    setPreviewUrl(null);

    if (onRemove) {
      onRemove();
    }

    if (autoDeleteOld && currentUrl && currentUrl.includes('.r2.cloudflarestorage.com')) {
      deleteObject(currentUrl).catch((err) =>
        console.warn('[ImageUpload] Gagal menghapus file saat tombol remove diklik:', err),
      );
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveManualUrl = () => {
    if (urlDraft.trim()) {
      onChange(urlDraft.trim());
      setIsEditingUrl(false);
      setUrlDraft('');
    }
  };

  return (
    <div className={cn('w-full space-y-3', className)}>
      {label && <Label className="text-sm font-medium text-foreground">{label}</Label>}

      {/* Main Upload Box */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm shadow-xs transition hover:border-border">
        {/* Preview Area */}
        <div
          className={cn(
            'relative shrink-0 overflow-hidden border border-border/80 bg-muted/40 shadow-xs flex items-center justify-center transition-all group',
            PREVIEW_SIZES[previewSize],
            SHAPES[shape],
          )}
        >
          {displayImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={displayImage}
              alt="Uploaded Preview"
              className="size-full object-cover"
              onError={(e) => {
                // Fallback jika image URL rusak
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground p-2">
              <Building2 className="w-8 h-8 stroke-[1.5]" />
            </div>
          )}

          {/* Uploading Overlay */}
          {isUploading && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-xs flex flex-col items-center justify-center p-2 text-center z-10">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-[10px] font-medium text-foreground mt-1">Mengunggah...</span>
            </div>
          )}

          {/* Hover Action Overlay saat ada gambar */}
          {displayImage && !isUploading && !disabled && (
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Ganti gambar"
                className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white transition cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                title="Hapus gambar"
                className="p-1.5 rounded-full bg-red-500/80 hover:bg-red-500 text-white transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Dropzone & Action Details */}
        <div className="flex-1 w-full space-y-2">
          {/* Dropzone Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => {
              if (!disabled && !isUploading) {
                fileInputRef.current?.click();
              }
            }}
            className={cn(
              'border-2 border-dashed rounded-lg p-3 sm:p-4 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-1.5',
              isDragging
                ? 'border-primary bg-primary/10 scale-[1.01]'
                : 'border-border/70 hover:border-primary/60 hover:bg-muted/30',
              disabled || isUploading ? 'opacity-60 cursor-not-allowed pointer-events-none' : '',
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedTypes.join(',')}
              onChange={onFileInputChange}
              disabled={disabled || isUploading}
              className="hidden"
            />

            <div className="flex items-center gap-2 text-primary font-medium text-xs sm:text-sm">
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{uploadProgress || 'Mengunggah...'}</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>{placeholderText}</span>
                </>
              )}
            </div>

            <p className="text-[11px] text-muted-foreground">{description}</p>
          </div>

          {/* Quick Action Buttons & URL Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || isUploading}
                className="h-7 text-xs px-2.5"
              >
                <UploadCloud className="w-3.5 h-3.5 mr-1.5" />
                Pilih File
              </Button>

              {displayImage && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemove}
                  disabled={disabled || isUploading}
                  className="h-7 text-xs px-2 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Hapus
                </Button>
              )}
            </div>

            {showUrlInput && (
              <button
                type="button"
                onClick={() => {
                  setUrlDraft(value || '');
                  setIsEditingUrl((prev) => !prev);
                }}
                disabled={disabled || isUploading}
                className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 transition"
              >
                <LinkIcon className="w-3 h-3" />
                {isEditingUrl ? 'Tutup URL Manual' : 'Input URL Manual'}
              </button>
            )}
          </div>

          {/* Collapsible Manual URL Input */}
          {showUrlInput && isEditingUrl && (
            <div className="flex items-center gap-1.5 pt-2 border-t border-border/40">
              <Input
                type="url"
                value={urlDraft}
                onChange={(e) => setUrlDraft(e.target.value)}
                placeholder="https://example.com/logo.png"
                disabled={disabled || isUploading}
                className="h-8 text-xs"
              />
              <Button
                type="button"
                size="sm"
                onClick={handleSaveManualUrl}
                disabled={disabled || isUploading || !urlDraft.trim()}
                className="h-8 text-xs px-3"
              >
                <Check className="w-3.5 h-3.5 mr-1" />
                Terapkan
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
