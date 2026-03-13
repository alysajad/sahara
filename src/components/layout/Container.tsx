import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div
      className={cn("max-w-7xl mx-auto px-6 w-full relative z-10", className)}
      {...props}
    >
      {children}
    </div>
  );
}
