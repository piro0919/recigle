import { Analytics } from "@vercel/analytics/next";
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
  alternates: { canonical: "/" },
  applicationName: "レシグル",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "レシグル",
  },
  description:
    "個人のブログや動画だけのサイトを除いて、レシピを Google 検索できるサイトです。料理名や材料を入れると、除外を組み込んだ検索結果が開きます。",
  formatDetection: {
    telephone: false,
  },
  icons: {
    apple: "/logo512.png",
    icon: "/favicon.ico",
  },
  metadataBase: new URL("https://recigle.kkweb.io"),
  openGraph: {
    siteName: "レシグル",
    type: "website",
    url: "/",
  },
  title: "レシグル｜個人ブログと動画サイトを除いたレシピ検索",
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  initialScale: 1,
  interactiveWidget: "resizes-content",
  width: "device-width",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>): ReactNode {
  return (
    <html lang="ja" className={`${shimizu.variable} ${montserrat.variable}`}>
      <body>
        <SerwistProvider swUrl="/serwist">{children}</SerwistProvider>
        <Analytics />
      </body>
    </html>
  );
}
