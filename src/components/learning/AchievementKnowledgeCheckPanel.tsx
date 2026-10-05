import { useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button.tsx";
import { Card } from "@/components/ui/Card.tsx";
import { getKnowledgeCheckForAchievement } from "@/data/knowledgeChecks.ts";
import { useAuth } from "@/context/AuthContext.tsx";
import type { EarnedAchievement } from "@/types/index.ts";
import { hasPassedKnowledgeCheck } from "@/lib/knowledgeCheck.ts";

type AchievementKnowledgeCheckPanelProps = {
  earned: EarnedAchievement;
};

export function AchievementKnowledgeCheckPanel({ earned }: AchievementKnowledgeCheckPanelProps) {
  const { submitKnowledgeCheck, earnedAchievements } = useAuth();
  const liveEarned =
    earnedAchievements.find((item) => item.achievementId === earned.achievementId) ?? earned;
  const check = getKnowledgeCheckForAchievement(earned.achievementId);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const passed = hasPassedKnowledgeCheck(liveEarned);

  const allAnswered = useMemo(() => {
    if (!check) {
      return true;
    }
    return check.questions.every((question) => Boolean(answers[question.id]));
  }, [answers, check]);

  if (!check || passed) {
    return null;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFeedback(null);
    setSubmitting(true);
    const result = submitKnowledgeCheck(earned.achievementId, answers);
    setSubmitting(false);
    if (result.ok) {
      setFeedback(`Nice work — ${result.score}/${result.total} correct. You can verify on Stellar testnet next.`);
      return;
    }
    setFeedback(
      `You got ${result.score}/${result.total}. You need at least ${result.passAt} correct — review the module and try again.`,
    );
  }

  return (
    <Card className="border-primary/20 bg-primary-soft/15">
      <h2 className="font-sans text-lg font-semibold text-ink">Knowledge check</h2>
      <p className="mt-2 text-sm leading-7 text-muted">{check.intro}</p>
      <p className="mt-2 text-xs text-muted">
        Pass with {check.passAt} of {check.questions.length} correct, then Stellar verification unlocks.
      </p>
      <form className="mt-5 space-y-5" onSubmit={handleSubmit}>
        {check.questions.map((question, index) => (
          <fieldset key={question.id} className="space-y-2">
            <legend className="text-sm font-semibold text-ink">
              {index + 1}. {question.prompt}
            </legend>
            <div className="space-y-2">
              {question.choices.map((choice) => (
                <label
                  key={choice.id}
                  className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-paper-raised px-3 py-2 text-sm hover:border-primary/30"
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={choice.id}
                    checked={answers[question.id] === choice.id}
                    onChange={() => setAnswers((prev) => ({ ...prev, [question.id]: choice.id }))}
                    className="mt-1"
                  />
                  <span>{choice.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
        {feedback ? (
          <p className="text-sm text-muted" role="status">
            {feedback}
          </p>
        ) : null}
        <Button type="submit" loading={submitting} disabled={!allAnswered || submitting}>
          Submit answers
        </Button>
      </form>
    </Card>
  );
}
