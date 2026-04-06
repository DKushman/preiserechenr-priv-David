"use client";

import { PriceCalculator } from "../components/PriceCalculator/PriceCalculator";
import type { Step } from "../components/PriceCalculator/types";

const stepOneDeltaByOption: Record<string, [number, number]> = {
  "option-a": [180, 260],
  "option-b": [260, 380],
  "option-c": [420, 620],
};

const stepTwoDeltaByOption: Record<string, [number, number]> = {
  "pill-1": [120, 180],
  "pill-2": [220, 320],
  "pill-3": [320, 460],
  "pill-4": [480, 680],
};

const stepFourDeltaByOption: Record<string, [number, number]> = {
  "final-a": [140, 210],
  "final-b": [260, 380],
  "final-c": [420, 600],
};

const stepThreeDeltaBySliderValue: Record<number, [number, number]> = {
  0: [0, 0],
  25000: [220, 340],
  50000: [360, 520],
  75000: [520, 760],
  100000: [700, 980],
};

function applyOptionDelta(
  selectedValue: string | number,
  range: [number, number],
  deltaMap: Record<string, [number, number]>,
): [number, number] {
  const delta = deltaMap[String(selectedValue)] ?? [0, 0];
  return [range[0] + delta[0], range[1] + delta[1]];
}

function applySliderDelta(
  selectedValue: string | number,
  range: [number, number],
): [number, number] {
  const raw = Number(selectedValue);
  const allowedValues = Object.keys(stepThreeDeltaBySliderValue).map(Number);
  const nearest = allowedValues.reduce((prev, cur) =>
    Math.abs(cur - raw) < Math.abs(prev - raw) ? cur : prev,
  );
  const delta = stepThreeDeltaBySliderValue[nearest] ?? [0, 0];
  return [range[0] + delta[0], range[1] + delta[1]];
}

const placeholderSteps: Step[] = [
  {
    id: "step-1",
    type: "cards",
    question: "Überschrift für Schritt 1?",
    description:
      "Beschreibungstext, der den Kontext für diesen Auswahlschritt liefert.",
    options: [
      {
        id: "option-a",
        title: "Option A",
        subtitle: "Kurzbeschreibung A",
        badge: "Meistgewählt",
      },
      {
        id: "option-b",
        title: "Option B",
        subtitle: "Kurzbeschreibung B",
      },
      {
        id: "option-c",
        title: "Option C",
        subtitle: "Kurzbeschreibung C",
      },
    ],
    priceEffect: (value, range) =>
      applyOptionDelta(value, range, stepOneDeltaByOption),
  },
  {
    id: "step-2",
    type: "pills",
    question: "Überschrift für Schritt 2?",
    description:
      "Wähle eine der folgenden Kategorien, die am besten zu deiner Situation passt.",
    options: [
      { id: "pill-1", label: "Kategorie A" },
      { id: "pill-2", label: "Kategorie B" },
      { id: "pill-3", label: "Kategorie C" },
      { id: "pill-4", label: "Kategorie D" },
    ],
    priceEffect: (value, range) =>
      applyOptionDelta(value, range, stepTwoDeltaByOption),
  },
  {
    id: "step-3",
    type: "slider",
    question: "Überschrift für Schritt 3?",
    description:
      "Stelle den Wert mit dem Regler ein, um eine genauere Schätzung zu erhalten.",
    sliderConfig: {
      min: 0,
      max: 100000,
      step: 25000,
      unit: "€",
      averageValue: 35000,
      averageLabel: "Durchschnitt",
    },
    priceEffect: (value, range) => applySliderDelta(value, range),
  },
  {
    id: "step-4",
    type: "cards",
    question: "Überschrift für Schritt 4?",
    description: "Letzte Auswahl, die das Ergebnis beeinflusst.",
    options: [
      {
        id: "final-a",
        title: "Variante 1",
        subtitle: "Detailinfo zu Variante 1",
      },
      {
        id: "final-b",
        title: "Variante 2",
        subtitle: "Detailinfo zu Variante 2",
      },
      {
        id: "final-c",
        title: "Variante 3",
        subtitle: "Detailinfo zu Variante 3",
      },
    ],
    priceEffect: (value, range) =>
      applyOptionDelta(value, range, stepFourDeltaByOption),
  },
];

export function RechnerVorlageClient() {
  return (
    <PriceCalculator
      steps={placeholderSteps}
      initialRange={[0, 0]}
      currency="€"
      finalButtonLabel="Ergebnis anzeigen"
    />
  );
}
