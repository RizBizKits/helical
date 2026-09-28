import type { Metadata } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono, Nunito } from "next/font/google";
import "./globals.css";

const nats = localFont({
  src: "../fonts/NATS-Regular.woff2",
  variable: "--font-wordmark",
  display: "swap",
  weight: "400",
  fallback: ["Nunito", "system-ui", "sans-serif"],
});

const nunito = Nunito({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Helical — habits are steps",
  description:
    "A calm habit tracker. Every check-in is a step on your staircase — and steps you climbed stay with you.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${nats.variable} ${nunito.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[var(--bg)] text-[var(--ink)]">
        {children}
      </body>
    </html>
  );
}
