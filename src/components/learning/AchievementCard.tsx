import { Link } from "react-router";
import { Badge } from "@/components/ui/Badge.tsx";
import { Card } from "@/components/ui/Card.tsx";
import { getAchievement } from "@/data/catalog.ts";
import {
  achievementBadgeTone,
  achievementUiStatus,
} from "@/lib/learnerProgress.ts";
import { pathLabels } from "@/lib/labels.ts";
import type { EarnedAchievement } from "@/types/index.ts";

type AchievementCardProps = {
  earned: EarnedAchievement;
  linkToDetail?: boolean;
};

export function AchievementCard({ earned, linkToDetail = true }: AchievementCardProps) {
  const definition = getAchievement(earned.achievementId);
  if (!definition) {
    return null;
  }

  const status = achievementUiStatus(earned.verification);
  const content = (
    <Card className="h-full">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={achievementBadgeTone(status)}>{status}</Badge>
        <span className="text-xs text-muted">Earned {earned.earnedAt}</span>
      </div>
      <h3 className="mt-3 text-lg font-semibold text-ink">{definition.name}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{definition.description}</p>
      <p className="mt-3 text-xs font-medium text-primary">{pathLabels[definition.pathId]}</p>
      {status === "Ready to verify on Stellar" ? (
        <p className="mt-3 text-xs text-muted">Open card → Verify Achievement (Stellar wallet)</p>
      ) : null}
      {status === "Verified on Stellar" ? (
        <p className="mt-3 text-xs font-semibold text-success">View verification</p>
      ) : null}
    </Card>
  );

  if (linkToDetail) {
    return (
      <Link
        to={`/learn/achievements/${definition.id}`}
        className="block rounded-2xl focus-visible:outline-offset-4"
      >
        {content}
      </Link>
    );
  }

  return content;
}
