import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { SerwistProvider } from "@/app/_components/serwist-provider";
import "./globals.css";

const shimizu = localFont({
  display: "swap",
  src: "./fonts/NP_Shimizu.woff2",
  variable: "--font-shimizu",
});

const montserrat = Montserrat({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: "700",
});

export const metadata: Metadata = {
  applicationName: "レシグル",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "レシグル",
  },
  description: "レシピを検索する",
  formatDetection: {
    telephone: false,
  },
  icons: {
    apple: "/logo512.png",
    icon: "/favicon.ico",
  },

  openGraph: {
    description: "レシピを検索する",
    images: "https://recigle.kk-web.link/logo512.png",
    siteName: "レシグル",
    title: "レシグル",
    type: "website",
  },
  title: "レシグル | レシピを検索する",
  twitter: {
    card: "summary",
    description: "レシピを検索する",
    title: "レシグル",
  },
};

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>): ReactNode {
  return (
    <html lang="ja" className={`${shimizu.variable} ${montserrat.variable}`}>
      <body>
        <SerwistProvider swUrl="/serwist">{children}</SerwistProvider>
      </body>
    </html>
  );
}
