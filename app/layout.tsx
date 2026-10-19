import type { Metadata } from "next";
import { DM_Sans, Geist_Mono, Newsreader } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const publicSans = localFont({
  src: "./fonts/public-sans-latin.woff2",
  variable: "--font-public-sans",
  weight: "100 900",
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://howtosf.vercel.app"),
  title: "How I Use Superfocus",
  description:
    "A personal guide to planning time, working toward goals, and reflecting on progress with Superfocus.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${dmSans.variable} ${geistMono.variable} ${newsreader.variable} ${publicSans.variable} h-full antialiased`}
    >
      <body className={`${dmSans.className} min-h-full bg-paper text-ink`}>{children}</body>
    </html>
  );
}
