import { useMemo } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type PasswordStrengthLevel = "weak" | "fair" | "good" | "strong";

export function getPasswordStrength(password: string): {
  level: PasswordStrengthLevel;
  score: number;
  checks: { id: string; label: string; met: boolean }[];
} {
  const checks = [
    {
      id: "len",
      label: "At least 6 characters",
      met: password.length >= 6,
    },
    {
      id: "case",
      label: "Upper and lowercase letter",
      met: /[a-z]/.test(password) && /[A-Z]/.test(password),
    },
    {
      id: "num",
      label: "One number",
      met: /\d/.test(password),
    },
    {
      id: "sym",
      label: "One special character",
      met: /[^A-Za-z0-9]/.test(password),
    },
  ] as const;

  const score = checks.filter((c) => c.met).length;

  let level: PasswordStrengthLevel;
  if (password.length === 0) level = "weak";
  else if (score <= 1) level = "weak";
  else if (score === 2) level = "fair";
  else if (score === 3) level = "good";
  else level = "strong";

  return { level, score, checks: [...checks] };
}

const LEVEL_COPY: Record<
  PasswordStrengthLevel,
  { label: string; barClass: string; textClass: string }
> = {
  weak: {
    label: "Weak",
    barClass: "bg-destructive",
    textClass: "text-destructive",
  },
  fair: {
    label: "Fair",
    barClass: "bg-orange-500",
    textClass: "text-orange-600 dark:text-orange-400",
  },
  good: {
    label: "Good",
    barClass: "bg-amber-500",
    textClass: "text-amber-700 dark:text-amber-400",
  },
  strong: {
    label: "Strong",
    barClass: "bg-emerald-600",
    textClass: "text-emerald-700 dark:text-emerald-500",
  },
};

type PasswordStrengthMeterProps = {
  password: string;
  className?: string;
};

export function PasswordStrengthMeter({ password, className }: PasswordStrengthMeterProps) {
  const { level, score, checks } = useMemo(() => getPasswordStrength(password), [password]);
  const style = LEVEL_COPY[level];

  if (!password) {
    return (
      <div className={cn("space-y-2", className)}>
        <p className="text-xs text-muted-foreground">Password strength will appear as you type.</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">Security level</span>
        <span className={cn("text-xs font-semibold tabular-nums", style.textClass)}>{style.label}</span>
      </div>
      <div className="flex gap-1" role="status" aria-label={`Password strength: ${style.label}`}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              i < score ? style.barClass : "bg-muted"
            )}
          />
        ))}
      </div>
      <ul className="space-y-1.5" aria-label="Password requirements">
        {checks.map((c) => (
          <li key={c.id} className="flex items-start gap-2 text-xs">
            <span
              className={cn(
                "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                c.met
                  ? "border-emerald-600/50 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400"
                  : "border-muted-foreground/25 text-muted-foreground/40"
              )}
            >
              {c.met ? <Check className="h-2.5 w-2.5 stroke-[3]" aria-hidden /> : null}
            </span>
            <span className={cn("leading-snug", c.met ? "text-foreground" : "text-muted-foreground")}>
              {c.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
