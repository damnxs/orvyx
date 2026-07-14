import type { Metadata, Viewport } from "next";
import { Cormorant, Inter } from "next/font/google";
import "./globals.css";

const display = Cormorant({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://orvyx.xyz"),
  title: "ORVYX",
  description: "The future isn't predicted. It is remembered.",
  applicationName: "ORVYX",
  openGraph: {
    title: "ORVYX",
    description: "The future isn't predicted. It is remembered.",
    type: "website",
    siteName: "ORVYX",
  },
  twitter: {
    card: "summary_large_image",
    title: "ORVYX",
    description: "The future isn't predicted. It is remembered.",
  },
  icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }] },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
