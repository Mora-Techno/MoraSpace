'use client';

import { formatDateOnly } from '@repo';
import type { Note, PickCreateNote } from '@repo/types';
import { BookOpen, Clock, Edit3, Eye, FileText, PenTool, Save, Trash2 } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/atoms';
import { Skeleton } from '@/components/atoms/Skeleton';
import { RichTextEditor } from '@/components/molecules/editor/RichTextEditor';
import { GhibliCard } from '@/components/molecules/GhibliCard';
import { cn } from '@/utils/classname';
import { stripHtml } from '@/utils/html';

export interface NoteEditorSectionProps {
  service: {
    handleSave: () => void;
    handleDelete?: () => void;
    uploadNoteImage?: (file: File) => Promise<string>;
    deleteObject?: (url: string) => Promise<void>;
  };
  state: {
    note: Note | undefined;
    isLoading: boolean;
    formCreateNote: PickCreateNote;
    setFormCreateNote: React.Dispatch<React.SetStateAction<PickCreateNote>>;
    isPending: boolean;
  };
}

export function NoteEditorSection({ service, state }: NoteEditorSectionProps) {
  const { handleSave, handleDelete, uploadNoteImage, deleteObject } = service;
  const { note, isLoading, formCreateNote, setFormCreateNote, isPending } = state;

  // Pastikan note di-unwrap dengan aman dari kemungkinan pembungkus respons API
  const rawNote = note as any;
  const actualNote: Note | undefined = rawNote?.data?.id
    ? rawNote.data
    : rawNote?.id
      ? rawNote
      : rawNote?.data?.data?.id
        ? rawNote.data.data
        : (rawNote?.data ?? rawNote);

  // Inisialisasi mode: Editor jika konten kosong, Mode Baca jika sudah ada konten
  const [isEditing, setIsEditing] = useState<boolean>(() => {
    const hasInitialContent =
      Boolean(formCreateNote.content && formCreateNote.content.trim().length > 0) ||
      Boolean(actualNote?.content && actualNote.content.trim().length > 0);
    return !hasInitialContent;
  });

  // Jika note baru selesai dimuat dan sudah memiliki judul atau konten, otomatis buka dalam Mode Baca
  const hasAutoSwitchedRef = useRef(false);
  useEffect(() => {
    if (!hasAutoSwitchedRef.current && actualNote) {
      const hasContent =
        Boolean(actualNote.content && actualNote.content.trim().length > 0) ||
        Boolean(actualNote.title && actualNote.title.trim().length > 0);
      if (hasContent) {
        setIsEditing(false);
        hasAutoSwitchedRef.current = true;
      }
    }
  }, [actualNote]);

  const activeContent = formCreateNote.content || actualNote?.content || '';
  const activeTitle = formCreateNote.title || actualNote?.title || '';

  const wordStats = useMemo(() => {
    const raw = stripHtml(activeContent);
    if (!raw) return { words: 0, readingTime: 1 };
    const words = raw.split(/\s+/).filter(Boolean).length;
    const readingTime = Math.max(1, Math.ceil(words / 200));
    return { words, readingTime };
  }, [activeContent]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <GhibliCard>
          <div className="space-y-3">
            <Skeleton className="h-9 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </GhibliCard>
        <GhibliCard>
          <div className="space-y-4 py-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-6 w-2/3" />
          </div>
        </GhibliCard>
      </div>
    );
  }

  if (!isLoading && !actualNote && !formCreateNote.title && !formCreateNote.content) {
    return (
      <GhibliCard className="text-center py-12">
        <p className="text-base text-muted-foreground">
          Catatan tidak ditemukan atau telah dihapus.
        </p>
      </GhibliCard>
    );
  }

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* 1. Header Toolbar & Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-card/80 backdrop-blur-md border border-border/60 rounded-2xl shadow-xs">
        {/* Left: Mode Badge */}
        <div className="flex items-center gap-2">
          {isEditing ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
              <PenTool className="size-3.5" />
              Mode Editor
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <BookOpen className="size-3.5" />
              Mode Baca (Reading View)
            </span>
          )}
          <span className="hidden sm:inline text-xs text-muted-foreground">•</span>
          <span className="hidden sm:inline text-xs text-muted-foreground">
            {wordStats.words} kata • ~{wordStats.readingTime} mnt baca
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
                className="text-xs h-9 gap-1.5 cursor-pointer"
                title="Beralih ke tampilan baca"
              >
                <Eye className="size-3.5" />
                <span>Mode Baca</span>
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleSave}
                disabled={isPending}
                className="ghibli-btn text-xs h-9 gap-1.5 cursor-pointer"
              >
                <Save className="size-3.5" />
                <span>{isPending ? 'Menyimpan...' : 'Simpan'}</span>
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="ghibli-btn text-xs h-9 gap-1.5 cursor-pointer"
                title="Buka editor untuk mengubah teks"
              >
                <Edit3 className="size-3.5" />
                <span>Edit Catatan</span>
              </Button>
              {handleDelete && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isPending}
                  className="text-xs h-9 text-destructive hover:bg-destructive/10 gap-1.5 cursor-pointer"
                  title="Hapus catatan ini"
                >
                  <Trash2 className="size-3.5" />
                  <span className="hidden sm:inline">Hapus</span>
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* 2. Main Content Canvas */}
      {isEditing ? (
        /* ==================== EDITOR MODE ==================== */
        <div className="space-y-4">
          <div className="p-4 sm:p-6 bg-card border border-border/70 rounded-2xl shadow-xs">
            <label
              htmlFor="note-title-input"
              className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block"
            >
              Judul Catatan
            </label>
            <input
              id="note-title-input"
              type="text"
              value={activeTitle}
              onChange={(e) =>
                setFormCreateNote((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              placeholder="Beri judul catatanmu..."
              className="w-full bg-transparent font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground placeholder:text-muted-foreground/60 border-b border-border/60 pb-2 focus:outline-none focus:border-primary transition"
            />
          </div>

          <RichTextEditor
            variant="full"
            value={activeContent}
            onChange={(content) =>
              setFormCreateNote((prev) => ({
                ...prev,
                content,
              }))
            }
            onUploadImage={uploadNoteImage}
            onDeleteImage={deleteObject}
            placeholder="Tulis ide, rangkuman, atau catatanmu... Sisipkan tabel, gambar, diagram pohon (Tree Graph), atau rumus LaTeX melalui toolbar."
            minHeight="550px"
          />

          {/* Quick footer save bar */}
          <div className="flex items-center justify-between p-3 bg-muted/40 rounded-xl border border-border/40 text-xs text-muted-foreground">
            <span>
              💡 <strong>Tips:</strong> Kamu dapat menyisipkan diagram pohon hierarki atau rumus
              LaTeX menggunakan ikon toolbar di atas.
            </span>
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              disabled={isPending}
              className="ghibli-btn text-xs h-8 cursor-pointer ml-3 shrink-0"
            >
              {isPending ? 'Menyimpan...' : 'Simpan Catatan'}
            </Button>
          </div>
        </div>
      ) : (
        /* ==================== READING MODE (MUDAH DIBACA) ==================== */
        <article className="p-6 sm:p-12 bg-card border border-border/70 rounded-3xl shadow-sm transition-all">
          {/* Article Header */}
          <header className="border-b border-border/60 pb-6 mb-8">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.2]">
              {activeTitle || 'Tanpa Judul'}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock className="size-4 text-primary/70" />
                Diperbarui{' '}
                {formatDateOnly(
                  actualNote?.updatedAt || actualNote?.createdAt || new Date().toISOString(),
                )}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="size-4 text-primary/70" />
                Estimasi ~{wordStats.readingTime} menit baca
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <FileText className="size-4 text-primary/70" />
                {wordStats.words} kata
              </span>
            </div>
          </header>

          {/* Article Prose Body */}
          {activeContent && activeContent.trim().length > 0 ? (
            <div
              className={cn(
                'note-reading-content prose prose-slate dark:prose-invert max-w-none text-foreground/90 leading-relaxed font-sans text-base',
                'prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground',
                'prose-h1:text-2xl sm:prose-h1:text-3xl prose-h2:text-xl sm:prose-h2:text-2xl prose-h3:text-lg',
                'prose-p:my-3 prose-p:leading-relaxed',
                'prose-a:text-sky-600 dark:prose-a:text-sky-400 prose-a:underline hover:prose-a:text-sky-500',
                'prose-img:rounded-2xl prose-img:shadow-md prose-img:my-6 prose-img:mx-auto prose-img:max-h-[600px] prose-img:object-contain',
                'prose-table:w-full prose-table:border-collapse prose-table:my-5',
                'prose-th:bg-muted/60 prose-th:p-3 prose-th:border prose-th:border-border prose-th:font-semibold prose-th:text-left',
                'prose-td:p-3 prose-td:border prose-td:border-border',
                'prose-blockquote:border-l-4 prose-blockquote:border-primary/60 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground',
              )}
              // biome-ignore lint/security/noDangerouslySetInnerHtml: render konten rich text yang sudah diformat user
              dangerouslySetInnerHTML={{ __html: activeContent }}
            />
          ) : (
            <div className="py-16 text-center space-y-4">
              <div className="size-12 rounded-full bg-muted/60 flex items-center justify-center mx-auto text-muted-foreground">
                <FileText className="size-6" />
              </div>
              <div className="space-y-1">
                <p className="font-serif text-lg font-medium text-foreground">
                  Catatan ini masih kosong
                </p>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Belum ada isi konten pada catatan ini. Klik tombol di bawah untuk mulai menulis
                  ide, menyisipkan gambar, tabel, ataupun diagram pohon.
                </p>
              </div>
              <Button
                type="button"
                onClick={() => setIsEditing(true)}
                className="ghibli-btn text-xs h-9 gap-1.5 cursor-pointer mt-2"
              >
                <Edit3 className="size-3.5" />
                <span>Mulai Menulis</span>
              </Button>
            </div>
          )}
        </article>
      )}
    </div>
  );
}
