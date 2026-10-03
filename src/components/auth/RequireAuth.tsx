import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "@/context/AuthContext.tsx";
import type { UserRole } from "@/types/index.ts";

type RequireAuthProps = {
  role?: UserRole;
  requireOnboarding?: boolean;
  allowOnboardingOnly?: boolean;
};

export function RequireAuth({ role, requireOnboarding = false, allowOnboardingOnly = false }: RequireAuthProps) {
  const { ready, user, learnerProfile, mentorProfile } = useAuth();
  const location = useLocation();

  if (!ready) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-4">
        <p className="text-sm text-muted">Loading your account…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === "learner" ? "/learn" : "/mentor"} replace />;
  }

  const onboardingComplete =
    user.role === "learner"
      ? learnerProfile?.onboardingComplete
      : mentorProfile?.onboardingComplete;

  if (requireOnboarding && !onboardingComplete) {
    const target = user.role === "learner" ? "/onboarding" : "/onboarding/mentor";
    return <Navigate to={target} replace />;
  }

  if (allowOnboardingOnly && onboardingComplete) {
    return <Navigate to={user.role === "learner" ? "/learn" : "/mentor"} replace />;
  }

  return <Outlet />;
}

export function RedirectIfAuthenticated() {
  const { ready, user, learnerProfile, mentorProfile } = useAuth();

  if (!ready) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center px-4">
        <p className="text-sm text-muted">Loading…</p>
      </div>
    );
  }

  if (!user) {
    return <Outlet />;
  }

  if (user.role === "learner") {
    return (
      <Navigate
        to={learnerProfile?.onboardingComplete ? "/learn" : "/onboarding"}
        replace
      />
    );
  }

  return (
    <Navigate to={mentorProfile?.onboardingComplete ? "/mentor" : "/onboarding/mentor"} replace />
  );
}
