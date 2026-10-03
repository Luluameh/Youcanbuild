import type { LearningPathId, MentorAvailability, MentorVerification } from "@/types/index.ts";

export type MentorDirectoryFilter = "all" | "frontend" | "ui-ux" | "web3";

export const mentorDirectoryFilters: { id: MentorDirectoryFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "frontend", label: "Frontend" },
  { id: "ui-ux", label: "UI/UX" },
  { id: "web3", label: "Web3" },
];

export function filterMentorsByCategory<T extends { pathIds: LearningPathId[] }>(
  mentors: T[],
  filter: MentorDirectoryFilter,
): T[] {
  if (filter === "all") {
    return mentors;
  }
  return mentors.filter((mentor) => mentor.pathIds.includes(filter));
}

export function sortMentorsForPath<T extends { id: string; pathIds: LearningPathId[]; displayName: string }>(
  mentors: T[],
  pathId: LearningPathId | null | undefined,
): T[] {
  if (!pathId) {
    return mentors;
  }
  return [...mentors].sort((left, right) => {
    const leftMatch = left.pathIds.includes(pathId) ? 0 : 1;
    const rightMatch = right.pathIds.includes(pathId) ? 0 : 1;
    if (leftMatch !== rightMatch) {
      return leftMatch - rightMatch;
    }
    return left.displayName.localeCompare(right.displayName);
  });
}

export function availabilityLabel(availability: MentorAvailability): string {
  switch (availability) {
    case "available":
      return "Available for new requests";
    case "limited":
      return "Limited availability";
    case "unavailable":
      return "Not accepting requests";
  }
}

export function verificationCopy(verification: MentorVerification): {
  label: string;
  detail: string;
  tone: "success" | "warning";
} {
  if (verification === "verified") {
    return {
      label: "Verified mentor",
      detail: "Profile reviewed by YouCanBuild for this hackathon demo.",
      tone: "success",
    };
  }
  return {
    label: "Demo profile pending review",
    detail: "Illustrative mentor profile for the hackathon demo.",
    tone: "warning",
  };
}
