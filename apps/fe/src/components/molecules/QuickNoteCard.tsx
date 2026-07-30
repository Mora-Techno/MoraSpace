import * as React from "react";
import { Note } from "@repo/types";
import { Edit2, FileText } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

interface QuickNoteCardProps {
  note: Note;
  onClick: () => void;
}

export function QuickNoteCard({ note, onClick }: QuickNoteCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex w-full flex-col items-start gap-2 rounded-xl bg-yellow-100/50 dark:bg-yellow-950/20 p-4 text-left transition-colors hover:bg-yellow-200/50 dark:hover:bg-yellow-900/30"
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-500">
          <FileText className="size-4" />
          <h4 className="text-sm font-semibold truncate">{note.title}</h4>
        </div>
        <Edit2 className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <p className="line-clamp-2 text-xs text-muted-foreground">
        {note.content}
      </p>
      <span className="text-[10px] text-muted-foreground/70">
        {format(new Date(note.createdAt), "dd MMM yyyy", { locale: idLocale })}
      </span>
    </button>
  );
}
