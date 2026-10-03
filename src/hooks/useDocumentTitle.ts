import { useEffect } from "react";
import { site } from "@/config/site.ts";

export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = `${title} · ${site.name}`;
  }, [title]);
}
