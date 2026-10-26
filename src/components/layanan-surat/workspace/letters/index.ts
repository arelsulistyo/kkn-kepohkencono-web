import type { LetterId } from "@/app/layanan-surat/data/services";
import type { LetterConfig } from "../types";
import domisili from "./domisili";
import izinKeramaian from "./izin-keramaian";
import kelahiran from "./kelahiran";
import kematian from "./kematian";
import pengantarDesa from "./pengantar-desa";
import tidakMampu from "./tidak-mampu";
import usaha from "./usaha";

export const letterConfigs: Record<LetterId, LetterConfig> = {
  domisili,
  "pengantar-desa": pengantarDesa,
  "izin-keramaian": izinKeramaian,
  usaha,
  "tidak-mampu": tidakMampu,
  kelahiran,
  kematian,
};
