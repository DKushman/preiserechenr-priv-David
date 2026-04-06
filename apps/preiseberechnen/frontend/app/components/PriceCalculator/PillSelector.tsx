"use client";

import type { PillOption } from "./types";

type PillSelectorProps = {
  stepId: string;
  options: PillOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function PillSelector({
  stepId,
  options,
  selectedId,
  onSelect,
}: PillSelectorProps) {
  return (
    <fieldset
      id={`price-calculator-pills-${stepId}`}
      className="flex flex-col gap-[clamp(0.5rem,1vw,0.75rem)]"
    >
      <legend className="sr-only">Optionen auswählen</legend>
      <div className="flex flex-wrap items-center gap-[clamp(0.5rem,1vw,0.75rem)]">
        {options.map((option) => {
          const isActive = selectedId === option.id;
          return (
            <label
              key={option.id}
              id={`price-calculator-pill-${stepId}-${option.id}`}
              className={`flex cursor-pointer items-center gap-[clamp(0.5rem,0.9vw,0.7rem)] rounded-full border px-[clamp(0.9rem,1.6vw,1.2rem)] py-[clamp(0.45rem,0.8vw,0.6rem)] transition-all duration-200 ${
                isActive
                  ? "border-[var(--foreground)] bg-[rgba(255,255,227,0.06)]"
                  : "border-[rgba(255,255,227,0.22)] bg-transparent hover:border-[rgba(255,255,227,0.4)]"
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
              <span
                className={`block size-[clamp(0.6rem,1.1vw,0.8rem)] rounded-full border transition-all duration-200 ${
                  isActive
                    ? "border-[var(--foreground)] bg-[var(--foreground)]"
                    : "border-[rgba(255,255,227,0.4)] bg-transparent"
                }`}
                aria-hidden="true"
              />
              <span className="text-[clamp(0.8rem,1.3vw,0.95rem)] font-normal text-[var(--foreground)]">
                {option.label}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
