import type { Metadata } from "next";
import { Caveat, Cormorant_Garamond, Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-editorial",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-handwritten",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const siteDescription =
  "Maria Aguilera — data and AI engineer at BMC Software. Notes, projects, and writing on building practical ML systems.";

export const metadata: Metadata = {
  metadataBase: new URL("https://mariaa.tech"),
  title: {
    default: "Maria Aguilera",
    template: "%s · Maria Aguilera",
  },
  description: siteDescription,
  openGraph: {
    type: "website",
    url: "https://mariaa.tech",
    siteName: "Maria Aguilera",
    title: "Maria Aguilera",
    description: siteDescription,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maria Aguilera",
    description: siteDescription,
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${cormorant.variable} ${caveat.variable} antialiased`}
      >
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
