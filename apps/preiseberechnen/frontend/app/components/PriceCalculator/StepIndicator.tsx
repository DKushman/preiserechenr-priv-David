"use client";

type StepIndicatorProps = {
  totalSteps: number;
  currentStep: number;
};

export function StepIndicator({
  totalSteps,
  currentStep,
}: StepIndicatorProps) {
  return (
    <nav
      id="price-calculator-step-indicator"
      aria-label="Fortschritt"
      className="flex items-center gap-[clamp(0.35rem,0.7vw,0.5rem)]"
    >
      {Array.from({ length: totalSteps }, (_, i) => {
        const isActive = i === currentStep;
        return (
          <span
            key={i}
            id={`price-calculator-step-dot-${i}`}
            role="img"
            aria-label={`Schritt ${i + 1} von ${totalSteps}${isActive ? ", aktiv" : ""}`}
            className={`block rounded-full transition-all duration-300 ease-out ${
              isActive
                ? "h-[clamp(0.55rem,1vw,0.7rem)] w-[clamp(1.4rem,2.5vw,1.8rem)] bg-[var(--foreground)]"
                : "size-[clamp(0.55rem,1vw,0.7rem)] bg-[rgba(255,255,227,0.3)]"
            }`}
          />
        );
      })}
    </nav>
  );
}
