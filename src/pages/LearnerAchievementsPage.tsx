import { AchievementCard } from "@/components/learning/AchievementCard.tsx";
import { ButtonLink } from "@/components/ui/Button.tsx";
import { Card } from "@/components/ui/Card.tsx";
import { EmptyState } from "@/components/ui/EmptyState.tsx";
import { PageHeader } from "@/components/ui/PageHeader.tsx";
import { StatCard } from "@/components/dashboard/StatCard.tsx";
import { getLearningPath } from "@/data/catalog.ts";
import { useAuth } from "@/context/AuthContext.tsx";
import { useDocumentTitle } from "@/hooks/useDocumentTitle.ts";
import { countVerifiedAchievements } from "@/lib/learnerProgress.ts";
import { getAchievement } from "@/data/catalog.ts";

export function LearnerAchievementsPage() {
  const { learnerProfile, earnedAchievements } = useAuth();
  useDocumentTitle("Achievements");

  const pathId = learnerProfile?.pathId;
  const path = pathId ? getLearningPath(pathId) : undefined;
  const verifiedCount = countVerifiedAchievements(earnedAchievements);
  const sorted = [...earnedAchievements].sort((left, right) => right.earnedAt.localeCompare(left.earnedAt));
  const readyToVerify = sorted.filter((item) => item.verification.status === "ready");
  const firstReady = readyToVerify[0];
  const firstReadyName = firstReady ? getAchievement(firstReady.achievementId)?.name : undefined;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <PageHeader
        eyebrow="Achievements"
        title="Your achievements"
        description="Earn milestones locally, then optionally verify major ones on Stellar testnet (any supported wallet)."
      />

      {firstReady ? (
        <Card className="border-primary/25 bg-primary-soft/20">
          <p className="text-sm font-semibold text-ink">Stellar verification available</p>
          <p className="mt-2 text-sm leading-6 text-muted">
            Open an achievement with the badge <strong className="text-ink">Ready to verify on Stellar</strong>, then
            click <strong className="text-ink">Verify Achievement</strong>. A wallet picker opens (Freighter, LOBSTR,
            WalletConnect, and more)—there is no wallet button on the rest of the app.
          </p>
          <ButtonLink to={`/learn/achievements/${firstReady.achievementId}`} className="mt-4">
            Verify {firstReadyName ?? "achievement"} on Stellar
          </ButtonLink>
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Earned" value={String(sorted.length)} />
        <StatCard label="Learning path" value={path?.title ?? "Not selected"} />
        <StatCard label="Verified" value={String(verifiedCount)} />
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          title="Your first achievement is waiting"
          description="Complete a major learning milestone to earn it."
          action={<ButtonLink to="/learn/roadmap">View roadmap</ButtonLink>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {sorted.map((earned) => (
            <AchievementCard key={earned.achievementId} earned={earned} />
          ))}
        </div>
      )}

        <Card className="border-dashed bg-paper">
        <p className="text-sm leading-6 text-muted">
          Achievements marked <strong className="font-semibold text-ink">Ready to verify on Stellar</strong> need a short
          knowledge check, then wallet verification on testnet. Verified milestones include a printable certificate.
        </p>
      </Card>
    </div>
  );
}
