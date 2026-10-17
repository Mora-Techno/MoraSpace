'use client';

import type {
  IModule,
  ModuleType,
  PickCreateModule,
  PickUpdateModule,
} from '@repo/types/module.types';
import {
  BookOpen,
  Briefcase,
  Check,
  CheckSquare,
  Folder,
  Layers,
  Loader2,
  Star,
  Target,
  Zap,
} from 'lucide-react';
import * as React from 'react';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Textarea,
} from '@/components/atoms';
import { cn } from '@/utils/classname';

interface CreateModuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: ModuleType;
  moduleToEdit?: IModule | null;
  onSubmit: (data: PickCreateModule | PickUpdateModule) => Promise<void>;
  isPending?: boolean;
}

const COLOR_PRESETS = [
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#6366f1', // Indigo
];

const ICONS = [
  { id: 'folder', icon: Folder, label: 'Folder' },
  { id: 'layers', icon: Layers, label: 'Layers' },
  { id: 'todo', icon: CheckSquare, label: 'Todo' },
  { id: 'book', icon: BookOpen, label: 'Buku' },
  { id: 'target', icon: Target, label: 'Target' },
  { id: 'briefcase', icon: Briefcase, label: 'Kantor' },
  { id: 'zap', icon: Zap, label: 'Kilat' },
  { id: 'star', icon: Star, label: 'Bintang' },
];

export function CreateModuleDialog({
  open,
  onOpenChange,
  type,
  moduleToEdit,
  onSubmit,
  isPending = false,
}: CreateModuleDialogProps) {
  const isEditing = !!moduleToEdit;

  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [color, setColor] = React.useState(COLOR_PRESETS[0]);
  const [icon, setIcon] = React.useState('folder');
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (moduleToEdit) {
      setName(moduleToEdit.name || '');
      setDescription(moduleToEdit.description || '');
      setColor(moduleToEdit.color || COLOR_PRESETS[0]);
      setIcon(
        moduleToEdit.icon || (type === 'TASK' ? 'layers' : type === 'TODO' ? 'todo' : 'book'),
      );
    } else {
      setName('');
      setDescription('');
      setColor(COLOR_PRESETS[0]);
      setIcon(type === 'TASK' ? 'layers' : type === 'TODO' ? 'todo' : 'book');
    }
    setError('');
  }, [moduleToEdit, open, type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Nama modul wajib diisi');
      return;
    }

    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() || undefined,
        color,
        icon,
        type,
      });
      onOpenChange(false);
    } catch (err: any) {
      setError(err?.message || 'Gagal menyimpan modul');
    }
  };

  const typeLabel = type === 'TASK' ? 'Tugas' : type === 'TODO' ? 'Todo' : 'Catatan';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Modul' : `Buat Modul ${typeLabel} Baru`}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Perbarui detail modul ini.'
                : `Kelompokkan ${typeLabel.toLowerCase()} Anda ke dalam modul agar tim tetap terorganisir.`}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {error && (
              <div className="rounded-md bg-destructive/15 p-3 text-xs font-medium text-destructive">
                {error}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="module-name">Nama Modul *</Label>
              <Input
                id="module-name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                placeholder={`Contoh: Modul Sprint 1, Modul Onboarding...`}
                autoFocus
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="module-desc">Deskripsi (Opsional)</Label>
              <Textarea
                id="module-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan tujuan atau cakupan modul ini..."
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label>Warna Tema</Label>
              <div className="flex flex-wrap gap-2.5">
                {COLOR_PRESETS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={cn(
                      'relative size-7 rounded-full transition-transform hover:scale-110 flex items-center justify-center cursor-pointer',
                      color === c && 'ring-2 ring-primary ring-offset-2',
                    )}
                    style={{ backgroundColor: c }}
                  >
                    {color === c && <Check className="size-3.5 text-white stroke-[3]" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Ikon Modul</Label>
              <div className="grid grid-cols-4 gap-2">
                {ICONS.map((item) => {
                  const IconComp = item.icon;
                  const isSelected = icon === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setIcon(item.id)}
                      className={cn(
                        'flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg border text-xs font-medium transition-all cursor-pointer',
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border/60 hover:bg-muted text-muted-foreground',
                      )}
                    >
                      <IconComp className="size-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              {isEditing ? 'Simpan Perubahan' : 'Buat Modul'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
