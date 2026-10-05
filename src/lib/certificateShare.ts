import { site } from "@/config/site.ts";

export type CertificateSharePayload = {
  learnerDisplayName: string;
  achievementName: string;
  pathLabel: string;
  explorerUrl: string;
  achievementPageUrl: string;
  recordedAt: string;
};

export function buildCertificateShareText(payload: CertificateSharePayload): string {
  return [
    `I verified my ${payload.achievementName} milestone on Stellar testnet with ${site.name}.`,
    `${payload.pathLabel} · ${payload.recordedAt}`,
    `On-chain proof: ${payload.explorerUrl}`,
  ].join("\n");
}

export function buildCertificateShareTextShort(payload: CertificateSharePayload): string {
  return `I earned ${payload.achievementName} on ${site.name} — verified on Stellar testnet. ${payload.explorerUrl}`;
}

export function twitterShareUrl(text: string, url: string): string {
  const params = new URLSearchParams({
    text,
    url,
  });
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

export function linkedInShareUrl(url: string): string {
  const params = new URLSearchParams({ url });
  return `https://www.linkedin.com/sharing/share-offsite/?${params.toString()}`;
}

export function mailtoShareUrl(subject: string, body: string): string {
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function whatsAppShareUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function certificatePageUrl(achievementId: string): string {
  if (typeof window === "undefined") {
    return `/learn/achievements/${achievementId}`;
  }
  return `${window.location.origin}/learn/achievements/${achievementId}`;
}

export async function copyCertificateShare(payload: CertificateSharePayload): Promise<boolean> {
  const text = buildCertificateShareText(payload);
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export async function nativeShareCertificate(payload: CertificateSharePayload): Promise<boolean> {
  if (typeof navigator.share !== "function") {
    return false;
  }
  try {
    await navigator.share({
      title: `${site.name} · ${payload.achievementName}`,
      text: buildCertificateShareTextShort(payload),
      url: payload.explorerUrl,
    });
    return true;
  } catch {
    return false;
  }
}

export function downloadCertificatePdf(): void {
  const previousTitle = document.title;
  document.title = `${site.name}-certificate`;
  window.print();
  window.setTimeout(() => {
    document.title = previousTitle;
  }, 500);
}
