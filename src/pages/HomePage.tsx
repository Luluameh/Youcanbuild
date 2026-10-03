import { useEffect } from "react";
import { useLocation } from "react-router";
import { LandingPage } from "@/pages/LandingPage.tsx";

export function ScrollToHash() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (pathname !== "/" || !hash) {
      return;
    }
    const id = hash.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, [hash, pathname]);

  return null;
}

export function HomePage() {
  return (
    <>
      <ScrollToHash />
      <LandingPage />
    </>
  );
}
