import Head from 'next/head';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  url?: string;
  type?: string;
}

export default function SEOHead({
  title = "Desa Kepohkencono - Website Resmi Desa Kepohkencono",
  description = "Website resmi Desa Kepohkencono. Informasi lengkap tentang profil desa, demografi, potensi, dan layanan masyarakat Desa Kepohkencono.",
  keywords = [
    "Desa Kepohkencono",
    "Kepohkencono",
    "desa",
    "pemerintahan desa",
    "profil desa",
    "demografi",
    "potensi desa",
    "layanan masyarakat",
    "Indonesia",
    "Pati",
    "Jawa Tengah",
    "Pucakwangi"
  ],
  ogImage = "/images/home/sunset_kepohkencono_centered.jpg",
  url = "https://desakepohkencono.com",
  type = "website"
}: SEOHeadProps) {
  const fullImageUrl = ogImage.startsWith('http') ? ogImage : `${url}${ogImage}`;
  
  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content="Pemerintah Desa Kepohkencono" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Indonesian" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      
      {/* Viewport and Mobile */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Desa Kepohkencono - Pemandangan sunset di hamparan sawah" />
      <meta property="og:site_name" content="Desa Kepohkencono" />
      <meta property="og:locale" content="id_ID" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImageUrl} />
      <meta property="twitter:image:alt" content="Desa Kepohkencono - Pemandangan sunset di hamparan sawah" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="geo.region" content="ID-JT" />
      <meta name="geo.placename" content="Kepohkencono, Pucakwangi, Pati, Jawa Tengah" />
      <meta name="geo.position" content="-6.8434;111.1459" />
      <meta name="ICBM" content="-6.8434, 111.1459" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Favicon and Icons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Preconnect for Performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      
      {/* Structured Data for Local Business */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "GovernmentOrganization",
            "name": "Desa Kepohkencono",
            "alternateName": "Kepohkencono Village",
            "description": description,
            "url": url,
            "image": fullImageUrl,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Kepohkencono",
              "addressRegion": "Jawa Tengah",
              "addressCountry": "ID"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "-6.8434",
              "longitude": "111.1459"
            },
            "areaServed": {
              "@type": "Place",
              "name": "Desa Kepohkencono"
            }
          })
        }}
      />
    </Head>
  );
}