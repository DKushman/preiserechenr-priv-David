import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { FaqSection } from "./components/FaqSection";

const clashDisplay = localFont({
  src: "./fonts/ClashDisplay-Variable.woff2",
  variable: "--font-clash-display",
  weight: "200 700",
  style: "normal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Preiseberechnen",
  description: "Preiseberechnen – Rechner, Blog und Kontakt",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${clashDisplay.variable} min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]`}
      >
        <Header />
        <div id="preiseberechnen-page-shell" className="flex-1 w-full min-w-0">
          {children}
        </div>
        <FaqSection />
        <Footer />
      </body>
    </html>
  );
}

