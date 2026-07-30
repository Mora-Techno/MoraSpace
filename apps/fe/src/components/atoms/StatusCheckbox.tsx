import * as React from "react";
import { cn } from "@/utils/classname";

interface StatusCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function StatusCheckbox({
  checked,
  onCheckedChange,
  disabled,
  className,
}: StatusCheckboxProps) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
      disabled={disabled}
      className={cn(
        "peer h-5 w-5 shrink-0 rounded-[4px] border-2 border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 checked:bg-primary checked:text-primary-foreground",
        className,
      )}
    />
  );
}
