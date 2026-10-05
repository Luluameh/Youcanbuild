export const site = {
  name: "YouCanBuild",
  tagline: "Learn. Build. Get Guided. Prove Your Progress.",
  socialTagline: "People • Skills • Opportunities",
  stellarUrl: "https://stellar.org",
  stellarBrandUrl: "https://www.stellar.org/brand",
  brand: {
    /** Transparent mark — use SVG in repo; replace with your removebg PNG at the same path if you prefer */
    markSrc: "/brand/youcanbuild-mark.svg",
    xBannerSrc: "/brand/x-banner.png",
    /** Stellar Development Foundation brand assets (logomark + horizontal lockup) */
    stellarLogomarkSrc: "/brand/stellar-logomark.svg",
    stellarLogoHorizSrc: "/brand/stellar-logo-horiz.svg",
  },
} as const;

export const publicLinks = [
  { label: "Explore Skills", to: "/explore" },
  { label: "How It Works", to: "/how-it-works" },
  { label: "Mentors", to: "/mentors" },
  { label: "About", to: "/about" },
] as const;
