import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { StatusCheckbox } from "@/components/atoms/StatusCheckbox";
import { Todo } from "@repo/types";
import { cn } from "@/utils/classname";

interface TodoItemCardProps {
  todo: Todo;
  isUpdating: boolean;
  onToggle: (checked: boolean) => void;
}

export function TodoItemCard({
  todo,
  isUpdating,
  onToggle,
}: TodoItemCardProps) {
  const isCompleted = todo.status === "completed";

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl bg-background/50 px-3 py-2 transition-opacity",
        isUpdating && "opacity-50",
      )}
    >
      <StatusCheckbox
        checked={isCompleted}
        disabled={isUpdating}
        onCheckedChange={onToggle}
      />
      <span
        className={cn(
          "flex-1 text-sm transition-all",
          isCompleted && "text-muted-foreground line-through",
        )}
      >
        {todo.text}
      </span>
      {todo.dueDate && (
        <span className="text-xs text-muted-foreground">
          {format(new Date(todo.dueDate), "HH:mm", { locale: idLocale })}
        </span>
      )}
    </div>
  );
}
