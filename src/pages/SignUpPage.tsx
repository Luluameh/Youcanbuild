import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { AuthShell, RoleChoice, TextField } from "@/components/auth/AuthFields.tsx";
import { Button } from "@/components/ui/Button.tsx";
import { Card } from "@/components/ui/Card.tsx";
import { useAuth } from "@/context/AuthContext.tsx";
import { useDocumentTitle } from "@/hooks/useDocumentTitle.ts";
import type { UserRole } from "@/types/index.ts";

export function SignUpPage() {
  useDocumentTitle("Create your account");
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const defaultRole = useMemo((): UserRole => {
    if (params.get("role") === "mentor") {
      return "mentor";
    }
    return "learner";
  }, [params]);

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const result = signUp({ displayName, email, password, role });
    setLoading(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    navigate(role === "learner" ? `/onboarding${params.get("path") ? `?path=${params.get("path")}` : ""}` : "/onboarding/mentor", {
      replace: true,
    });
  }

  return (
    <AuthShell
      title="Create your account"
      description="Name, email, password, and role. We do not ask for age, phone number, or location."
    >
      <Card>
        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Name"
            id="signup-name"
            autoComplete="name"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            required
          />
          <TextField
            label="Email"
            id="signup-email"
            type="email"
            autoComplete="email"
            hint="Private. Shown only to you, not on mentor or public screens."
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <TextField
            label="Password"
            id="signup-password"
            type="password"
            autoComplete="new-password"
            hint="At least 6 characters for this local demo."
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <RoleChoice value={role} onChange={setRole} />
          {error ? (
            <p className="text-sm text-danger" role="alert">
              {error}
            </p>
          ) : null}
          <Button type="submit" fullWidth loading={loading}>
            {role === "learner" ? "Create learner account" : "Create mentor account"}
          </Button>
        </form>
      </Card>
      <p className="mt-6 text-sm text-muted">
        Already have an account?{" "}
        <Link to="/signin" className="font-semibold text-primary hover:text-primary-strong">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
