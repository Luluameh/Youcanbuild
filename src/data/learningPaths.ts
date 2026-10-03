import type { LearningPath } from "@/types/index.ts";

export const learningPaths: LearningPath[] = [
  {
    id: "frontend",
    title: "Frontend Development",
    description:
      "Learn how websites are built, then practice HTML, CSS, JavaScript, and React until you can ship a portfolio project.",
    estimatedDuration: "8–10 weeks",
    sampleTopics: ["HTML", "CSS", "JavaScript", "React"],
    moduleIds: [
      "fe-internet",
      "fe-html",
      "fe-css",
      "fe-javascript",
      "fe-git",
      "fe-react",
      "fe-apis",
      "fe-typescript",
      "fe-portfolio",
    ],
  },
  {
    id: "ui-ux",
    title: "UI/UX Design",
    description:
      "Learn how to understand people, shape clear interfaces, and present a case study that shows your decisions.",
    estimatedDuration: "7–9 weeks",
    sampleTopics: ["Research", "Typography", "Figma", "Prototyping"],
    moduleIds: [
      "ux-fundamentals",
      "ux-research",
      "ux-type",
      "ux-color",
      "ux-wireframe",
      "ux-figma",
      "ux-prototype",
      "ux-testing",
      "ux-case-study",
    ],
  },
  {
    id: "web3",
    title: "Web3 Development",
    description:
      "Learn blockchain basics with a Stellar focus, then build a small app that can talk to the network.",
    estimatedDuration: "8–10 weeks",
    sampleTopics: ["Wallets", "Stellar", "Accounts", "dApps"],
    moduleIds: [
      "w3-blockchain",
      "w3-wallets",
      "w3-security",
      "w3-stellar",
      "w3-accounts",
      "w3-sdk",
      "w3-contracts",
      "w3-dapp",
    ],
  },
];
