import { modeQuick } from "@/components/molecules/QuickAddFab";
import { Button, Input, Label, Textarea } from "@/components/atoms";
import {
  PickCreateNote,
  PickCreateTodo,
  PickRegisterCompany,
} from "@repo/types";
import { Building2, CheckSquare, Eye, EyeOff, FileText } from "lucide-react";

interface QuickAddFormProps {
  formCreateTodo: PickCreateTodo;
  setFormCreateTodo: React.Dispatch<React.SetStateAction<PickCreateTodo>>;
  formCreateNote: PickCreateNote;
  setFormCreateNote: React.Dispatch<React.SetStateAction<PickCreateNote>>;

  mode: modeQuick;
  setMode: React.Dispatch<React.SetStateAction<modeQuick>>;
  handleSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
}

const QuickAddForm: React.FC<QuickAddFormProps> = ({
  formCreateNote,
  formCreateTodo,
  setFormCreateNote,
  setFormCreateTodo,
  mode,
  setMode,
  handleSubmit,
  isPending,
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        <Button
          type="button"
          variant={mode === "todo" ? "default" : "outline"}
          size="sm"
          className="ghibli-btn flex-1"
          onClick={() => setMode("todo")}
        >
          <CheckSquare className="size-4" /> Todo
        </Button>
        <Button
          type="button"
          variant={mode === "note" ? "default" : "outline"}
          size="sm"
          className="ghibli-btn flex-1"
          onClick={() => setMode("note")}
        >
          <FileText className="size-4" /> Note
        </Button>
      </div>

      {mode === "todo" ? (
        <Input
          value={formCreateTodo.text}
          onChange={(e) =>
            setFormCreateTodo((prev) => ({
              ...prev,
              text: e.target.value,
            }))
          }
          placeholder="Apa yang ingin kamu kerjakan?"
          className="w-full rounded-xl border border-input bg-background/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      ) : null}

      {mode === "note" ? (
        <div className="space-y-3">
          <Input
            value={formCreateNote.title}
            onChange={(e) =>
              setFormCreateNote((prev) => ({
                ...prev,
                title: e.target.value,
              }))
            }
            placeholder="Judul catatan"
            className="w-full rounded-xl border border-input bg-background/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <Textarea
            value={formCreateNote.content}
            onChange={(e) =>
              setFormCreateNote((prev) => ({
                ...prev,
                content: e.target.value,
              }))
            }
            placeholder="Tulis ide, jurnal, atau snippet..."
            rows={4}
            className="w-full resize-none rounded-xl border border-input bg-background/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      ) : null}

      <Button type="submit" className="ghibli-btn w-full" disabled={isPending}>
        Simpan
      </Button>
    </form>
  );
};

export default QuickAddForm;
