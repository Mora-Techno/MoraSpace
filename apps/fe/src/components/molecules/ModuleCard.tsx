'use client';

import type { IModule } from '@repo/types/module.types';
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  CheckSquare,
  Folder,
  Layers,
  MoreVertical,
  Pencil,
  Star,
  Target,
  Trash2,
  Zap,
} from 'lucide-react';
import * as React from 'react';

import {
  Badge,
  Button,
  Card,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/atoms';
import { cn } from '@/utils/classname';

interface ModuleCardProps {
  module: IModule;
  onSelect: (module: IModule) => void;
  onEdit?: (module: IModule) => void;
  onDelete?: (module: IModule) => void;
  canManage?: boolean;
}

const ICON_MAP: Record<string, React.ElementType> = {
  folder: Folder,
  layers: Layers,
  todo: CheckSquare,
  book: BookOpen,
  target: Target,
  briefcase: Briefcase,
  zap: Zap,
  star: Star,
};

export function ModuleCard({
  module,
  onSelect,
  onEdit,
  onDelete,
  canManage = false,
}: ModuleCardProps) {
  const IconComponent =
    (module.icon && ICON_MAP[module.icon.toLowerCase()]) ||
    (module.type === 'TASK' ? Layers : module.type === 'TODO' ? CheckSquare : BookOpen);

  const moduleColor = module.color || '#3b82f6';

  const itemCount =
    module.type === 'TASK'
      ? (module._count?.tasks ?? 0)
      : module.type === 'TODO'
        ? (module._count?.todos ?? 0)
        : (module._count?.notes ?? 0);

  const itemLabel = module.type === 'TASK' ? 'Tugas' : module.type === 'TODO' ? 'Todo' : 'Catatan';

  return (
    <Card
      onClick={() => onSelect(module)}
      className={cn(
        'group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border/60 bg-card/60 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-black/5 cursor-pointer',
      )}
    >
      {/* Top accent color bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5 transition-all duration-300 group-hover:h-2"
        style={{ backgroundColor: moduleColor }}
      />

      <div>
        <div className="flex items-start justify-between gap-3 mb-3 pt-1">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110"
            style={{
              backgroundColor: `${moduleColor}18`,
              color: moduleColor,
            }}
          >
            <IconComponent className="size-5" />
          </div>

          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            <Badge variant="outline" className="text-xs font-medium px-2 py-0.5">
              {itemCount} {itemLabel}
            </Badge>

            {canManage && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 rounded-md text-muted-foreground hover:text-foreground"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="size-4" />
                    <span className="sr-only">Aksi Modul</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36">
                  {onEdit && (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(module);
                      }}
                      className="cursor-pointer gap-2"
                    >
                      <Pencil className="size-3.5" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(module);
                      }}
                      className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                      <span>Hapus</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        <h3 className="font-semibold text-foreground text-base tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
          {module.name}
        </h3>

        <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 min-h-[2rem]">
          {module.description || 'Tidak ada deskripsi modul'}
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
        {module.creatorMember?.user ? (
          <span className="truncate max-w-[140px]">
            Oleh{' '}
            <span className="font-medium text-foreground">
              {module.creatorMember.user.fullName}
            </span>
          </span>
        ) : (
          <span>Workspace</span>
        )}

        <div className="flex items-center gap-1 font-medium text-primary group-hover:translate-x-1 transition-transform">
          <span>Buka</span>
          <ArrowRight className="size-3.5" />
        </div>
      </div>
    </Card>
  );
}
