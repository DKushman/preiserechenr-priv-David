"use client";

import { useState, useCallback, useEffect } from "react";
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
import { ResultsOverlay } from "./ResultsOverlay";
import { usePriceCalculatorOverlayToolbarRegister } from "./PriceCalculatorOverlayToolbarContext";

type BreakdownItem = {
  label: string;
  range: [number, number];
};

function getInitialSelections(
  steps: PriceCalculatorProps["steps"],
): Record<string, string | number | string[]> {
  const initial: Record<string, string | number | string[]> = {};
  for (const s of steps) {
    if (s.type === "slider" && s.sliderConfig) {
      initial[s.id] = s.sliderConfig.min;
    }
    if (s.type === "pills") {
      initial[s.id] = [];
    }
  }
  return initial;
}

function computeRangeUntilStep(
  steps: PriceCalculatorProps["steps"],
  selections: Record<string, string | number | string[]>,
  initialRange: [number, number],
  stepCount: number,
): [number, number] {
  let range: [number, number] = [initialRange[0], initialRange[1]];
  for (let i = 0; i < stepCount; i += 1) {
    const step = steps[i];
    if (!step) break;
    const val = selections[step.id];
    if (Array.isArray(val)) {
      for (const entry of val) {
        range = step.priceEffect(entry, range);
      }
    } else if (val != null) {
      range = step.priceEffect(val, range);
    }
  }
  return range;
}

function estimateDeltaValue(
  step: PriceCalculatorProps["steps"][number],
  value: string | number,
): [number, number] {
  const result = step.priceEffect(value, [0, 0]);
  return [result[0], result[1]];
}

function getOptionLabel(
  step: PriceCalculatorProps["steps"][number],
  value: string,
): string {
  if (!step.options) return value;
  const match = step.options.find((opt) => opt.id === value);
  if (!match) return value;
  return "title" in match ? match.title : match.label;
}

function buildBreakdownItems(
  steps: PriceCalculatorProps["steps"],
  selections: Record<string, string | number | string[]>,
  stepCount: number,
): BreakdownItem[] {
  const rows: BreakdownItem[] = [];
  for (let i = 0; i < stepCount; i += 1) {
    const step = steps[i];
    if (!step) break;
    const selected = selections[step.id];
    if (Array.isArray(selected)) {
      for (const entry of selected) {
        rows.push({
          label: getOptionLabel(step, entry),
          range: estimateDeltaValue(step, entry),
        });
      }
      continue;
    }
    if (selected == null) continue;
    if (step.type === "slider") {
      rows.push({
        label: step.question,
        range: estimateDeltaValue(step, selected),
      });
    } else {
      rows.push({
        label: getOptionLabel(step, String(selected)),
        range: estimateDeltaValue(step, selected),
      });
    }
  }
  return rows;
}

function stepHasSelection(
  step: PriceCalculatorProps["steps"][number],
  selections: Record<string, string | number | string[]>,
): boolean {
  const val = selections[step.id];
  if (step.type === "slider") return true;
  if (step.type === "pills") return Array.isArray(val) && val.length > 0;
  return val != null && val !== "";
}


export function PriceCalculator({
  steps,
  initialRange,
  currency = "€",
  finalButtonLabel,
  onComplete,
}: PriceCalculatorProps) {
  const overlayToolbar = usePriceCalculatorOverlayToolbarRegister();
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<
    Record<string, string | number | string[]>
  >(() => getInitialSelections(steps));
  const [boostKey, setBoostKey] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set());
  const [animatedProgress, setAnimatedProgress] = useState(0);

  const step = steps[currentStep];

  const priceRange = computeRangeUntilStep(
    steps,
    selections,
    initialRange,
    currentStep + 1,
  );
  const breakdownItems = buildBreakdownItems(steps, selections, currentStep + 1);

  const finalRange = computeRangeUntilStep(steps, selections, initialRange, steps.length);
  const finalBreakdown = buildBreakdownItems(steps, selections, steps.length);

  const progress = ((currentStep + 1) / steps.length) * 100;

  useEffect(() => {
    let rafId = 0;
    const animate = () => {
      setAnimatedProgress((prev) => {
        const next = prev + (progress - prev) * 0.14;
        if (Math.abs(next - progress) < 0.08) {
          return progress;
        }
        rafId = requestAnimationFrame(animate);
        return next;
      });
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [progress]);

  const canAdvance = stepHasSelection(step, selections);

  const handleSelect = useCallback(
    (value: string | number) => {
      setSelections((prev) => ({ ...prev, [step.id]: value }));
      setBoostKey((k) => k + 1);
      setVisitedSteps((prev) => new Set(prev).add(currentStep));
    },
    [step.id, currentStep],
  );

  const handlePillToggle = useCallback(
    (id: string) => {
      setSelections((prev) => {
        const current: string[] = Array.isArray(prev[step.id])
          ? (prev[step.id] as string[])
          : [];
        const next = current.includes(id)
          ? current.filter((x) => x !== id)
          : [...current, id];
        return { ...prev, [step.id]: next };
      });
      setBoostKey((k) => k + 1);
      setVisitedSteps((prev) => new Set(prev).add(currentStep));
    },
    [step.id, currentStep],
  );

  const handleBack = useCallback(() => {
    setVisitedSteps((prev) => new Set(prev).add(currentStep));
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, [currentStep]);

  const handleNext = useCallback(() => {
    setVisitedSteps((prev) => new Set(prev).add(currentStep));
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setShowResults(true);
      onComplete?.(selections);
    }
  }, [currentStep, steps.length, onComplete, selections]);

  const handleReset = useCallback(() => {
    setCurrentStep(0);
    setSelections(getInitialSelections(steps));
    setVisitedSteps(new Set());
  }, [steps]);

  useEffect(() => {
    if (!overlayToolbar) return undefined;
    if (showResults) {
      overlayToolbar.registerOnReset(null);
      return undefined;
    }
    overlayToolbar.registerOnReset(handleReset);
    return () => overlayToolbar.registerOnReset(null);
  }, [overlayToolbar, handleReset, showResults]);

  const handleStepSelect = useCallback(
    (stepIndex: number) => {
      setVisitedSteps((prev) => new Set(prev).add(currentStep));
      setCurrentStep(Math.max(0, Math.min(stepIndex, steps.length - 1)));
    },
    [steps.length, currentStep],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Enter" || e.repeat) return;
      if ((e as KeyboardEvent & { isComposing?: boolean }).isComposing)
        return;
      if (!canAdvance) return;

      const el = document.activeElement as HTMLElement | null;
      if (!el || !el.closest("#price-calculator")) return;

      if (el.closest("#price-calculator [role='dialog'][aria-modal='true']"))
        return;

      if (el.closest("#price-calculator-navigation")) return;
      if (el.closest("#price-calculator-reset-button")) return;
      if (el.closest("#price-calculator-header button")) return;

      if (el.closest("[data-price-calculator-manual-value]")) return;

      if (el.closest("#price-calculator-step-content button")) return;

      if (el.tagName === "TEXTAREA") return;
      if (el.isContentEditable) return;
      if (el.tagName === "SELECT") return;

      if (el.tagName === "INPUT") {
        const input = el as HTMLInputElement;
        const t = input.type;
        if (
          t === "text" ||
          t === "search" ||
          t === "email" ||
          t === "tel" ||
          t === "url" ||
          t === "number" ||
          t === "password"
        ) {
          return;
        }
      }

      e.preventDefault();
      handleNext();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [canAdvance, handleNext]);

  if (showResults) {
    return (
      <div className="flex min-h-0 w-full flex-1 flex-col">
        <ResultsOverlay
          priceRange={finalRange}
          breakdownItems={finalBreakdown}
          currency={currency}
          onClose={() => setShowResults(false)}
        />
      </div>
    );
  }

  return (
    <section
      id="price-calculator"
      aria-label="Preisrechner"
      className="flex min-h-[clamp(28rem,70vh,45rem)] flex-col items-center gap-[clamp(1.5rem,3.5vw,2.5rem)] pt-[clamp(0.85rem,1.8vw,1.2rem)] pb-[clamp(2rem,5vw,4rem)]"
    >
      {/* Header: Schritte (Reset sitzt in der Overlay-Werkzeugleiste) */}
      <div
        id="price-calculator-header"
        className="flex w-full flex-col gap-[clamp(0.5rem,1vw,0.75rem)]"
      >
        <StepIndicator
          totalSteps={steps.length}
          currentStep={currentStep}
          visitedSteps={visitedSteps}
          onStepSelect={handleStepSelect}
        />

        {/* Progress bar */}
        <div className="relative h-[2px] w-full overflow-hidden rounded-full bg-[rgba(255,255,227,0.1)]">
          <div
            className="price-calc-progress-fill absolute left-0 top-0 h-full rounded-full bg-[var(--foreground)]"
            style={{ width: `${animatedProgress}%` }}
            role="progressbar"
            aria-valuenow={Math.round(animatedProgress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Fortschritt: ${Math.round(animatedProgress)}%`}
          />
        </div>

        {/* Step label */}
        <p className="text-[clamp(0.58rem,0.85vw,0.7rem)] font-medium tracking-[0.06em] text-[rgba(255,255,227,0.38)]">
          Schritt {currentStep + 1} von {steps.length}
        </p>
      </div>

      {/* Price display */}
      <div className="flex w-full flex-col items-center gap-[clamp(1rem,2vw,1.5rem)]">
        <AnimatedPriceDisplay
          range={priceRange}
          currency={currency}
          boostKey={boostKey}
          breakdownItems={breakdownItems}
        />
        <hr className="w-[clamp(6rem,12vw,10rem)] border-t border-[rgba(255,255,227,0.15)]" />
      </div>

      {/* Step content */}
      <div
        key={`step-${currentStep}`}
        id="price-calculator-step-content"
        className="price-calc-step-enter mt-[clamp(1.5rem,3vw,2.4rem)] flex w-full max-w-[clamp(36rem,65vw,52rem)] flex-col items-center gap-[clamp(1rem,2vw,1.5rem)]"
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
              selectedIds={
                Array.isArray(selections[step.id])
                  ? (selections[step.id] as string[])
                  : []
              }
              onToggle={handlePillToggle}
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
              onEnterAdvance={() => {
                if (canAdvance) handleNext();
              }}
            />
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-auto pt-[clamp(2.4rem,4vw,3.4rem)]">
        <StepNavigation
          currentStep={currentStep}
          totalSteps={steps.length}
          finalLabel={finalButtonLabel}
          disableNext={!canAdvance}
          onBack={handleBack}
          onNext={handleNext}
        />
      </div>
    </section>
  );
}
