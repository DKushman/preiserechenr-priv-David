"use client";

import { useState, useCallback } from "react";
import type {
  PriceCalculatorProps,
  CardOption,
  PillOption,
} from "./types";
import { AnimatedPriceDisplay } from "./AnimatedPriceDisplay";
import { StepIndicator } from "./StepIndicator";
import { CardSelector } from "./CardSelector";
import { PillSelector } from "./PillSelector";
import { SliderSelector } from "./SliderSelector";
import { StepNavigation } from "./StepNavigation";

function getInitialSelections(
  steps: PriceCalculatorProps["steps"],
): Record<string, string | number> {
  const initial: Record<string, string | number> = {};
  for (const s of steps) {
    if (s.type === "slider" && s.sliderConfig) {
      initial[s.id] = s.sliderConfig.min;
    }
  }
  return initial;
}

export function PriceCalculator({
  steps,
  initialRange,
  currency = "€",
  finalButtonLabel,
  onComplete,
}: PriceCalculatorProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string | number>>(
    () => getInitialSelections(steps),
  );

  const step = steps[currentStep];

  let priceRange: [number, number] = [initialRange[0], initialRange[1]];
  for (const s of steps) {
    const val = selections[s.id];
    if (val != null) {
      priceRange = s.priceEffect(val, priceRange);
    }
  }

  const handleSelect = useCallback(
    (value: string | number) => {
      setSelections((prev) => ({ ...prev, [step.id]: value }));
    },
    [step.id],
  );

  const handleBack = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onComplete?.(selections);
    }
  }, [currentStep, steps.length, onComplete, selections]);

  const handleReset = useCallback(() => {
    setCurrentStep(0);
    setSelections(getInitialSelections(steps));
  }, [steps]);

  return (
    <section
      id="price-calculator"
      aria-label="Preisrechner"
      className="flex min-h-[clamp(28rem,70vh,45rem)] flex-col items-center gap-[clamp(1.5rem,3.5vw,2.5rem)] py-[clamp(2rem,5vw,4rem)]"
    >
      <div
        id="price-calculator-header"
        className="flex w-full items-start justify-between"
      >
        <StepIndicator
          totalSteps={steps.length}
          currentStep={currentStep}
        />
        <button
          id="price-calculator-reset-button"
          type="button"
          onClick={handleReset}
          aria-label="Preisrechner zurücksetzen"
          className="inline-flex size-[clamp(2rem,3.5vw,2.35rem)] items-center justify-center rounded-full border border-[rgba(255,255,227,0.28)] text-[var(--foreground)] transition-colors duration-200 hover:bg-[rgba(255,255,227,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
        >
          <svg
            viewBox="0 0 24 24"
            className="size-[clamp(1rem,1.8vw,1.2rem)]"
            aria-hidden="true"
          >
            <path
              d="M20 11a8 8 0 1 1-2.34-5.66"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M20 4v5h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <AnimatedPriceDisplay
        range={priceRange}
        currency={currency}
      />

      <div
        id="price-calculator-step-content"
        className="flex w-full max-w-[clamp(36rem,65vw,52rem)] flex-col items-center gap-[clamp(1rem,2vw,1.5rem)]"
      >
        <h2
          id={`price-calculator-question-${step.id}`}
          className="text-center text-[clamp(1.1rem,2vw,1.4rem)] font-semibold text-[var(--foreground)]"
        >
          {step.question}
        </h2>

        {step.description && (
          <p
            id={`price-calculator-description-${step.id}`}
            className="max-w-[clamp(24rem,50vw,38rem)] text-center text-[clamp(0.8rem,1.2vw,0.95rem)] leading-relaxed text-[rgba(255,255,227,0.41)]"
          >
            {step.description}
          </p>
        )}

        <div className="mt-[clamp(0.5rem,1.5vw,1rem)] w-full">
          {step.type === "cards" && step.options && (
            <CardSelector
              stepId={step.id}
              options={step.options as CardOption[]}
              selectedId={
                selections[step.id] != null
                  ? String(selections[step.id])
                  : null
              }
              onSelect={handleSelect}
            />
          )}

          {step.type === "pills" && step.options && (
            <PillSelector
              stepId={step.id}
              options={step.options as PillOption[]}
              selectedId={
                selections[step.id] != null
                  ? String(selections[step.id])
                  : null
              }
              onSelect={handleSelect}
            />
          )}

          {step.type === "slider" && step.sliderConfig && (
            <SliderSelector
              stepId={step.id}
              config={step.sliderConfig}
              value={
                typeof selections[step.id] === "number"
                  ? (selections[step.id] as number)
                  : step.sliderConfig.min
              }
              onChange={handleSelect}
            />
          )}
        </div>
      </div>

      <div className="mt-auto pt-[clamp(1rem,2vw,1.5rem)]">
        <StepNavigation
          currentStep={currentStep}
          totalSteps={steps.length}
          finalLabel={finalButtonLabel}
          onBack={handleBack}
          onNext={handleNext}
        />
      </div>
    </section>
  );
}
