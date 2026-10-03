import { Link } from "react-router";
import { Card } from "@/components/ui/Card.tsx";
import { MentorshipStatusBadge } from "@/components/mentorship/MentorshipStatusBadge.tsx";
import { getMentor } from "@/data/catalog.ts";
import { pathLabels } from "@/lib/labels.ts";
import { getModule } from "@/data/catalog.ts";
import type { MentorshipRequest } from "@/types/index.ts";

type MentorshipRequestSummaryProps = {
  request: MentorshipRequest;
  detailHref: string;
  showLearner?: boolean;
};

export function MentorshipRequestSummary({
  request,
  detailHref,
  showLearner,
}: MentorshipRequestSummaryProps) {
  const mentor = getMentor(request.mentorId);
  const module = getModule(request.moduleId);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link to={detailHref} className="font-semibold text-ink hover:text-primary">
            {request.topic}
          </Link>
          <p className="mt-1 text-sm text-muted">
            {showLearner ? (
              <>
                Learner: <span className="font-medium text-ink">{request.learnerDisplayName}</span>
                {" · "}
              </>
            ) : null}
            {mentor ? mentor.displayName : "Mentor"} · {pathLabels[request.pathId]}
            {module ? ` · ${module.title}` : null}
          </p>
          <p className="mt-2 text-xs text-muted">Submitted {request.createdAt}</p>
        </div>
        <MentorshipStatusBadge status={request.status} />
      </div>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">{request.description}</p>
      <Link to={detailHref} className="mt-4 inline-block text-sm font-semibold text-primary">
        View details
      </Link>
    </Card>
  );
}
