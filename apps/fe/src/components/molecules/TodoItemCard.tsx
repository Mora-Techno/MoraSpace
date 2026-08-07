import { Todo } from "@repo/types";
import { formatDateTime } from "@repo";
import { TodoCheckbox } from "@/components/molecules/TodoCheckbox";
import { Button } from "../atoms";
import { Trash2 } from "lucide-react";
import { AlertContexType } from "@/types/ui";

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
      className="flex cursor-pointer items-center gap-3  rounded-xl bg-background/50 px-3 py-3 transition-colors hover:bg-background/80"
      onClick={() => onClick(todo.id)}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <TodoCheckbox
          checked={todo.status === "completed"}
          disabled={disabled}
          onChange={handleToggleChange}
        />
      </div>
      <div className="flex w-full flex-col items-start">
        <span
          className={
            todo.status === "completed"
              ? "flex-1 text-sm text-muted-foreground line-through"
              : "flex-1 text-sm"
          }
        >
          {todo.text}
        </span>
        <span className="text-xs text-muted-foreground">
          {todo.dueDate ? formatDateTime(todo.dueDate) : "Tanpa tenggat"}
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="size-8 shrink-0 text-destructive"
        onClick={(e) => {
          e.stopPropagation();
          alert.confirm({
            title: "Hapus ?",
            deskripsi: "Apakah anda yakin menghapus todo ini ?",
            icon: "info",
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
