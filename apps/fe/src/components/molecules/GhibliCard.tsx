import { cn } from '@/utils/classname';

type GhibliCardProps = React.ComponentProps<'div'> & {
  hover?: boolean;
};

export function GhibliCard({ className, hover = true, children, ...props }: GhibliCardProps) {
  return (
    <div
      className={cn(
        'ghibli-glass flex flex-col gap-4 p-5 md:p-6',
        hover && 'ghibli-card-hover',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
