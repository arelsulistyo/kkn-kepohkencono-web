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
  jenisGarapan?: string;
  luasLahan?: string;
  lokasiLahan?: string;
  jenisBibit?: string;
  hasilPanen?: {
    ton?: string;
    kw?: string;
    kg?: string;
  };
}

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

  const doc = new jsPDF();

  doc.setFont("Bookman Old Style", "normal");

  try {
    const kopSuratDataUrl = await getImgFromUrl(
      "/images/layanan-surat/kop_kepohkencono.png"
    );

    doc.addImage(
      kopSuratDataUrl,
      "PNG",
      20,
      10,
      170,
      40,
      "kop_surat",
      "MEDIUM"
    );
  } catch (error) {
    console.error("Gagal memuat kop surat:", error);
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

  doc.setFontSize(12);
  doc.setFont("Bookman Old Style", "normal");
  doc.text("No Kode Desa : 33.18.05.20.03", 20, 55);

  const currentDate = new Date();

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

  doc.setFontSize(12);
  doc.setFont("Bookman Old Style", "normal");
  doc.text("Yang bertanda tangan dibawah ini :", 20, 93);

  doc.text("Nama", 20, 100);
  doc.text(": NGASIMAN S.H.", 75, 100);
  doc.text("Jabatan", 20, 107);
  doc.text(": Pj.Kepala Desa Kepohkencono", 75, 107);

  doc.text("Menerangkan dengan sesungguhnya bahwa :", 20, 123);

  doc.text("Nama", 20, 130);
  doc.text(": " + namaPeminta.toUpperCase(), 75, 130);
  doc.text("Pekerjaan", 20, 137);

  const splitPekerjaan = doc.splitTextToSize(pekerjaan, 120);
  doc.text(": " + splitPekerjaan[0], 75, 137);

  let currentY = 137;
  for (let i = 1; i < splitPekerjaan.length; i++) {
    currentY += 7;
    doc.text(splitPekerjaan[i], 75, currentY);
  }

  const alamatY = currentY + 7;
  doc.text("Alamat", 20, alamatY);
  doc.text(": " + alamat, 75, alamatY);

  const businessY = alamatY + 16;
  doc.text("Benar benar mempunyai usaha :", 35, businessY);

  const splitJenisUsaha = doc.splitTextToSize(jenisUsaha, 130);
  doc.text(splitJenisUsaha, 35, businessY + 7);

  const jenisUsahaLines = splitJenisUsaha.length;
  const closingY = businessY + 7 + jenisUsahaLines * 7 + 10;

  doc.text(
    "        Demikian Surat Keterangan tersebut kami buat dan dapat dipergunakan seperlunya.",
    20,
    closingY,
    { maxWidth: 170, align: "justify" }
  );

  const day = currentDate.getDate();

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

  const signatureY = closingY + 15;

  doc.text(`Kepohkencono, ${formattedDate}`, 130, signatureY);
  doc.text("Pj.Kepala Desa Kepohkencono", 130, signatureY + 5);

  const nameY = signatureY + 30;
  doc.setFont("Bookman Old Style", "bold");
  doc.text("NGASIMAN S.H.", 145, nameY);

  const signatureNameWidth = doc.getTextWidth("NGASIMAN S.H.");
  doc.setLineWidth(0.5);
  doc.line(145, nameY + 1, 145 + signatureNameWidth, nameY + 1);

  doc.setFont("Bookman Old Style", "normal");
  doc.text("NIP. 197006051992031007", 133, nameY + 6);

  if (jenisGarapan) {
    const agricY = nameY + 15;

    doc.setFontSize(10);
    doc.setFont("Bookman Old Style", "bold");
    doc.text("KETERANGAN GARAPAN UNTUK USAHA PERTANIAN:", 20, agricY);

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

const generateSuratKeteranganUsaha = (
  props: SuratKeteranganUsahaProps
): Promise<GeneratedLetter | null> =>
  generateLetter("usaha", buildSuratKeteranganUsahaDoc, props, suratKeteranganUsahaFilename(props));

export default generateSuratKeteranganUsaha;
