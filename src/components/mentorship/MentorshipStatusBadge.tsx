import { Badge } from "@/components/ui/Badge.tsx";
import { mentorshipStatusLabel } from "@/services/mentorship/repository.ts";
import type { MentorshipStatus } from "@/types/index.ts";

type MentorshipStatusBadgeProps = {
  status: MentorshipStatus;
};

export function MentorshipStatusBadge({ status }: MentorshipStatusBadgeProps) {
  const label = mentorshipStatusLabel(status);
  const tone =
    status === "accepted"
      ? "primary"
      : status === "completed"
        ? "success"
        : status === "declined"
          ? "danger"
          : "warning";

  return (
    <Badge tone={tone}>
      <span className="sr-only">Status: </span>
      {label}
    </Badge>
  );
}
