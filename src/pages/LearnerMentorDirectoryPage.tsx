import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { MentorCard } from "@/components/mentorship/MentorCard.tsx";
import { EmptyState } from "@/components/ui/EmptyState.tsx";
import { PageHeader } from "@/components/ui/PageHeader.tsx";
import { mentors } from "@/data/catalog.ts";
import { useAuth } from "@/context/AuthContext.tsx";
import { useMentorship } from "@/context/MentorshipContext.tsx";
import { useDocumentTitle } from "@/hooks/useDocumentTitle.ts";
import {
  filterMentorsByCategory,
  mentorDirectoryFilters,
  sortMentorsForPath,
  type MentorDirectoryFilter,
} from "@/lib/mentorshipUi.ts";
import { cn } from "@/lib/cn.ts";

export function LearnerMentorDirectoryPage() {
  useDocumentTitle("Find a mentor");
  const { learnerProfile } = useAuth();
  const { blockedMentorIds } = useMentorship();
  const [searchParams, setSearchParams] = useSearchParams();
  const filterParam = searchParams.get("filter");
  const moduleId = searchParams.get("moduleId") ?? undefined;
  const initialFilter: MentorDirectoryFilter =
    filterParam === "frontend" || filterParam === "ui-ux" || filterParam === "web3" ? filterParam : "all";
  const [filter, setFilter] = useState<MentorDirectoryFilter>(initialFilter);

  const learnerUserId = learnerProfile?.userId;
  const blockedIds = learnerUserId ? blockedMentorIds(learnerUserId) : [];

  const visibleMentors = useMemo(() => {
    const filtered = filterMentorsByCategory(
      mentors.filter((mentor) => !blockedIds.includes(mentor.id)),
      filter,
    );
    return sortMentorsForPath(filtered, learnerProfile?.pathId);
  }, [blockedIds, filter, learnerProfile?.pathId]);

  function selectFilter(next: MentorDirectoryFilter) {
    setFilter(next);
    const params = new URLSearchParams(searchParams);
    if (next === "all") {
      params.delete("filter");
    } else {
      params.set("filter", next);
    }
    setSearchParams(params, { replace: true });
  }

  function requestHref(mentorId: string) {
    const base = `/learn/mentors/${mentorId}/request`;
    if (!moduleId) {
      return base;
    }
    return `${base}?moduleId=${encodeURIComponent(moduleId)}`;
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <PageHeader
        eyebrow="Mentor directory"
        title="Find a mentor"
        description="Request structured guidance on your path and module. No private chat or contact details are shared."
      />

      <div role="tablist" aria-label="Filter mentors by skill area" className="flex flex-wrap gap-2">
        {mentorDirectoryFilters.map((item) => {
          const selected = filter === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                selected
                  ? "border-primary bg-primary-soft text-primary-strong"
                  : "border-line bg-surface text-muted hover:text-ink",
              )}
              onClick={() => selectFilter(item.id)}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {visibleMentors.length === 0 ? (
        <EmptyState
          title="No mentors match this filter"
          description="Try another skill area or unblock a mentor from a previous request."
        />
      ) : (
        <ul className="grid gap-5 md:grid-cols-2">
          {visibleMentors.map((mentor, index) => (
            <li key={mentor.id}>
              <MentorCard
                mentor={mentor}
                requestHref={requestHref(mentor.id)}
                highlighted={index === 0 && Boolean(learnerProfile?.pathId && mentor.pathIds.includes(learnerProfile.pathId))}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
