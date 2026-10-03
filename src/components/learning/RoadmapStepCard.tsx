import { CheckCircle2, Circle, Lock } from "lucide-react";
import { Link } from "react-router";
import { Badge } from "@/components/ui/Badge.tsx";
import { ButtonLink } from "@/components/ui/Button.tsx";
import { Card } from "@/components/ui/Card.tsx";
import type { RoadmapStep } from "@/lib/progress.ts";
import { cn } from "@/lib/cn.ts";

type RoadmapStepCardProps = {
  step: RoadmapStep;
  showConnector?: boolean;
};

export function RoadmapStepCard({ step, showConnector = true }: RoadmapStepCardProps) {
  const statusLabel =
    step.status === "completed"
      ? "Completed"
      : step.status === "current"
        ? "Continue learning"
        : "Upcoming";

  const StatusIcon =
    step.status === "completed" ? CheckCircle2 : step.status === "current" ? Circle : Lock;

  return (
    <li className="relative pb-6 last:pb-0">
      {showConnector ? (
        <span className="absolute left-[19px] top-10 h-[calc(100%-2rem)] w-px bg-line" aria-hidden="true" />
      ) : null}
      <Card
        className={cn(
          step.status === "current" && "border-primary/40 ring-1 ring-primary/10",
          step.status === "upcoming" && "opacity-90",
        )}
      >
        <div className="flex gap-3">
          <span
            className={cn(
              "mt-0.5 grid size-10 shrink-0 place-items-center rounded-full",
              step.status === "completed" && "bg-success-soft text-success",
              step.status === "current" && "bg-primary text-white",
              step.status === "upcoming" && "border border-line bg-paper text-muted",
            )}
          >
            <StatusIcon aria-hidden="true" className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-semibold text-primary">Module {step.order}</p>
              <Badge
                tone={
                  step.status === "completed"
                    ? "success"
                    : step.status === "current"
                      ? "primary"
                      : "neutral"
                }
              >
                {statusLabel}
              </Badge>
            </div>
            <h3 className="mt-1 text-lg font-semibold text-ink">{step.title}</h3>
            <p className="mt-1 text-sm leading-6 text-muted">{step.description}</p>
            <p className="mt-2 text-xs text-muted">{step.estimatedDuration}</p>
            {step.topics.length > 0 ? (
              <ul className="mt-3 flex flex-wrap gap-2">
                {step.topics.slice(0, 4).map((topic) => (
                  <li
                    key={topic}
                    className="rounded-full border border-line px-2 py-0.5 text-xs text-muted"
                  >
                    {topic}
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-2">
              {step.status === "current" ? (
                <ButtonLink to={`/learn/modules/${step.id}`}>Continue learning</ButtonLink>
              ) : (
                <Link
                  to={`/learn/modules/${step.id}`}
                  className="text-sm font-semibold text-primary hover:text-primary-strong"
                >
                  Preview module
                </Link>
              )}
            </div>
          </div>
        </div>
      </Card>
    </li>
  );
}
