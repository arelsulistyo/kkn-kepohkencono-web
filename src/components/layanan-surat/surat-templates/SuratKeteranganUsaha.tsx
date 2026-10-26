import { jsPDF } from "jspdf";
import {
  generateLetter,
  getImgFromUrl,
  PREVIEW_LETTER_NUMBER,
  type GeneratedLetter,
} from "./shared";

export interface SuratKeteranganUsahaProps {
  namaPeminta: string;
  pekerjaan: string;
  alamat: string;
  jenisUsaha: string;
  // Fields for agricultural business details
  jenisGarapan?: string; // Tambak/Sawah/Tegalan
  luasLahan?: string; // in Ha
  lokasiLahan?: string; // Terletak di Desa
  jenisBibit?: string;
  hasilPanen?: {
    ton?: string;
    kw?: string;
    kg?: string;
  };
}

/**
 * Komponen untuk menghasilkan PDF Surat Keterangan Usaha
 */
export const buildSuratKeteranganUsahaDoc = async (
  props: SuratKeteranganUsahaProps,
  letterNumber: string = PREVIEW_LETTER_NUMBER
): Promise<jsPDF> => {
  const {
    namaPeminta,
    pekerjaan,
    alamat,
    jenisUsaha,
    jenisGarapan,
    luasLahan,
    lokasiLahan,
    jenisBibit,
    hasilPanen,
  } = props;

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
  doc.text("SURAT KETERANGAN USAHA", 105, 70, { align: "center" });
  const textWidth = doc.getTextWidth("SURAT KETERANGAN USAHA");
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
  doc.text(": NGASIMAN S.H.", 75, 100);
  doc.text("Jabatan", 20, 107);
  doc.text(": Pj.Kepala Desa Kepohkencono", 75, 107);

  // Add description
  doc.text("Menerangkan dengan sesungguhnya bahwa :", 20, 123);

  // Add user data
  doc.text("Nama", 20, 130);
  doc.text(": " + namaPeminta.toUpperCase(), 75, 130);
  doc.text("Pekerjaan", 20, 137);

  // Format pekerjaan as a paragraph with word wrapping
  const splitPekerjaan = doc.splitTextToSize(pekerjaan, 120); // Split text with max width
  doc.text(": " + splitPekerjaan[0], 75, 137);

  // Add additional lines if pekerjaan is multi-line
  let currentY = 137;
  for (let i = 1; i < splitPekerjaan.length; i++) {
    currentY += 7;
    doc.text(splitPekerjaan[i], 75, currentY);
  }

  // Adjust alamat position based on pekerjaan height
  const alamatY = currentY + 7;
  doc.text("Alamat", 20, alamatY);
  doc.text(": " + alamat, 75, alamatY);

  // Add business description - adjust position based on alamat position
  const businessY = alamatY + 16; // Add some space after alamat
  doc.text("Benar benar mempunyai usaha :", 35, businessY);

  // Format jenisUsaha as a paragraph with word wrapping
  const splitJenisUsaha = doc.splitTextToSize(jenisUsaha, 130); // Split text with max width
  doc.text(splitJenisUsaha, 35, businessY + 7);

  // Add closing statement - adjust position based on business description
  // Calculate position based on jenisUsaha length
  const jenisUsahaLines = splitJenisUsaha.length;
  const closingY = businessY + 7 + jenisUsahaLines * 7 + 10; // Add some space after business description

  doc.text(
    "        Demikian Surat Keterangan tersebut kami buat dan dapat dipergunakan seperlunya.",
    20,
    closingY,
    { maxWidth: 170, align: "justify" }
  );

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

  // Calculate signature position based on closing statement position
  const signatureY = closingY + 15; // Add space after closing statement

  doc.text(`Kepohkencono, ${formattedDate}`, 130, signatureY);
  doc.text("Pj.Kepala Desa Kepohkencono", 130, signatureY + 5);

  // Space for signature
  const nameY = signatureY + 30; // Add space for signature
  doc.setFont("Bookman Old Style", "bold");
  doc.text("NGASIMAN S.H.", 145, nameY);

  // Add underline for the signature name
  const signatureNameWidth = doc.getTextWidth("NGASIMAN S.H.");
  doc.setLineWidth(0.5);
  doc.line(145, nameY + 1, 145 + signatureNameWidth, nameY + 1);

  doc.setFont("Bookman Old Style", "normal");
  doc.text("NIP. 197006051992031007", 133, nameY + 6);

  // Add agricultural business details if provided
  if (jenisGarapan) {
    // Calculate position for agricultural details section based on signature position
    const agricY = nameY + 15; // Add space after signature

    doc.setFontSize(10);
    doc.setFont("Bookman Old Style", "bold");
    doc.text("KETERANGAN GARAPAN UNTUK USAHA PERTANIAN:", 20, agricY);

    // Add underline for the agricultural business details title
    const agricTitleWidth = doc.getTextWidth(
      "KETERANGAN GARAPAN UNTUK USAHA PERTANIAN:"
    );
    doc.setLineWidth(0.5);
    doc.line(20, agricY + 1, 20 + agricTitleWidth, agricY + 1);

    doc.setFont("Bookman Old Style", "normal");
    doc.text("- Jenis Garapan", 20, agricY + 5);
    doc.text(": " + jenisGarapan, 85, agricY + 5);
    doc.text("- Luas", 20, agricY + 10);
    doc.text(
      ": " + (luasLahan || ".....................") + " Ha",
      85,
      agricY + 10
    );
    doc.text("- Nama Tambak / Sawah / Tegalan", 20, agricY + 15);
    doc.text(": " + (jenisUsaha || "....................."), 85, agricY + 15);
    doc.text("- Terletak di Desa", 20, agricY + 20);
    doc.text(
      ": " + (lokasiLahan || "....................."),
      85,
      agricY + 20
    );
    doc.text("- Jenis Bibit", 20, agricY + 25);
    doc.text(": " + (jenisBibit || "....................."), 85, agricY + 25);
    doc.text("- Hasil tiap Ha", 20, agricY + 30);

    let hasilText = ": ";
    if (hasilPanen) {
      if (hasilPanen.ton) hasilText += hasilPanen.ton + " Ton ";
      if (hasilPanen.kw) hasilText += hasilPanen.kw + " Kw ";
      if (hasilPanen.kg) hasilText += hasilPanen.kg + " Kg";
    } else {
      hasilText +=
        "..................... Ton ..................... Kw ..................... Kg";
    }

    doc.text(hasilText, 85, agricY + 30);
  }

  return doc;
};

export const suratKeteranganUsahaFilename = (props: SuratKeteranganUsahaProps) =>
  "Surat_Keterangan_Usaha_" + props.namaPeminta.replace(/ /g, "_") + ".pdf";

/**
 * Mengambil nomor surat berikutnya, membuat PDF, lalu mengunduhnya.
 */
const generateSuratKeteranganUsaha = (
  props: SuratKeteranganUsahaProps
): Promise<GeneratedLetter | null> =>
  generateLetter("usaha", buildSuratKeteranganUsahaDoc, props, suratKeteranganUsahaFilename(props));

export default generateSuratKeteranganUsaha;
