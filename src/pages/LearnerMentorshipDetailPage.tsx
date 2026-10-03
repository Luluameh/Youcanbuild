import { useState } from "react";
import { Link, useParams } from "react-router";
import { MentorshipStatusBadge } from "@/components/mentorship/MentorshipStatusBadge.tsx";
import { Button, ButtonLink } from "@/components/ui/Button.tsx";
import { Card } from "@/components/ui/Card.tsx";
import { EmptyState } from "@/components/ui/EmptyState.tsx";
import { PageHeader } from "@/components/ui/PageHeader.tsx";
import { getMentor, getModule } from "@/data/catalog.ts";
import { useAuth } from "@/context/AuthContext.tsx";
import { useMentorship } from "@/context/MentorshipContext.tsx";
import { useDocumentTitle } from "@/hooks/useDocumentTitle.ts";
import { pathLabels } from "@/lib/labels.ts";

export function LearnerMentorshipDetailPage() {
  const { requestId } = useParams();
  const { user } = useAuth();
  const { getRequest, blockMentor, reportConcern } = useMentorship();
  const request = requestId ? getRequest(requestId) : undefined;
  const [safetyMessage, setSafetyMessage] = useState<string | null>(null);
  useDocumentTitle(request?.topic ?? "Mentorship request");

  if (!request || !user || request.learnerId !== user.id) {
    return (
      <EmptyState
        title="Request not found"
        description="This request is not on your account."
        action={<ButtonLink to="/learn/mentorship">My requests</ButtonLink>}
      />
    );
  }

  const activeRequest = request;
  const learnerId = user.id;
  const mentor = getMentor(activeRequest.mentorId);
  const module = getModule(activeRequest.moduleId);

  function handleReport() {
    reportConcern(activeRequest.id);
    setSafetyMessage("Demo only: your concern was recorded locally for hackathon storytelling—not sent to a moderation team.");
  }

  function handleBlock() {
    blockMentor(learnerId, activeRequest.mentorId);
    setSafetyMessage(`${mentor?.displayName ?? "This mentor"} will no longer appear in your mentor directory.`);
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <Link to="/learn/mentorship" className="text-sm font-semibold text-primary">
        ← My requests
      </Link>
      <PageHeader
        eyebrow="Mentorship request"
        title={activeRequest.topic}
        description={`Submitted ${activeRequest.createdAt}`}
        actions={<MentorshipStatusBadge status={activeRequest.status} />}
      />

      <Card>
        <dl className="space-y-4 text-sm">
          <div>
            <dt className="text-muted">Mentor</dt>
            <dd className="font-medium text-ink">
              <Link to={`/learn/mentors/${request.mentorId}`} className="text-primary hover:text-primary-strong">
                {mentor?.displayName ?? "Mentor"}
              </Link>
            </dd>
          </div>
          <div>
            <dt className="text-muted">Learning path</dt>
            <dd className="font-medium text-ink">{pathLabels[request.pathId]}</dd>
          </div>
          <div>
            <dt className="text-muted">Module</dt>
            <dd className="font-medium text-ink">{module?.title ?? request.moduleId}</dd>
          </div>
          <div>
            <dt className="text-muted">Your description</dt>
            <dd className="leading-7 text-ink">{request.description}</dd>
          </div>
        </dl>
      </Card>

      <Card>
        <h2 className="font-sans text-lg font-semibold text-ink">Status timeline</h2>
        <ol className="mt-4 space-y-2 text-sm text-muted">
          <li>
            <span className="font-medium text-ink">Submitted</span> · {request.createdAt}
          </li>
          {request.status !== "pending" ? (
            <li>
              <span className="font-medium text-ink">Updated</span> · {request.updatedAt.slice(0, 10)} (
              {request.status})
            </li>
          ) : null}
        </ol>
      </Card>

      {request.status === "accepted" || request.status === "completed" ? (
        <Card className="border-primary/20 bg-primary-soft/20">
          <h2 className="font-sans text-lg font-semibold text-ink">Guidance request accepted</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            This mentor has accepted your request. The MVP keeps mentorship structured and does not include private
            messaging.
          </p>
          {request.guidance ? (
            <div className="mt-4 rounded-xl border border-line bg-surface px-4 py-3">
              <p className="text-sm font-semibold text-ink">Structured guidance</p>
              <p className="mt-2 text-sm leading-7 text-muted">{request.guidance.message}</p>
              {request.guidance.resourceUrl ? (
                <p className="mt-3 text-sm">
                  <span className="font-medium text-ink">Suggested resource: </span>
                  <a
                    href={request.guidance.resourceUrl}
                    className="font-semibold text-primary hover:text-primary-strong"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {request.guidance.resourceTitle ?? request.guidance.resourceUrl}
                  </a>
                </p>
              ) : null}
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted">Your mentor has not posted structured guidance yet.</p>
          )}
        </Card>
      ) : null}

      {request.status === "declined" ? (
        <Card>
          <p className="text-sm text-muted">
            This mentor declined the request. You can find another mentor on the same module when you are ready.
          </p>
          <ButtonLink to="/learn/mentors" variant="secondary" className="mt-4">
            Find another mentor
          </ButtonLink>
        </Card>
      ) : null}

      <Card className="border-dashed">
        <h2 className="text-sm font-semibold text-ink">Safety actions (demo)</h2>
        <p className="mt-2 text-sm text-muted">
          These controls illustrate reporting and blocking without a production moderation backend.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button type="button" variant="secondary" onClick={handleReport}>
            Report concern
          </Button>
          <Button type="button" variant="ghost" onClick={handleBlock}>
            Block mentor
          </Button>
        </div>
        {safetyMessage ? (
          <p className="mt-3 text-sm text-muted" role="status">
            {safetyMessage}
          </p>
        ) : null}
      </Card>
    </div>
  );
}
