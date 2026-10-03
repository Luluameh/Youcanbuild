import type { ReactNode } from "react";
import { cn } from "@/lib/cn.ts";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn("rounded-2xl border border-line bg-paper-raised p-5 shadow-sm", className)}>
      {children}
    </div>
  );
}
