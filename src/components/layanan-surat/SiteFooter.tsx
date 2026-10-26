export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <span>Desa Kepohkencono</span>
      <span>Arsip Layanan Surat · {new Date().getFullYear()}</span>
    </footer>
  );
}
