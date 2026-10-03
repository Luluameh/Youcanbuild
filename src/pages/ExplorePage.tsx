import { Navigate, useParams } from "react-router";
import { SkillCard } from "@/components/marketing/SkillCard.tsx";
import { ButtonLink } from "@/components/ui/Button.tsx";
import { Card } from "@/components/ui/Card.tsx";
import { EmptyState } from "@/components/ui/EmptyState.tsx";
import { PageHeader } from "@/components/ui/PageHeader.tsx";
import { getLearningPath, getModulesForPath } from "@/data/catalog.ts";
import { useDocumentTitle } from "@/hooks/useDocumentTitle.ts";
import { getPathIcon, orderedPaths } from "@/lib/paths.ts";
import type { LearningPathId } from "@/types/index.ts";

function PathIconMark({ pathId }: { pathId: LearningPathId }) {
  const Icon = getPathIcon(pathId);
  return (
    <span className="grid size-11 place-items-center rounded-2xl bg-primary-soft text-primary">
      <Icon aria-hidden="true" className="size-5" />
    </span>
  );
}

export function ExplorePage() {
  useDocumentTitle("Explore skills");

  return (
    <div className="mx-auto w-full max-w-6xl py-10 lg:py-14">
      <PageHeader
        eyebrow="Explore"
        title="Choose a technology path"
        description="Each path is a structured roadmap with modules, resources, and practical tasks—ready to follow from day one."
      />
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {orderedPaths().map((path) => (
          <SkillCard key={path.id} path={path} icon={getPathIcon(path.id)} />
        ))}
      </div>
    </div>
  );
}

const pathIds = ["frontend", "ui-ux", "web3"] as const;

function isLearningPathId(value: string | undefined): value is LearningPathId {
  return pathIds.includes(value as LearningPathId);
}

export function PathDetailPage() {
  const { pathId: rawPathId } = useParams();
  const pathId = isLearningPathId(rawPathId) ? rawPathId : undefined;
  const path = pathId ? getLearningPath(pathId) : undefined;
  const modules = path ? getModulesForPath(path.id) : [];

  useDocumentTitle(path?.title ?? "Learning path");

  if (!path) {
    return (
      <EmptyState
        title="Path not found"
        description="Pick one of the three learning paths to preview its roadmap."
        action={<ButtonLink to="/explore">Explore skills</ButtonLink>}
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl py-10 lg:py-14">
      <PageHeader
        eyebrow="Learning path"
        title={path.title}
        description={path.description}
        actions={
          <ButtonLink to={`/signup?intent=learner&path=${path.id}`}>
            Start this path
          </ButtonLink>
        }
      />
      <Card className="mt-8">
        <div className="flex items-center gap-3">
          <PathIconMark pathId={path.id} />
          <div>
            <p className="text-sm font-semibold text-ink">{path.estimatedDuration}</p>
            <p className="text-sm text-muted">{modules.length} modules</p>
          </div>
        </div>
        <ul className="mt-6 flex flex-wrap gap-2">
          {path.sampleTopics.map((topic) => (
            <li key={topic} className="rounded-full border border-line px-2.5 py-1 text-xs font-medium text-muted">
              {topic}
            </li>
          ))}
        </ul>
      </Card>
      <h2 className="mt-10 text-2xl text-ink">Roadmap preview</h2>
      <ol className="mt-4 space-y-3">
        {modules.map((module) => (
          <li key={module.id}>
            <Card className="py-4">
              <p className="text-xs font-semibold text-primary">Module {module.order}</p>
              <p className="mt-1 font-semibold text-ink">{module.title}</p>
              <p className="mt-1 text-sm text-muted">{module.estimatedDuration}</p>
            </Card>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function HowItWorksRedirect() {
  return <Navigate to="/#how-it-works" replace />;
}
