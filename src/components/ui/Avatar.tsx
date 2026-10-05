import { cn } from "@/lib/cn.ts";

type AvatarProps = {
  name: string;
  src?: string;
  className?: string;
};

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function Avatar({ name, src, className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt=""
        width={40}
        height={40}
        decoding="async"
        className={cn("size-10 shrink-0 rounded-full object-cover ring-2 ring-line", className)}
      />
    );
  }

  return (
    <span
      className={cn(
        "inline-grid size-10 shrink-0 place-items-center rounded-full bg-primary-soft text-sm font-semibold text-primary-strong",
        className,
      )}
      role="img"
      aria-label={name}
    >
      {initials(name)}
    </span>
  );
}
