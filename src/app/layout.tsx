import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed, Instrument_Serif } from "next/font/google";
import "./globals.css";

// Display: the condensed caps printed on every Zyro can and campaign
const display = Barlow_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  style: ["normal", "italic"],
});

// Voice: the big serif "0" motif and the founder's words
const serif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const body = Barlow({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Zyro by Karan Aujla | Nothing Unnecessary",
  description:
    "Zero sugar. Zero calories. Nothing unnecessary. Energy Pop, Hydrate+, Indie Pop and Skinny Pop from Zyro.",
};

export const viewport: Viewport = {
  themeColor: "#0e0c0b",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${serif.variable} ${body.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
