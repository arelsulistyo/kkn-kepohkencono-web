import type { jsPDF } from "jspdf";
// Side-effect imports: each module registers its font with jsPDF on load.
import "../fonts/BookmanOldStyle-normal.js";
import "../fonts/BookmanOldStyle-bold.js";
import { getNextLetterNumber } from "@/lib/firebase";

/** Letter number printed on preview renders, so previews never consume a real number. */
export const PREVIEW_LETTER_NUMBER = `... / ... / ${new Date().getFullYear()}`;

export interface GeneratedLetter {
  filename: string;
  blob: Blob;
}

const imageCache = new Map<string, Promise<string>>();

const loadImageAsDataUrl = (imgUrl: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Gagal mendapatkan context canvas"));
        return;
      }
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };

    img.onerror = () => {
      reject(new Error("Gagal memuat gambar"));
    };

    img.src = imgUrl;
  });

/**
 * Converts an image URL to a base64 data URL. Results are cached so live
 * previews don't re-decode the letterhead on every render.
 */
export const getImgFromUrl = (imgUrl: string): Promise<string> => {
  let pending = imageCache.get(imgUrl);
  if (!pending) {
    pending = loadImageAsDataUrl(imgUrl);
    pending.catch(() => imageCache.delete(imgUrl));
    imageCache.set(imgUrl, pending);
  }
  return pending;
};

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = filename;
  downloadLink.style.display = "none";

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
};

/**
 * Takes the next real letter number, builds the document and downloads it.
 * Returns null (after logging) when anything fails.
 */
export const generateLetter = async <T>(
  counterType: string,
  build: (data: T, letterNumber: string) => Promise<jsPDF>,
  data: T,
  filename: string
): Promise<GeneratedLetter | null> => {
  try {
    const letterNumber = await getNextLetterNumber(counterType);
    const doc = await build(data, letterNumber);
    const blob = doc.output("blob");
    downloadBlob(blob, filename);
    return { filename, blob };
  } catch (error) {
    console.error("Gagal membuat PDF:", error);
    return null;
  }
};
