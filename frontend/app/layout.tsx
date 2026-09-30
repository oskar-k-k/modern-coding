import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  icons: { icon: "/mark.svg" },
  title: "Modern Coding — Architektur im Wandel",
  description:
    "Ein offenes Architektur-Labor für Entwicklung mit KI. Spring Boot, Java und Programmiermuster im Vergleich.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
