import type { Metadata } from "next";
import { LayananSessionProvider } from "@/components/layanan-surat/LayananSession";
import LayananToaster from "@/components/layanan-surat/LayananToaster";
import { LS_ROOT_CLASS } from "./fonts";
import "./layanan-surat.css";

export const metadata: Metadata = {
  title: "Layanan Surat · Desa Kepohkencono",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function LayananSuratLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${LS_ROOT_CLASS} ls-page`}>
      <LayananSessionProvider>{children}</LayananSessionProvider>
      <LayananToaster />
    </div>
  );
}
