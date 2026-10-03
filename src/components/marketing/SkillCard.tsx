import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { ButtonLink } from "@/components/ui/Button.tsx";
import { Card } from "@/components/ui/Card.tsx";
import type { LearningPath } from "@/types/index.ts";

type SkillCardProps = {
  path: LearningPath;
  icon: LucideIcon;
  compact?: boolean;
};

export function SkillCard({ path, icon: Icon, compact = false }: SkillCardProps) {
  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">
          <Icon aria-hidden="true" className="size-5" />
        </span>
        <div>
          <h3 className="text-lg font-semibold text-ink">{path.title}</h3>
          <p className="mt-1 text-xs font-medium text-primary">{path.estimatedDuration}</p>
        </div>
      </div>
      <p className={compact ? "mt-3 text-sm leading-6 text-muted line-clamp-3" : "mt-4 text-sm leading-6 text-muted"}>
        {path.description}
      </p>
      {!compact ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {path.sampleTopics.map((topic) => (
            <li
              key={topic}
              className="rounded-full border border-line bg-paper px-2.5 py-1 text-xs font-medium text-muted"
            >
              {topic}
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-auto pt-5">
        <ButtonLink to={`/explore/${path.id}`} variant="secondary" className="w-full sm:w-auto">
          Explore Path
          <ArrowRight aria-hidden="true" className="size-4" />
        </ButtonLink>
      </div>
    </Card>
  );
}

export function SkillCardLink({ path, icon: Icon }: SkillCardProps) {
  return (
    <Link to={`/explore/${path.id}`} className="block h-full rounded-2xl focus-visible:outline-offset-4">
      <SkillCard path={path} icon={Icon} compact />
    </Link>
  );
}
