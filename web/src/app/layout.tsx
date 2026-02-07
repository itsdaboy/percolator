import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Percolator",
  description: "Turn any token into a perpetual futures market on Solana",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen antialiased bg-slate-950 text-slate-50">
        {children}
      </body>
    </html>
  );
}
