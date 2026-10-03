import { Link, useParams } from "react-router";
import { Badge } from "@/components/ui/Badge.tsx";
import { ButtonLink } from "@/components/ui/Button.tsx";
import { Card } from "@/components/ui/Card.tsx";
import { EmptyState } from "@/components/ui/EmptyState.tsx";
import { PageHeader } from "@/components/ui/PageHeader.tsx";
import { Avatar } from "@/components/ui/Avatar.tsx";
import { getMentor } from "@/data/catalog.ts";
import { useMentorship } from "@/context/MentorshipContext.tsx";
import { useAuth } from "@/context/AuthContext.tsx";
import { useDocumentTitle } from "@/hooks/useDocumentTitle.ts";
import { availabilityLabel, verificationCopy } from "@/lib/mentorshipUi.ts";

export function LearnerMentorProfilePage() {
  const { mentorId } = useParams();
  const { learnerProfile } = useAuth();
  const { blockedMentorIds } = useMentorship();
  const mentor = mentorId ? getMentor(mentorId) : undefined;
  useDocumentTitle(mentor?.displayName ?? "Mentor");

  if (!mentor) {
    return (
      <EmptyState
        title="Mentor not found"
        description="That profile is not in the directory."
        action={<ButtonLink to="/learn/mentors">Back to directory</ButtonLink>}
      />
    );
  }

  const blocked = learnerProfile ? blockedMentorIds(learnerProfile.userId).includes(mentor.id) : false;
  const verification = verificationCopy(mentor.verification);

  if (blocked) {
    return (
      <EmptyState
        title="This mentor is hidden"
        description="You blocked this mentor from your directory. Unblock is not part of this demo."
        action={<ButtonLink to="/learn/mentors">Browse other mentors</ButtonLink>}
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <Link to="/learn/mentors" className="text-sm font-semibold text-primary">
        ← Back to mentors
      </Link>
      <PageHeader
        eyebrow="Mentor profile"
        title={mentor.displayName}
        description={mentor.headline}
        actions={
          <ButtonLink to={`/learn/mentors/${mentor.id}/request`}>Request guidance</ButtonLink>
        }
      />

      <Card>
        <div className="flex items-start gap-4">
          <Avatar name={mentor.displayName} className="size-14 text-lg" />
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge tone={verification.tone}>{verification.label}</Badge>
              <Badge tone="neutral">{availabilityLabel(mentor.availability)}</Badge>
            </div>
            <p className="mt-3 text-sm text-muted">{verification.detail}</p>
          </div>
        </div>
        <p className="mt-6 text-sm leading-7 text-muted">{mentor.bio}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <h2 className="text-sm font-semibold text-ink">Expertise</h2>
            <ul className="mt-2 space-y-1 text-sm text-muted">
              {mentor.expertise.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-ink">Technologies</h2>
            <ul className="mt-2 flex flex-wrap gap-2">
              {mentor.technologies.map((tech) => (
                <li key={tech} className="rounded-full border border-line px-2 py-0.5 text-xs text-muted">
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-ink">Areas they can help with</h2>
          <p className="mt-2 text-sm text-muted">
            Structured guidance on modules within{" "}
            {mentor.pathIds.map((pathId) => pathId.replace("-", "/")).join(", ")} paths, focused on the topic you
            submit—not open-ended messaging.
          </p>
        </div>
      </Card>
    </div>
  );
}
