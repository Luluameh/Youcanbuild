import { Link } from "react-router";
import { Badge } from "@/components/ui/Badge.tsx";
import { ButtonLink } from "@/components/ui/Button.tsx";
import { Card } from "@/components/ui/Card.tsx";
import { PageHeader } from "@/components/ui/PageHeader.tsx";
import { StatCard } from "@/components/dashboard/StatCard.tsx";
import { useAuth } from "@/context/AuthContext.tsx";
import { useMentorship } from "@/context/MentorshipContext.tsx";
import { useDocumentTitle } from "@/hooks/useDocumentTitle.ts";
import { pathLabels } from "@/lib/labels.ts";
import { mentorCanManageRequests, resolveMentorCatalogId } from "@/lib/mentorAccount.ts";

export function MentorDashboardPage() {
  const { user, mentorProfile } = useAuth();
  const { getMentorRequests } = useMentorship();
  useDocumentTitle("Mentor dashboard");

  const catalogId = resolveMentorCatalogId(mentorProfile);
  const requests = catalogId ? getMentorRequests(catalogId) : [];
  const pending = requests.filter((request) => request.status === "pending");
  const active = requests.filter((request) => request.status === "accepted");
  const completed = requests.filter((request) => request.status === "completed");

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <PageHeader
        eyebrow="Mentor dashboard"
        title={mentorProfile?.displayName ?? user?.displayName ?? "Mentor"}
        description="Structured requests from learners on your paths."
      />
      {mentorProfile?.verification === "verified" ? (
        <Badge tone="success">Verified mentor · profile reviewed by YouCanBuild (demo)</Badge>
      ) : (
        <Badge tone="warning">Demo verification pending</Badge>
      )}

      {!mentorCanManageRequests(mentorProfile) ? (
        <Card className="border-dashed">
          <p className="text-sm text-muted">
            Link your account to a directory profile to receive requests. For the hackathon demo, sign in as Amara.
          </p>
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Pending requests" value={String(pending.length)} />
        <StatCard label="Active" value={String(active.length)} />
        <StatCard label="Completed" value={String(completed.length)} />
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-sans text-lg font-semibold text-ink">Latest requests</h2>
          <ButtonLink to="/mentor/requests" variant="secondary">
            View all
          </ButtonLink>
        </div>
        <ul className="mt-4 space-y-4">
          {pending.length === 0 ? (
            <li className="text-sm text-muted">No pending requests right now.</li>
          ) : (
            pending.slice(0, 3).map((request) => (
              <li key={request.id} className="rounded-xl border border-line px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">New mentorship request</p>
                <p className="mt-2 font-semibold text-ink">Learner: {request.learnerDisplayName}</p>
                <p className="text-sm text-muted">
                  Path: {pathLabels[request.pathId]} · Module topic: {request.topic}
                </p>
                <p className="mt-2 text-sm text-muted">{request.description}</p>
                <Link to={`/mentor/requests/${request.id}`} className="mt-3 inline-block text-sm font-semibold text-primary">
                  Review request
                </Link>
              </li>
            ))
          )}
        </ul>
      </Card>
    </div>
  );
}
