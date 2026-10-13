import { formatTimeOnly } from '@repo';
import type { Note } from '@repo/types';
import { Ellipsis, FileText } from 'lucide-react';

import type { AlertContexType } from '@/types/ui';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../atoms';

interface QuickNoteCardProps {
  note: Note;
  onClick: () => void;
  alertType: AlertContexType;
  handleDeleteNote: () => void;
}

export function QuickNoteCard({ note, onClick, alertType, handleDeleteNote }: QuickNoteCardProps) {
  return (
    <div className="group relative flex w-full flex-col items-start gap-2 rounded-2xl border border-border/70 bg-card/85 text-card-foreground p-4 text-left shadow-2xs backdrop-blur-md transition-all duration-200 hover:border-primary/50 hover:bg-card hover:shadow-xs">
      <div className="w-full flex justify-between items-start">
        <button
          type="button"
          onClick={onClick}
          className="w-full flex flex-col items-start pr-2 cursor-pointer"
        >
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <FileText className="size-4 text-primary shrink-0" />
              <h4 className="text-sm font-semibold truncate tracking-tight">{note.title}</h4>
            </div>
          </div>
          <p className="line-clamp-2 text-xs text-muted-foreground mt-1">{note.content}</p>
          <span className="text-[10px] text-muted-foreground/75 mt-2">
            {formatTimeOnly(note.createdAt)}
          </span>
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
            <Ellipsis
              size={16}
              className="text-muted-foreground opacity-60 transition-opacity group-hover:opacity-100"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="flex">
              <span className="font-sans text-xs font-medium text-muted-foreground">
                Pilihan Catatan
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Button
                variant="destructive"
                size="sm"
                className="w-full justify-start cursor-pointer"
                onClick={() => {
                  alertType.modal({
                    title: 'Hapus Catatan?',
                    deskripsi: 'Apakah kamu yakin ingin menghapus catatan ini?',
                    icon: 'question',
                    onConfirm: () => {
                      handleDeleteNote();
                    },
                  });
                }}
              >
                Hapus
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
