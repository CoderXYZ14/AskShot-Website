import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://askshot.xyz"),
  title: "AskShot — Screenshot & Ask AI Instantly",
  description:
    "AskShot is a Chrome extension that lets you draw on any webpage, capture a section, and instantly ask AI about it. Ideal for visual Q&A, fast learning, and on-page explanations.",
  keywords: [
    "AskShot",
    "AI screenshot tool",
    "Chrome AI extension",
    "ask AI from screenshot",
    "screenshot to chat AI",
    "visual Q&A",
    "AI webpage assistant",
    "image understanding AI",
    "draw to ask AI",
    "screenshot GPT",
    "AI for web browsing",
    "ask AI anything",
    "instant visual search",
  ],
  openGraph: {
    title: "AskShot — Screenshot & Ask AI Instantly",
    description:
      "Draw, capture, and chat. AskShot lets you screenshot any part of a webpage and ask questions with AI — right inside your browser.",
    url: "/",
    siteName: "AskShot",
    images: [
      {
        url: "/og-cover.png",
        width: 1200,
        height: 630,
        alt: "AskShot — Screenshot & Ask AI Instantly",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AskShot — Screenshot & Ask AI Instantly",
    description:
      "Capture any part of a webpage and chat with AI about it. AskShot makes visual Q&A effortless.",
    images: ["/og-cover.png"],
    creator: "@coderxyz14",
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
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon.ico", type: "image/png", sizes: "96x96" },
      { url: "/favicon.ico", type: "image/svg+xml" },
    ],
    apple: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  authors: [{ name: "Shahwaiz Islam" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "AskShot",
              url: "https://askshot.xyz",

              knowsAbout: [
                "AskShot",
                "AI screenshot tool",
                "Chrome AI extension",
                "ask AI from screenshot",
                "screenshot to chat AI",
                "visual Q&A",
                "AI webpage assistant",
                "image understanding AI",
                "draw to ask AI",
                "screenshot GPT",
                "AI for web browsing",
                "ask AI anything",
                "instant visual search",
              ],

              description:
                "Draw, capture, and chat. AskShot lets you screenshot any part of a webpage and ask questions with AI — right inside your browser.",
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
