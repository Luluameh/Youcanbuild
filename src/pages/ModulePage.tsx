import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ResourceCard } from "@/components/learning/ResourceCard.tsx";
import { Badge } from "@/components/ui/Badge.tsx";
import { Button, ButtonLink } from "@/components/ui/Button.tsx";
import { Card } from "@/components/ui/Card.tsx";
import { ConfirmModal, Modal } from "@/components/ui/Modal.tsx";
import { EmptyState } from "@/components/ui/EmptyState.tsx";
import { getAchievement, getLearningPath, getModule } from "@/data/catalog.ts";
import { useAuth } from "@/context/AuthContext.tsx";
import { useDocumentTitle } from "@/hooks/useDocumentTitle.ts";
import { pathLabels } from "@/lib/labels.ts";
import { canCompleteModule, moduleBelongsToPath } from "@/lib/learnerProgress.ts";
import { summarizeProgress } from "@/lib/progress.ts";

export function ModulePage() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { learnerProfile, moduleProgress, completeModule } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [completionError, setCompletionError] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);
  const [lastResult, setLastResult] = useState<{
    moduleTitle: string;
    nextTitle?: string;
    achievementName?: string;
    pathComplete: boolean;
    nextModuleId?: string;
  } | null>(null);

  const pathId = learnerProfile?.pathId;
  const module = moduleId ? getModule(moduleId) : undefined;
  const path = pathId ? getLearningPath(pathId) : undefined;
  const summary = pathId ? summarizeProgress(pathId, moduleProgress) : null;
  const step = summary?.steps.find((item) => item.id === moduleId);

  useDocumentTitle(module?.title ?? "Module");

  if (!pathId || !path) {
    return (
      <EmptyState
        title="Choose a learning path first"
        description="Your modules appear after onboarding."
        action={<ButtonLink to="/onboarding">Find your path</ButtonLink>}
      />
    );
  }

  if (!moduleId || !module) {
    return (
      <EmptyState
        title="Module not found"
        description="That module is not in the catalog."
        action={<ButtonLink to="/learn/roadmap">View roadmap</ButtonLink>}
      />
    );
  }

  if (!moduleBelongsToPath(pathId, moduleId)) {
    return (
      <EmptyState
        title="This module is not on your path"
        description={`${module.title} belongs to ${pathLabels[module.pathId]}, not your current roadmap.`}
        action={<ButtonLink to="/learn/roadmap">Back to your roadmap</ButtonLink>}
      />
    );
  }

  const status = step?.status ?? "upcoming";
  const isCurrent = status === "current";
  const isCompleted = status === "completed";
  const canComplete = canCompleteModule(pathId, moduleId, moduleProgress);

  function handleConfirmComplete() {
    if (!moduleId) {
      return;
    }
    setCompleting(true);
    setCompletionError(null);
    const result = completeModule(moduleId);
    setCompleting(false);
    setConfirmOpen(false);

    if (!result.ok) {
      setCompletionError(result.reason);
      return;
    }

    if (result.alreadyCompleted) {
      return;
    }

    const achievement = result.achievementId ? getAchievement(result.achievementId) : undefined;
    const nextModule = result.nextModuleId ? getModule(result.nextModuleId) : undefined;

    setLastResult({
      moduleTitle: module!.title,
      nextTitle: nextModule?.title,
      achievementName: achievement?.name,
      pathComplete: result.pathComplete,
      nextModuleId: result.nextModuleId,
    });
    setSuccessOpen(true);
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 pb-8">
      <Link
        to="/learn/roadmap"
        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-strong"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to roadmap
      </Link>

      <header>
        <p className="text-sm font-semibold text-primary">{path.title}</p>
        <h1 className="mt-2 text-3xl text-ink sm:text-4xl">{module.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge tone={isCompleted ? "success" : isCurrent ? "primary" : "neutral"}>
            {isCompleted ? "Completed" : isCurrent ? "Current module" : "Upcoming"}
          </Badge>
          <span className="text-sm text-muted">{module.estimatedDuration}</span>
        </div>
      </header>

      <Card>
        <h2 className="font-sans text-lg font-semibold text-ink">Overview</h2>
        <p className="mt-2 text-sm leading-7 text-muted">{module.description}</p>
      </Card>

      <Card>
        <h2 className="font-sans text-lg font-semibold text-ink">Learning objectives</h2>
        <p className="mt-2 text-sm text-muted">By the end of this module, you&apos;ll be able to:</p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted">
          {module.objectives.map((objective) => (
            <li key={objective}>{objective}</li>
          ))}
        </ul>
      </Card>

      <Card>
        <h2 className="font-sans text-lg font-semibold text-ink">Topics</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {module.topics.map((topic) => (
            <li key={topic} className="rounded-full border border-line px-3 py-1 text-sm text-muted">
              {topic}
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <h2 className="font-sans text-lg font-semibold text-ink">Learning resources</h2>
        <ul className="mt-4 space-y-3">
          {module.resources.map((resource) => (
            <li key={resource.id}>
              <ResourceCard resource={resource} />
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <h2 className="font-sans text-lg font-semibold text-ink">Practical task</h2>
        <p className="mt-2 text-sm leading-7 text-muted">{module.practicalTask}</p>
      </Card>

      <Card className="border-dashed bg-paper">
        <h2 className="font-sans text-lg font-semibold text-ink">Need structured support?</h2>
        <p className="mt-2 text-sm text-muted">
          Stuck on this module? Get mentor guidance on your path and topic—without sharing contact details.
        </p>
        <ButtonLink
          to={`/learn/mentors?moduleId=${encodeURIComponent(moduleId)}${pathId === "frontend" || pathId === "ui-ux" || pathId === "web3" ? `&filter=${pathId}` : ""}`}
          variant="secondary"
          className="mt-4"
        >
          Stuck on this module? Get mentor guidance
        </ButtonLink>
      </Card>

      {completionError ? (
        <p className="text-sm text-danger" role="alert">
          {completionError}
        </p>
      ) : null}

      {isCurrent && canComplete ? (
        <Card className="border-primary/25 bg-primary-soft/20">
          <p className="text-sm font-semibold text-ink">Ready to mark this module complete?</p>
          <p className="mt-2 text-sm text-muted">
            This updates your progress and unlocks your next step. It does not submit work for grading.
          </p>
          <Button type="button" className="mt-4" onClick={() => setConfirmOpen(true)}>
            Complete Module
          </Button>
        </Card>
      ) : null}

      {isCompleted ? (
        <p className="text-sm font-medium text-success">You completed this module.</p>
      ) : null}

      {!isCurrent && !isCompleted ? (
        <p className="text-sm text-muted">
          Preview this module now. Complete it when it becomes your current step on the roadmap.
        </p>
      ) : null}

      <ConfirmModal
        open={confirmOpen}
        title={`Ready to complete ${module.title}?`}
        description="This will mark the module complete and unlock your next step."
        confirmLabel="Complete Module"
        onConfirm={handleConfirmComplete}
        onClose={() => setConfirmOpen(false)}
        loading={completing}
      />

      <Modal
        open={successOpen}
        title="Module complete!"
        description={`You've completed ${lastResult?.moduleTitle ?? module.title}.`}
        onClose={() => setSuccessOpen(false)}
        footer={
          <>
            <Button type="button" variant="ghost" onClick={() => setSuccessOpen(false)}>
              Close
            </Button>
            {!lastResult?.pathComplete && lastResult?.nextModuleId ? (
              <Button
                type="button"
                onClick={() => {
                  setSuccessOpen(false);
                  navigate(`/learn/modules/${lastResult.nextModuleId}`);
                }}
              >
                Continue to next module
              </Button>
            ) : null}
            <ButtonLink
              to="/learn/roadmap"
              variant="secondary"
              onClick={() => setSuccessOpen(false)}
            >
              View roadmap
            </ButtonLink>
          </>
        }
      >
        {lastResult?.nextTitle && !lastResult.pathComplete ? (
          <p className="text-sm text-muted">
            Next up: <span className="font-semibold text-ink">{lastResult.nextTitle}</span>
          </p>
        ) : null}
        {lastResult?.pathComplete ? (
          <p className="text-sm font-semibold text-primary">Roadmap complete — great work!</p>
        ) : null}
        {lastResult?.achievementName ? (
          <div className="mt-4 rounded-xl border border-primary/20 bg-primary-soft/40 px-4 py-3">
            <p className="text-sm font-semibold text-ink">Achievement earned</p>
            <p className="mt-1 font-medium text-ink">{lastResult.achievementName}</p>
            <Badge tone="primary" className="mt-2">
              Ready to verify
            </Badge>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
