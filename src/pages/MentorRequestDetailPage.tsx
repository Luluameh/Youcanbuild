import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useParams } from "react-router";
import { TextField } from "@/components/auth/AuthFields.tsx";
import { MentorshipStatusBadge } from "@/components/mentorship/MentorshipStatusBadge.tsx";
import { Button } from "@/components/ui/Button.tsx";
import { ButtonLink } from "@/components/ui/Button.tsx";
import { Card } from "@/components/ui/Card.tsx";
import { EmptyState } from "@/components/ui/EmptyState.tsx";
import { PageHeader } from "@/components/ui/PageHeader.tsx";
import { getModule } from "@/data/catalog.ts";
import { useAuth } from "@/context/AuthContext.tsx";
import { useMentorship } from "@/context/MentorshipContext.tsx";
import { useDocumentTitle } from "@/hooks/useDocumentTitle.ts";
import { pathLabels } from "@/lib/labels.ts";
import { mentorCanManageRequests, resolveMentorCatalogId } from "@/lib/mentorAccount.ts";

/** Mentor-facing view model — intentionally excludes learner account PII. */
type MentorRequestView = {
  learnerDisplayName: string;
  pathLabel: string;
  moduleTitle: string;
  topic: string;
  description: string;
};

export function MentorRequestDetailPage() {
  const { requestId } = useParams();
  const { mentorProfile } = useAuth();
  const { getRequest, updateStatus, saveGuidance } = useMentorship();
  const catalogId = resolveMentorCatalogId(mentorProfile);
  const request = requestId ? getRequest(requestId) : undefined;
  const [actionError, setActionError] = useState<string | null>(null);
  const [guidanceMessage, setGuidanceMessage] = useState(request?.guidance?.message ?? "");
  const [resourceTitle, setResourceTitle] = useState(request?.guidance?.resourceTitle ?? "");
  const [resourceUrl, setResourceUrl] = useState(request?.guidance?.resourceUrl ?? "");
  const [guidanceSaved, setGuidanceSaved] = useState(false);

  useDocumentTitle(request?.topic ?? "Mentorship request");

  if (!mentorCanManageRequests(mentorProfile) || !catalogId) {
    return (
      <EmptyState
        title="Demo mentor account required"
        description="Sign in as demo mentor Amara to review structured requests in the hackathon flow."
        action={<ButtonLink to="/signin">Sign in</ButtonLink>}
      />
    );
  }

  if (!request || request.mentorId !== catalogId) {
    return (
      <EmptyState
        title="Request not found"
        description="You can only open requests assigned to your mentor profile."
        action={<ButtonLink to="/mentor/requests">All requests</ButtonLink>}
      />
    );
  }

  const activeRequest = request;
  const activeCatalogId = catalogId;

  const module = getModule(activeRequest.moduleId);
  const view: MentorRequestView = {
    learnerDisplayName: activeRequest.learnerDisplayName,
    pathLabel: pathLabels[activeRequest.pathId],
    moduleTitle: module?.title ?? activeRequest.moduleId,
    topic: activeRequest.topic,
    description: activeRequest.description,
  };

  function handleStatus(next: "accepted" | "declined" | "completed") {
    setActionError(null);
    const result = updateStatus(activeRequest.id, next, activeCatalogId);
    if (!result.ok) {
      setActionError(result.message);
    }
  }

  function handleGuidanceSubmit(event: FormEvent) {
    event.preventDefault();
    setActionError(null);
    const result = saveGuidance(activeRequest.id, activeCatalogId, {
      message: guidanceMessage,
      resourceTitle: resourceTitle || undefined,
      resourceUrl: resourceUrl || undefined,
    });
    if (!result.ok) {
      setActionError(result.message);
      return;
    }
    setGuidanceSaved(true);
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <Link to="/mentor/requests" className="text-sm font-semibold text-primary">
        ← All requests
      </Link>
      <PageHeader
        eyebrow="New mentorship request"
        title={view.topic}
        description={`Learner: ${view.learnerDisplayName}`}
        actions={<MentorshipStatusBadge status={activeRequest.status} />}
      />

      <Card>
        <dl className="space-y-4 text-sm">
          <div>
            <dt className="text-muted">Learner</dt>
            <dd className="font-medium text-ink">{view.learnerDisplayName}</dd>
          </div>
          <div>
            <dt className="text-muted">Path</dt>
            <dd className="font-medium text-ink">{view.pathLabel}</dd>
          </div>
          <div>
            <dt className="text-muted">Module</dt>
            <dd className="font-medium text-ink">{view.moduleTitle}</dd>
          </div>
          <div>
            <dt className="text-muted">Topic</dt>
            <dd className="font-medium text-ink">{view.topic}</dd>
          </div>
          <div>
            <dt className="text-muted">Description</dt>
            <dd className="leading-7 text-ink">{view.description}</dd>
          </div>
        </dl>
      </Card>

      {actionError ? (
        <p className="text-sm text-danger" role="alert">
          {actionError}
        </p>
      ) : null}

      {activeRequest.status === "pending" ? (
        <Card>
          <h2 className="font-sans text-lg font-semibold text-ink">Respond</h2>
          <p className="mt-2 text-sm text-muted">Accept to offer structured guidance, or decline if you cannot help.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button type="button" onClick={() => handleStatus("accepted")}>
              Accept
            </Button>
            <Button type="button" variant="secondary" onClick={() => handleStatus("declined")}>
              Decline
            </Button>
          </div>
        </Card>
      ) : null}

      {activeRequest.status === "accepted" ? (
        <>
          <Card>
            <h2 className="font-sans text-lg font-semibold text-ink">Mark complete</h2>
            <p className="mt-2 text-sm text-muted">Close the loop after you share structured guidance below.</p>
            <Button type="button" className="mt-4" variant="secondary" onClick={() => handleStatus("completed")}>
              Mark completed
            </Button>
          </Card>
          <Card>
            <h2 className="font-sans text-lg font-semibold text-ink">Structured guidance (one response)</h2>
            <p className="mt-2 text-sm text-muted">This is not chat—learners see a single mentor response on their request.</p>
            <form className="mt-4 space-y-4" onSubmit={handleGuidanceSubmit}>
              <label className="block text-sm font-semibold text-ink" htmlFor="mentor-guidance">
                Guidance
                <textarea
                  id="mentor-guidance"
                  className="mt-2 min-h-32 w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  value={guidanceMessage}
                  onChange={(event) => setGuidanceMessage(event.target.value)}
                  required
                />
              </label>
              <TextField
                label="Suggested resource title (optional)"
                id="mentor-resource-title"
                value={resourceTitle}
                onChange={(event) => setResourceTitle(event.target.value)}
              />
              <TextField
                label="Suggested resource URL (optional)"
                id="mentor-resource-url"
                type="url"
                value={resourceUrl}
                onChange={(event) => setResourceUrl(event.target.value)}
              />
              <Button type="submit">Save guidance</Button>
              {guidanceSaved ? (
                <p className="text-sm text-success" role="status">
                  Guidance saved for the learner.
                </p>
              ) : null}
            </form>
          </Card>
        </>
      ) : null}

      {activeRequest.status === "completed" && activeRequest.guidance ? (
        <Card>
          <h2 className="font-sans text-lg font-semibold text-ink">Guidance sent</h2>
          <p className="mt-2 text-sm leading-7 text-muted">{activeRequest.guidance.message}</p>
        </Card>
      ) : null}
    </div>
  );
}
