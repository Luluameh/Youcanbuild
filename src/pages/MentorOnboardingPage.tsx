import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { TextAreaField, TextField } from "@/components/auth/AuthFields.tsx";
import { Badge } from "@/components/ui/Badge.tsx";
import { Button } from "@/components/ui/Button.tsx";
import { Card } from "@/components/ui/Card.tsx";
import { useAuth } from "@/context/AuthContext.tsx";
import { useDocumentTitle } from "@/hooks/useDocumentTitle.ts";
import { pathLabels } from "@/lib/labels.ts";
import { orderedPaths } from "@/lib/paths.ts";
import { cn } from "@/lib/cn.ts";
import type { LearningPathId, MentorAvailability } from "@/types/index.ts";

const expertiseSuggestions = [
  "Frontend development",
  "JavaScript",
  "UI/UX design",
  "User research",
  "Stellar fundamentals",
  "Portfolio reviews",
];

export function MentorOnboardingPage() {
  useDocumentTitle("Mentor profile");
  const { user, mentorProfile, completeMentorOnboarding } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(user?.displayName ?? mentorProfile?.displayName ?? "");
  const [bio, setBio] = useState(mentorProfile?.bio ?? "");
  const [expertise, setExpertise] = useState<string[]>(mentorProfile?.expertise ?? []);
  const [technologies, setTechnologies] = useState(mentorProfile?.technologies.join(", ") ?? "");
  const [availability, setAvailability] = useState<MentorAvailability>(
    mentorProfile?.availability ?? "available",
  );
  const [pathIds, setPathIds] = useState<LearningPathId[]>(mentorProfile?.pathIds ?? []);
  const [error, setError] = useState<string | null>(null);

  function toggleExpertise(item: string) {
    setExpertise((current) =>
      current.includes(item) ? current.filter((value) => value !== item) : [...current, item],
    );
  }

  function togglePath(id: LearningPathId) {
    setPathIds((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!displayName.trim()) {
      setError("Add a display name learners will see.");
      return;
    }
    if (bio.trim().length < 20) {
      setError("Write a short professional bio (at least 20 characters).");
      return;
    }
    if (expertise.length === 0) {
      setError("Choose at least one area of expertise.");
      return;
    }
    if (pathIds.length === 0) {
      setError("Select at least one path you can mentor.");
      return;
    }

    const techList = technologies
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    completeMentorOnboarding({
      displayName,
      bio,
      expertise,
      technologies: techList,
      availability,
      pathIds,
    });
    navigate("/mentor", { replace: true });
  }

  return (
    <div className="mx-auto w-full max-w-2xl py-10 lg:py-14">
      <p className="text-sm font-semibold text-primary uppercase">Mentor onboarding</p>
      <h1 className="mt-2 text-3xl text-ink sm:text-4xl">Share how you can help</h1>
      <p className="mt-3 text-sm leading-6 text-muted">
        Professional information only. Learners will not see your email or other private account details.
      </p>
      <Badge tone="warning" className="mt-4">
        Demo verification pending — not a live background check
      </Badge>

      <Card className="mt-8">
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Display name"
            id="mentor-name"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            required
          />
          <TextAreaField
            label="Professional bio"
            id="mentor-bio"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            hint="A few sentences about how you mentor and what learners can expect."
            required
          />

          <fieldset>
            <legend className="text-sm font-semibold text-ink">Areas of expertise</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {expertiseSuggestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleExpertise(item)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-sm",
                    expertise.includes(item)
                      ? "border-primary bg-primary-soft text-primary-strong"
                      : "border-line text-muted",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </fieldset>

          <TextField
            label="Technologies"
            id="mentor-tech"
            value={technologies}
            onChange={(event) => setTechnologies(event.target.value)}
            hint="Comma-separated, e.g. React, Figma, Stellar"
          />

          <fieldset>
            <legend className="text-sm font-semibold text-ink">Paths you mentor</legend>
            <div className="mt-3 grid gap-2">
              {orderedPaths().map((path) => (
                <label
                  key={path.id}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-line px-3 py-2"
                >
                  <input
                    type="checkbox"
                    checked={pathIds.includes(path.id)}
                    onChange={() => togglePath(path.id)}
                  />
                  <span className="text-sm text-ink">{pathLabels[path.id]}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="mentor-availability" className="text-sm font-semibold text-ink">
              Availability
            </label>
            <select
              id="mentor-availability"
              value={availability}
              onChange={(event) => setAvailability(event.target.value as MentorAvailability)}
              className="mt-2 w-full rounded-xl border border-line bg-paper-raised px-4 py-3 text-sm"
            >
              <option value="available">Available</option>
              <option value="limited">Limited</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>

          {error ? (
            <p className="text-sm text-danger" role="alert">
              {error}
            </p>
          ) : null}

          <Button type="submit" fullWidth>
            Go to mentor dashboard
          </Button>
        </form>
      </Card>
    </div>
  );
}
