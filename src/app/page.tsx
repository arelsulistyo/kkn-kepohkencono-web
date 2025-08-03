import Index from "./Index";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Desa Kepohkencono - Website Resmi Desa Kepohkencono",
  description: "Website resmi Desa Kepohkencono, Pucakwangi, Pati, Jawa Tengah. Informasi lengkap tentang profil desa, demografi penduduk, potensi desa, layanan masyarakat, dan berita terkini dari Desa Kepohkencono.",
  keywords: [
    "Desa Kepohkencono",
    "Kepohkencono",
    "Pucakwangi",
    "Pati",
    "Jawa Tengah",
    "desa",
    "pemerintahan desa",
    "profil desa",
    "demografi",
    "potensi desa",
    "layanan masyarakat",
    "Indonesia",
    "sedekah bumi",
    "ketoprak",
    "campursari",
    "petani",
    "sawah",
    "tradisi",
    "budaya",
    "dukuh",
    "manding",
    "panggang",
    "prau",
    "ngepoh",
    "jatikebo",
    "dangklik"
  ],
  openGraph: {
    title: "Desa Kepohkencono - Website Resmi Desa Kepohkencono",
    description: "Website resmi Desa Kepohkencono, Pucakwangi, Pati, Jawa Tengah. Informasi lengkap tentang profil desa, demografi penduduk, potensi desa, layanan masyarakat, dan berita terkini dari Desa Kepohkencono.",
    url: "https://desakepohkencono.com",
    siteName: "Desa Kepohkencono",
    images: [
      {
        url: "/images/home/sunset_kepohkencono_centered.jpg",
        width: 1200,
        height: 630,
        alt: "Pemandangan sunset di hamparan sawah Desa Kepohkencono",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Desa Kepohkencono - Website Resmi Desa Kepohkencono",
    description: "Website resmi Desa Kepohkencono, Pucakwangi, Pati, Jawa Tengah. Informasi lengkap tentang profil desa, demografi penduduk, potensi desa, layanan masyarakat, dan berita terkini dari Desa Kepohkencono.",
    images: ["/images/home/sunset_kepohkencono_centered.jpg"],
  },
  alternates: {
     canonical: "https://desakepohkencono.com",
   },
};

export default function Home() {
  return <Index />;
}
