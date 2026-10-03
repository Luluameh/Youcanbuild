import { Link } from "react-router";
import { MentorshipRequestSummary } from "@/components/mentorship/MentorshipRequestSummary.tsx";
import { Badge } from "@/components/ui/Badge.tsx";
import { EmptyState } from "@/components/ui/EmptyState.tsx";
import { PageHeader } from "@/components/ui/PageHeader.tsx";
import { useAuth } from "@/context/AuthContext.tsx";
import { useMentorship } from "@/context/MentorshipContext.tsx";
import { useDocumentTitle } from "@/hooks/useDocumentTitle.ts";
import { mentorCanManageRequests, resolveMentorCatalogId } from "@/lib/mentorAccount.ts";

export function MentorRequestsPage() {
  useDocumentTitle("Mentorship requests");
  const { mentorProfile } = useAuth();
  const { getMentorRequests } = useMentorship();
  const catalogId = resolveMentorCatalogId(mentorProfile);

  if (!mentorCanManageRequests(mentorProfile) || !catalogId) {
    return (
      <EmptyState
        title="Directory link required"
        description="Signed-up mentors need a directory profile before requests appear here. Use the demo mentor account for the hackathon walkthrough."
      />
    );
  }

  const requests = getMentorRequests(catalogId);
  const pending = requests.filter((request) => request.status === "pending");
  const active = requests.filter((request) => request.status === "accepted");
  const completed = requests.filter((request) => request.status === "completed");

  function section(title: string, items: typeof requests) {
    if (items.length === 0) {
      return null;
    }
    return (
      <section className="space-y-4">
        <h2 className="font-sans text-lg font-semibold text-ink">{title}</h2>
        <ul className="space-y-4">
          {items.map((request) => (
            <li key={request.id}>
              <MentorshipRequestSummary
                request={request}
                detailHref={`/mentor/requests/${request.id}`}
                showLearner
              />
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      <PageHeader
        eyebrow="Mentor requests"
        title="Structured mentorship queue"
        description="Review learner display names, paths, modules, and topics only—no private account data."
      />
      <Badge tone="success">Verified mentor · demo profile reviewed by YouCanBuild</Badge>
      <Link to="/mentor" className="inline-block text-sm font-semibold text-primary">
        ← Back to dashboard
      </Link>

      {requests.length === 0 ? (
        <EmptyState title="No requests yet" description="When learners request guidance, they will appear here." />
      ) : (
        <>
          {section("Pending requests", pending)}
          {section("Active requests", active)}
          {section("Completed requests", completed)}
        </>
      )}
    </div>
  );
}
