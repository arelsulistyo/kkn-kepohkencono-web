import { Archivo, Public_Sans } from "next/font/google";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--ls-font-heading",
  display: "swap",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--ls-font-body",
  display: "swap",
});

/**
 * Scope class for Layanan Surat. Also applied to portaled layers (dialogs,
 * popovers, toasts) because they render outside the page wrapper.
 */
export const LS_ROOT_CLASS = `ls-root ${archivo.variable} ${publicSans.variable}`;
