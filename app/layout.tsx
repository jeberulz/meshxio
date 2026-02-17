import type { Metadata } from "next";
import { JetBrains_Mono, Inter_Tight } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jb-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const interTight = Inter_Tight({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "MESHX FOUNDATION — Data Product Explorer",
  description: "Supply Chain Logistics Data Product Catalog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${jetbrainsMono.variable} ${interTight.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
