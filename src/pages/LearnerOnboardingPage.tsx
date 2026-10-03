import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Button } from "@/components/ui/Button.tsx";
import { Card } from "@/components/ui/Card.tsx";
import { ProgressBar } from "@/components/ui/ProgressBar.tsx";
import { getModulesForPath } from "@/data/catalog.ts";
import { useAuth } from "@/context/AuthContext.tsx";
import { useDocumentTitle } from "@/hooks/useDocumentTitle.ts";
import { experienceLabels, goalLabels, pathLabels } from "@/lib/labels.ts";
import { getPathIcon, orderedPaths } from "@/lib/paths.ts";
import { cn } from "@/lib/cn.ts";
import type { ExperienceLevel, LearningGoal, LearningPathId } from "@/types/index.ts";

const steps = ["path", "experience", "goal", "confirm"] as const;
type Step = (typeof steps)[number];

function StepProgress({ currentIndex }: { currentIndex: number }) {
  const percent = ((currentIndex + 1) / steps.length) * 100;
  return (
    <ProgressBar
      value={percent}
      label={`Onboarding step ${currentIndex + 1} of ${steps.length}`}
      className="max-w-md"
    />
  );
}

const pathIds = ["frontend", "ui-ux", "web3"] as const;

function pathFromSearchParam(value: string | null): LearningPathId | null {
  if (value && pathIds.includes(value as LearningPathId)) {
    return value as LearningPathId;
  }
  return null;
}

export function LearnerOnboardingPage() {
  useDocumentTitle("Find your path");
  const { completeLearnerOnboarding } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialPath = useMemo(() => pathFromSearchParam(params.get("path")), [params]);
  const [step, setStep] = useState<Step>("path");
  const [pathId, setPathId] = useState<LearningPathId | null>(initialPath);
  const [experience, setExperience] = useState<ExperienceLevel | null>(null);
  const [goal, setGoal] = useState<LearningGoal | null>(null);

  const stepIndex = steps.indexOf(step);
  const previewModules = useMemo(
    () => (pathId ? getModulesForPath(pathId).slice(0, 4) : []),
    [pathId],
  );

  function next() {
    if (step === "path" && pathId) {
      setStep("experience");
    } else if (step === "experience" && experience) {
      setStep("goal");
    } else if (step === "goal" && goal) {
      setStep("confirm");
    }
  }

  function back() {
    if (step === "experience") {
      setStep("path");
    } else if (step === "goal") {
      setStep("experience");
    } else if (step === "confirm") {
      setStep("goal");
    }
  }

  function finish() {
    if (!pathId || !experience || !goal) {
      return;
    }
    completeLearnerOnboarding({ pathId, experience, goal });
    navigate("/learn", { replace: true });
  }

  return (
    <div className="mx-auto w-full max-w-2xl py-10 lg:py-14">
      <p className="text-sm font-semibold text-primary uppercase">Learner onboarding</p>
      <h1 className="mt-2 text-3xl text-ink sm:text-4xl">
        {step === "confirm" ? "Your learning journey is ready." : "Let's set up your path"}
      </h1>
      <p className="mt-3 text-sm leading-6 text-muted">
        We select a structured roadmap from our catalog—no AI claims, just a clear sequence you can follow.
      </p>
      <StepProgress currentIndex={stepIndex} />

      <Card className="mt-8">
        {step === "path" ? (
          <>
            <h2 className="text-xl text-ink">What would you like to learn?</h2>
            <div className="mt-5 grid gap-3">
              {orderedPaths().map((path) => {
                const Icon = getPathIcon(path.id);
                const selected = pathId === path.id;
                return (
                  <button
                    key={path.id}
                    type="button"
                    onClick={() => setPathId(path.id)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-2xl border px-4 py-4 text-left transition-colors",
                      selected ? "border-primary bg-primary-soft" : "border-line hover:border-primary/40",
                    )}
                  >
                    <span className="grid size-10 place-items-center rounded-xl bg-paper-raised text-primary">
                      <Icon aria-hidden="true" className="size-5" />
                    </span>
                    <span>
                      <span className="font-semibold text-ink">{path.title}</span>
                      <span className="mt-1 block text-sm text-muted">{path.estimatedDuration}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        ) : null}

        {step === "experience" ? (
          <>
            <h2 className="text-xl text-ink">Where are you starting from?</h2>
            <div className="mt-5 grid gap-3">
              {(Object.entries(experienceLabels) as Array<[ExperienceLevel, string]>).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setExperience(value)}
                  className={cn(
                    "rounded-2xl border px-4 py-3 text-left text-sm font-medium",
                    experience === value ? "border-primary bg-primary-soft text-primary-strong" : "border-line",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </>
        ) : null}

        {step === "goal" ? (
          <>
            <h2 className="text-xl text-ink">What would you like to achieve?</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {(Object.entries(goalLabels) as Array<[LearningGoal, string]>).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setGoal(value)}
                  className={cn(
                    "rounded-2xl border px-4 py-3 text-left text-sm font-medium",
                    goal === value ? "border-primary bg-primary-soft text-primary-strong" : "border-line",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </>
        ) : null}

        {step === "confirm" && pathId && experience && goal ? (
          <>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-muted">Path</dt>
                <dd className="font-semibold text-ink">{pathLabels[pathId]}</dd>
              </div>
              <div>
                <dt className="text-muted">Starting point</dt>
                <dd className="font-semibold text-ink">{experienceLabels[experience]}</dd>
              </div>
              <div>
                <dt className="text-muted">Goal</dt>
                <dd className="font-semibold text-ink">{goalLabels[goal]}</dd>
              </div>
            </dl>
            <h3 className="mt-6 font-sans text-sm font-semibold text-ink">First milestones</h3>
            <ol className="mt-3 space-y-2">
              {previewModules.map((module) => (
                <li key={module.id} className="rounded-xl border border-line px-3 py-2 text-sm text-muted">
                  {module.order}. {module.title}
                </li>
              ))}
            </ol>
          </>
        ) : null}

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          {step !== "path" ? (
            <Button type="button" variant="ghost" onClick={back}>
              Back
            </Button>
          ) : (
            <span />
          )}
          {step === "confirm" ? (
            <Button type="button" onClick={finish}>
              Start Learning
            </Button>
          ) : (
            <Button
              type="button"
              onClick={next}
              disabled={
                (step === "path" && !pathId) ||
                (step === "experience" && !experience) ||
                (step === "goal" && !goal)
              }
            >
              Continue
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
