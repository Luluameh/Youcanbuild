import { Menu, X } from "lucide-react";
import { useCallback, useState } from "react";
import { NavLink, useLocation } from "react-router";
import { Button, ButtonLink } from "@/components/ui/Button.tsx";
import { Logo } from "@/components/layout/Logo.tsx";
import { useAuth } from "@/context/AuthContext.tsx";
import { publicLinks } from "@/config/site.ts";
import { useDismissible } from "@/hooks/useDismissible.ts";
import { cn } from "@/lib/cn.ts";

export function Navbar() {
  const { user, learnerProfile, mentorProfile, signOut } = useAuth();
  const { pathname } = useLocation();
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const open = menuPath === pathname;
  const close = useCallback(() => setMenuPath(null), []);
  useDismissible(open, close);

  const dashboardTo =
    user?.role === "mentor"
      ? mentorProfile?.onboardingComplete
        ? "/mentor"
        : "/onboarding/mentor"
      : learnerProfile?.onboardingComplete
        ? "/learn"
        : "/onboarding";

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {publicLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium",
                  isActive ? "text-primary" : "text-muted hover:text-ink",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <>
              <ButtonLink to={dashboardTo} variant="secondary">
                Dashboard
              </ButtonLink>
              <Button type="button" variant="ghost" onClick={signOut}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <ButtonLink to="/signin" variant="ghost">
                Sign In
              </ButtonLink>
              <ButtonLink to="/signup">Start Learning</ButtonLink>
            </>
          )}
        </div>
        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-full text-ink hover:bg-ink/5 lg:hidden"
          aria-expanded={open}
          aria-controls="public-menu"
          onClick={() => setMenuPath(open ? null : pathname)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      {open ? (
        <div id="public-menu" className="border-t border-line bg-paper px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Primary mobile">
            {publicLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={close}
                className={({ isActive }) =>
                  cn(
                    "rounded-xl px-3 py-3 text-base font-medium",
                    isActive ? "bg-primary-soft text-primary-strong" : "text-ink hover:bg-ink/5",
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 grid gap-2">
            {user ? (
              <>
                <ButtonLink to={dashboardTo} fullWidth onClick={close}>
                  Dashboard
                </ButtonLink>
                <Button type="button" variant="secondary" fullWidth onClick={() => { signOut(); close(); }}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <ButtonLink to="/signin" variant="secondary" fullWidth onClick={close}>
                  Sign In
                </ButtonLink>
                <ButtonLink to="/signup" fullWidth onClick={close}>
                  Start Learning
                </ButtonLink>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
