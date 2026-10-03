import { Outlet } from "react-router";
import { Footer } from "@/components/layout/Footer.tsx";
import { Navbar } from "@/components/layout/Navbar.tsx";

export function PublicLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-paper-raised focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="flex-1 px-4 sm:px-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
