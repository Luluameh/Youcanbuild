import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge.tsx";
import type { Resource } from "@/types/index.ts";

const kindLabels: Record<Resource["kind"], string> = {
  documentation: "Documentation",
  tutorial: "Tutorial",
  video: "Video",
  article: "Article",
};

type ResourceCardProps = {
  resource: Resource;
};

export function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start justify-between gap-3 rounded-xl border border-line bg-paper px-4 py-3 transition-colors hover:border-primary/40 hover:bg-primary-soft/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <span>
        <span className="font-medium text-ink group-hover:text-primary-strong">{resource.title}</span>
        <span className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
          <Badge tone="neutral">{kindLabels[resource.kind]}</Badge>
          <span>{resource.source}</span>
        </span>
      </span>
      <ExternalLink aria-hidden="true" className="mt-1 size-4 shrink-0 text-muted" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}
