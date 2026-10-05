import { Link } from "react-router";
import { BrandMark } from "@/components/layout/BrandMark.tsx";
import { cn } from "@/lib/cn.ts";

type LogoProps = {
  className?: string;
  /** Show wordmark text beside the mark (default true). */
  showWordmark?: boolean;
};

export function Logo({ className, showWordmark = true }: LogoProps) {
  return (
    <Link
      to="/"
      className={cn("inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-offset-4", className)}
    >
      <BrandMark className="size-9" />
      {showWordmark ? (
        <span className="font-sans text-lg font-bold tracking-tight">
          <span className="text-brand-navy">YouCan</span>
          <span className="text-brand-mint">Build</span>
        </span>
      ) : null}
    </Link>
  );
}
