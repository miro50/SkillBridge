import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkillBridge | Assunzione Ingegneri Gestionali Testati su Fermi Linea",
  description:
    "Assumi ingegneri gestionali già testati su fermi linea reali. 3 profili in 7 giorni, zero anticipi, paghi solo al 90° giorno.",
  metadataBase: new URL("https://skillbridge-mocha-three.vercel.app"),
  openGraph: {
    title: "SkillBridge | Assunzione Ingegneri Gestionali Testati su Fermi Linea",
    description:
      "3 profili in 7 giorni, zero anticipi, paghi solo al 90° giorno. Validazione su simulazioni industriali da 25 minuti.",
    url: "https://skillbridge-mocha-three.vercel.app",
    siteName: "SkillBridge Operations",
    locale: "it_IT",
    type: "website",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SkillBridge",
  url: "https://skillbridge-mocha-three.vercel.app",
  logo: "https://skillbridge-mocha-three.vercel.app/favicon.ico",
  description:
    "Piattaforma di validazione competenze tecniche e recruiting per ingegneri gestionali e operations su simulazioni di stabilimento.",
  areaServed: "IT",
  sameAs: [],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="it"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-[#0B1220]">
        {children}
      </body>
    </html>
  );
}
