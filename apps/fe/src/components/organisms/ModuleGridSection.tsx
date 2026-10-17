'use client';

import type { IModule, ModuleType } from '@repo/types/module.types';
import { BookOpen, CheckSquare, Layers, Plus, Search, ShieldAlert } from 'lucide-react';
import * as React from 'react';

import { Button, Input, Skeleton } from '@/components/atoms';
import { ModuleCard } from '@/components/molecules/ModuleCard';
import { PageHeader } from '@/components/molecules/PageHeader';

interface ModuleGridSectionProps {
  type: ModuleType;
  modules: IModule[];
  isLoading?: boolean;
  canManage?: boolean;
  onSelect: (module: IModule) => void;
  onCreate: () => void;
  onEdit?: (module: IModule) => void;
  onDelete?: (module: IModule) => void;
}

export function ModuleGridSection({
  type,
  modules,
  isLoading = false,
  canManage = false,
  onSelect,
  onCreate,
  onEdit,
  onDelete,
}: ModuleGridSectionProps) {
  const [search, setSearch] = React.useState('');

  const typeConfig = {
    TASK: {
      title: 'Modul Tugas',
      desc: 'Pilih modul untuk mengelola dan memantau tugas tim Anda.',
      icon: Layers,
      emptyTitle: 'Belum ada modul tugas',
      emptyDesc:
        'Buat modul pertama untuk mengelompokkan tugas berdasarkan sprint, divisi, atau project.',
    },
    TODO: {
      title: 'Modul Todo',
      desc: 'Pilih modul daftar kegiatan harian dan target yang ingin dicapai.',
      icon: CheckSquare,
      emptyTitle: 'Belum ada modul todo',
      emptyDesc: 'Buat modul pertama untuk mengelompokkan checklist harian dan target Anda.',
    },
    NOTE: {
      title: 'Modul Catatan',
      desc: 'Pilih modul catatan untuk mengelola ide, dokumentasi, dan jurnal.',
      icon: BookOpen,
      emptyTitle: 'Belum ada modul catatan',
      emptyDesc:
        'Buat modul pertama untuk mengorganisir dokumen, ringkasan rapat, atau catatan pribadi.',
    },
  }[type];

  const filteredModules = React.useMemo(() => {
    if (!search.trim()) return modules;
    const term = search.toLowerCase();
    return modules.filter(
      (m) =>
        m.name.toLowerCase().includes(term) ||
        (m.description && m.description.toLowerCase().includes(term)),
    );
  }, [modules, search]);

  const IconComp = typeConfig.icon;

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader title={typeConfig.title} description={typeConfig.desc} />

        <div className="flex items-center gap-3 shrink-0">
          {canManage ? (
            <Button onClick={onCreate} className="gap-2 shadow-xs">
              <Plus className="size-4" />
              <span>Buat Modul</span>
            </Button>
          ) : (
            <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground border border-border/50">
              <ShieldAlert className="size-3.5 text-muted-foreground/70" />
              <span>Modul dikelola oleh Owner</span>
            </div>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari modul..."
            className="pl-9 bg-card/60"
          />
        </div>
        <div className="text-xs text-muted-foreground font-medium">
          {filteredModules.length} modul ditemukan
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border/50 p-5 space-y-3 bg-card/40">
              <div className="flex justify-between items-center">
                <Skeleton className="size-10 rounded-lg" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredModules.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[340px] rounded-2xl border border-dashed border-border/70 p-8 text-center bg-card/40">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground mb-4">
            <IconComp className="size-7 opacity-70" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            {search.trim() ? 'Modul tidak ditemukan' : typeConfig.emptyTitle}
          </h3>
          <p className="mt-1.5 text-sm text-muted-foreground max-w-md">
            {search.trim()
              ? `Tidak ada modul yang cocok dengan "${search}".`
              : typeConfig.emptyDesc}
          </p>
          {!search.trim() && canManage && (
            <Button onClick={onCreate} className="mt-5 gap-2">
              <Plus className="size-4" />
              <span>Buat Modul Pertama</span>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredModules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              onSelect={onSelect}
              onEdit={onEdit}
              onDelete={onDelete}
              canManage={canManage}
            />
          ))}
        </div>
      )}
    </div>
  );
}
