import { Menu, X } from "lucide-react";
import { useCallback, useState } from "react";
import { Outlet } from "react-router";
import { DashboardSidebarContainer } from "@/components/layout/DashboardSidebarContainer.tsx";
import { Logo } from "@/components/layout/Logo.tsx";
import { MobileNavigation } from "@/components/layout/MobileNavigation.tsx";
import { useDismissible } from "@/hooks/useDismissible.ts";
import type { UserRole } from "@/types/index.ts";

type AppLayoutProps = {
  role: UserRole;
};

export function AppLayout({ role }: AppLayoutProps) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  useDismissible(open, close);

  return (
    <div className="min-h-dvh bg-paper">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-paper-raised focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-paper/90 px-4 backdrop-blur lg:hidden">
        <Logo />
        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-full text-ink hover:bg-ink/5"
          aria-expanded={open}
          aria-controls="app-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </header>

      <div className="lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
        <aside className="sticky top-0 hidden h-dvh border-r border-line bg-paper-raised p-4 lg:block">
          <DashboardSidebarContainer role={role} />
        </aside>
        <main id="main" className="min-w-0 px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:py-8 lg:pb-8">
          <Outlet />
        </main>
      </div>

      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button type="button" className="absolute inset-0 bg-ink/40" aria-label="Close menu" onClick={close} />
          <div id="app-menu" className="absolute inset-y-0 left-0 w-72 overflow-y-auto bg-paper-raised p-4 shadow-xl">
            <DashboardSidebarContainer role={role} onNavigate={close} />
          </div>
        </div>
      ) : null}

      <div inert={open || undefined}>
        <MobileNavigation role={role} />
      </div>
    </div>
  );
}
