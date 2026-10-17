'use client';

import type { IModule } from '@repo/types/module.types';
import {
  ArrowLeft,
  BookOpen,
  Check,
  CheckSquare,
  ChevronDown,
  Folder,
  Layers,
  Pencil,
  Trash2,
} from 'lucide-react';
import * as React from 'react';

import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/atoms';
import { cn } from '@/utils/classname';

interface ModuleHeaderProps {
  activeModule: IModule;
  modules: IModule[];
  onBack: () => void;
  onSwitchModule: (module: IModule) => void;
  onEdit?: (module: IModule) => void;
  onDelete?: (module: IModule) => void;
  canManage?: boolean;
  extraAction?: React.ReactNode;
}

export function ModuleHeader({
  activeModule,
  modules,
  onBack,
  onSwitchModule,
  onEdit,
  onDelete,
  canManage = false,
  extraAction,
}: ModuleHeaderProps) {
  const moduleColor = activeModule.color || '#3b82f6';

  const typeIcon =
    activeModule.type === 'TASK' ? (
      <Layers className="size-4" />
    ) : activeModule.type === 'TODO' ? (
      <CheckSquare className="size-4" />
    ) : (
      <BookOpen className="size-4" />
    );

  const typeLabel =
    activeModule.type === 'TASK' ? 'Tugas' : activeModule.type === 'TODO' ? 'Todo' : 'Catatan';

  return (
    <div className="mb-6 rounded-xl border border-border/70 bg-card/60 p-4 sm:p-5 backdrop-blur-sm shadow-xs">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Back button + Module Details */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="gap-1.5 text-xs text-muted-foreground hover:text-foreground h-8 px-2"
            >
              <ArrowLeft className="size-3.5" />
              <span>Semua Modul</span>
            </Button>

            <span className="text-muted-foreground/40 text-xs">/</span>

            <Badge
              variant="outline"
              className="gap-1.5 text-xs font-normal py-0.5"
              style={{
                borderColor: `${moduleColor}40`,
                backgroundColor: `${moduleColor}10`,
                color: moduleColor,
              }}
            >
              <span className="size-2 rounded-full" style={{ backgroundColor: moduleColor }} />
              <span>Modul {typeLabel}</span>
            </Badge>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Quick Switcher Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="group flex items-center gap-2 font-serif text-xl sm:text-2xl font-bold tracking-tight text-foreground hover:text-primary transition-colors cursor-pointer text-left"
                >
                  <span className="line-clamp-1">{activeModule.name}</span>
                  <ChevronDown className="size-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-y-0.5 shrink-0" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="start" className="w-64 max-h-72 overflow-y-auto">
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                  Ganti Modul {typeLabel}
                </div>
                <DropdownMenuSeparator />

                {modules.map((m) => {
                  const isCurrent = m.id === activeModule.id;
                  const mColor = m.color || '#3b82f6';
                  return (
                    <DropdownMenuItem
                      key={m.id}
                      onClick={() => onSwitchModule(m)}
                      className={cn(
                        'flex items-center justify-between cursor-pointer py-2',
                        isCurrent && 'bg-primary/10 font-medium text-primary',
                      )}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className="size-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: mColor }}
                        />
                        <span className="truncate">{m.name}</span>
                      </div>
                      {isCurrent && <Check className="size-4 shrink-0 text-primary" />}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {activeModule.description && (
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 max-w-xl">
              {activeModule.description}
            </p>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          {canManage && (
            <div className="flex items-center gap-1">
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(activeModule)}
                  className="gap-1.5 h-9 text-xs"
                >
                  <Pencil className="size-3.5" />
                  <span className="hidden sm:inline">Edit Modul</span>
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(activeModule)}
                  className="h-9 px-2.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
                >
                  <Trash2 className="size-3.5" />
                  <span className="sr-only">Hapus Modul</span>
                </Button>
              )}
            </div>
          )}

          {extraAction}
        </div>
      </div>
    </div>
  );
}
