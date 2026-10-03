import { Link } from "react-router";
import { site } from "@/config/site.ts";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Explore Skills", to: "/explore" },
      { label: "How It Works", to: "/how-it-works" },
      { label: "Mentors", to: "/mentors" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "About", to: "/about" },
      { label: "Safety", to: "/about" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Start Learning", to: "/sign-up" },
      { label: "Become a Mentor", to: "/sign-up" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper-raised">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4">
        <div>
          <p className="font-display text-lg font-semibold text-ink">{site.name}</p>
          <p className="mt-2 max-w-xs text-sm leading-6 text-muted">{site.tagline}</p>
        </div>
        {columns.map((column) => (
          <div key={column.title}>
            <h2 className="font-sans text-sm font-semibold text-ink">{column.title}</h2>
            <ul className="mt-3 space-y-2">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-muted hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-4 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>GitHub repository coming soon</p>
          <a href={site.stellarUrl} className="font-medium text-primary hover:text-primary-strong">
            Built on Stellar
          </a>
        </div>
      </div>
    </footer>
  );
}
