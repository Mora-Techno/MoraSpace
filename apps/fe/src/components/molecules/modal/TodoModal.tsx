import React from "react";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { Plus } from "lucide-react";

interface AddTaskFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isPending?: boolean;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({
  value,
  onChange,
  onSubmit,
  isPending = false,
}) => {
  return (
    <form onSubmit={onSubmit} className="mt-auto flex gap-2">
      <Input
        placeholder="Tugas baru..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 h-10 border-transparent bg-background/50 focus-visible:ring-1"
        disabled={isPending}
      />
      <Button
        type="submit"
        size="sm"
        className="h-10 shrink-0 px-3"
        disabled={isPending || !value.trim()}
      >
        <Plus className="size-4" />
      </Button>
    </form>
  );
};

export default AddTaskForm;
