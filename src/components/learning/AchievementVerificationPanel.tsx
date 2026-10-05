import { useState } from "react";
import type { ReactNode } from "react";
import { AchievementCertificate } from "@/components/learning/AchievementCertificate.tsx";
import { Button } from "@/components/ui/Button.tsx";
import { Card } from "@/components/ui/Card.tsx";
import { useAuth } from "@/context/AuthContext.tsx";
import { getAchievement } from "@/data/catalog.ts";
import { copyTextToClipboard, truncateStellarAddress, truncateTransactionHash } from "@/lib/stellarFormat.ts";
import { friendbotFundUrl } from "@/services/stellar/config.ts";
import { isStellarServiceError } from "@/services/stellar/errors.ts";
import type { VerificationPhase } from "@/services/stellar/types.ts";
import type { EarnedAchievement } from "@/types/index.ts";
import { hasPassedKnowledgeCheck } from "@/lib/knowledgeCheck.ts";

type AchievementVerificationPanelProps = {
  earned: EarnedAchievement;
};

function phaseMessage(phase: VerificationPhase): string | null {
  switch (phase) {
    case "connecting-wallet":
      return "Choose your Stellar wallet (Freighter, LOBSTR, xBull, WalletConnect, …).";
    case "building":
      return "Preparing your verification transaction…";
    case "awaiting-signature":
      return "Approve the transaction in your wallet (extension popup or mobile app).";
    case "submitting":
      return "Submitting to Stellar Testnet…";
    case "wrong-network":
      return "Switch your wallet to Stellar Testnet to continue.";
    default:
      return null;
  }
}

export function AchievementVerificationPanel({ earned }: AchievementVerificationPanelProps) {
  const { verifyAchievement, earnedAchievements, learnerProfile } = useAuth();
  const definition = getAchievement(earned.achievementId);
  const liveEarned =
    earnedAchievements.find((item) => item.achievementId === earned.achievementId) ?? earned;
  const [phase, setPhase] = useState<VerificationPhase>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [fundUrl, setFundUrl] = useState<string | null>(null);
  const [copyNote, setCopyNote] = useState<string | null>(null);

  const verification = liveEarned.verification;
  const busy = phase !== "idle" && phase !== "confirmed" && phase !== "error";
  const knowledgePassed = hasPassedKnowledgeCheck(liveEarned);
  const learnerName = learnerProfile?.displayName ?? "Learner";

  async function handleVerify() {
    setMessage(null);
    setFundUrl(null);
    setCopyNote(null);
    setPhase("connecting-wallet");
    try {
      const result = await verifyAchievement(earned.achievementId, setPhase);
      if (result.ok) {
        setPhase("confirmed");
        setMessage(
          result.alreadyVerified
            ? "This achievement is already verified on Stellar testnet."
            : "Verified on Stellar testnet.",
        );
        return;
      }

      if (import.meta.env.DEV && isStellarServiceError(result.error) && result.error.causeDetail) {
        console.debug("[stellar]", result.error.code, result.error.causeDetail);
      }

      setPhase(result.error.code === "wrong-network" ? "wrong-network" : "error");
      if (result.cancelled) {
        setMessage("Verification cancelled. Your achievement is still earned and ready to verify whenever you want.");
        setPhase("idle");
        return;
      }

      setMessage(result.error.message);
      if (result.error.publicKey) {
        setFundUrl(friendbotFundUrl(result.error.publicKey));
      }
    } catch (error) {
      setPhase("error");
      setMessage(error instanceof Error ? error.message : "Verification failed. Try again.");
    }
  }

  async function handleCopy(value: string, label: string) {
    const copied = await copyTextToClipboard(value);
    setCopyNote(copied ? `${label} copied` : `Could not copy ${label}`);
  }

  if (!definition) {
    return null;
  }

  if (verification.status === "verified") {
    return (
      <div className="space-y-6">
        <Card className="border-success/25 bg-success-soft/10">
          <p className="text-sm font-semibold text-success">✓ Verified on Stellar</p>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-muted">Network</dt>
              <dd className="font-medium text-ink">Stellar Testnet</dd>
            </div>
            <div>
              <dt className="text-muted">Verified</dt>
              <dd className="font-medium text-ink">{verification.recordedAt}</dd>
            </div>
            <div>
              <dt className="text-muted">Account</dt>
              <dd className="flex flex-wrap items-center gap-2 font-medium text-ink">
                <span title={verification.account}>{truncateStellarAddress(verification.account)}</span>
                <Button
                  type="button"
                  variant="ghost"
                  className="px-2 py-1 text-xs"
                  onClick={() => handleCopy(verification.account, "Account")}
                >
                  Copy
                </Button>
              </dd>
            </div>
            <div>
              <dt className="text-muted">Transaction</dt>
              <dd className="flex flex-wrap items-center gap-2 font-medium text-ink">
                <span title={verification.transactionHash}>
                  {truncateTransactionHash(verification.transactionHash)}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  className="px-2 py-1 text-xs"
                  onClick={() => handleCopy(verification.transactionHash, "Transaction hash")}
                >
                  Copy
                </Button>
              </dd>
            </div>
            <div>
              <dt className="text-muted">Achievement marker</dt>
              <dd className="font-mono text-xs text-ink">{verification.achievementCode}</dd>
            </div>
          </dl>
          <ButtonLinkExternal href={verification.explorerUrl} className="mt-4 inline-flex">
            View on Stellar Explorer
          </ButtonLinkExternal>
          {copyNote ? (
            <p className="mt-2 text-xs text-muted" role="status">
              {copyNote}
            </p>
          ) : null}
        </Card>

        <section>
          <h2 className="font-sans text-lg font-semibold text-ink">Your certificate</h2>
          <p className="mt-2 text-sm text-muted">
            Print or save a certificate for this milestone. The on-chain proof stays on Stellar testnet; the certificate
            is for you to share offline.
          </p>
          <div className="mt-4">
            <AchievementCertificate
              learnerDisplayName={learnerName}
              earned={liveEarned}
              verification={verification}
            />
          </div>
        </section>
      </div>
    );
  }

  if (verification.status !== "ready") {
    return (
      <Card>
        <p className="text-sm text-muted">Earn this milestone on your roadmap before Stellar verification is available.</p>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="font-sans text-lg font-semibold text-ink">Verification</h2>
      <p className="mt-2 text-sm leading-7 text-muted">
        You earned this achievement locally. Verify it on Stellar to create a public, independently checkable record of
        this milestone.
      </p>
      <p className="mt-3 text-sm text-muted">
        Use any supported Stellar wallet on testnet. A wallet picker opens when you verify; LOBSTR and WalletConnect can
        route approvals to your phone.
      </p>
      {phaseMessage(phase) ? (
        <p className="mt-3 text-sm font-medium text-primary" role="status">
          {phaseMessage(phase)}
        </p>
      ) : null}
      {message ? (
        <p className="mt-3 text-sm text-muted" role={phase === "error" ? "alert" : "status"}>
          {message}
        </p>
      ) : null}
      {fundUrl ? (
        <p className="mt-3 text-sm">
          <a
            href={fundUrl}
            className="font-semibold text-primary hover:text-primary-strong"
            target="_blank"
            rel="noreferrer"
          >
            Fund with Friendbot (testnet demo)
          </a>
        </p>
      ) : null}
      <Button
        type="button"
        className="mt-4"
        onClick={handleVerify}
        loading={busy}
        disabled={busy || !knowledgePassed}
      >
        Verify Achievement
      </Button>
      {!knowledgePassed ? (
        <p className="mt-3 text-sm text-muted">Complete the knowledge check above before Stellar verification unlocks.</p>
      ) : null}
      {phase === "wrong-network" ? (
        <p className="mt-3 text-sm text-muted">
          In your wallet, switch network to <strong className="text-ink">Testnet</strong> (Freighter: Settings → Network),
          then try again.
        </p>
      ) : null}
    </Card>
  );
}

function ButtonLinkExternal({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-paper hover:bg-primary-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${className ?? ""}`}
    >
      {children}
    </a>
  );
}
