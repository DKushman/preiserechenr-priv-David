"use client";

import { useId } from "react";
import type { SliderConfig } from "./types";

type SliderSelectorProps = {
  stepId: string;
  config: SliderConfig;
  value: number;
  onChange: (value: number) => void;
};

export function SliderSelector({
  stepId,
  config,
  value,
  onChange,
}: SliderSelectorProps) {
  const sliderId = useId();
  const { min, max, step, unit = "€", averageValue, averageLabel = "Durchschnitt" } = config;

  const pct = ((value - min) / (max - min)) * 100;
  const avgPct =
    averageValue != null ? ((averageValue - min) / (max - min)) * 100 : null;

  return (
    <div
      id={`price-calculator-slider-${stepId}`}
      className="flex flex-col items-center gap-[clamp(1.2rem,2.5vw,2rem)]"
    >
      <output
        htmlFor={sliderId}
        id={`price-calculator-slider-value-${stepId}`}
        className="text-center text-[clamp(2rem,5vw,3.2rem)] font-semibold leading-none text-[var(--foreground)]"
      >
        {value.toLocaleString("de-DE")}
        {unit}
      </output>

      <div className="relative w-full">
        <div
          id={`price-calculator-slider-track-${stepId}`}
          className="pointer-events-none absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-[var(--foreground)]"
          aria-hidden="true"
        />

        {avgPct != null && (
          <div
            id={`price-calculator-slider-avg-${stepId}`}
            className="pointer-events-none absolute top-1/2 flex -translate-x-1/2 flex-col items-center"
            style={{ left: `${avgPct}%` }}
            aria-hidden="true"
          >
            <span className="block h-[clamp(0.75rem,1.5vw,1rem)] w-px -translate-y-1/2 bg-[#c0392b]" />
            <span className="mt-[clamp(0.2rem,0.4vw,0.3rem)] whitespace-nowrap text-[clamp(0.6rem,1vw,0.75rem)] text-[#c0392b]">
              {averageLabel}
            </span>
          </div>
        )}

        <input
          id={sliderId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-label="Wert einstellen"
          className="price-calculator-range-input relative z-10 w-full cursor-pointer appearance-none bg-transparent"
          style={
            {
              "--thumb-pct": `${pct}%`,
            } as React.CSSProperties
          }
        />
      </div>
    </div>
  );
}
