import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import { TextField } from "@/components/auth/AuthFields.tsx";
import { Button, ButtonLink } from "@/components/ui/Button.tsx";
import { Card } from "@/components/ui/Card.tsx";
import { EmptyState } from "@/components/ui/EmptyState.tsx";
import { PageHeader } from "@/components/ui/PageHeader.tsx";
import { getLearningPath, getMentor, getModule, getModulesForPath } from "@/data/catalog.ts";
import { useAuth } from "@/context/AuthContext.tsx";
import { useMentorship } from "@/context/MentorshipContext.tsx";
import { useDocumentTitle } from "@/hooks/useDocumentTitle.ts";
import { pathLabels } from "@/lib/labels.ts";
import { moduleBelongsToPath } from "@/lib/learnerProgress.ts";

export function MentorshipRequestFormPage() {
  const { mentorId } = useParams();
  const [searchParams] = useSearchParams();
  const { user, learnerProfile, moduleProgress } = useAuth();
  const { createRequest } = useMentorship();
  const mentor = mentorId ? getMentor(mentorId) : undefined;
  const pathId = learnerProfile?.pathId;
  const path = pathId ? getLearningPath(pathId) : undefined;
  const modules = pathId ? getModulesForPath(pathId) : [];
  const queryModuleId = searchParams.get("moduleId");

  function defaultModuleId(): string {
    if (pathId && queryModuleId && moduleBelongsToPath(pathId, queryModuleId)) {
      return queryModuleId;
    }
    const current = moduleProgress.find((entry) => entry.status === "current");
    if (current && pathId && moduleBelongsToPath(pathId, current.moduleId)) {
      return current.moduleId;
    }
    return modules[0]?.id ?? "";
  }

  const [moduleId, setModuleId] = useState(defaultModuleId);
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ mentorName: string; requestId: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useDocumentTitle(mentor ? `Request · ${mentor.displayName}` : "Request guidance");

  const selectedModule = useMemo(() => getModule(moduleId), [moduleId]);

  if (!user || !learnerProfile?.pathId || !path) {
    return (
      <EmptyState
        title="Choose a learning path first"
        description="Complete onboarding to request mentorship on your roadmap."
        action={<ButtonLink to="/onboarding">Find your path</ButtonLink>}
      />
    );
  }

  if (!mentor) {
    return (
      <EmptyState
        title="Mentor not found"
        description="That mentor is no longer listed in the directory."
        action={<ButtonLink to="/learn/mentors">Back to directory</ButtonLink>}
      />
    );
  }

  const activeMentor = mentor;
  const activePathId = learnerProfile.pathId;

  if (success) {
    return (
      <div className="mx-auto w-full max-w-lg space-y-6">
        <Card className="border-success/30 bg-success-soft/20">
          <h1 className="text-2xl font-semibold text-ink">Request sent</h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            Your mentorship request has been sent to {success.mentorName}. They can accept or decline from their mentor
            dashboard.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink to="/learn/mentorship">View my requests</ButtonLink>
            <ButtonLink to={`/learn/mentorship/${success.requestId}`} variant="secondary">
              Open this request
            </ButtonLink>
          </div>
        </Card>
      </div>
    );
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!user || !pathId || !mentorId) {
      return;
    }
    setSubmitting(true);
    setError(null);
    const result = createRequest({
      learnerId: user.id,
      learnerDisplayName: user.displayName,
      mentorId,
      pathId: activePathId,
      moduleId,
      topic,
      description,
    });
    setSubmitting(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setSuccess({ mentorName: activeMentor.displayName, requestId: result.request.id });
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <Link to={`/learn/mentors/${activeMentor.id}`} className="text-sm font-semibold text-primary">
        ← Back to {activeMentor.displayName}
      </Link>
      <PageHeader
        eyebrow="Structured request"
        title="Request guidance"
        description={`Share what you are working on in ${path.title}. We only send your display name and learning context—not email or contact details.`}
      />

      <Card>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted">Learner</dt>
            <dd className="font-medium text-ink">{user.displayName}</dd>
          </div>
          <div>
            <dt className="text-muted">Mentor</dt>
            <dd className="font-medium text-ink">{activeMentor.displayName}</dd>
          </div>
          <div>
            <dt className="text-muted">Learning path</dt>
            <dd className="font-medium text-ink">{pathLabels[activePathId]}</dd>
          </div>
          <div>
            <dt className="text-muted">Module</dt>
            <dd className="font-medium text-ink">{selectedModule?.title ?? "Select a module"}</dd>
          </div>
        </dl>
      </Card>

      <Card>
        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <label className="block text-sm font-semibold text-ink" htmlFor="request-module">
            Module
            <select
              id="request-module"
              className="mt-2 w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              value={moduleId}
              onChange={(event) => setModuleId(event.target.value)}
              required
            >
              {modules.map((module) => (
                <option key={module.id} value={module.id}>
                  {module.title}
                </option>
              ))}
            </select>
          </label>
          <TextField
            label="Topic"
            id="request-topic"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="JavaScript array methods"
            required
          />
          <label className="block text-sm font-semibold text-ink" htmlFor="request-description">
            What are you stuck on?
            <textarea
              id="request-description"
              className="mt-2 min-h-32 w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="I'm having trouble understanding when to use map, filter, and reduce."
              required
            />
          </label>
          {error ? (
            <p className="text-sm text-danger" role="alert">
              {error}
            </p>
          ) : null}
          <Button type="submit" loading={submitting} fullWidth>
            Submit request
          </Button>
        </form>
      </Card>
    </div>
  );
}
