import { formatDateTime } from '@repo';
import { Todo } from '@repo/types';
import { Trash2 } from 'lucide-react';

import { TodoCheckbox } from '@/components/molecules/TodoCheckbox';
import { AlertContexType } from '@/types/ui';

import { Button } from '../atoms';

type TodoListItemProps = {
  todo: Todo;
  alert: AlertContexType;
  disabled: boolean;
  onToggle: (id: string, checked: boolean) => void;
  onDelete: (id: string) => void;
  onClick: (id: string) => void;
};

export function TodoListItem({
  todo,
  disabled,
  onToggle,
  alert,
  onDelete,
  onClick,
}: TodoListItemProps) {
  const todoId = { id: todo.id };

  const handleToggleChange = (checked: boolean) => {
    onToggle(todoId.id, checked);
  };

  const handleDeleteClick = () => {
    onDelete(todoId.id);
  };

  return (
    <li
      data-stagger-item
      className="group flex cursor-pointer items-center gap-3 rounded-2xl border border-border/40 bg-card/65 px-3.5 py-3 transition-all duration-200 hover:border-border/70 hover:bg-card/90 hover:shadow-2xs"
      onClick={() => onClick(todo.id)}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <TodoCheckbox
          checked={todo.status === 'completed'}
          disabled={disabled}
          onChange={handleToggleChange}
        />
      </div>
      <div className="flex w-full flex-col items-start min-w-0">
        <span
          className={
            todo.status === 'completed'
              ? 'flex-1 text-sm text-muted-foreground line-through truncate w-full'
              : 'flex-1 text-sm text-foreground truncate w-full font-medium'
          }
        >
          {todo.text}
        </span>
        <span className="text-xs text-muted-foreground/80 mt-0.5">
          {todo.dueDate ? formatDateTime(todo.dueDate) : 'Tanpa tenggat'}
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="size-8 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          alert.confirm({
            title: 'Hapus ?',
            deskripsi: 'Apakah anda yakin menghapus todo ini ?',
            icon: 'info',
            onConfirm: () => {
              handleDeleteClick();
            },
          });
        }}
        disabled={disabled}
      >
        <Trash2 className="size-4" />
      </Button>
    </li>
  );
}
