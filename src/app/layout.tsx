import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";
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
  appleWebApp: {
    title: "EchoLoom",
    capable: true,
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
      { url: "/icon0.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json",
  authors: [{ name: "Shahwaiz Islam" }],
  alternates: {
    canonical: "https://askshot.xyz/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />

        {/* Additional favicon formats - use your existing files */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/svg+xml" href="/icon0.svg" />

        {/* Apple touch icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon.png" />

        {/* Web App Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Web app meta tags */}
        <meta name="apple-mobile-web-app-title" content="AskShot" />
        <meta name="application-name" content="AskShot" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="msapplication-TileColor" content="#ffffff" />

        <link rel="canonical" href="https://askshot.xyz/" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "AskShot",
              url: "https://askshot.xyz",
              applicationCategory: "BusinessApplication",
              applicationSubCategory: "ProductivityApplication",
              applicationSuite: "AskShot",
              applicationVersion: "1.0.0",
              applicationReleaseDate: "2025-07-08",
              applicationProvider: "AskShot",
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
              author: {
                "@type": "Person",
                name: "Shahwaiz Islam",
              },
              description:
                "Draw, capture, and chat. AskShot lets you screenshot any part of a webpage and ask questions with AI — right inside your browser.",
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
          <Toaster
            theme="light"
            duration={2000}
            position="bottom-right"
            richColors
          />
        </Providers>
      </body>
    </html>
  );
}
