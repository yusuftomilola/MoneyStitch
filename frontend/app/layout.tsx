// frontend/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MoneyStitch - Smart Personal Finance Education",
    template: "%s | MoneyStitch",
  },
  description:
    "Master your personal finances with MoneyStitch. Get practical tools, smart guides, and resources designed to help you build better money habits and secure your financial future.",
  keywords: [
    "personal finance",
    "money management",
    "budgeting",
    "savings",
    "financial education",
    "money habits",
    "financial literacy",
    "investment basics",
    "emergency fund",
    "debt management",
  ],
  authors: [{ name: "MoneyStitch" }],
  creator: "MoneyStitch",
  publisher: "MoneyStitch",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://moneystitch.com"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "MoneyStitch",
    title: "MoneyStitch - Smart Personal Finance Education",
    description:
      "Master your personal finances with MoneyStitch. Practical tools, smart guides, and resources to build better money habits.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MoneyStitch - Stitching Smart Money Habits Into Your Life",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MoneyStitch - Smart Personal Finance Education",
    description:
      "Master your personal finances with MoneyStitch. Practical tools and guides to build better money habits.",
    images: ["/og-image.png"],
    creator: "@moneystitch",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  category: "finance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
