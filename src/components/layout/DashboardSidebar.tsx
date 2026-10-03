import { NavLink } from "react-router";
import { Avatar } from "@/components/ui/Avatar.tsx";
import { Badge } from "@/components/ui/Badge.tsx";
import { ProgressBar } from "@/components/ui/ProgressBar.tsx";
import { Logo } from "@/components/layout/Logo.tsx";
import { navigationForRole } from "@/config/navigation.ts";
import { cn } from "@/lib/cn.ts";
import type { MentorVerification, UserRole } from "@/types/index.ts";
import type { ProgressSummary } from "@/lib/progress.ts";

type DashboardSidebarProps = {
  role: UserRole;
  displayName: string;
  mentorVerification?: MentorVerification;
  pathTitle?: string;
  progress?: ProgressSummary;
  onNavigate?: () => void;
};

export function DashboardSidebar({
  role,
  displayName,
  mentorVerification = "pending",
  pathTitle,
  progress,
  onNavigate,
}: DashboardSidebarProps) {
  const items = navigationForRole(role);

  return (
    <div className="flex h-full flex-col">
      <Logo className="px-2" />
      <div className="mt-6 flex items-center gap-3 px-2">
        <Avatar name={displayName} />
        <div className="min-w-0">
          <p className="truncate font-semibold text-ink">{displayName}</p>
          <Badge
            tone={
              role === "mentor" && mentorVerification === "pending"
                ? "warning"
                : role === "mentor"
                  ? "success"
                  : "primary"
            }
          >
            {role === "learner"
              ? "Learner"
              : mentorVerification === "verified"
                ? "Verified mentor"
                : "Verification pending"}
          </Badge>
        </div>
      </div>

      {pathTitle && progress ? (
        <div className="mt-6 rounded-2xl border border-line bg-paper px-3 py-3">
          <p className="text-sm font-semibold text-ink">{pathTitle}</p>
          <p className="mt-1 text-xs text-muted">
            {progress.completed} of {progress.total} modules
          </p>
          <ProgressBar className="mt-3" value={progress.percent} label={`${pathTitle} progress`} />
          <p className="mt-2 text-xs font-medium text-primary">{progress.percent}% complete</p>
        </div>
      ) : null}

      <nav className="mt-6 flex flex-col gap-1" aria-label={role === "learner" ? "Learner" : "Mentor"}>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
                  isActive ? "bg-primary-soft text-primary-strong" : "text-ink hover:bg-ink/5",
                )
              }
            >
              <Icon aria-hidden="true" className="size-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
