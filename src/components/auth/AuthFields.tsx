import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn.ts";

type FieldProps = {
  label: string;
  id: string;
  hint?: string;
  error?: string;
  className?: string;
};

export function TextField({
  label,
  id,
  hint,
  error,
  className,
  ...props
}: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-semibold text-ink">
        {label}
      </label>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(
          "mt-2 w-full rounded-xl border bg-paper-raised px-4 py-3 text-sm text-ink outline-none transition-colors",
          "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
          error ? "border-danger" : "border-line",
        )}
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextAreaField({
  label,
  id,
  hint,
  error,
  className,
  ...props
}: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-semibold text-ink">
        {label}
      </label>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        className={cn(
          "mt-2 min-h-28 w-full rounded-xl border bg-paper-raised px-4 py-3 text-sm text-ink outline-none transition-colors",
          "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
          error ? "border-danger" : "border-line",
        )}
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type RoleChoiceProps = {
  value: "learner" | "mentor";
  onChange: (value: "learner" | "mentor") => void;
};

export function RoleChoice({ value, onChange }: RoleChoiceProps) {
  const options = [
    { id: "learner", label: "Learner", description: "Follow a roadmap and build skills step by step." },
    { id: "mentor", label: "Mentor", description: "Guide learners through structured requests." },
  ] as const;

  return (
    <fieldset>
      <legend className="text-sm font-semibold text-ink">Role</legend>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {options.map((option) => (
          <label
            key={option.id}
            className={cn(
              "cursor-pointer rounded-2xl border px-4 py-4 transition-colors",
              value === option.id
                ? "border-primary bg-primary-soft"
                : "border-line bg-paper-raised hover:border-primary/40",
            )}
          >
            <input
              type="radio"
              name="role"
              value={option.id}
              checked={value === option.id}
              onChange={() => onChange(option.id)}
              className="sr-only"
            />
            <span className="font-semibold text-ink">{option.label}</span>
            <p className="mt-1 text-sm text-muted">{option.description}</p>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function AuthShell({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-lg py-10 lg:py-14">
      <h1 className="text-3xl text-ink sm:text-4xl">{title}</h1>
      <p className="mt-3 text-base leading-7 text-muted">{description}</p>
      <div className="mt-8">{children}</div>
    </div>
  );
}
