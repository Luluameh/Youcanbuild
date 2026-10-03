import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { AuthShell, TextField } from "@/components/auth/AuthFields.tsx";
import { Button } from "@/components/ui/Button.tsx";
import { Card } from "@/components/ui/Card.tsx";
import { demoLearnerEmail, demoMentorEmail } from "@/lib/authStorage.ts";
import { demoLearnerUser } from "@/data/demo.ts";
import { useAuth } from "@/context/AuthContext.tsx";
import { useMentorship } from "@/context/MentorshipContext.tsx";
import { useDocumentTitle } from "@/hooks/useDocumentTitle.ts";

function destinationAfterAuth(
  role: "learner" | "mentor",
  onboardingComplete: boolean,
  from?: string,
): string {
  if (from && from !== "/signin" && from !== "/signup") {
    return from;
  }
  if (role === "learner") {
    return onboardingComplete ? "/learn" : "/onboarding";
  }
  return onboardingComplete ? "/mentor" : "/onboarding/mentor";
}

export function SignInPage() {
  useDocumentTitle("Sign in");
  const { signIn, signInDemoAda, signInDemoAmara, resetAdaDemo } = useAuth();
  const { resetLearnerRequests } = useMentorship();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [demoMessage, setDemoMessage] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const result = signIn({ email, password });
    setLoading(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    navigate(destinationAfterAuth(result.role, result.onboardingComplete, from), { replace: true });
  }

  function handleDemoAda() {
    signInDemoAda();
    navigate("/learn", { replace: true });
  }

  function handleDemoAmara() {
    signInDemoAmara();
    navigate("/mentor", { replace: true });
  }

  function handleResetAdaDemo() {
    resetAdaDemo();
    resetLearnerRequests(demoLearnerUser.id);
    setDemoMessage("Ada demo reset: Phase 3 progress, achievements, and mentorship requests restored for repeat demos.");
    signInDemoAda();
    navigate("/learn/modules/fe-javascript", { replace: true });
  }

  return (
    <AuthShell title="Sign in" description="Return to your roadmap, achievements, and mentorship requests.">
      <Card>
        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Email"
            id="signin-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <TextField
            label="Password"
            id="signin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          {error ? (
            <p className="text-sm text-danger" role="alert">
              {error}
            </p>
          ) : null}
          <Button type="submit" fullWidth loading={loading}>
            Sign In
          </Button>
        </form>
      </Card>

      <Card className="mt-6 border-dashed bg-paper">
        <p className="text-sm font-semibold text-ink">Hackathon demo</p>
        <p className="mt-2 text-sm leading-6 text-muted">
          Switch between Ada (learner on JavaScript Fundamentals) and Amara (verified demo mentor) for the structured
          mentorship walkthrough.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button type="button" variant="secondary" onClick={handleDemoAda}>
            Continue as demo learner Ada
          </Button>
          <Button type="button" variant="secondary" onClick={handleDemoAmara}>
            Continue as demo mentor Amara
          </Button>
        </div>
        <Button type="button" variant="ghost" className="mt-3 text-sm" onClick={handleResetAdaDemo}>
          Reset Ada demo (progress + requests)
        </Button>
        {demoMessage ? (
          <p className="mt-3 text-xs text-muted" role="status">
            {demoMessage}
          </p>
        ) : null}
        <p className="mt-3 text-xs text-muted">
          Ada: <span className="font-medium text-ink">{demoLearnerEmail}</span> /{" "}
          <span className="font-medium text-ink">demo-ada</span>
          {" · "}
          Amara: <span className="font-medium text-ink">{demoMentorEmail}</span> /{" "}
          <span className="font-medium text-ink">demo-amara</span>
        </p>
      </Card>

      <p className="mt-6 text-sm text-muted">
        New here?{" "}
        <Link to="/signup" className="font-semibold text-primary hover:text-primary-strong">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
