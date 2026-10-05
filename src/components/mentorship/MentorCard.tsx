import { Link } from "react-router";
import { Badge } from "@/components/ui/Badge.tsx";
import { ButtonLink } from "@/components/ui/Button.tsx";
import { Card } from "@/components/ui/Card.tsx";
import { MentorSocialLinks } from "@/components/mentorship/MentorSocialLinks.tsx";
import { Avatar } from "@/components/ui/Avatar.tsx";
import { availabilityLabel, verificationCopy } from "@/lib/mentorshipUi.ts";
import type { MentorProfile } from "@/types/index.ts";

type MentorCardProps = {
  mentor: MentorProfile;
  requestHref: string;
  highlighted?: boolean;
};

export function MentorCard({ mentor, requestHref, highlighted }: MentorCardProps) {
  const verification = verificationCopy(mentor.verification);

  return (
    <Card className={highlighted ? "border-primary/30 ring-1 ring-primary/15" : undefined}>
      <div className="flex items-start gap-3">
        <Avatar name={mentor.displayName} src={mentor.avatarSrc} />
        <div className="min-w-0 flex-1">
          <Link to={`/learn/mentors/${mentor.id}`} className="font-semibold text-ink hover:text-primary">
            {mentor.displayName}
          </Link>
          <p className="mt-1 text-sm text-muted">{mentor.headline}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge tone={verification.tone}>{verification.label}</Badge>
            <Badge tone="neutral">{availabilityLabel(mentor.availability)}</Badge>
          </div>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-muted">{mentor.bio}</p>
      <div className="mt-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Expertise</p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {mentor.expertise.map((item) => (
            <li key={item} className="rounded-full border border-line px-2.5 py-0.5 text-xs text-muted">
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Technologies</p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {mentor.technologies.map((tech) => (
            <li key={tech} className="rounded-full bg-paper px-2.5 py-0.5 text-xs text-muted">
              {tech}
            </li>
          ))}
        </ul>
      </div>
      <MentorSocialLinks social={mentor.social} className="mt-4" />
      <ButtonLink to={requestHref} className="mt-5" fullWidth>
        Request guidance
      </ButtonLink>
    </Card>
  );
}
