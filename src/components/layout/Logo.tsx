import { Link } from "react-router";
import { site } from "@/config/site.ts";
import { cn } from "@/lib/cn.ts";

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <Link
      to="/"
      className={cn("inline-flex items-center gap-2 rounded-lg focus-visible:outline-offset-4", className)}
    >
      <span
        aria-hidden="true"
        className="grid size-8 place-items-center rounded-lg bg-primary font-display text-sm font-semibold text-white"
      >
        Y
      </span>
      <span className="font-display text-lg font-semibold tracking-tight text-ink">{site.name}</span>
    </Link>
  );
}
