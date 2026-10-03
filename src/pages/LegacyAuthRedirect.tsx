import { Navigate, useLocation } from "react-router";

/** Sends legacy `/sign-in` and `/sign-up` links to the Phase 2 routes. */
export function LegacyAuthRedirect({ to }: { to: "/signin" | "/signup" }) {
  const location = useLocation();
  return <Navigate to={`${to}${location.search}`} replace />;
}
