import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/Dialog";
// Sesuaikan import Input, Textarea, dan Button dengan struktur folder Anda
import { Input } from "@/components/atoms/Input";
import { Textarea } from "@/components/atoms/Textarea";
import { Button } from "@/components/atoms/Button";
import { FileEdit, Save } from "lucide-react";
import { PickUpdateNote } from "@repo";

interface EditNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formEditNote: PickUpdateNote;
  setFormEditNote: React.Dispatch<React.SetStateAction<PickUpdateNote>>;
  handleSaveEdit: (e: React.FormEvent<HTMLFormElement>) => void;
  isPending?: boolean;
}

const EditNoteDialog: React.FC<EditNoteDialogProps> = ({
  open,
  onOpenChange,
  formEditNote,
  setFormEditNote,
  handleSaveEdit,
  isPending = false,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
        <form onSubmit={handleSaveEdit} className="flex flex-col w-full">
          <DialogHeader className="border-b border-border/30 px-4 py-3">
            <DialogTitle className="flex items-center gap-2 text-sm font-medium">
              <FileEdit className="size-4 text-yellow-600" />
              Edit Catatan
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-3 p-4">
            <Input
              placeholder="Judul catatan..."
              value={formEditNote.title}
              onChange={(e) =>
                setFormEditNote((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              className=" border-none focus-visible:ring-0 px-1 font-medium placeholder:text-muted-foreground/60 text-sm"
            />
            <Textarea
              placeholder="Tulis idemu disini..."
              value={formEditNote.content}
              onChange={(e) =>
                setFormEditNote((prev) => ({
                  ...prev,
                  content: e.target.value,
                }))
              }
              rows={5}
              className=" border-none focus-visible:ring-0 px-1 text-sm resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-border/30 px-4 py-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              className="gap-2"
              disabled={
                isPending ||
                !formEditNote.title.trim() ||
                !formEditNote.content.trim()
              }
            >
              <Save className="size-4" />
              Simpan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditNoteDialog;
