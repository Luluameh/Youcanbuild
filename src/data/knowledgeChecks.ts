export type KnowledgeQuestion = {
  id: string;
  prompt: string;
  choices: { id: string; label: string }[];
  /** Id of the correct choice */
  answerId: string;
  hint?: string;
};

export type AchievementKnowledgeCheck = {
  achievementId: string;
  title: string;
  intro: string;
  /** Minimum correct answers required (inclusive). */
  passAt: number;
  questions: KnowledgeQuestion[];
};

export const achievementKnowledgeChecks: AchievementKnowledgeCheck[] = [
  {
    achievementId: "html-foundations",
    title: "HTML quick check",
    intro: "Three friendly questions on semantic HTML and accessibility from your HTML module.",
    passAt: 2,
    questions: [
      {
        id: "html-1",
        prompt: "Which element is best for the main content of a page (one per page)?",
        choices: [
          { id: "a", label: "<div class=\"main\">" },
          { id: "b", label: "<main>" },
          { id: "c", label: "<section>" },
        ],
        answerId: "b",
        hint: "Landmark elements like <main> help screen readers skip to content.",
      },
      {
        id: "html-2",
        prompt: "What makes a form field accessible when you add a visible label?",
        choices: [
          { id: "a", label: "Wrap the input in <label> or use for/id to associate them" },
          { id: "b", label: "Only placeholder text is needed" },
          { id: "c", label: "Use <span> instead of <label>" },
        ],
        answerId: "a",
      },
      {
        id: "html-3",
        prompt: "Headings should…",
        choices: [
          { id: "a", label: "Skip levels for styling (h1 then h4)" },
          { id: "b", label: "Follow a logical order (h1 → h2 → h3)" },
          { id: "c", label: "Be avoided on real pages" },
        ],
        answerId: "b",
      },
    ],
  },
  {
    achievementId: "css-foundations",
    title: "CSS quick check",
    intro: "Check your layout and responsive basics from the CSS module.",
    passAt: 2,
    questions: [
      {
        id: "css-1",
        prompt: "Flexbox is especially useful for…",
        choices: [
          { id: "a", label: "Aligning items in a row or column" },
          { id: "b", label: "Storing data in the browser" },
          { id: "c", label: "Connecting to Stellar" },
        ],
        answerId: "a",
      },
      {
        id: "css-2",
        prompt: "A responsive layout usually means…",
        choices: [
          { id: "a", label: "The page works on different screen sizes" },
          { id: "b", label: "The page only works on desktop" },
          { id: "c", label: "You never use media queries" },
        ],
        answerId: "a",
      },
      {
        id: "css-3",
        prompt: "Padding adds space…",
        choices: [
          { id: "a", label: "Outside the border" },
          { id: "b", label: "Inside the border, around the content" },
          { id: "c", label: "Between two unrelated pages" },
        ],
        answerId: "b",
      },
    ],
  },
  {
    achievementId: "javascript-explorer",
    title: "JavaScript quick check",
    intro: "Light questions on functions, arrays, and everyday JS from your module.",
    passAt: 2,
    questions: [
      {
        id: "js-1",
        prompt: "A function is best when it…",
        choices: [
          { id: "a", label: "Does one clear job" },
          { id: "b", label: "Changes unrelated parts of the app silently" },
          { id: "c", label: "Has no parameters ever" },
        ],
        answerId: "a",
      },
      {
        id: "js-2",
        prompt: "Array methods like map() or filter()…",
        choices: [
          { id: "a", label: "Return a new array based on each item" },
          { id: "b", label: "Only work on strings" },
          { id: "c", label: "Replace HTML tags" },
        ],
        answerId: "a",
      },
      {
        id: "js-3",
        prompt: "const in JavaScript means…",
        choices: [
          { id: "a", label: "The binding cannot be reassigned" },
          { id: "b", label: "The value can never change in memory" },
          { id: "c", label: "It only works in CSS" },
        ],
        answerId: "a",
      },
    ],
  },
  {
    achievementId: "react-builder",
    title: "React quick check",
    intro: "Confirm the component mindset from your React module.",
    passAt: 2,
    questions: [
      {
        id: "react-1",
        prompt: "In React, UI is built from…",
        choices: [
          { id: "a", label: "Reusable components" },
          { id: "b", label: "One giant HTML file only" },
          { id: "c", label: "Database tables" },
        ],
        answerId: "a",
      },
      {
        id: "react-2",
        prompt: "State in a component is used to…",
        choices: [
          { id: "a", label: "Remember data that can change over time" },
          { id: "b", label: "Replace all CSS" },
          { id: "c", label: "Sign Stellar transactions" },
        ],
        answerId: "a",
      },
      {
        id: "react-3",
        prompt: "Props are…",
        choices: [
          { id: "a", label: "Inputs passed from a parent to a child component" },
          { id: "b", label: "Secret keys for wallets" },
          { id: "c", label: "Only used in backend code" },
        ],
        answerId: "a",
      },
    ],
  },
  {
    achievementId: "frontend-foundations",
    title: "Frontend path quick check",
    intro: "Wrap-up questions on bringing HTML, CSS, JS, and React together.",
    passAt: 2,
    questions: [
      {
        id: "fe-1",
        prompt: "A portfolio project on the frontend path should show…",
        choices: [
          { id: "a", label: "Structured content, styling, and interactivity working together" },
          { id: "b", label: "Only raw HTML with no layout" },
          { id: "c", label: "Private user passwords" },
        ],
        answerId: "a",
      },
      {
        id: "fe-2",
        prompt: "Semantic HTML helps because…",
        choices: [
          { id: "a", label: "People and assistive tech understand page structure" },
          { id: "b", label: "It removes the need for CSS" },
          { id: "c", label: "It mines cryptocurrency" },
        ],
        answerId: "a",
      },
      {
        id: "fe-3",
        prompt: "Before shipping a project you should…",
        choices: [
          { id: "a", label: "Test on more than one screen size and fix obvious issues" },
          { id: "b", label: "Never open developer tools" },
          { id: "c", label: "Delete all labels from forms" },
        ],
        answerId: "a",
      },
    ],
  },
  {
    achievementId: "stellar-explorer",
    title: "Stellar quick check",
    intro: "Make sure you can read testnet activity—the same skill you use when verifying achievements.",
    passAt: 2,
    questions: [
      {
        id: "w3-1",
        prompt: "Stellar testnet is for…",
        choices: [
          { id: "a", label: "Trying apps and learning without real money" },
          { id: "b", label: "Production payments to customers" },
          { id: "c", label: "Storing private emails on-chain" },
        ],
        answerId: "a",
      },
      {
        id: "w3-2",
        prompt: "A transaction hash lets you…",
        choices: [
          { id: "a", label: "Look up that transaction in an explorer" },
          { id: "b", label: "Recover someone's secret key" },
          { id: "c", label: "Skip wallet approval" },
        ],
        answerId: "a",
      },
      {
        id: "w3-3",
        prompt: "YouCanBuild puts achievement markers in a transaction…",
        choices: [
          { id: "a", label: "Memo (public code), not your name or email" },
          { id: "b", label: "With your home address" },
          { id: "c", label: "Only inside localStorage on Stellar" },
        ],
        answerId: "a",
      },
    ],
  },
];

const byAchievementId = new Map(achievementKnowledgeChecks.map((check) => [check.achievementId, check]));

export function getKnowledgeCheckForAchievement(achievementId: string): AchievementKnowledgeCheck | undefined {
  return byAchievementId.get(achievementId);
}
