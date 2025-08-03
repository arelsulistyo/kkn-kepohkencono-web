export const structuredData = {
  "@context": "https://schema.org",
  "@type": "GovernmentOrganization",
  "name": "Desa Kepohkencono",
  "alternateName": "Kepohkencono Village",
  "description": "Pemerintahan Desa Kepohkencono - Website resmi yang menyediakan informasi lengkap tentang profil desa, demografi, potensi, dan layanan masyarakat.",
  "url": "https://desakepohkencono.com",
  "logo": "https://desakepohkencono.com/images/logo-desa.png",
  "image": "https://desakepohkencono.com/images/desa-kepohkencono.jpg",
  "telephone": "+62-XXX-XXXX-XXXX",
  "email": "info@kepohkencono.id",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Jalan Desa Kepohkencono",
    "addressLocality": "Kepohkencono",
    "addressRegion": "Jawa Tengah",
    "postalCode": "XXXXX",
    "addressCountry": "ID"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "-7.XXXXX",
    "longitude": "110.XXXXX"
  },
  "areaServed": {
    "@type": "Place",
    "name": "Desa Kepohkencono"
  },
  "serviceType": [
    "Pelayanan Administrasi Desa",
    "Pelayanan Masyarakat",
    "Informasi Demografi",
    "Pengembangan Potensi Desa"
  ],
  "sameAs": [
    "https://www.instagram.com/kepohkencono",
    "https://www.tiktok.com/@kepohkencono"
  ],
  "knowsAbout": [
    "Desa Kepohkencono",
    "Pemerintahan Desa",
    "Demografi Desa",
    "Potensi Desa",
    "Layanan Masyarakat"
  ]
};

export const breadcrumbStructuredData = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Beranda",
      "item": "https://desakepohkencono.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Tentang Desa",
      "item": "https://desakepohkencono.com/#about"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Demografi",
      "item": "https://desakepohkencono.com/#demografi"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "Potensi Desa",
      "item": "https://desakepohkencono.com/#potensi"
    }
  ]
};