import type { MentorshipRequest } from "@/types/index.ts";

/** Seed requests for non-demo learners only. Ada creates requests during the live demo. */
export const mentorshipSeedRequests: MentorshipRequest[] = [
  {
    id: "req-leila-css",
    learnerId: "learner-leila-demo",
    learnerDisplayName: "Leila",
    mentorId: "mentor-amara",
    pathId: "frontend",
    moduleId: "fe-css",
    topic: "Flexbox and grid",
    description: "I can center a card, but the layout breaks when the text gets longer.",
    status: "accepted",
    createdAt: "2026-09-18",
    updatedAt: "2026-09-19",
  },
  {
    id: "req-leila-html",
    learnerId: "learner-leila-demo",
    learnerDisplayName: "Leila",
    mentorId: "mentor-amara",
    pathId: "frontend",
    moduleId: "fe-html",
    topic: "Choosing semantic elements",
    description: "I used divs for everything. I want to know which elements belong in a simple profile page.",
    status: "completed",
    createdAt: "2026-09-02",
    updatedAt: "2026-09-10",
    guidance: {
      message:
        "Start with one landmark per region: header, main, footer. Use headings in order and reserve buttons for actions.",
      resourceTitle: "Structuring content with HTML",
      resourceUrl: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content",
      submittedAt: "2026-09-05",
    },
  },
  {
    id: "req-maya-wireframes",
    learnerId: "learner-maya-demo",
    learnerDisplayName: "Maya",
    mentorId: "mentor-lina",
    pathId: "ui-ux",
    moduleId: "ux-wireframe",
    topic: "Choosing what to wireframe first",
    description: "I have research notes, but I am not sure which screens belong in the first wireframe.",
    status: "accepted",
    createdAt: "2026-09-20",
    updatedAt: "2026-09-21",
  },
];
