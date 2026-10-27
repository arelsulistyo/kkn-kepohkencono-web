import type { Metadata } from "next";
import { KP_ROOT_CLASS } from "@/lib/fonts";
import "@/styles/kepohkencono.css";

export const metadata: Metadata = {
  title: "Visualisasi Data · Desa Kepohkencono",
  description:
    "Data kependudukan Desa Kepohkencono, Pucakwangi, Pati: jumlah penduduk, kelompok usia, pekerjaan, tingkat pendidikan, serta kepemilikan KTP dan akta kelahiran.",
  alternates: { canonical: "https://desakepohkencono.com/visualisasi-data" },
};

export default function VisualisasiDataLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${KP_ROOT_CLASS} data-page`}>{children}</div>;
}
