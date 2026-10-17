'use client';

import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  ChevronDown,
  Code2,
  FileText,
  FolderTree,
  Highlighter,
  Image as ImageIcon,
  Indent,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Maximize2,
  Minimize2,
  Minus,
  Outdent,
  Plus,
  RemoveFormatting,
  RotateCcw,
  RotateCw,
  Sigma,
  Table as TableIcon,
  Trash2,
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/utils/classname';
import { stripHtml } from '@/utils/html';

export interface RichTextEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  onUploadImage?: (file: File) => Promise<string>;
  onDeleteImage?: (url: string) => Promise<void>;
  apiKey?: string;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  onWordCountChange?: (count: number) => void;
  documentTitle?: string;
  documentSubtitle?: string;
  variant?: 'full' | 'compact';
  minHeight?: string;
}

export const DEFAULT_DOCUMENT_HTML = `
<div class="space-y-6 text-foreground leading-relaxed font-normal">
  <div>
    <p class="text-xs font-bold text-primary tracking-wider uppercase mb-2">
      MODUL PEMBELAJARAN TKA BAHASA INDONESIA
    </p>
    <h1 class="text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-snug">
      Memahami Teks Eksplanasi: Ciri, Kaidah Kebahasaan, dan Struktur Analisis
    </h1>
    <p class="text-xs text-muted-foreground font-medium mt-2">
      Jenjang: SMA / MA Fase F &nbsp;&bull;&nbsp; Pilar: Literasi &amp; Pemahaman Tekstual &nbsp;&bull;&nbsp; Penulis: Rian Pratama, M.Pd.
    </p>
  </div>

  <div class="border-t border-border pt-5">
    <h2 class="text-base sm:text-lg font-bold text-foreground mb-3 border-b border-border pb-2">
      A. Definisi dan Karakteristik Utama
    </h2>
    <p class="text-sm text-foreground/90 leading-relaxed">
      <strong>Teks eksplanasi</strong> adalah teks yang berisi penjelasan mengenai proses mengapa dan bagaimana peristiwa alam, sosial, ilmu pengetahuan, budaya, dan fenomena lainnya dapat terjadi. Sebuah peristiwa baik alam maupun sosial yang terjadi di sekitar kita senantiasa memiliki hubungan kausalitas (sebab-akibat) serta kronologis (urutan waktu).
    </p>
    
    <div class="my-4 p-4 rounded-r-xl border-l-4 border-primary bg-primary/10 text-xs sm:text-sm text-foreground leading-relaxed">
      <strong>Prinsip Utama:</strong> Fokus penulisan eksplanasi bukan pada opini subjektif, melainkan pengungkapan fakta faktual yang dapat diuji kebenarannya secara rasional dan ilmiah.
    </div>
  </div>

  <div>
    <h2 class="text-base sm:text-lg font-bold text-foreground mb-3 border-b border-border pb-2">
      B. Struktur Baku Teks Eksplanasi
    </h2>
    <p class="text-sm text-foreground/90 leading-relaxed mb-3">
      Secara umum, teks eksplanasi memuat tiga komponen struktur logis yang tidak dapat dipertukarkan posisinya:
    </p>
    <div class="space-y-2.5 text-sm text-foreground/90 pl-4 border-l-2 border-border">
      <p>
        <strong>Pernyataan Umum (General Statement):</strong> Pengenalan awal mengenai fenomena yang dibahas serta latar belakang mengapa topik tersebut penting untuk diurai.
      </p>
      <p>
        <strong>Rangkaian Penjelas (Deretan Penjelas / Sequence):</strong> Uraian terperinci mengenai tahapan peristiwa, hubungan interaksi antar-unsur, dan mekanisme sebab akibat secara logis.
      </p>
      <p>
        <strong>Interpretasi (Penutup / Review):</strong> Kesimpulan, simpulan evaluatif, atau implikasi peristiwa tersebut terhadap lingkungan manusia.
      </p>
    </div>
  </div>

  <div>
    <h2 class="text-base sm:text-lg font-bold text-foreground mb-3 border-b border-border pb-2">
      C. Kaidah Kebahasaan yang Dominan
    </h2>
    <ul class="list-disc list-inside space-y-1.5 text-sm text-foreground/90 pl-2">
      <li>Menggunakan kata kerja material dan relasional (misal: menyebabkan, bertransformasi).</li>
      <li>Memanfaatkan konjungsi kausalitas (sebab, karena, oleh karena itu, sehingga).</li>
      <li>Memanfaatkan konjungsi kronologis (kemudian, setelah itu, pada akhirnya).</li>
      <li>Dominan menggunakan istilah teknis/ilmiah sesuai dengan bidang tema fenomena.</li>
    </ul>
  </div>
</div>
`;

function countWords(html: string): number {
  const text = stripHtml(html);
  if (!text) return 0;
  return text.split(' ').filter(Boolean).length;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  onUploadImage,
  onDeleteImage,
  placeholder = 'Mulai menulis materi...',
  readOnly = false,
  className,
  onWordCountChange,
  variant = 'full',
  minHeight,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState<number>(16);
  const [fontFamily, setFontFamily] = useState<string>('Poppins');
  const [headingStyle, setHeadingStyle] = useState<string>('Teks Normal');
  const [wordCount, setWordCount] = useState<number>(0);
  const [scale, setScale] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [savedSelection, setSavedSelection] = useState<Range | null>(null);
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);
  const [selectedImageRect, setSelectedImageRect] = useState<DOMRect | null>(null);
  const [isTableMenuOpen, setIsTableMenuOpen] = useState<boolean>(false);
  const [isTreeMenuOpen, setIsTreeMenuOpen] = useState<boolean>(false);
  const [isLatexMenuOpen, setIsLatexMenuOpen] = useState<boolean>(false);
  const [tableSize, setTableSize] = useState<{ rows: number; cols: number }>({
    rows: 0,
    cols: 0,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pendingDeletions = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const isReplacingContentRef = useRef<boolean>(false);

  // Sync initial content
  useEffect(() => {
    if (editorRef.current) {
      const nextHtml = value !== undefined ? value : '';
      if (editorRef.current.innerHTML !== nextHtml) {
        isReplacingContentRef.current = true;
        editorRef.current.innerHTML = nextHtml;
        setTimeout(() => {
          isReplacingContentRef.current = false;
        }, 50);
      }
      const words = countWords(nextHtml);
      setWordCount(words);
      onWordCountChange?.(words);
    }
  }, [value, onWordCountChange]);

  // Observe node removal to delete images
  useEffect(() => {
    if (!editorRef.current || !onDeleteImage) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // Cancel deletion if image is added back (e.g. Undo)
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            const checkAndCancel = (element: HTMLElement) => {
              if (element.nodeName === 'IMG') {
                const src = (element as HTMLImageElement).src;
                if (pendingDeletions.current.has(src)) {
                  clearTimeout(pendingDeletions.current.get(src)!);
                  pendingDeletions.current.delete(src);
                }
              }
              if (element.querySelectorAll) {
                const imgs = element.querySelectorAll('img');
                imgs.forEach((img) => {
                  if (pendingDeletions.current.has(img.src)) {
                    clearTimeout(pendingDeletions.current.get(img.src)!);
                    pendingDeletions.current.delete(img.src);
                  }
                });
              }
            };
            checkAndCancel(node);
          }
        });

        // Skip deletion if replacing the entire editor content
        if (isReplacingContentRef.current) return;

        // Schedule deletion for removed images
        mutation.removedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            const checkAndQueue = (element: HTMLElement) => {
              if (element.nodeName === 'IMG') {
                const src = (element as HTMLImageElement).src;
                if (!pendingDeletions.current.has(src)) {
                  const timer = setTimeout(() => {
                    onDeleteImage(src).catch(console.error);
                    pendingDeletions.current.delete(src);
                  }, 5000); // 5s delay
                  pendingDeletions.current.set(src, timer);
                }
              }
              if (element.querySelectorAll) {
                const imgs = element.querySelectorAll('img');
                imgs.forEach((img) => {
                  if (!pendingDeletions.current.has(img.src)) {
                    const timer = setTimeout(() => {
                      onDeleteImage(img.src).catch(console.error);
                      pendingDeletions.current.delete(img.src);
                    }, 5000); // 5s delay
                    pendingDeletions.current.set(img.src, timer);
                  }
                });
              }
            };
            checkAndQueue(node);
          }
        });
      });
    });

    observer.observe(editorRef.current, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [onDeleteImage]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      const count = countWords(html);
      setWordCount(count);
      onWordCountChange?.(count);
      onChange?.(html);
    }
  }, [onChange, onWordCountChange]);

  const executeCommand = (command: string, arg?: string) => {
    if (readOnly) return;
    document.execCommand(command, false, arg);
    editorRef.current?.focus();
    handleInput();
  };

  const handleHeadingChange = (format: string) => {
    setHeadingStyle(format);
    if (format === 'H1') executeCommand('formatBlock', '<h1>');
    else if (format === 'H2') executeCommand('formatBlock', '<h2>');
    else if (format === 'H3') executeCommand('formatBlock', '<h3>');
    else if (format === 'Kutipan') executeCommand('formatBlock', '<blockquote>');
    else executeCommand('formatBlock', '<p>');
  };

  const handleFontSizeChange = (delta: number) => {
    const next = Math.max(10, Math.min(36, fontSize + delta));
    setFontSize(next);
    executeCommand('fontSize', next > 20 ? '5' : next > 16 ? '4' : '3');
  };

  const handleInsertLink = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      alert('Pilih teks terlebih dahulu sebelum menyisipkan tautan.');
      return;
    }
    const url = prompt('Masukkan URL tautan:');
    if (url) executeCommand('createLink', url);
  };

  const handleInsertImage = () => {
    if (onUploadImage) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        setSavedSelection(selection.getRangeAt(0));
      }
      fileInputRef.current?.click();
    } else {
      const url = prompt('Masukkan URL Gambar:');
      if (url) {
        const imgHtml = `<img src="${url}" alt="image" class="max-w-full h-auto rounded-xl my-4" />`;
        executeCommand('insertHTML', imgHtml);
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUploadImage) return;

    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar (JPG, PNG, WEBP, dll)');
      return;
    }

    try {
      setIsUploading(true);
      const url = await onUploadImage(file);

      if (savedSelection) {
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(savedSelection);
      } else {
        editorRef.current?.focus();
      }

      const imgHtml = `<img src="${url}" alt="${file.name}" class="max-w-full h-auto rounded-xl my-4" />`;
      executeCommand('insertHTML', imgHtml);
    } catch (error) {
      console.error('Failed to upload image:', error);
    } finally {
      setIsUploading(false);
      setSavedSelection(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const buildTableHtml = (rows: number, cols: number): string => {
    const headerCells = Array.from(
      { length: cols },
      (_, c) =>
        `<th class="border border-border p-2 font-bold text-left bg-muted/60 text-foreground">Kolom ${c + 1}</th>`,
    ).join('');
    const bodyRows = Array.from(
      { length: Math.max(0, rows - 1) },
      (_, r) =>
        `<tr>${Array.from(
          { length: cols },
          (_, c) =>
            `<td class="border border-border p-2 text-foreground/90">Baris ${r + 1} Kolom ${c + 1}</td>`,
        ).join('')}</tr>`,
    ).join('');

    return `
      <table class="w-full border-collapse border border-border my-4 text-xs">
        <thead>
          <tr class="bg-muted/40">${headerCells}</tr>
        </thead>
        <tbody>${bodyRows}</tbody>
      </table>
    `;
  };

  const handleInsertTable = (rows: number, cols: number) => {
    executeCommand('insertHTML', buildTableHtml(rows, cols));
    setIsTableMenuOpen(false);
    setTableSize({ rows: 0, cols: 0 });
  };

  const handleInsertTree = (preset: 'visual' | 'ascii' | 'mermaid') => {
    let html = '';
    if (preset === 'visual') {
      html = `
        <div class="my-5 p-5 rounded-2xl border border-border bg-card/90 text-foreground shadow-xs">
          <div class="text-xs font-bold uppercase tracking-wider text-primary mb-3 flex items-center gap-1.5">
            <span>🌳 Diagram Pohon (Tree Graph)</span>
          </div>
          <div class="space-y-2 text-xs sm:text-sm">
            <div class="p-2.5 rounded-xl bg-muted/80 border border-border font-semibold text-foreground shadow-2xs">
              📌 Topik Utama (Root Node)
            </div>
            <div class="pl-6 border-l-2 border-primary/50 space-y-2.5">
              <div class="p-2 rounded-lg bg-card border border-border text-foreground font-medium">
                ├── Cabang A (Branch 1): Konsep &amp; Teori
              </div>
              <div class="pl-5 border-l border-border space-y-1 text-muted-foreground text-xs">
                <div>• Sub-topik A.1 (Analisis)</div>
                <div>• Sub-topik A.2 (Karakteristik)</div>
              </div>
              <div class="p-2 rounded-lg bg-card border border-border text-foreground font-medium">
                └── Cabang B (Branch 2): Implementasi Praktis
              </div>
              <div class="pl-5 border-l border-border space-y-1 text-muted-foreground text-xs">
                <div>• Sub-topik B.1 (Metodologi)</div>
                <div>• Sub-topik B.2 (Hasil &amp; Kesimpulan)</div>
              </div>
            </div>
          </div>
        </div>
        <p><br></p>
      `;
    } else if (preset === 'ascii') {
      html = `
        <div class="my-4 p-4 rounded-xl border border-border bg-muted/80 text-foreground font-mono text-xs">
          <div class="text-muted-foreground text-[10px] uppercase font-bold tracking-wider mb-2">Hierarki Pohon (Directory Tree)</div>
          <pre class="m-0 p-0 font-mono text-xs leading-relaxed text-primary">
Root (Topik Utama)
├── 01_Pendahuluan
│   ├── Latar_Belakang.md
│   └── Tujuan_Penelitian.md
├── 02_Pembahasan
│   ├── Analisis_Data.md
│   └── Evaluasi.md
└── 03_Kesimpulan.md</pre>
        </div>
        <p><br></p>
      `;
    } else {
      html = `
        <div class="my-4 p-4 rounded-xl border border-border bg-muted/40 text-xs text-foreground">
          <div class="text-xs font-bold text-primary mb-2">📊 Bagan Pohon / Mermaid Graph:</div>
          <pre class="font-mono bg-card p-3 rounded-lg border border-border text-foreground leading-relaxed">
graph TD
  Root[Akar Masalah] --> B1[Faktor Manusia]
  Root --> B2[Faktor Sistem]
  Root --> B3[Faktor Lingkungan]
  B1 --> B1_1[Kurang Pelatihan]
  B2 --> B2_1[Bug Konfigurasi]
  B3 --> B3_1[Koneksi Lambat]</pre>
        </div>
        <p><br></p>
      `;
    }
    executeCommand('insertHTML', html);
    setIsTreeMenuOpen(false);
  };

  const handleInsertLatex = (preset: 'equation' | 'tree' | 'matrix') => {
    let html = '';
    if (preset === 'equation') {
      html = `
        <div class="my-4 p-4 rounded-2xl border-l-4 border-primary bg-primary/10 text-xs sm:text-sm text-foreground">
          <div class="flex items-center justify-between text-primary font-bold mb-1.5">
            <span>📐 Formula Matematika &amp; LaTeX:</span>
            <span class="text-[10px] px-2 py-0.5 rounded bg-primary/20 font-mono text-foreground">LaTeX</span>
          </div>
          <pre class="bg-card p-3 rounded-xl border border-border font-mono text-xs text-foreground overflow-x-auto leading-relaxed">
$$ f(x) = \\sum_{i=1}^{n} \\frac{x_i^2}{\\sqrt{2\\pi\\sigma^2}} \\cdot e^{-\\frac{(x - \\mu)^2}{2\\sigma^2}} $$</pre>
        </div>
        <p><br></p>
      `;
    } else if (preset === 'tree') {
      html = `
        <div class="my-4 p-4 rounded-2xl border-l-4 border-primary bg-primary/10 text-xs sm:text-sm text-foreground">
          <div class="flex items-center justify-between text-primary font-bold mb-1.5">
            <span>🌲 LaTeX Forest (Tree Graph Syntax):</span>
            <span class="text-[10px] px-2 py-0.5 rounded bg-primary/20 font-mono text-foreground">LaTeX Tree</span>
          </div>
          <pre class="bg-card p-3 rounded-xl border border-border font-mono text-xs text-foreground overflow-x-auto leading-relaxed">
\\begin{forest}
  [Root (Top Level)
    [Branch 1
      [Leaf 1.1]
      [Leaf 1.2]
    ]
    [Branch 2
      [Leaf 2.1]
    ]
  ]
\\end{forest}</pre>
        </div>
        <p><br></p>
      `;
    } else {
      html = `
        <div class="my-4 p-4 rounded-2xl border-l-4 border-primary bg-primary/10 text-xs sm:text-sm text-foreground">
          <div class="flex items-center justify-between text-primary font-bold mb-1.5">
            <span>🔢 Matriks / Aljabar Linier (LaTeX):</span>
            <span class="text-[10px] px-2 py-0.5 rounded bg-primary/20 font-mono text-foreground">Matrix</span>
          </div>
          <pre class="bg-card p-3 rounded-xl border border-border font-mono text-xs text-foreground overflow-x-auto leading-relaxed">
$$ A = \\begin{pmatrix} a_{11} & a_{12} & a_{13} \\\\ a_{21} & a_{22} & a_{23} \\\\ a_{31} & a_{32} & a_{33} \\end{pmatrix} $$</pre>
        </div>
        <p><br></p>
      `;
    }
    executeCommand('insertHTML', html);
    setIsLatexMenuOpen(false);
  };

  const clearImageSelection = () => {
    if (selectedImage) {
      selectedImage.style.outline = '';
      selectedImage.style.outlineOffset = '';
    }
    setSelectedImage(null);
    setSelectedImageRect(null);
  };

  const handleEditorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (readOnly) return;
    const target = e.target as HTMLElement;
    if (target instanceof HTMLImageElement) {
      if (selectedImage && selectedImage !== target) {
        selectedImage.style.outline = '';
        selectedImage.style.outlineOffset = '';
      }
      target.style.outline = '2px solid var(--primary, #7DAF74)';
      target.style.outlineOffset = '2px';
      setSelectedImage(target);
      setSelectedImageRect(target.getBoundingClientRect());
    } else {
      clearImageSelection();
    }
  };

  const handleDeleteSelectedImage = () => {
    if (selectedImage) {
      selectedImage.remove();
      clearImageSelection();
      handleInput();
    }
  };

  useEffect(() => {
    if (!selectedImage) return;
    const hide = () => {
      selectedImage.style.outline = '';
      setSelectedImage(null);
      setSelectedImageRect(null);
    };
    window.addEventListener('scroll', hide, true);
    return () => window.removeEventListener('scroll', hide, true);
  }, [selectedImage]);

  return (
    <div
      className={cn(
        'w-full bg-card rounded-3xl border border-border shadow-xs overflow-hidden flex flex-col transition-all duration-300',
        isFullscreen && 'fixed inset-0 z-50 rounded-none h-screen bg-background',
        className,
      )}
    >
      {/* 1. Toolbar Controls */}
      {!readOnly && (
        <div className="flex items-center flex-wrap gap-1 px-4 sm:px-6 py-2.5 border-b border-border bg-muted/40 text-foreground select-none">
          {/* Undo / Redo */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              title="Undo"
              onClick={() => executeCommand('undo')}
              className="p-1.5 rounded-lg hover:bg-accent text-foreground/80 hover:text-foreground transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Redo"
              onClick={() => executeCommand('redo')}
              className="p-1.5 rounded-lg hover:bg-accent text-foreground/80 hover:text-foreground transition cursor-pointer"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          <div className="h-5 w-px bg-border mx-1.5" />

          {/* Heading Style Dropdown */}
          <div className="relative inline-block">
            <select
              value={headingStyle}
              onChange={(e) => handleHeadingChange(e.target.value)}
              className="text-xs font-semibold text-foreground bg-card border border-border rounded-lg px-2.5 py-1.5 cursor-pointer appearance-none pr-7 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="Teks Normal" className="bg-popover text-popover-foreground">
                Teks Normal
              </option>
              <option value="H1" className="bg-popover text-popover-foreground">
                Judul Besar (H1)
              </option>
              <option value="H2" className="bg-popover text-popover-foreground">
                Sub-Judul (H2)
              </option>
              <option value="H3" className="bg-popover text-popover-foreground">
                Heading 3 (H3)
              </option>
              <option value="Kutipan" className="bg-popover text-popover-foreground">
                Blok Kutipan
              </option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-2 top-2.5 pointer-events-none" />
          </div>

          {/* Font Family Dropdown */}
          <div className="relative inline-block ml-1">
            <select
              value={fontFamily}
              onChange={(e) => {
                setFontFamily(e.target.value);
                executeCommand('fontName', e.target.value);
              }}
              className="text-xs font-semibold text-foreground bg-card border border-border rounded-lg px-2.5 py-1.5 cursor-pointer appearance-none pr-7 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="Poppins" className="bg-popover text-popover-foreground">
                Poppins
              </option>
              <option value="Inter" className="bg-popover text-popover-foreground">
                Inter
              </option>
              <option value="Geist" className="bg-popover text-popover-foreground">
                Geist
              </option>
              <option value="Arial" className="bg-popover text-popover-foreground">
                Arial
              </option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-2 top-2.5 pointer-events-none" />
          </div>

          {/* Font Size Counter */}
          <div className="flex items-center bg-card border border-border rounded-lg ml-1 px-1 py-0.5 text-xs font-bold text-foreground">
            <button
              type="button"
              onClick={() => handleFontSizeChange(-1)}
              className="p-1 hover:bg-accent text-foreground/80 hover:text-foreground rounded cursor-pointer"
              title="Perkecil teks"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-6 text-center text-xs text-foreground">{fontSize}</span>
            <button
              type="button"
              onClick={() => handleFontSizeChange(1)}
              className="p-1 hover:bg-accent text-foreground/80 hover:text-foreground rounded cursor-pointer"
              title="Perbesar teks"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <div className="h-5 w-px bg-border mx-1.5" />

          {/* Inline Formatting: B, I, U, Color, Highlight */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              title="Bold (Ctrl+B)"
              onClick={() => executeCommand('bold')}
              className="px-2 py-1 rounded-lg font-black hover:bg-accent text-foreground text-xs transition cursor-pointer"
            >
              B
            </button>
            <button
              type="button"
              title="Italic (Ctrl+I)"
              onClick={() => executeCommand('italic')}
              className="px-2 py-1 rounded-lg italic font-serif hover:bg-accent text-foreground text-xs transition cursor-pointer"
            >
              I
            </button>
            <button
              type="button"
              title="Underline (Ctrl+U)"
              onClick={() => executeCommand('underline')}
              className="px-2 py-1 rounded-lg underline hover:bg-accent text-foreground text-xs transition cursor-pointer"
            >
              U
            </button>
            <button
              type="button"
              title="Warna Teks"
              onClick={() => {
                const color = prompt('Kode warna hex (misal: #7DAF74):', '#7DAF74');
                if (color) executeCommand('foreColor', color);
              }}
              className="p-1.5 rounded-lg hover:bg-accent text-foreground/80 hover:text-foreground transition flex items-center cursor-pointer"
            >
              <div className="flex flex-col items-center">
                <span className="font-bold text-xs leading-none">A</span>
                <span className="w-3 h-0.5 bg-primary mt-0.5 rounded-full" />
              </div>
            </button>
            <button
              type="button"
              title="Highlight Kuning"
              onClick={() => executeCommand('hiliteColor', '#fef08a')}
              className="p-1.5 rounded-lg hover:bg-accent text-amber-500 transition cursor-pointer"
            >
              <Highlighter className="w-4 h-4" />
            </button>
          </div>

          <div className="h-5 w-px bg-border mx-1.5" />

          {/* Alignments */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              title="Rata Kiri"
              onClick={() => executeCommand('justifyLeft')}
              className="p-1.5 rounded-lg hover:bg-accent text-foreground/80 hover:text-foreground transition cursor-pointer"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Rata Tengah"
              onClick={() => executeCommand('justifyCenter')}
              className="p-1.5 rounded-lg hover:bg-accent text-foreground/80 hover:text-foreground transition cursor-pointer"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Rata Kanan"
              onClick={() => executeCommand('justifyRight')}
              className="p-1.5 rounded-lg hover:bg-accent text-foreground/80 hover:text-foreground transition cursor-pointer"
            >
              <AlignRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Rata Kanan Kiri (Justify)"
              onClick={() => executeCommand('justifyFull')}
              className="p-1.5 rounded-lg hover:bg-accent text-foreground/80 hover:text-foreground transition cursor-pointer"
            >
              <AlignJustify className="w-4 h-4" />
            </button>
          </div>

          <div className="h-5 w-px bg-border mx-1.5" />

          {/* Lists & Indentation */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              title="Daftar Bullet"
              onClick={() => executeCommand('insertUnorderedList')}
              className="p-1.5 rounded-lg hover:bg-accent text-foreground/80 hover:text-foreground transition cursor-pointer"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Daftar Angka"
              onClick={() => executeCommand('insertOrderedList')}
              className="p-1.5 rounded-lg hover:bg-accent text-foreground/80 hover:text-foreground transition cursor-pointer"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Kurangi Indent"
              onClick={() => executeCommand('outdent')}
              className="p-1.5 rounded-lg hover:bg-accent text-foreground/80 hover:text-foreground transition cursor-pointer"
            >
              <Outdent className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Tambah Indent"
              onClick={() => executeCommand('indent')}
              className="p-1.5 rounded-lg hover:bg-accent text-foreground/80 hover:text-foreground transition cursor-pointer"
            >
              <Indent className="w-4 h-4" />
            </button>
          </div>

          <div className="h-5 w-px bg-border mx-1.5" />

          {/* Insertions */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              title="Sisipkan Tautan"
              onClick={handleInsertLink}
              onMouseDown={(e) => e.preventDefault()}
              className="p-1.5 rounded-lg hover:bg-accent text-foreground/80 hover:text-foreground transition cursor-pointer"
            >
              <Link2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Sisipkan Gambar"
              onClick={handleInsertImage}
              disabled={isUploading}
              onMouseDown={(e) => e.preventDefault()}
              className="p-1.5 rounded-lg hover:bg-accent text-foreground/80 hover:text-foreground transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
              ) : (
                <ImageIcon className="w-4 h-4" />
              )}
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="relative">
              <button
                type="button"
                title="Sisipkan Tabel"
                onClick={() => setIsTableMenuOpen((open) => !open)}
                onMouseDown={(e) => e.preventDefault()}
                className="p-1.5 rounded-lg hover:bg-accent text-foreground/80 hover:text-foreground transition cursor-pointer"
              >
                <TableIcon className="w-4 h-4" />
              </button>

              {isTableMenuOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Tutup pemilih ukuran tabel"
                    className="fixed inset-0 z-40 w-full h-full cursor-default border-0 bg-transparent"
                    onClick={() => setIsTableMenuOpen(false)}
                  />
                  <div className="absolute z-50 top-full left-0 mt-2 bg-popover text-popover-foreground border border-border rounded-xl shadow-xl p-3">
                    <p className="text-xs font-semibold text-foreground mb-2 text-center">
                      {tableSize.rows > 0
                        ? `${tableSize.rows} × ${tableSize.cols} tabel`
                        : 'Pilih ukuran tabel'}
                    </p>
                    <div className="grid grid-cols-6 gap-1">
                      {Array.from({ length: 36 }, (_, i) => {
                        const row = Math.floor(i / 6) + 1;
                        const col = (i % 6) + 1;
                        const isActive = row <= tableSize.rows && col <= tableSize.cols;
                        return (
                          <button
                            type="button"
                            key={i}
                            aria-label={`${row} baris ${col} kolom`}
                            onMouseEnter={() => setTableSize({ rows: row, cols: col })}
                            onClick={() => handleInsertTable(row, col)}
                            className={cn(
                              'w-5 h-5 rounded border cursor-pointer transition-colors',
                              isActive
                                ? 'bg-primary border-primary text-primary-foreground'
                                : 'bg-muted border-border',
                            )}
                          />
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Tree Graph Dropdown */}
            <div className="relative">
              <button
                type="button"
                title="Sisipkan Graph / Pohon"
                onClick={() => setIsTreeMenuOpen((open) => !open)}
                onMouseDown={(e) => e.preventDefault()}
                className="p-1.5 rounded-lg hover:bg-accent text-foreground/80 hover:text-foreground transition cursor-pointer flex items-center gap-0.5"
              >
                <FolderTree className="w-4 h-4" />
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </button>

              {isTreeMenuOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Tutup menu pohon"
                    className="fixed inset-0 z-40 w-full h-full cursor-default border-0 bg-transparent"
                    onClick={() => setIsTreeMenuOpen(false)}
                  />
                  <div className="absolute z-50 top-full left-0 mt-2 w-56 bg-popover text-popover-foreground border border-border rounded-xl shadow-xl p-1.5 space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        handleInsertTree('visual');
                        setIsTreeMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-accent rounded-lg flex items-center gap-2 cursor-pointer transition"
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <div>
                        <div className="font-semibold text-foreground">Tree Visual (Node)</div>
                        <div className="text-[10px] text-muted-foreground">
                          Blok diagram hierarki
                        </div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleInsertTree('ascii');
                        setIsTreeMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-accent rounded-lg flex items-center gap-2 cursor-pointer transition"
                    >
                      <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
                      <div>
                        <div className="font-semibold text-foreground">Tree ASCII</div>
                        <div className="text-[10px] text-muted-foreground">
                          Format folder ├── direktori
                        </div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleInsertTree('mermaid');
                        setIsTreeMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-accent rounded-lg flex items-center gap-2 cursor-pointer transition"
                    >
                      <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                      <div>
                        <div className="font-semibold text-foreground">Mermaid Graph</div>
                        <div className="text-[10px] text-muted-foreground">
                          Sintaks graph TD diagram
                        </div>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* LaTeX / Rumus Dropdown */}
            <div className="relative">
              <button
                type="button"
                title="Sisipkan Rumus & LaTeX"
                onClick={() => setIsLatexMenuOpen((open) => !open)}
                onMouseDown={(e) => e.preventDefault()}
                className="p-1.5 rounded-lg hover:bg-accent text-foreground/80 hover:text-foreground transition cursor-pointer flex items-center gap-0.5"
              >
                <Sigma className="w-4 h-4" />
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </button>

              {isLatexMenuOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Tutup menu latex"
                    className="fixed inset-0 z-40 w-full h-full cursor-default border-0 bg-transparent"
                    onClick={() => setIsLatexMenuOpen(false)}
                  />
                  <div className="absolute z-50 top-full left-0 mt-2 w-56 bg-popover text-popover-foreground border border-border rounded-xl shadow-xl p-1.5 space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        handleInsertLatex('equation');
                        setIsLatexMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-accent rounded-lg flex items-center gap-2 cursor-pointer transition"
                    >
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                      <div>
                        <div className="font-semibold text-foreground">Rumus Matematika</div>
                        <div className="text-[10px] text-muted-foreground">
                          Persamaan LaTeX block
                        </div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleInsertLatex('tree');
                        setIsLatexMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-accent rounded-lg flex items-center gap-2 cursor-pointer transition"
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <div>
                        <div className="font-semibold text-foreground">LaTeX Forest Tree</div>
                        <div className="text-[10px] text-muted-foreground">
                          Pohon sintaksis LaTeX forest
                        </div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleInsertLatex('matrix');
                        setIsLatexMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-accent rounded-lg flex items-center gap-2 cursor-pointer transition"
                    >
                      <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                      <div>
                        <div className="font-semibold text-foreground">Matriks LaTeX</div>
                        <div className="text-[10px] text-muted-foreground">
                          pmatrix aljabar linier
                        </div>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>

            <button
              type="button"
              title="Blok Kode"
              onClick={() => executeCommand('formatBlock', '<pre>')}
              className="p-1.5 rounded-lg hover:bg-accent text-foreground/80 hover:text-foreground transition cursor-pointer"
            >
              <Code2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Hapus Pemformatan"
              onClick={() => executeCommand('removeFormat')}
              className="p-1.5 rounded-lg hover:bg-accent text-foreground/80 hover:text-foreground transition cursor-pointer"
            >
              <RemoveFormatting className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Document Canvas Area */}
      {variant === 'compact' ? (
        <div className="p-3 sm:p-4 bg-card text-foreground overflow-auto">
          {/* biome-ignore lint/a11y/noStaticElementInteractions: editor contentEditable */}
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: editor contentEditable */}
          <div
            ref={editorRef}
            contentEditable={!readOnly}
            onInput={handleInput}
            onClick={handleEditorClick}
            suppressContentEditableWarning
            className={cn(
              'prose dark:prose-invert max-w-none focus:outline-none text-xs sm:text-sm leading-relaxed text-foreground empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground empty:before:pointer-events-none',
              minHeight || 'min-h-[120px]',
            )}
            data-placeholder={placeholder}
          />
        </div>
      ) : (
        <div className="flex-1 bg-muted/20 p-4 sm:p-8 md:p-10 overflow-auto flex justify-center items-start min-h-[560px]">
          {/* Document Paper Sheet */}
          <div
            style={{
              transform: `scale(${scale / 100})`,
              transformOrigin: 'top center',
            }}
            className="w-full max-w-4xl bg-card rounded-2xl shadow-sm border border-border/80 p-6 sm:p-12 md:p-16 min-h-[640px] focus:outline-none transition-transform duration-200 text-foreground"
          >
            {/* biome-ignore lint/a11y/noStaticElementInteractions: editor contentEditable */}
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: editor contentEditable */}
            <div
              ref={editorRef}
              contentEditable={!readOnly}
              onInput={handleInput}
              onClick={handleEditorClick}
              suppressContentEditableWarning
              className={cn(
                'prose dark:prose-invert max-w-none focus:outline-none text-foreground leading-relaxed empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground empty:before:pointer-events-none',
                minHeight || 'min-h-[500px]',
              )}
              data-placeholder={placeholder}
            />
          </div>
        </div>
      )}

      {/* 3. Bottom Document Status Footer Bar */}
      {variant !== 'compact' && (
        <div className="flex items-center justify-between px-6 py-3 border-t border-border bg-card/90 select-none text-xs text-muted-foreground font-medium">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-foreground font-bold">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span>{wordCount} kata</span>
            </div>
            <span className="text-border">&bull;</span>
            <div className="flex items-center gap-1.5 text-primary font-bold">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span>Status Dokumen: Valid</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>Skala Dokumen:</span>
              <select
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="bg-card border border-border text-foreground rounded-lg px-2 py-0.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value={75} className="bg-popover text-popover-foreground">
                  75%
                </option>
                <option value={90} className="bg-popover text-popover-foreground">
                  90%
                </option>
                <option value={100} className="bg-popover text-popover-foreground">
                  100%
                </option>
                <option value={110} className="bg-popover text-popover-foreground">
                  110%
                </option>
                <option value={125} className="bg-popover text-popover-foreground">
                  125%
                </option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
              className="p-1 rounded-lg hover:bg-accent text-foreground/80 hover:text-foreground transition cursor-pointer"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4 text-foreground" />
              ) : (
                <Maximize2 className="w-4 h-4 text-foreground" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Floating delete button for selected image */}
      {!readOnly && selectedImage && selectedImageRect && (
        <button
          type="button"
          onClick={handleDeleteSelectedImage}
          title="Hapus gambar"
          className="fixed z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive text-destructive-foreground text-xs font-bold shadow-lg hover:opacity-90 transition cursor-pointer"
          style={{
            top: selectedImageRect.top + selectedImageRect.height / 2,
            left: selectedImageRect.left - 8,
            transform: 'translate(-100%, -50%)',
          }}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Hapus</span>
        </button>
      )}
    </div>
  );
};

export default RichTextEditor;
