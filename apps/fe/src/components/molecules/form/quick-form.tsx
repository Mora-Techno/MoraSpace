import { modeQuick } from "@/app/(private)/member/dashboard/_containers/dashboard";
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
  formCreateCompany: PickRegisterCompany;
  setFormCreateCompany: React.Dispatch<
    React.SetStateAction<PickRegisterCompany>
  >;
  showPasswordCompany: boolean;
  setShowPasswordCompany: React.Dispatch<React.SetStateAction<boolean>>;
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
  setShowPasswordCompany,
  showPasswordCompany,
  handleSubmit,
  isPending,
  formCreateCompany,
  setFormCreateCompany,
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        <Button
          type="button"
          variant={mode === "company" ? "default" : "outline"}
          size={"sm"}
          className="ghibli-btn flex-1"
          onClick={() => setMode("company")}
        >
          <Building2 className="size-4" /> Company
        </Button>
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
      {mode === "company" ? (
        <div className="space-y-3">
          <div className="flex flex-col justify-start items-start space-y-2">
            <Label className="text-sm">Name Company:</Label>
            <Input
              value={formCreateCompany.companyName}
              onChange={(e) =>
                setFormCreateCompany((prev) => ({
                  ...prev,
                  companyName: e.target.value,
                }))
              }
              about="companyName"
              placeholder="Mora Space"
              className="w-full rounded-xl border border-input bg-background/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex flex-col justify-start items-start space-y-2">
            <Label className="text-sm">Email:</Label>
            <Input
              value={formCreateCompany.email}
              onChange={(e) =>
                setFormCreateCompany((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              about="email company"
              type="email"
              placeholder="moraspace@gmail.com"
              className="w-full rounded-xl border border-input bg-background/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex flex-col justify-start items-start space-y-2">
            <Label className="text-sm">Full Name:</Label>
            <Input
              value={formCreateCompany.fullName}
              onChange={(e) =>
                setFormCreateCompany((prev) => ({
                  ...prev,
                  fullName: e.target.value,
                }))
              }
              about="fullname"
              type="text"
              placeholder="mora"
              className="w-full rounded-xl border border-input bg-background/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex flex-col justify-start items-start space-y-2">
            <Label className="text-sm">Password:</Label>
            <div className="relative w-full">
              <Input
                value={formCreateCompany.password}
                onChange={(e) =>
                  setFormCreateCompany((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                about="password"
                type={showPasswordCompany ? "text" : "password"}
                placeholder="******"
                className="w-full rounded-xl border border-input bg-background/80 px-4 py-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="button"
                onClick={() => setShowPasswordCompany((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showPasswordCompany ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <Button type="submit" className="ghibli-btn w-full" disabled={isPending}>
        Simpan
      </Button>
    </form>
  );
};

export default QuickAddForm;
