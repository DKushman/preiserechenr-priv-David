"use client";

import type { CardOption } from "./types";

type CardSelectorProps = {
  stepId: string;
  options: CardOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function CardSelector({
  stepId,
  options,
  selectedId,
  onSelect,
}: CardSelectorProps) {
  return (
    <fieldset
      id={`price-calculator-cards-${stepId}`}
      className="flex flex-col gap-[clamp(0.75rem,1.5vw,1rem)]"
    >
      <legend className="sr-only">Optionen auswählen</legend>
      <div className="grid grid-cols-1 gap-[clamp(0.75rem,1.5vw,1rem)] sm:grid-cols-2 lg:grid-cols-3">
        {options.map((option) => {
          const isActive = selectedId === option.id;
          return (
            <label
              key={option.id}
              id={`price-calculator-card-${stepId}-${option.id}`}
              className={`relative flex cursor-pointer flex-col items-center gap-[clamp(0.3rem,0.6vw,0.5rem)] rounded-[clamp(1rem,2vw,1.3rem)] border px-[clamp(1rem,2vw,1.5rem)] py-[clamp(1.1rem,2.2vw,1.6rem)] transition-all duration-200 ${
                isActive
                  ? "border-[var(--foreground)] bg-[rgba(255,255,227,0.02)]"
                  : "border-[rgba(255,255,227,0.22)] bg-[var(--background)] hover:border-[rgba(255,255,227,0.4)]"
              }`}
            >
              <input
                type="radio"
                name={`step-${stepId}`}
                value={option.id}
                checked={isActive}
                onChange={() => onSelect(option.id)}
                className="sr-only"
              />

              {option.badge && (
                <span
                  className="absolute left-[clamp(0.75rem,1.5vw,1rem)] top-0 -translate-y-1/2 rounded-full bg-[var(--foreground)] px-[clamp(0.5rem,1vw,0.75rem)] py-[clamp(0.1rem,0.2vw,0.15rem)] text-[clamp(0.55rem,0.9vw,0.65rem)] font-normal text-[var(--background)]"
                >
                  {option.badge}
                </span>
              )}

              {option.icon && (
                <span
                  className="flex size-[clamp(1.5rem,3vw,2rem)] items-center justify-center text-[var(--foreground)]"
                  aria-hidden="true"
                >
                  {option.icon}
                </span>
              )}

              <span className="text-center text-[clamp(0.85rem,1.4vw,1rem)] font-semibold text-[var(--foreground)]">
                {option.title}
              </span>

              {option.subtitle && (
                <span
                  className={`text-center text-[clamp(0.7rem,1.1vw,0.8rem)] ${
                    isActive
                      ? "text-[var(--foreground)]"
                      : "text-[rgba(255,255,227,0.4)]"
                  }`}
                >
                  {option.subtitle}
                </span>
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
