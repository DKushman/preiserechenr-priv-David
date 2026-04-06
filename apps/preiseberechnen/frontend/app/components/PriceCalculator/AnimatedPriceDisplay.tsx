"use client";

import { useEffect, useState } from "react";

type AnimatedPriceDisplayProps = {
  range: [number, number];
  currency?: string;
};

function formatPrice(value: number, currency: string): string {
  return `${currency}${value.toLocaleString("de-DE")}`;
}

export function AnimatedPriceDisplay({
  range,
  currency = "€",
}: AnimatedPriceDisplayProps) {
  const formatted = `${formatPrice(range[0], currency)}–${formatPrice(range[1], currency)}`;

  const [currentText, setCurrentText] = useState(formatted);
  const [prevText, setPrevText] = useState("");
  const [animKey, setAnimKey] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (formatted === currentText) return;
    setPrevText(currentText);
    setCurrentText(formatted);
    setAnimKey((k) => k + 1);
    setIsAnimating(true);

    const timer = window.setTimeout(() => {
      setIsAnimating(false);
      setPrevText("");
    }, 180);

    return () => window.clearTimeout(timer);
  }, [formatted, currentText]);

  const widthText =
    isAnimating && prevText.length > currentText.length ? prevText : currentText;

  return (
    <output
      id="price-calculator-price-display"
      className="flex items-baseline justify-center font-semibold text-[clamp(2.4rem,6vw,3.6rem)] leading-none text-[var(--foreground)]"
    >
      <span
        id="price-calculator-price-value"
        className="relative inline-flex overflow-hidden"
        style={{ height: "1.15em" }}
        aria-live="polite"
        aria-atomic="true"
      >
        <span className="invisible block whitespace-nowrap" aria-hidden="true">
          {widthText}
        </span>
        {isAnimating && (
          <span
            key={`exit-${animKey}`}
            className="price-calc-layer price-calc-exit"
            aria-hidden="true"
          >
            {prevText}
          </span>
        )}
        <span
          key={`enter-${animKey}`}
          className={isAnimating ? "price-calc-layer price-calc-enter" : "block"}
        >
          {currentText}
        </span>
      </span>
    </output>
  );
}
