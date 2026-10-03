import { ArrowRight, CheckCircle2, Compass, Map, ShieldCheck, Users } from "lucide-react";
import { Link } from "react-router";
import { SkillCard } from "@/components/marketing/SkillCard.tsx";
import { ButtonLink } from "@/components/ui/Button.tsx";
import { Card } from "@/components/ui/Card.tsx";
import { SectionHeader } from "@/components/ui/SectionHeader.tsx";
import { useDocumentTitle } from "@/hooks/useDocumentTitle.ts";
import { getPathIcon, orderedPaths } from "@/lib/paths.ts";
import { summarizeProgress } from "@/lib/progress.ts";
import { demoLearnerProgress } from "@/data/demo.ts";

const steps = [
  {
    title: "Choose Your Path",
    description: "Pick Frontend, UI/UX, or Web3 and get a structured roadmap instead of scattered tabs.",
    icon: Compass,
  },
  {
    title: "Follow Your Roadmap",
    description: "Move through modules with clear objectives, resources, and practical tasks.",
    icon: Map,
  },
  {
    title: "Get Guidance",
    description: "Request help on a specific module topic when you are stuck—no open-ended DMs.",
    icon: Users,
  },
  {
    title: "Prove Your Progress",
    description: "Earn achievements for major milestones and verify the ones that matter most.",
    icon: ShieldCheck,
  },
] as const;

function RoadmapPreview() {
  const summary = summarizeProgress("frontend", demoLearnerProgress);

  return (
    <Card className="relative overflow-hidden border-primary/15 bg-linear-to-br from-paper-raised to-primary-soft/40 p-0">
      <div className="border-b border-line/80 px-5 py-4">
        <p className="text-sm font-semibold text-ink">Frontend Development</p>
        <p className="text-xs text-muted">Ada&apos;s roadmap preview</p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/70">
          <div className="h-full rounded-full bg-primary" style={{ width: `${summary.percent}%` }} />
        </div>
        <p className="mt-2 text-xs font-medium text-primary">{summary.percent}% complete</p>
      </div>
      <ol className="space-y-0 px-5 py-4">
        {summary.steps.slice(0, 5).map((step, index) => (
          <li key={step.id} className="relative flex gap-3 pb-4 last:pb-0">
            {index < 4 ? (
              <span className="absolute left-[11px] top-6 h-full w-px bg-line" aria-hidden="true" />
            ) : null}
            <span
              className={
                step.status === "completed"
                  ? "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-success-soft text-success"
                  : step.status === "current"
                    ? "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-primary text-white"
                    : "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-line bg-paper-raised text-muted"
              }
            >
              {step.status === "completed" ? (
                <CheckCircle2 aria-hidden="true" className="size-4" />
              ) : (
                <span className="text-[10px] font-bold">{step.order}</span>
              )}
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">{step.title}</p>
              <p className="text-xs capitalize text-muted">{step.status.replace("_", " ")}</p>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}

export function LandingPage() {
  useDocumentTitle("Your journey into tech starts with a clear path");

  return (
    <>
      <section className="relative overflow-hidden border-b border-line/70">
        <div className="pointer-events-none absolute -right-24 top-0 size-72 rounded-full bg-accent/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 size-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-20">
          <div>
            <p className="text-sm font-semibold tracking-wide text-primary uppercase">YouCanBuild</p>
            <h1 className="mt-4 text-4xl text-ink sm:text-5xl lg:text-[3.25rem] lg:leading-[1.05]">
              Your journey into tech starts with a clear path.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted">
              YouCanBuild helps women and young learners develop modern technology skills through structured
              learning roadmaps, trusted resources, mentorship, and verifiable achievements.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink to="/signup?intent=learner" size="lg">
                Find My Path
                <ArrowRight aria-hidden="true" className="size-4" />
              </ButtonLink>
              <ButtonLink to="/signup?role=mentor" variant="secondary" size="lg">
                Become a Mentor
              </ButtonLink>
            </div>
          </div>
          <RoadmapPreview />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeader
          title="Learning online can feel overwhelming"
          description="Tutorials are everywhere, but learners still ask the same questions: What should I learn next? Which resources can I trust? Who can help when I get stuck? YouCanBuild turns that uncertainty into a guided journey."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            "Too many tabs, no clear order",
            "Hard to show what you have actually learned",
            "Unstructured help when you are stuck",
          ].map((item) => (
            <Card key={item} className="bg-paper">
              <p className="text-sm leading-6 text-muted">{item}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="border-y border-line/70 bg-paper-raised">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <SectionHeader title="How it works" description="Four steps from curious beginner to confident builder." />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card key={step.title} className="h-full">
                  <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <p className="mt-4 text-xs font-semibold text-primary">Step {index + 1}</p>
                  <h3 className="mt-1 text-lg text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{step.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            title="Explore skills"
            description="Start with one of three structured paths. Each one includes milestones, resources, and projects."
          />
          <Link to="/explore" className="text-sm font-semibold text-primary hover:text-primary-strong">
            View all paths
          </Link>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {orderedPaths().map((path) => (
            <SkillCard key={path.id} path={path} icon={getPathIcon(path.id)} />
          ))}
        </div>
      </section>

      <section className="border-y border-line/70 bg-primary-soft/35">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center">
          <SectionHeader
            title="Guidance when you need it"
            description="Request mentorship on a specific module and topic. Mentors see only what they need to help—your path, module, and where you are stuck."
          />
          <Card>
            <p className="text-sm font-semibold text-ink">Structured request</p>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-muted">Path</dt>
                <dd className="font-medium text-ink">Frontend Development</dd>
              </div>
              <div>
                <dt className="text-muted">Module</dt>
                <dd className="font-medium text-ink">JavaScript Fundamentals</dd>
              </div>
              <div>
                <dt className="text-muted">Topic</dt>
                <dd className="font-medium text-ink">Understanding array methods</dd>
              </div>
            </dl>
            <p className="mt-4 text-xs leading-5 text-muted">
              Verification badges show demo status today. Stronger mentor review can be added later.
            </p>
          </Card>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <SectionHeader
            title="Proof that travels with you"
            description="YouCanBuild uses Stellar to make major learning milestones independently verifiable. Your everyday learning stays private and off-chain."
          />
          <Card className="border-primary/20 bg-paper-raised">
            <p className="text-sm font-semibold text-ink">Achievement preview</p>
            <p className="mt-2 text-lg text-ink">CSS Foundations</p>
            <p className="mt-1 text-sm text-muted">Styled a responsive page with a consistent layout.</p>
            <p className="mt-4 text-xs font-medium text-primary">Ready to verify when you complete a major milestone</p>
          </Card>
        </div>
      </section>

      <section className="border-t border-line/70 bg-ink text-paper">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-3xl sm:text-4xl">You can learn it. You can build it.</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-paper/80">
              Choose a path, follow the roadmap, and take the next step that is actually in front of you.
            </p>
          </div>
          <ButtonLink to="/signup" size="lg" className="bg-paper text-ink hover:bg-paper/90">
            Start Your Journey
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
