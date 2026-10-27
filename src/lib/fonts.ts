import { Newsreader, Public_Sans, Young_Serif } from "next/font/google";

const youngSerif = Young_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--kp-font-serif",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--kp-font-italic",
  display: "swap",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--kp-font-sans",
  display: "swap",
});

/** Classes defining --kp-font-serif / --kp-font-italic / --kp-font-sans; shared with Layanan Surat. */
export const FONT_VARIABLES = `${youngSerif.variable} ${newsreader.variable} ${publicSans.variable}`;

/** Scope class for the public site (home + visualisasi data). */
export const KP_ROOT_CLASS = `kp-root ${FONT_VARIABLES}`;
