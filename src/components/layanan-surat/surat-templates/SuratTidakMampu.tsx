import { jsPDF } from "jspdf";
import {
  generateLetter,
  getImgFromUrl,
  PREVIEW_LETTER_NUMBER,
  type GeneratedLetter,
} from "./shared";

export interface SuratTidakMampuProps {
  namaPemohon: string;
  tempatLahirPemohon: string;
  tanggalLahirPemohon: string;
  jenisKelaminPemohon: string; // "L" atau "P"
  pekerjaanPemohon: string;
  alamatPemohon: string;
  persyaratan: string;
}

/**
 * Komponen untuk menghasilkan PDF Surat Keterangan Tidak Mampu
 */
export const buildSuratTidakMampuDoc = async (
  props: SuratTidakMampuProps,
  letterNumber: string = PREVIEW_LETTER_NUMBER
): Promise<jsPDF> => {
  const {
    namaPemohon,
    tempatLahirPemohon,
    tanggalLahirPemohon,
    jenisKelaminPemohon,
    pekerjaanPemohon,
    alamatPemohon,
    persyaratan,
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
  doc.text("SURAT KETERANGAN TIDAK MAMPU", 105, 70, { align: "center" });
  const textWidth = doc.getTextWidth("SURAT KETERANGAN TIDAK MAMPU");
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
  doc.text(
    "Yang bertanda tangan di bawah ini, Kepala Desa Kepohkencono, Kecamatan Pucakwangi, Kabupaten Pati, dengan ini menerangkan bahwa:",
    20,
    93,
    { maxWidth: 170, align: "justify" }
  );

  // Add pemohon data
  let yPos = 110;
  const lineHeight = 7;

  // Nama Pemohon
  doc.text("Nama", 20, yPos);
  doc.text(": " + namaPemohon, 100, yPos);
  yPos += lineHeight;

  // Tempat/Tgl Lahir Pemohon
  doc.text("Tempat/Tgl Lahir", 20, yPos);
  doc.text(": " + tempatLahirPemohon + ", " + tanggalLahirPemohon, 100, yPos);
  yPos += lineHeight;

  // Jenis Kelamin Pemohon
  doc.text("Jenis Kelamin", 20, yPos);
  doc.text(": " + jenisKelaminPemohon, 100, yPos);
  yPos += lineHeight;

  // Pekerjaan Pemohon
  doc.text("Pekerjaan", 20, yPos);
  doc.text(": " + pekerjaanPemohon, 100, yPos);
  yPos += lineHeight;

  // Alamat Pemohon
  doc.text("Alamat", 20, yPos);
  doc.text(": " + alamatPemohon, 100, yPos);
  yPos += lineHeight * 2;

  // Keterangan tidak mampu
  doc.text(
    "Bahwa yang bersangkutan benar-benar warga Desa Kepohkencono dan termasuk dalam kategori keluarga tidak mampu berdasarkan pengawasan dan pengamatan kami.",
    20,
    yPos,
    { maxWidth: 170, align: "justify" }
  );
  yPos += lineHeight * 3;

  // Keperluan - combine the sentence with persyaratan on the same line
  const keperluanText =
    "Surat keterangan ini diberikan kepadanya untuk dipergunakan sebagai persyaratan (" +
    persyaratan +
    ").";
  const keperluanTextWidth = doc.getTextWidth(keperluanText);

  // Write the first part normally
  doc.text(keperluanText, 20, yPos, { maxWidth: 170, align: "justify" });

  yPos += lineHeight * 2;

  // Add closing statement
  doc.text(
    "Demikian surat keterangan ini dibuat untuk dapat dipergunakan sebagaimana mestinya.",
    20,
    yPos,
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

  // Calculate signature position
  const signatureY = yPos + 15;

  doc.text(`Kepohkencono, ${formattedDate}`, 130, signatureY);
  doc.text("Pj.Kepala Desa Kepohkencono", 130, signatureY + 5);

  // Space for signature
  const nameY = signatureY + 30;
  doc.setFont("Bookman Old Style", "bold");
  doc.text("NGASIMAN S.H.", 145, nameY);

  // Add underline for the signature name
  const signatureNameWidth = doc.getTextWidth("NGASIMAN S.H.");
  doc.setLineWidth(0.5);
  doc.line(145, nameY + 1, 145 + signatureNameWidth, nameY + 1);

  doc.setFont("Bookman Old Style", "normal");
  doc.text("NIP. 197006051992031007", 133, nameY + 6);

  return doc;
};

export const suratTidakMampuFilename = (props: SuratTidakMampuProps) =>
  "Surat_Keterangan_Tidak_Mampu_" + props.namaPemohon.replace(/ /g, "_") + ".pdf";

/**
 * Mengambil nomor surat berikutnya, membuat PDF, lalu mengunduhnya.
 */
const generateSuratTidakMampu = (
  props: SuratTidakMampuProps
): Promise<GeneratedLetter | null> =>
  generateLetter("tidak-mampu", buildSuratTidakMampuDoc, props, suratTidakMampuFilename(props));

export default generateSuratTidakMampu;
