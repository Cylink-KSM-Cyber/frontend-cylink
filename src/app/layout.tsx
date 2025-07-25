import "./globals.css";
import "@/styles/hero.css";
import "@/styles/features.css";
import "@/styles/footer.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "./Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CyLink - URL Shortener",
  description: "Shorten, manage, and track your URLs with QR code support",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </Providers>
  );
}
