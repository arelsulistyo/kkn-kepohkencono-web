import { jsPDF } from "jspdf";
import {
  generateLetter,
  getImgFromUrl,
  PREVIEW_LETTER_NUMBER,
  type GeneratedLetter,
} from "./shared";

export interface SuratDomisiliProps {
  namaPeminta: string;
  alamatDomisili: string;
  signatureType?: "sekretaris" | "kepala"; // Optional parameter to choose signature type
}

/**
 * Komponen untuk menghasilkan PDF Surat Keterangan Domisili
 */
export const buildSuratDomisiliDoc = async (
  props: SuratDomisiliProps,
  letterNumber: string = PREVIEW_LETTER_NUMBER
): Promise<jsPDF> => {
  const { namaPeminta, alamatDomisili, signatureType = "sekretaris" } = props;

  // Buat instance jsPDF
  const doc = new jsPDF();

  // Set font ke Bookman Old Style
  doc.setFont("Bookman Old Style", "normal");

  // Coba untuk mendapatkan gambar kop surat
  try {
    // Gunakan gambar kop surat dari folder public
    const kopSuratDataUrl = await getImgFromUrl(
      "/images/layanan-surat/kop_kepohkencono.png"
    );

    // Header Surat
    doc.addImage(
      kopSuratDataUrl,
      "PNG",
      20, // x position
      10, // y position
      170, // width (hampir selebar halaman A4)
      40, // height
      "kop_surat", // alias
      "MEDIUM" // compression
    );
  } catch (error) {
    console.error("Gagal memuat kop surat:", error);
    // Lanjutkan tanpa kop surat, gunakan teks sebagai fallback
    doc.setFontSize(12);
    doc.setFont("Bookman Old Style", "bold");
    doc.text("PEMERINTAH KABUPATEN PATI", 105, 20, { align: "center" });
    doc.text("KECAMATAN PUCAKWANGI", 105, 25, { align: "center" });
    doc.text("DESA KEPOHKENCONO", 105, 30, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("Bookman Old Style", "normal");
    doc.text(
      "Alamat: Jl. Raya Kepohkencono, Pucakwangi, Pati, Jawa Tengah",
      105,
      35,
      { align: "center" }
    );
  }

  // No Kode Desa
  doc.setFontSize(12);
  doc.setFont("Bookman Old Style", "normal");
  doc.text("No Kode Desa : 33.18.05.20.03", 20, 55);

  const currentDate = new Date();

  // Title Surat
  doc.setFontSize(18);
  doc.setFont("Bookman Old Style", "bold");
  doc.text("SURAT KETERANGAN DOMISILI", 105, 70, { align: "center" });
  const textWidth = doc.getTextWidth("SURAT KETERANGAN DOMISILI");
  doc.setLineWidth(0.5);
  doc.line(105 - textWidth / 2, 71, 105 + textWidth / 2, 71);
  doc.setFontSize(12);
  doc.setFont("Bookman Old Style", "normal");
  doc.text(`Nomor : 400.7.22.1 / ${letterNumber}`, 105, 76, {
    align: "center",
  });

  // Add content
  doc.setFontSize(12);
  doc.setFont("Bookman Old Style", "normal");
  doc.text("Yang bertanda tangan dibawah ini :", 20, 93);

  // Add penandatangan data
  doc.text("Nama", 20, 100);
  doc.text(": AGUS SUMANTO", 75, 100);
  doc.text("Jabatan", 20, 107);
  doc.text(": Plt.Sekretaris Desa", 75, 107);

  // Add description
  doc.text("Menerangkan dengan sesungguhnya bahwa :", 20, 123);

  // Add user data
  doc.text("Nama", 20, 130);
  doc.text(": " + namaPeminta.toUpperCase(), 75, 130);
  doc.text("Alamat", 20, 137);
  doc.text(": " + alamatDomisili, 75, 137);

  // Add domisili description
  // Extract first word from alamatDomisili and capitalize it
  const firstWord = alamatDomisili.split(" ")[0];
  const capitalizedFirstWord =
    firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase();

  // Extract RT/RW numbers from the second word of alamatDomisili
  const words = alamatDomisili.split(" ");
  let rt = "0";
  let rw = "0";

  if (words.length > 1) {
    const rtRwPattern = words[1].match(/\d+\/\d+/);
    if (rtRwPattern) {
      const rtRwParts = rtRwPattern[0].split("/");
      if (rtRwParts.length === 2) {
        // Extract numbers without leading zeros
        rt = parseInt(rtRwParts[0], 10).toString(); // Remove leading zeros
        rw = parseInt(rtRwParts[1], 10).toString(); // Remove leading zeros
      }
    }
  }

  doc.text(
    "     Benar-benar berdomisili di dukuh " +
      capitalizedFirstWord +
      " RT 00" +
      rt +
      " RW 00" +
      rw +
      " Desa Kepohkencono Pucakwangi Pati.",
    20,
    150,
    { maxWidth: 170, align: "justify" }
  );
  // doc.text("Kepohkencono Pucakwangi Pati.", 10, 170);

  doc.text(
    "        Demikian Surat Keterangan tersebut kami buat dan dapat dipergunakan seperlunya.",
    20,
    160,
    { maxWidth: 170, align: "justify" }
  );
  // doc.text("seperlunya.", 10, 195);

  // Add signature section with current date
  // Format the current date in Indonesian style
  const day = currentDate.getDate();

  // Array of month names in Indonesian
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const month = monthNames[currentDate.getMonth()];
  const year = currentDate.getFullYear();
  const formattedDate = `${day} ${month} ${year}`;

  doc.text(`Kepohkencono, ${formattedDate}`, 130, 180);

  // Add signature based on selected type
  if (signatureType === "sekretaris") {
    // Sekretaris Desa signature
    doc.text("Plt.Sekretaris Desa", 140, 185);

    // Space for signature
    doc.setFont("Bookman Old Style", "bold");
    doc.text("AGUS SUMANTO", 142, 225);

    // Add underline for the signature name
    const signatureNameWidth = doc.getTextWidth("AGUS SUMANTO");
    doc.setLineWidth(0.5);
    doc.line(142, 226, 142 + signatureNameWidth, 226);
    doc.setFont("Bookman Old Style", "normal");
  } else {
    // Kepala Desa signature (copied from SuratKelahiran)
    doc.text("Pj.Kepala Desa Kepohkencono", 130, 185);

    // Space for signature
    doc.setFont("Bookman Old Style", "bold");
    doc.text("NGASIMAN S.H.", 145, 225);

    // Add underline for the signature name
    const signatureNameWidth = doc.getTextWidth("NGASIMAN S.H.");
    doc.setLineWidth(0.5);
    doc.line(145, 226, 145 + signatureNameWidth, 226);

    doc.setFont("Bookman Old Style", "normal");
    doc.text("NIP. 197006051992031007", 133, 231);
  }

  return doc;
};

export const suratDomisiliFilename = (props: SuratDomisiliProps) =>
  "Surat_Keterangan_Domisili_" + props.namaPeminta.replace(/ /g, "_") + ".pdf";

/**
 * Mengambil nomor surat berikutnya, membuat PDF, lalu mengunduhnya.
 */
const generateSuratDomisili = (
  props: SuratDomisiliProps
): Promise<GeneratedLetter | null> =>
  generateLetter("domisili", buildSuratDomisiliDoc, props, suratDomisiliFilename(props));

export default generateSuratDomisili;
