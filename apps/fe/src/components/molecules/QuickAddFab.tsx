import { Plus } from "lucide-react";

import { Button } from "@/components/atoms";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/atoms/Dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/atoms/Sheet";
import { cn } from "@/utils/classname";
import QuickAddForm from "./form/QuickForm";
import {
  PickCreateNote,
  PickCreateTodo,
  PickRegisterCompany,
} from "@repo/types";
export type modeQuick = "todo" | "note";

interface QuickAddFabProps {
  formCreateTodo: PickCreateTodo;
  setFormCreateTodo: React.Dispatch<React.SetStateAction<PickCreateTodo>>;
  formCreateNote: PickCreateNote;
  setFormCreateNote: React.Dispatch<React.SetStateAction<PickCreateNote>>;

  mode: modeQuick;
  setMode: React.Dispatch<React.SetStateAction<modeQuick>>;
  handleSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
}
export function QuickAddFab({
  formCreateNote,
  formCreateTodo,
  setFormCreateNote,
  setFormCreateTodo,
  mode,
  setMode,
  handleSubmit,
  isPending,
}: QuickAddFabProps) {
  const title = "Tambah Cepat";

  return (
    <>
      {/* Mobile: floating action button with bottom sheet */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className={cn(
                "ghibli-btn fixed right-4 bottom-20 z-40 size-14 rounded-full shadow-lg",
              )}
            >
              <Plus className="size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-3xl">
            <SheetHeader>
              <SheetTitle className="font-serif">{title}</SheetTitle>
            </SheetHeader>
            <div className="px-4 pb-6">
              <QuickAddForm
                formCreateNote={formCreateNote}
                formCreateTodo={formCreateTodo}
                setFormCreateNote={setFormCreateNote}
                setFormCreateTodo={setFormCreateTodo}
                mode={mode}
                setMode={setMode}
                handleSubmit={handleSubmit}
                isPending={isPending}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: inline dialog trigger */}
      <div className="hidden md:block">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="ghibli-btn">
              <Plus className="size-4" /> Quick Add
            </Button>
          </DialogTrigger>
          <DialogContent className="ghibli-glass sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-serif">{title}</DialogTitle>
            </DialogHeader>
            <QuickAddForm
              formCreateNote={formCreateNote}
              formCreateTodo={formCreateTodo}
              setFormCreateNote={setFormCreateNote}
              setFormCreateTodo={setFormCreateTodo}
              mode={mode}
              setMode={setMode}
              handleSubmit={handleSubmit}
              isPending={isPending}
            />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
