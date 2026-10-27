import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/jelajah.pucakwangi?igsh=MTA3c3ZxejVyb3o0Mg%3D%3D&utm_source=qr",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@jelajahpucakwangi_?_t=ZS-8yObUMdgxa3&_r=1",
  },
];

const QUICK_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Tentang", href: "/#tentang" },
  { label: "Budaya", href: "/#budaya" },
  { label: "Galeri", href: "/#galeri" },
  { label: "Visualisasi data", href: "/visualisasi-data" },
];

const CONTACTS = [
  { Icon: MapPin, text: "Desa Kepohkencono, Kec. Pucakwangi" },
  { Icon: Phone, text: "+62 812-3456-7890" },
  { Icon: Mail, text: "jelajahpucakwangi@gmail.com" },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer" id="kontak">
      <div className="footer-grid">
        <div>
          <p className="footer-brand">Kepohkencono</p>
          <p className="footer-tagline">
            Menjaga tradisi, merangkul masa depan. Sebuah komunitas yang
            harmonis di tengah keindahan alam.
          </p>
          <div className="social-links">
            {SOCIAL_LINKS.map((link) => (
              <a
                href={link.href}
                key={link.label}
                rel="noopener noreferrer"
                target="_blank"
                aria-label={`${link.label} Desa Kepohkencono (tab baru)`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h2>Tautan cepat</h2>
          <nav aria-label="Tautan footer">
            {QUICK_LINKS.map((link) => (
              <Link href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div>
          <h2>Punya pertanyaan?</h2>
          <address>
            {CONTACTS.map(({ Icon, text }) => (
              <p key={text}>
                <Icon aria-hidden="true" size={18} strokeWidth={1.7} />
                {text}
              </p>
            ))}
          </address>
        </div>
      </div>
      <p className="footer-bottom">
        © 2025 Desa Kepohkencono · Dikembangkan oleh Tim
        KKN Jelajah Pucakwangi
      </p>
    </footer>
  );
}
