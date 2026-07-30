import { Button } from "@/components/atoms";
import { GhibliCard } from "@/components/molecules/GhibliCard";

interface TodoFormSectionProps {
  service: {
    handleSubmit: (e: React.FormEvent) => void;
  };
  state: {
    text: string;
    setText: (val: string) => void;
    dueDate: string;
    setDueDate: (val: string) => void;
    isPending: boolean;
  };
}

export function TodoFormSection({ service, state }: TodoFormSectionProps) {
  const { handleSubmit } = service;
  const { text, setText, dueDate, setDueDate, isPending } = state;

  return (
    <GhibliCard className="h-fit" hover={false}>
      <h2 className="font-serif text-lg font-semibold">Tugas Baru</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Tulis tugas baru..."
          className="w-full rounded-xl border border-input bg-background/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full rounded-xl border border-input bg-background/80 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <Button
          type="submit"
          className="ghibli-btn w-full"
          disabled={isPending}
        >
          {isPending ? "Menambahkan..." : "Tambah Tugas"}
        </Button>
      </form>
    </GhibliCard>
  );
}
