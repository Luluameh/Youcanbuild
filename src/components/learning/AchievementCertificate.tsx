import { useState, type ReactNode } from "react";
import { site } from "@/config/site.ts";
import { getAchievement, getLearningPath, getModule } from "@/data/catalog.ts";
import { pathLabels } from "@/lib/labels.ts";
import {
  buildCertificateShareText,
  buildCertificateShareTextShort,
  certificatePageUrl,
  copyCertificateShare,
  downloadCertificatePdf,
  linkedInShareUrl,
  mailtoShareUrl,
  nativeShareCertificate,
  twitterShareUrl,
  whatsAppShareUrl,
  type CertificateSharePayload,
} from "@/lib/certificateShare.ts";
import { truncateStellarAddress, truncateTransactionHash } from "@/lib/stellarFormat.ts";
import type { EarnedAchievement, StellarVerification } from "@/types/index.ts";
import { BrandMark } from "@/components/layout/BrandMark.tsx";
import { Button } from "@/components/ui/Button.tsx";

type AchievementCertificateProps = {
  learnerDisplayName: string;
  earned: EarnedAchievement;
  verification: Extract<StellarVerification, { status: "verified" }>;
  printTargetId?: string;
};

export function AchievementCertificate({
  learnerDisplayName,
  earned,
  verification,
  printTargetId = "achievement-certificate",
}: AchievementCertificateProps) {
  const definition = getAchievement(earned.achievementId);
  const module = definition ? getModule(definition.moduleId) : undefined;
  const path = definition ? getLearningPath(definition.pathId) : undefined;
  const [shareNote, setShareNote] = useState<string | null>(null);

  if (!definition) {
    return null;
  }

  const sharePayload: CertificateSharePayload = {
    learnerDisplayName,
    achievementName: definition.name,
    pathLabel: path?.title ?? pathLabels[definition.pathId],
    explorerUrl: verification.explorerUrl,
    achievementPageUrl: certificatePageUrl(earned.achievementId),
    recordedAt: verification.recordedAt,
  };

  const shareTextShort = buildCertificateShareTextShort(sharePayload);
  const mailSubject = `${site.name} certificate · ${definition.name}`;
  const mailBody = buildCertificateShareText(sharePayload);

  async function handleCopyShare() {
    const copied = await copyCertificateShare(sharePayload);
    setShareNote(copied ? "Share message copied — paste it on any social app." : "Could not copy. Try Share instead.");
  }

  async function handleNativeShare() {
    const shared = await nativeShareCertificate(sharePayload);
    if (!shared) {
      await handleCopyShare();
    }
  }

  return (
    <div className="space-y-4 print-certificate-root">
      <CertificateShareActions
        shareNote={shareNote}
        onDownloadPdf={() => {
          setShareNote("Choose “Save as PDF” in the print dialog to download.");
          downloadCertificatePdf();
        }}
        onNativeShare={handleNativeShare}
        onCopy={handleCopyShare}
        twitterHref={twitterShareUrl(shareTextShort, verification.explorerUrl)}
        linkedInHref={linkedInShareUrl(verification.explorerUrl)}
        mailHref={mailtoShareUrl(mailSubject, mailBody)}
        whatsAppHref={whatsAppShareUrl(buildCertificateShareText(sharePayload))}
      />

      <article
        id={printTargetId}
        className="certificate-sheet mx-auto max-w-3xl rounded-2xl border-2 border-brand-navy/20 bg-paper-raised p-8 shadow-sm print:rounded-none print:border-brand-navy print:shadow-none"
      >
        <header className="flex flex-wrap items-start justify-between gap-6 border-b border-line pb-6">
          <div className="flex items-center gap-3">
            <BrandMark className="size-12" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-sky">{site.name}</p>
              <p className="font-display text-lg text-ink">Achievement certificate</p>
            </div>
          </div>
          <StellarBrandLockup />
        </header>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 rounded-xl border border-brand-sky/25 bg-primary-soft/40 px-4 py-3 text-center">
          <img
            src={site.brand.stellarLogomarkSrc}
            alt=""
            width={28}
            height={28}
            className="size-7 shrink-0"
            aria-hidden="true"
          />
          <p className="text-sm font-medium text-ink">
            On-chain verification on the <span className="text-brand-navy">Stellar</span> network · testnet
          </p>
        </div>

        <p className="mt-8 text-center font-display text-2xl text-ink md:text-3xl">Certificate of milestone</p>
        <p className="mt-4 text-center text-sm text-muted">This certifies that</p>
        <p className="mt-2 text-center font-display text-3xl text-brand-navy">{learnerDisplayName}</p>
        <p className="mt-6 text-center text-sm leading-7 text-muted">
          has completed the <strong className="text-ink">{pathLabels[definition.pathId]}</strong> milestone
        </p>
        <p className="mt-2 text-center font-display text-2xl text-ink">{definition.name}</p>
        <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-7 text-muted">{definition.description}</p>

        {module ? (
          <div className="mt-8 rounded-xl border border-line bg-paper px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Roadmap module</p>
            <p className="mt-1 font-semibold text-ink">{module.title}</p>
            {module.objectives.length > 0 ? (
              <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted">
                {module.objectives.slice(0, 4).map((objective) => (
                  <li key={objective}>{objective}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        <dl className="mt-8 grid gap-4 border-t border-line pt-6 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted">Program path</dt>
            <dd className="font-medium text-ink">{path?.title ?? pathLabels[definition.pathId]}</dd>
          </div>
          <div>
            <dt className="text-muted">Milestone earned</dt>
            <dd className="font-medium text-ink">{earned.earnedAt}</dd>
          </div>
          <div>
            <dt className="text-muted">On-chain verification</dt>
            <dd className="font-medium text-ink">{verification.recordedAt}</dd>
          </div>
          <div>
            <dt className="text-muted">Public marker</dt>
            <dd className="font-mono text-xs text-ink">{verification.achievementCode}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-muted">Transaction</dt>
            <dd className="font-mono text-xs text-ink" title={verification.transactionHash}>
              {truncateTransactionHash(verification.transactionHash)}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-muted">Stellar account</dt>
            <dd className="font-mono text-xs text-ink" title={verification.account}>
              {truncateStellarAddress(verification.account)}
            </dd>
          </div>
        </dl>

        <footer className="mt-8 space-y-4 border-t border-line pt-6 text-xs text-muted">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <a
              href={verification.explorerUrl}
              className="font-semibold text-primary print:text-ink"
              target="_blank"
              rel="noreferrer"
            >
              View on Stellar Explorer →
            </a>
            <a
              href={site.stellarBrandUrl}
              className="font-semibold text-primary print:text-ink"
              target="_blank"
              rel="noreferrer"
            >
              Stellar brand resources
            </a>
          </div>
          <p className="max-w-2xl leading-6">
            {site.name} hackathon demo certificate. Stellar® and the Stellar logo are trademarks of the Stellar
            Development Foundation. On-chain proof is a public testnet transaction—anyone can verify it via the explorer.
            No private learner data is stored on Stellar.
          </p>
        </footer>
      </article>
    </div>
  );
}

function StellarBrandLockup() {
  return (
    <div className="flex flex-col items-end gap-1 text-right">
      <img
        src={site.brand.stellarLogoHorizSrc}
        alt="Stellar"
        width={160}
        height={32}
        className="h-8 w-auto max-w-[160px] object-contain object-right"
      />
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">Verified on testnet</p>
    </div>
  );
}

type CertificateShareActionsProps = {
  shareNote: string | null;
  onDownloadPdf: () => void;
  onNativeShare: () => void;
  onCopy: () => void;
  twitterHref: string;
  linkedInHref: string;
  mailHref: string;
  whatsAppHref: string;
};

function CertificateShareActions({
  shareNote,
  onDownloadPdf,
  onNativeShare,
  onCopy,
  twitterHref,
  linkedInHref,
  mailHref,
  whatsAppHref,
}: CertificateShareActionsProps) {
  const canNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  return (
    <CardToolbar>
      <p className="w-full text-sm font-semibold text-ink">Share or download</p>
      <p className="w-full text-sm text-muted">
        Download a PDF, send to a friend, or post your milestone—include the explorer link so others can verify on
        Stellar testnet.
      </p>
      <div className="flex w-full flex-wrap gap-2">
        <Button type="button" variant="primary" size="sm" onClick={onDownloadPdf}>
          Download PDF
        </Button>
        {canNativeShare ? (
          <Button type="button" variant="secondary" size="sm" onClick={onNativeShare}>
            Share…
          </Button>
        ) : null}
        <Button type="button" variant="secondary" size="sm" onClick={onCopy}>
          Copy message
        </Button>
        <ShareLink href={twitterHref} label="Post on X" />
        <ShareLink href={linkedInHref} label="LinkedIn" />
        <ShareLink href={mailHref} label="Email friend" />
        <ShareLink href={whatsAppHref} label="WhatsApp" />
      </div>
      {shareNote ? (
        <p className="w-full text-sm text-muted" role="status">
          {shareNote}
        </p>
      ) : null}
    </CardToolbar>
  );
}

function CardToolbar({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-line bg-paper-raised p-4 print:hidden">
      {children}
    </div>
  );
}

function ShareLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-9 items-center justify-center rounded-full border border-line bg-paper-raised px-3 text-sm font-semibold text-ink hover:bg-paper"
    >
      {label}
    </a>
  );
}
