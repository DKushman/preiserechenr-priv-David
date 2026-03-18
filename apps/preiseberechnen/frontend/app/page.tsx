import { Button } from "./components/Button";
import { FillCircle } from "./components/FillCircle";

export default function Home() {
  return (
    <main
      id="preiseberechnen-main"
      className="pt-[clamp(5rem,14vh,8rem)] pb-[clamp(2.5rem,6vh,4rem)]"
    >
      <section id="preiseberechnen-hero" className="flex flex-col gap-8 sm:gap-10 lg:gap-12 ">
        <div id="preiseberechnen-hero-heading-wrapper">
          <h1
            id="preiseberechnen-hero-heading"
            className="text-[clamp(3.4rem,9vw,4.4rem)] leading-[clamp(1.02,1.06,1.08)] sm:text-[clamp(5.4rem,12vw,7rem)] sm:leading-[clamp(0.98,1.02,1.04)] lg:text-[clamp(6.4rem,13vw,8.2rem)] lg:leading-[clamp(0.96,1,1.02)] font-semibold"
          >
            Kosten kennen, bevor sie entstehen.
          </h1> 
        </div>

        <p
          id="preiseberechnen-hero-subtitle"
          className="max-w-xl text-[0.98rem] sm:text-[1.02rem] leading-relaxed text-[rgba(255,255,227,0.8)]"
        >
          Anwaltsgebühren, Notarkosten, Websitepreise – wir bringen Transparenz
          in die Themen, bei denen die meisten einfach zu viel bezahlen.
          Kostenlos, anonym, in unter einer Minute.
        </p>

        <div
          id="preiseberechnen-hero-cta"
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5"
        >
          <Button>
            Zur Übersicht
          </Button>
        </div>
      </section>

      <section
        id="preiseberechnen-feature-section"
        className="min-h-[100vh] bg-[#ffffe3] text-[#1c120e] rounded-[clamp(1.25rem,2.2vw,2.75rem)] mt-[clamp(2.5rem,6vh,4rem)] w-[calc(100%+4vh)] mx-[-2vh]"
      >
        <div
          id="preiseberechnen-feature-container"
          className="px-[2vh] py-[clamp(3rem,6vw,5rem)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-[clamp(2rem,5vw,4rem)]"
        >
          <div id="preiseberechnen-feature-left" className="flex-1">
            <h2
              id="preiseberechnen-feature-heading"
              className="text-[clamp(2.1rem,4.6vw,3.2rem)] leading-[clamp(1.02,1.08,1.14)] tracking-[-0.03em] font-semibold"
            >
              Auf einer Seite alle Rechner die du brauchst kompakt
            </h2>
          </div>

          <div
            id="preiseberechnen-feature-center"
            className="flex-1 flex items-center justify-center w-full"
          >
            <FillCircle sectionId="preiseberechnen-feature-section" />
          </div>

          <div id="preiseberechnen-feature-right" className="flex-1 w-full">
            <ul
              id="preiseberechnen-feature-list"
              className="list-disc pl-[clamp(1.1rem,1.4vw,1.5rem)] space-y-[clamp(0.35rem,0.9vw,0.75rem)] text-[clamp(0.95rem,1.4vw,1.05rem)] leading-[clamp(1.35,1.55,1.7)] text-black/70"
            >
              <li id="preiseberechnen-feature-item-1">keine Abzocke mehr</li>
              <li id="preiseberechnen-feature-item-2">Verhandlungsbasis</li>
              <li id="preiseberechnen-feature-item-3">erste Einschätzung</li>
              <li id="preiseberechnen-feature-item-4">eier lecken</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
