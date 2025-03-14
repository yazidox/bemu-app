import type { Metadata } from "next";
import { Jersey_10 } from "next/font/google";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { TempoInit } from "@/components/tempo-init";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Jersey_10({ weight: "400", subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ weight: "400", subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "L.U.C.I. AI - Sports Prediction Platform",
  description:
    "Advanced neural network sports prediction system with 94.7% accuracy rating",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Jersey+10&display=swap"
          rel="stylesheet"
        />
      </head>
      <Script src="https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/error-handling.js" />
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-black text-white`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <TempoInit />
      </body>
    </html>
  );
}
