import { Link } from "react-router";
import { RoadmapStepCard } from "@/components/learning/RoadmapStepCard.tsx";
import { ButtonLink } from "@/components/ui/Button.tsx";
import { Card } from "@/components/ui/Card.tsx";
import { EmptyState } from "@/components/ui/EmptyState.tsx";
import { PageHeader } from "@/components/ui/PageHeader.tsx";
import { ProgressBar } from "@/components/ui/ProgressBar.tsx";
import { getLearningPath } from "@/data/catalog.ts";
import { useAuth } from "@/context/AuthContext.tsx";
import { useDocumentTitle } from "@/hooks/useDocumentTitle.ts";
import { summarizeProgress } from "@/lib/progress.ts";

export function LearnerRoadmapPage() {
  const { learnerProfile, moduleProgress } = useAuth();
  useDocumentTitle("Your roadmap");

  const pathId = learnerProfile?.pathId;
  const path = pathId ? getLearningPath(pathId) : undefined;
  const summary = pathId ? summarizeProgress(pathId, moduleProgress) : null;

  if (!pathId || !path || !summary) {
    return (
      <EmptyState
        title="Choose a learning path to start building your roadmap"
        description="Complete onboarding to unlock your structured modules."
        action={<ButtonLink to="/onboarding">Find your path</ButtonLink>}
      />
    );
  }

  if (!summary.current && summary.completed === summary.total) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <PageHeader eyebrow="Roadmap" title="You completed your roadmap!" description={path.title} />
        <EmptyState
          title="You reached the end of this learning path"
          description="Review your achievements or revisit any module you want to practice again."
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <ButtonLink to="/learn/achievements">View achievements</ButtonLink>
              <ButtonLink to="/learn" variant="secondary">
                Back to dashboard
              </ButtonLink>
            </div>
          }
        />
        <ol className="space-y-0">
          {summary.steps.map((step, index) => (
            <RoadmapStepCard
              key={step.id}
              step={{ ...step, status: "completed" }}
              showConnector={index < summary.steps.length - 1}
            />
          ))}
        </ol>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <PageHeader
        eyebrow="Roadmap"
        title={path.title}
        description={path.description}
        actions={
          summary.current ? (
            <ButtonLink to={`/learn/modules/${summary.current.id}`}>Continue learning</ButtonLink>
          ) : undefined
        }
      />

      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-ink">Overall progress</p>
            <p className="mt-1 text-sm text-muted">
              {summary.completed} of {summary.total} modules complete
              {summary.current ? (
                <>
                  {" "}
                  · Current: <span className="font-medium text-ink">{summary.current.title}</span>
                </>
              ) : null}
            </p>
          </div>
          <p className="text-2xl font-semibold text-primary">{summary.percent}%</p>
        </div>
        <ProgressBar className="mt-4" value={summary.percent} label={`${path.title} progress`} />
      </Card>

      <ol className="space-y-0">
        {summary.steps.map((step, index) => (
          <RoadmapStepCard key={step.id} step={step} showConnector={index < summary.steps.length - 1} />
        ))}
      </ol>

      <p className="text-sm text-muted">
        <Link to="/learn" className="font-semibold text-primary hover:text-primary-strong">
          Back to dashboard
        </Link>
      </p>
    </div>
  );
}
