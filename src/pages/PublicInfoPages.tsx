import { Link } from "react-router";
import { ButtonLink } from "@/components/ui/Button.tsx";
import { Card } from "@/components/ui/Card.tsx";
import { PageHeader } from "@/components/ui/PageHeader.tsx";
import { mentors } from "@/data/catalog.ts";
import { useDocumentTitle } from "@/hooks/useDocumentTitle.ts";
import { Badge } from "@/components/ui/Badge.tsx";
import { MentorSocialLinks } from "@/components/mentorship/MentorSocialLinks.tsx";
import { Avatar } from "@/components/ui/Avatar.tsx";

export function MentorsPage() {
  useDocumentTitle("Mentors");

  return (
    <div className="mx-auto w-full max-w-6xl py-10 lg:py-14">
      <PageHeader
        eyebrow="Mentorship"
        title="Structured guidance, not open-ended chat"
        description="Learners request help on a path, module, and topic. Mentors respond through a clear workflow designed for safety and focus."
      />
      <Card className="mt-8 border-primary/15 bg-primary-soft/30">
        <p className="text-sm leading-6 text-muted">
          YouCanBuild does not offer unrestricted private messaging between learners and mentors. Requests include
          only the information needed to match help with the learning task at hand.
        </p>
      </Card>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {mentors.map((mentor) => (
          <Card key={mentor.id}>
            <div className="flex items-start gap-3">
              <Avatar name={mentor.displayName} src={mentor.avatarSrc} />
              <div>
                <p className="font-semibold text-ink">{mentor.displayName}</p>
                <p className="text-sm text-muted">{mentor.headline}</p>
                <Badge tone={mentor.verification === "verified" ? "success" : "warning"}>
                  {mentor.verification === "verified" ? "Verified mentor" : "Demo verification pending"}
                </Badge>
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted">{mentor.bio}</p>
            <MentorSocialLinks social={mentor.social} className="mt-4" />
            <ul className="mt-3 flex flex-wrap gap-2">
              {mentor.technologies.slice(0, 4).map((tech) => (
                <li key={tech} className="rounded-full border border-line px-2 py-0.5 text-xs text-muted">
                  {tech}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
      <p className="mt-8 text-sm text-muted">
        Ready to learn?{" "}
        <Link to="/signup?intent=learner" className="font-semibold text-primary hover:text-primary-strong">
          Create a learner account
        </Link>
        .
      </p>
    </div>
  );
}

export function AboutPage() {
  useDocumentTitle("About");

  return (
    <div className="mx-auto w-full max-w-3xl py-10 lg:py-14">
      <PageHeader
        eyebrow="About"
        title="Built for learners who want a clearer way in"
        description="YouCanBuild is an education product first. Stellar supports verifiable milestones—not trading, speculation, or wallet-first onboarding."
      />
      <div className="mt-8 space-y-6">
        <Card>
          <h2 className="font-sans text-lg font-semibold text-ink">Safety & privacy</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted">
            <li>We do not collect age, phone number, or location for the MVP.</li>
            <li>Email stays on the private account record and is not shown on public or mentor screens.</li>
            <li>Mentorship stays structured: path, module, topic, and a short description.</li>
            <li>Learners can use the product without connecting a wallet or understanding blockchain.</li>
          </ul>
        </Card>
        <Card>
          <h2 className="font-sans text-lg font-semibold text-ink">Built on Stellar</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Major milestones can be verified on Stellar testnet with Freighter—a small public transaction records an
            achievement marker only. Names, emails, and mentorship details never go on-chain.
          </p>
        </Card>
      </div>
      <div className="mt-8">
        <ButtonLink to="/signup">Start learning</ButtonLink>
      </div>
    </div>
  );
}
