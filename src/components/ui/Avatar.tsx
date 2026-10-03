import { cn } from "@/lib/cn.ts";

type AvatarProps = {
  name: string;
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

export function Avatar({ name, className }: AvatarProps) {
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
