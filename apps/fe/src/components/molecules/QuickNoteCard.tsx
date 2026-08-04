import { formatTimeOnly } from "@repo";
import { Note } from "@repo/types";
import { Ellipsis, FileText } from "lucide-react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../atoms";
import { AlertContexType } from "@/types/ui";

interface QuickNoteCardProps {
  note: Note;
  onClick: () => void;
  alertType: AlertContexType;
  handleDeleteNote: () => void;
}

export function QuickNoteCard({
  note,
  onClick,
  alertType,
  handleDeleteNote,
}: QuickNoteCardProps) {
  return (
    <div className="group relative flex w-full flex-col items-start gap-2 rounded-xl bg-yellow-100/50 dark:bg-yellow-950/20 p-4 text-left transition-colors hover:bg-yellow-200/50 dark:hover:bg-yellow-900/30">
      <div className="w-full flex justify-between">
        <button
          type="button"
          onClick={onClick}
          className="w-full flex flex-col items-start"
        >
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-500">
              <FileText className="size-4" />
              <h4 className="text-sm font-semibold truncate">{note.title}</h4>
            </div>
          </div>
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {note.content}
          </p>
          <span className="text-[10px] text-muted-foreground/70">
            {formatTimeOnly(note.createdAt)}
          </span>
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Ellipsis
              size={16}
              className=" text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 "
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuLabel className="flex">
              <span className="font-serif text-sm font-semibold">Settings</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <div className=" w-full">
                <Button
                  className="w-full"
                  variant={"destructive"}
                  onClick={() => {
                    alertType.modal({
                      title: "Hapus?",
                      deskripsi: "Apakah kamu ingin menghapus catatan ini?",
                      icon: "question",
                      onConfirm: () => {
                        handleDeleteNote();
                      },
                    });
                  }}
                >
                  Hapus
                </Button>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
