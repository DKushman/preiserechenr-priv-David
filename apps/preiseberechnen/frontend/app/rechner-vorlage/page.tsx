import type { Metadata } from "next";
import { RechnerVorlageClient } from "./RechnerVorlageClient";

export const metadata: Metadata = {
  title: "Preisrechner – Vorlage",
  description:
    "Wiederverwendbare Preisrechner-Vorlage mit konfigurierbaren Schritten.",
};

export default function RechnerVorlagePage() {
  return (
    <main id="rechner-vorlage-main" className="py-[clamp(3rem,6vh,5rem)]">
      <RechnerVorlageClient />
    </main>
  );
}
