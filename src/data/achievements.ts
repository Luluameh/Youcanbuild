import type { AchievementDefinition } from "@/types/index.ts";

export const achievements: AchievementDefinition[] = [
  {
    id: "html-foundations",
    name: "HTML Foundations",
    description: "Structured an accessible page with semantic HTML.",
    pathId: "frontend",
    moduleId: "fe-html",
  },
  {
    id: "css-foundations",
    name: "CSS Foundations",
    description: "Styled a responsive page with a consistent layout.",
    pathId: "frontend",
    moduleId: "fe-css",
  },
  {
    id: "javascript-explorer",
    name: "JavaScript Explorer",
    description: "Built a small interactive application with JavaScript.",
    pathId: "frontend",
    moduleId: "fe-javascript",
  },
  {
    id: "react-builder",
    name: "React Builder",
    description: "Rebuilt an interface as React components with state.",
    pathId: "frontend",
    moduleId: "fe-react",
  },
  {
    id: "frontend-foundations",
    name: "Frontend Foundations",
    description: "Published a portfolio project that brings the frontend path together.",
    pathId: "frontend",
    moduleId: "fe-portfolio",
  },
  {
    id: "stellar-explorer",
    name: "Stellar Explorer",
    description: "Explained a Stellar testnet transaction and how to read it in public.",
    pathId: "web3",
    moduleId: "w3-stellar",
  },
];
