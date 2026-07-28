import * as React from "react";
import { cn } from "@/utils/classname";

interface WidgetHeaderProps {
  title: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function WidgetHeader({
  title,
  icon,
  action,
  className,
}: WidgetHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between mb-4", className)}>
      <div className="flex items-center gap-2">
        {icon && <span className="text-primary">{icon}</span>}
        <h3 className="font-serif text-lg font-semibold">{title}</h3>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
