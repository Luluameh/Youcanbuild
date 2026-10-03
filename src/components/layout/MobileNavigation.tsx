import { NavLink } from "react-router";
import { navigationForRole } from "@/config/navigation.ts";
import { cn } from "@/lib/cn.ts";
import type { UserRole } from "@/types/index.ts";

type MobileNavigationProps = {
  role: UserRole;
};

export function MobileNavigation({ role }: MobileNavigationProps) {
  const items = navigationForRole(role);

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper-raised/95 backdrop-blur lg:hidden"
      aria-label={role === "learner" ? "Learner" : "Mentor"}
    >
      <ul
        className="mx-auto grid max-w-lg"
        style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
      >
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "flex min-h-16 flex-col items-center justify-center gap-1 px-1 text-[11px] font-medium",
                    isActive ? "text-primary" : "text-muted",
                  )
                }
              >
                <Icon aria-hidden="true" className="size-5" />
                {item.label}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
