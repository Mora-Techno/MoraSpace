import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/Dialog";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Textarea } from "@/components/atoms/Textarea";
import { PickCreateNote } from "@repo";

interface NoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
  formCreateNote: PickCreateNote;
  setFormCreateNote: React.Dispatch<React.SetStateAction<PickCreateNote>>;
}

export function NoteModal({
  open,
  onOpenChange,
  formCreateNote,
  handleSubmit,
  setFormCreateNote,
  isPending,
}: NoteModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="ghibli-glass sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif">Catatan Baru</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="modal-title" className="text-sm font-medium">
              Judul
            </label>
            <Input
              id="modal-title"
              value={formCreateNote.title}
              onChange={(e) =>
                setFormCreateNote((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              placeholder="Judul catatan..."
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="modal-content" className="text-sm font-medium">
              Isi Catatan
            </label>
            <Textarea
              id="modal-content"
              value={formCreateNote.content}
              onChange={(e) =>
                setFormCreateNote((prev) => ({
                  ...prev,
                  content: e.target.value,
                }))
              }
              placeholder="Tulis sesuatu..."
              rows={5}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={!formCreateNote.title.trim() || isPending}
            >
              {isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
