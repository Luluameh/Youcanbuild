import { useAuth } from "@/context/AuthContext.tsx";
import { summarizeProgress } from "@/lib/progress.ts";
import { getLearningPath } from "@/data/catalog.ts";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar.tsx";
import type { UserRole } from "@/types/index.ts";

type DashboardSidebarContainerProps = {
  role: UserRole;
  onNavigate?: () => void;
};

export function DashboardSidebarContainer({ role, onNavigate }: DashboardSidebarContainerProps) {
  const { user, learnerProfile, moduleProgress, mentorProfile } = useAuth();

  const path =
    role === "learner" && learnerProfile?.pathId
      ? getLearningPath(learnerProfile.pathId)
      : undefined;
  const progress =
    role === "learner" && learnerProfile?.pathId
      ? summarizeProgress(learnerProfile.pathId, moduleProgress)
      : undefined;

  return (
    <DashboardSidebar
      role={role}
      onNavigate={onNavigate}
      displayName={
        role === "learner"
          ? (learnerProfile?.displayName ?? user?.displayName ?? "Learner")
          : (mentorProfile?.displayName ?? user?.displayName ?? "Mentor")
      }
      mentorVerification={mentorProfile?.verification ?? "pending"}
      pathTitle={path?.title}
      progress={progress}
    />
  );
}
