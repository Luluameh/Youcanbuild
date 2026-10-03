import { ButtonLink } from "@/components/ui/Button.tsx";
import { EmptyState } from "@/components/ui/EmptyState.tsx";
import { PageHeader } from "@/components/ui/PageHeader.tsx";
import { MentorshipRequestSummary } from "@/components/mentorship/MentorshipRequestSummary.tsx";
import { useAuth } from "@/context/AuthContext.tsx";
import { useMentorship } from "@/context/MentorshipContext.tsx";
import { useDocumentTitle } from "@/hooks/useDocumentTitle.ts";

export function LearnerMentorshipListPage() {
  useDocumentTitle("My mentorship requests");
  const { user } = useAuth();
  const { getLearnerRequests } = useMentorship();
  const requests = user ? getLearnerRequests(user.id) : [];

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <PageHeader
        eyebrow="Mentor support"
        title="My mentorship requests"
        description="Structured requests stay on your learning path. Status updates when a mentor accepts, completes, or declines."
        actions={<ButtonLink to="/learn/mentors">Find a mentor</ButtonLink>}
      />

      {requests.length === 0 ? (
        <EmptyState
          title="No requests yet"
          description="Need some guidance? Find a mentor who knows what you're learning."
          action={<ButtonLink to="/learn/mentors">Find a mentor</ButtonLink>}
        />
      ) : (
        <ul className="space-y-4">
          {requests.map((request) => (
            <li key={request.id}>
              <MentorshipRequestSummary
                request={request}
                detailHref={`/learn/mentorship/${request.id}`}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
