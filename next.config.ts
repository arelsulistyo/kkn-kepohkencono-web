import type { NextConfig } from "next";

const NOINDEX = [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];

const nextConfig: NextConfig = {
  trailingSlash: false,
  generateEtags: true,
  poweredByHeader: false,
  compress: true,
  // Keep the staff-only letter service, its API and sample PDFs out of search
  // engines without listing them in the public robots.txt.
  async headers() {
    return [
      { source: "/layanan-surat/:path*", headers: NOINDEX },
      { source: "/api/:path*", headers: NOINDEX },
      { source: "/pdf_preview/:path*", headers: NOINDEX },
    ];
  },
};

export default nextConfig;
