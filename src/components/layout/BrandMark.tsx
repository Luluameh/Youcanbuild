import { site } from "@/config/site.ts";
import { cn } from "@/lib/cn.ts";

type BrandMarkProps = {
  className?: string;
};

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <img
      src={site.brand.markSrc}
      alt=""
      width={40}
      height={40}
      decoding="async"
      className={cn("size-9 shrink-0 object-contain", className)}
      aria-hidden="true"
    />
  );
}
