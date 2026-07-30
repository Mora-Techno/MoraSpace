import { Button } from "@/components/atoms";
import { Skeleton } from "@/components/atoms/Skeleton";
import { GhibliCard } from "@/components/molecules/GhibliCard";
import type { Note } from "@repo/types";

interface NoteEditorSectionProps {
  service: {
    handleSave: () => void;
  };
  state: {
    note: Note | undefined;
    isLoading: boolean;
    title: string;
    setTitle: (val: string) => void;
    content: string;
    setContent: (val: string) => void;
    isPending: boolean;
  };
}

export function NoteEditorSection({ service, state }: NoteEditorSectionProps) {
  const { handleSave } = service;
  const { note, isLoading, title, setTitle, content, setContent, isPending } =
    state;

  if (isLoading) {
    return (
      <GhibliCard>
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-40 w-full" />
      </GhibliCard>
    );
  }

  if (!note) {
    return (
      <GhibliCard>
        <p className="text-muted-foreground">Catatan tidak ditemukan.</p>
      </GhibliCard>
    );
  }

  return (
    <GhibliCard className="h-full min-h-100">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border-none bg-transparent font-serif text-xl font-semibold outline-none"
        placeholder="Judul catatan"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={16}
        className="mt-4 w-full flex-1 resize-none rounded-xl border border-input bg-background/60 px-4 py-3 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-ring"
        placeholder="Tulis catatanmu di sini..."
      />
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isPending}
          className="ghibli-btn"
        >
          {isPending ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>
    </GhibliCard>
  );
}
