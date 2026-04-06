"use client";

type StepNavigationProps = {
  currentStep: number;
  totalSteps: number;
  finalLabel?: string;
  disableNext?: boolean;
  onBack: () => void;
  onNext: () => void;
};

export function StepNavigation({
  currentStep,
  totalSteps,
  finalLabel = "Ergebnis anzeigen",
  disableNext = false,
  onBack,
  onNext,
}: StepNavigationProps) {
  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;

  return (
    <div
      id="price-calculator-navigation"
      role="group"
      aria-label="Schrittnavigation"
      className="flex items-center justify-center gap-[clamp(0.5rem,1vw,0.75rem)]"
    >
      {!isFirst && (
        <button
          id="price-calculator-nav-back"
          type="button"
          onClick={onBack}
          aria-label="Zurück zum vorherigen Schritt"
          className="inline-flex h-[clamp(2.4rem,4.5vw,3rem)] items-center justify-center gap-[clamp(0.15rem,0.3vw,0.2rem)] rounded-full border border-[rgba(255,255,227,0.25)] bg-transparent px-[clamp(1.8rem,3.5vw,2.5rem)] text-[clamp(0.85rem,1.3vw,1rem)] text-[var(--foreground)] transition-colors duration-200 hover:bg-[rgba(255,255,227,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
        >
          <span aria-hidden="true">←</span>
          <span>Zurück</span>
        </button>
      )}

      <button
        id="price-calculator-nav-next"
        type="button"
        onClick={onNext}
        disabled={disableNext}
        className={`inline-flex h-[clamp(2.4rem,4.5vw,3rem)] items-center justify-center gap-[clamp(0.15rem,0.3vw,0.2rem)] rounded-full px-[clamp(1.8rem,3.5vw,2.5rem)] text-[clamp(0.85rem,1.3vw,1rem)] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] ${
          disableNext
            ? "cursor-not-allowed bg-[rgba(255,255,227,0.18)] text-[rgba(255,255,227,0.35)]"
            : "bg-[var(--foreground)] text-[var(--background)] hover:bg-[#f3f0c8] active:scale-[0.97] active:bg-[#e7e3b8]"
        }`}
      >
        <span>{isLast ? finalLabel : "Weiter"}</span>
        {!isLast && <span aria-hidden="true">→</span>}
      </button>
    </div>
  );
}
