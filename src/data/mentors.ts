import type { MentorProfile } from "@/types/index.ts";

/** Demo portrait URLs (replace with real mentor photos in production). */
function mentorAvatarSeed(displayName: string): string {
  return encodeURIComponent(displayName.replace(/\s+/g, "-").toLowerCase());
}

export function mentorAvatarUrl(displayName: string): string {
  return `https://api.dicebear.com/7.x/notionists/svg?seed=${mentorAvatarSeed(displayName)}&backgroundColor=e3f0f4,fcfdfe`;
}

export const mentors: MentorProfile[] = [
  {
    id: "mentor-amara",
    displayName: "Amara Okonkwo",
    headline: "Frontend mentor · JavaScript & React",
    expertise: ["Frontend Development", "JavaScript", "React", "TypeScript"],
    technologies: ["HTML", "CSS", "JavaScript", "React", "TypeScript"],
    bio: "Amara helps learners who are writing their first interactive pages. She focuses on small exercises, array methods, and clear next steps.",
    verification: "verified",
    availability: "available",
    pathIds: ["frontend"],
    avatarSrc: mentorAvatarUrl("Amara Okonkwo"),
    social: {
      github: "https://github.com/amara-okonkwo",
      linkedIn: "https://www.linkedin.com/in/amara-okonkwo/",
      twitter: "https://x.com/amara_builds",
      website: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    },
  },
  {
    id: "mentor-lina",
    displayName: "Lina Chen",
    headline: "UI/UX mentor · Research & prototyping",
    expertise: ["Product design", "User research", "Portfolio case studies"],
    technologies: ["Figma", "Prototyping", "Usability testing"],
    bio: "Lina helps learners turn a rough idea into a flow they can test with another person.",
    verification: "verified",
    availability: "limited",
    pathIds: ["ui-ux"],
    avatarSrc: mentorAvatarUrl("Lina Chen"),
    social: {
      github: "https://github.com/lina-chen-ux",
      linkedIn: "https://www.linkedin.com/in/lina-chen-ux/",
      twitter: "https://x.com/lina_designs",
    },
  },
  {
    id: "mentor-sofia",
    displayName: "Sofia Alvarez",
    headline: "Web3 mentor · Stellar fundamentals",
    expertise: ["Stellar fundamentals", "Testnet development", "Wallet safety"],
    technologies: ["Stellar", "JavaScript", "Soroban"],
    bio: "Sofia introduces Stellar through testnet projects and spends extra time on what should never be shared.",
    verification: "verified",
    availability: "available",
    pathIds: ["web3"],
    avatarSrc: mentorAvatarUrl("Sofia Alvarez"),
    social: {
      github: "https://github.com/stellar/soroban-examples",
      linkedIn: "https://www.linkedin.com/company/stellar-development-foundation/",
      twitter: "https://x.com/stellarorg",
      website: "https://stellar.org/learn",
    },
  },
  {
    id: "mentor-nia",
    displayName: "Nia Mensah",
    headline: "Frontend mentor · CSS & portfolios",
    expertise: ["CSS layout", "Responsive design", "First portfolios"],
    technologies: ["CSS", "HTML", "GitHub"],
    bio: "Nia mentors learners who can build a page and want help making it hold together on a phone.",
    verification: "pending",
    availability: "available",
    pathIds: ["frontend"],
    avatarSrc: mentorAvatarUrl("Nia Mensah"),
    social: {
      github: "https://github.com/nia-mensah",
      linkedIn: "https://www.linkedin.com/in/nia-mensah/",
      twitter: "https://x.com/nia_css",
    },
  },
];
