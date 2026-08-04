import { Button, Skeleton } from "@/components/atoms";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/Dialog";
import { Input } from "@/components/atoms";
import { PickCreateNote } from "@repo";
import { SendHorizontal } from "lucide-react";

interface QuickNoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handleAdd: (e: React.FormEvent) => void;
  formCreateNote: PickCreateNote;
  setFormCreateNote: React.Dispatch<React.SetStateAction<PickCreateNote>>;
  isPending: boolean;
}
const QuickNoteModal: React.FC<QuickNoteModalProps> = ({
  onOpenChange,
  open,
  handleAdd,
  formCreateNote,
  setFormCreateNote,
  isPending,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="ghibli-glass sm:max-w-md p-0 overflow-hidden">
        <DialogHeader className="border-b border-border/30 px-4 py-3">
          <DialogTitle className="font-serif text-lg font-semibold flex items-center gap-2">
            Catatan
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleAdd}
          className="mt-auto flex flex-col gap-2 rounded-xl bg-background/40 p-3 ring-1 ring-border/50"
        >
          <Input
            placeholder="Judul catatan..."
            value={formCreateNote.title}
            onChange={(e) =>
              setFormCreateNote((prev) => ({ ...prev, title: e.target.value }))
            }
            className="bg-transparent h-8 border-none focus-visible:ring-0 px-1 font-medium placeholder:text-muted-foreground/60 text-sm"
            disabled={isPending}
          />
          <div className="flex items-end gap-2">
            <Input
              placeholder="Tulis idemu disini..."
              value={formCreateNote.content}
              onChange={(e) =>
                setFormCreateNote((prev) => ({
                  ...prev,
                  content: e.target.value,
                }))
              }
              className="flex-1 bg-transparent h-8 border-none focus-visible:ring-0 px-1 text-sm"
              disabled={isPending}
            />
            <Button
              type="submit"
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-primary hover:text-primary hover:bg-primary/20 shrink-0"
              disabled={
                isPending ||
                !formCreateNote.title.trim() ||
                !formCreateNote.content.trim()
              }
            >
              <SendHorizontal className="size-4" />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuickNoteModal;
