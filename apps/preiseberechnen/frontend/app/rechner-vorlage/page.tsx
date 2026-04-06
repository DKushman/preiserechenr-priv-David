import type { Metadata } from "next";
import { PriceCalculatorLauncherOverlay } from "../components/PriceCalculatorLauncherOverlay";

export const metadata: Metadata = {
  title: "Preisrechner – Vorlage",
  description:
    "Wiederverwendbare Preisrechner-Vorlage mit konfigurierbaren Schritten.",
};

export default function RechnerVorlagePage() {
  return (
    <main
      id="rechner-vorlage-main"
      className="flex min-h-[70vh] items-center justify-center py-[clamp(3rem,6vh,5rem)]"
    >
      <PriceCalculatorLauncherOverlay />
    </main>
  );
}
