import { PickUpdateTodo } from '@repo/types';
import { CheckSquare, Plus } from 'lucide-react';

import { Button } from '@/components/atoms/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/atoms/Dialog';
import { Input } from '@/components/atoms/Input';

interface TodoCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handleAdd: (e: React.FormEvent) => void;
  formCreateTodo: PickUpdateTodo;
  setFormCreateTodo: React.Dispatch<React.SetStateAction<PickUpdateTodo>>;
  isPending: boolean;
}

const TodoCreateModal: React.FC<TodoCreateModalProps> = ({
  open,
  onOpenChange,
  handleAdd,
  formCreateTodo,
  setFormCreateTodo,
  isPending,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <form onSubmit={handleAdd} className="flex flex-col w-full">
          <DialogHeader className="border-b border-border/30 px-4 py-3">
            <DialogTitle className="flex items-center gap-2 text-sm font-medium">
              <CheckSquare className="size-4 text-emerald-600" />
              Tugas Baru
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-3 p-4">
            <Input
              autoFocus
              placeholder="Tugas baru..."
              value={formCreateTodo.text ?? ''}
              onChange={(e) =>
                setFormCreateTodo((prev) => ({
                  ...prev,
                  text: e.target.value,
                }))
              }
              className="bg-transparent border-none focus-visible:ring-0 px-1 font-medium placeholder:text-muted-foreground/60 text-sm"
              disabled={isPending}
            />
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-border/30 px-4 py-3">
            <Button type="button" variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              className="gap-2"
              disabled={isPending || !formCreateTodo.text?.trim()}
            >
              <Plus className="size-4" />
              Tambah
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TodoCreateModal;
