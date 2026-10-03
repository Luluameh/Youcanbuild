import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { AchievementCard } from "@/components/learning/AchievementCard.tsx";
import { ButtonLink } from "@/components/ui/Button.tsx";
import { Card } from "@/components/ui/Card.tsx";
import { EmptyState } from "@/components/ui/EmptyState.tsx";
import { PageHeader } from "@/components/ui/PageHeader.tsx";
import { ProgressBar } from "@/components/ui/ProgressBar.tsx";
import { StatCard } from "@/components/dashboard/StatCard.tsx";
import { getLearningPath } from "@/data/catalog.ts";
import { useAuth } from "@/context/AuthContext.tsx";
import { useMentorship } from "@/context/MentorshipContext.tsx";
import { useDocumentTitle } from "@/hooks/useDocumentTitle.ts";
import { summarizeProgress } from "@/lib/progress.ts";

export function LearnerDashboardPage() {
  const { user, learnerProfile, moduleProgress, earnedAchievements } = useAuth();
  const { getLearnerRequests } = useMentorship();
  useDocumentTitle("Dashboard");

  const pathId = learnerProfile?.pathId;
  const path = pathId ? getLearningPath(pathId) : undefined;
  const summary = pathId ? summarizeProgress(pathId, moduleProgress) : null;
  const learnerRequests = user ? getLearnerRequests(user.id) : [];
  const pendingRequest = learnerRequests.find((request) => request.status === "pending");
  const acceptedRequest = learnerRequests.find((request) => request.status === "accepted");
  const recentCompleted = learnerRequests.find((request) => request.status === "completed");

  if (!user || !learnerProfile || !path || !summary) {
    return (
      <EmptyState
        title="Choose a learning path to start building your roadmap"
        description="Complete onboarding to see your dashboard."
        action={<ButtonLink to="/onboarding">Find your path</ButtonLink>}
      />
    );
  }

  const pathComplete = !summary.current && summary.completed === summary.total;
  const recentEarned = [...earnedAchievements]
    .sort((left, right) => right.earnedAt.localeCompare(left.earnedAt))
    .slice(0, 2);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <PageHeader
        eyebrow="Welcome back"
        title={`${user.displayName}, continue your journey.`}
        description={
          pathComplete
            ? `${path.title} · Roadmap complete`
            : `${path.title} · ${summary.percent}% complete`
        }
        actions={
          pathComplete ? (
            <ButtonLink to="/learn/roadmap">View roadmap</ButtonLink>
          ) : summary.current ? (
            <ButtonLink to={`/learn/modules/${summary.current.id}`}>
              Continue Learning
              <ArrowRight aria-hidden="true" className="size-4" />
            </ButtonLink>
          ) : (
            <ButtonLink to="/learn/roadmap">View roadmap</ButtonLink>
          )
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Current path"
          value={path.title}
        />
        <StatCard
          label="Current module"
          value={summary.current?.title ?? "Roadmap complete"}
        />
        <StatCard label="Modules done" value={`${summary.completed} / ${summary.total}`} />
      </div>

      <Card>
        <h2 className="font-sans text-lg font-semibold text-ink">Progress</h2>
        <ProgressBar className="mt-4" value={summary.percent} label={`${path.title} progress`} />
        {summary.current ? (
          <p className="mt-2 text-sm text-muted">
            Focus: <span className="font-medium text-ink">{summary.current.focus}</span>
          </p>
        ) : (
          <p className="mt-2 text-sm font-medium text-primary">You completed your roadmap!</p>
        )}
        <Link to="/learn/roadmap" className="mt-4 inline-block text-sm font-semibold text-primary">
          View full roadmap
        </Link>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-sans text-lg font-semibold text-ink">Upcoming milestones</h2>
          {pathComplete ? (
            <p className="mt-3 text-sm text-muted">You reached the end of this path. Celebrate what you built.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {summary.steps
                .filter((step) => step.status !== "completed")
                .slice(0, 4)
                .map((step) => (
                  <li key={step.id} className="flex items-center justify-between gap-2 text-sm">
                    <span className="text-ink">{step.title}</span>
                    <span className="shrink-0 capitalize text-muted">{step.status}</span>
                  </li>
                ))}
            </ul>
          )}
        </Card>

        <Card>
          <h2 className="font-sans text-lg font-semibold text-ink">Recent achievements</h2>
          {recentEarned.length === 0 ? (
            <p className="mt-3 text-sm text-muted">
              Your first achievement is waiting. Complete a milestone to earn it.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {recentEarned.map((earned) => (
                <AchievementCard key={earned.achievementId} earned={earned} />
              ))}
            </div>
          )}
          <Link to="/learn/achievements" className="mt-4 inline-block text-sm font-semibold text-primary">
            View achievements
          </Link>
        </Card>
      </div>

      <Card>
        <h2 className="font-sans text-lg font-semibold text-ink">Mentor support</h2>
        {pendingRequest ? (
          <>
            <p className="mt-2 text-sm font-medium text-ink">Mentorship request pending</p>
            <p className="mt-1 text-sm text-muted">
              Topic: <span className="font-medium text-ink">{pendingRequest.topic}</span>
            </p>
            <ButtonLink to={`/learn/mentorship/${pendingRequest.id}`} variant="secondary" className="mt-4">
              View request
            </ButtonLink>
          </>
        ) : acceptedRequest ? (
          <>
            <p className="mt-2 text-sm font-medium text-ink">Your mentor request was accepted</p>
            <p className="mt-1 text-sm text-muted">Open your request for structured guidance—no private chat.</p>
            <ButtonLink to={`/learn/mentorship/${acceptedRequest.id}`} variant="secondary" className="mt-4">
              View request
            </ButtonLink>
          </>
        ) : recentCompleted ? (
          <>
            <p className="mt-2 text-sm text-muted">
              Recent support on <span className="font-medium text-ink">{recentCompleted.topic}</span> is marked complete.
            </p>
            <ButtonLink to="/learn/mentorship" variant="secondary" className="mt-4">
              My requests
            </ButtonLink>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm text-muted">Need some guidance?</p>
            <p className="text-sm text-muted">Find a mentor who knows what you&apos;re learning.</p>
            <ButtonLink to="/learn/mentors" variant="secondary" className="mt-4">
              Find a mentor
            </ButtonLink>
          </>
        )}
      </Card>
    </div>
  );
}
