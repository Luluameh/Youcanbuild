import { Link, useParams } from "react-router";
import { AchievementVerificationPanel } from "@/components/learning/AchievementVerificationPanel.tsx";
import { Badge } from "@/components/ui/Badge.tsx";
import { ButtonLink } from "@/components/ui/Button.tsx";
import { Card } from "@/components/ui/Card.tsx";
import { EmptyState } from "@/components/ui/EmptyState.tsx";
import { getAchievement, getModule } from "@/data/catalog.ts";
import { useAuth } from "@/context/AuthContext.tsx";
import { useDocumentTitle } from "@/hooks/useDocumentTitle.ts";
import { pathLabels } from "@/lib/labels.ts";
import { achievementBadgeTone, achievementUiStatus } from "@/lib/learnerProgress.ts";

export function AchievementDetailPage() {
  const { achievementId } = useParams();
  const { earnedAchievements } = useAuth();
  const definition = achievementId ? getAchievement(achievementId) : undefined;
  const earned = earnedAchievements.find((item) => item.achievementId === achievementId);
  const module = definition ? getModule(definition.moduleId) : undefined;

  useDocumentTitle(definition?.name ?? "Achievement");

  if (!definition) {
    return (
      <EmptyState
        title="Achievement not found"
        description="This milestone is not in the catalog."
        action={<ButtonLink to="/learn/achievements">Back to achievements</ButtonLink>}
      />
    );
  }

  if (!earned) {
    return (
      <EmptyState
        title="You have not earned this yet"
        description="Complete the related module milestone on your roadmap."
        action={<ButtonLink to="/learn/roadmap">View roadmap</ButtonLink>}
      />
    );
  }

  const status = achievementUiStatus(earned.verification);

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <Link to="/learn/achievements" className="text-sm font-semibold text-primary hover:text-primary-strong">
        ← All achievements
      </Link>

      <header>
        <Badge tone={achievementBadgeTone(status)}>{status}</Badge>
        <h1 className="mt-3 text-3xl text-ink">{definition.name}</h1>
        <p className="mt-3 text-sm leading-7 text-muted">{definition.description}</p>
      </header>

      <Card>
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="text-muted">Learning path</dt>
            <dd className="font-medium text-ink">{pathLabels[definition.pathId]}</dd>
          </div>
          <div>
            <dt className="text-muted">Milestone completed</dt>
            <dd className="font-medium text-ink">{module?.title ?? definition.moduleId}</dd>
          </div>
          <div>
            <dt className="text-muted">Date earned</dt>
            <dd className="font-medium text-ink">{earned.earnedAt}</dd>
          </div>
        </dl>
      </Card>

      <AchievementVerificationPanel earned={earned} />
    </div>
  );
}
