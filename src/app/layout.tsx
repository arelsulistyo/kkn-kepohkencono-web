import type { Metadata } from "next";
import { Inter, Poppins, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { structuredData, breadcrumbStructuredData } from "./structured-data";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Desa Kepohkencono - Website Resmi Desa Kepohkencono",
  description: "Website resmi Desa Kepohkencono. Informasi lengkap tentang profil desa, demografi, potensi, dan layanan masyarakat Desa Kepohkencono.",
  keywords: [
    "Desa Kepohkencono",
    "Kepohkencono",
    "desa",
    "pemerintahan desa",
    "profil desa",
    "demografi",
    "potensi desa",
    "layanan masyarakat",
    "Indonesia"
  ],
  authors: [{ name: "Pemerintah Desa Kepohkencono" }],
  creator: "Pemerintah Desa Kepohkencono",
  publisher: "Pemerintah Desa Kepohkencono",
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
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://desakepohkencono.com",
    title: "Desa Kepohkencono - Website Resmi Desa Kepohkencono",
    description: "Website resmi Desa Kepohkencono. Informasi lengkap tentang profil desa, demografi, potensi, dan layanan masyarakat Desa Kepohkencono.",
    siteName: "Desa Kepohkencono",
  },
  twitter: {
    card: "summary_large_image",
    title: "Desa Kepohkencono - Website Resmi Desa Kepohkencono",
    description: "Website resmi Desa Kepohkencono. Informasi lengkap tentang profil desa, demografi, potensi, dan layanan masyarakat Desa Kepohkencono.",
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://desakepohkencono.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbStructuredData),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${poppins.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
