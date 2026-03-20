 
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prompt Vault",
  description: "AI Prompt Kayıt Sistemi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}