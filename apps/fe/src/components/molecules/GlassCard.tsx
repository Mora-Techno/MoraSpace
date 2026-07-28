import { cn } from "@/utils/classname";

export function GlassCard({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "gsap-widget rounded-2xl border border-border/40 bg-card/70 shadow-lg shadow-black/[0.02] backdrop-blur-xl transition-all duration-300 hover:shadow-xl hover:shadow-black/[0.04] dark:border-border/30 dark:bg-card/60 dark:shadow-black/[0.08]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
