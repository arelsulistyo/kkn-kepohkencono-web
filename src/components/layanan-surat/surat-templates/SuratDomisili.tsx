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
  signatureType?: "sekretaris" | "kepala";
}

export const buildSuratDomisiliDoc = async (
  props: SuratDomisiliProps,
  letterNumber: string = PREVIEW_LETTER_NUMBER
): Promise<jsPDF> => {
  const { namaPeminta, alamatDomisili, signatureType = "sekretaris" } = props;

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
  doc.text("SURAT KETERANGAN DOMISILI", 105, 70, { align: "center" });
  const textWidth = doc.getTextWidth("SURAT KETERANGAN DOMISILI");
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
  doc.text(": AGUS SUMANTO", 75, 100);
  doc.text("Jabatan", 20, 107);
  doc.text(": Plt.Sekretaris Desa", 75, 107);

  doc.text("Menerangkan dengan sesungguhnya bahwa :", 20, 123);

  doc.text("Nama", 20, 130);
  doc.text(": " + namaPeminta.toUpperCase(), 75, 130);
  doc.text("Alamat", 20, 137);
  doc.text(": " + alamatDomisili, 75, 137);

  const firstWord = alamatDomisili.split(" ")[0];
  const capitalizedFirstWord =
    firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase();

  const words = alamatDomisili.split(" ");
  let rt = "0";
  let rw = "0";

  if (words.length > 1) {
    const rtRwPattern = words[1].match(/\d+\/\d+/);
    if (rtRwPattern) {
      const rtRwParts = rtRwPattern[0].split("/");
      if (rtRwParts.length === 2) {
        rt = parseInt(rtRwParts[0], 10).toString();
        rw = parseInt(rtRwParts[1], 10).toString();
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

  doc.text(
    "        Demikian Surat Keterangan tersebut kami buat dan dapat dipergunakan seperlunya.",
    20,
    160,
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

  doc.text(`Kepohkencono, ${formattedDate}`, 130, 180);

  if (signatureType === "sekretaris") {
    doc.text("Plt.Sekretaris Desa", 140, 185);

    doc.setFont("Bookman Old Style", "bold");
    doc.text("AGUS SUMANTO", 142, 225);

    const signatureNameWidth = doc.getTextWidth("AGUS SUMANTO");
    doc.setLineWidth(0.5);
    doc.line(142, 226, 142 + signatureNameWidth, 226);
    doc.setFont("Bookman Old Style", "normal");
  } else {
    doc.text("Pj.Kepala Desa Kepohkencono", 130, 185);

    doc.setFont("Bookman Old Style", "bold");
    doc.text("NGASIMAN S.H.", 145, 225);

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

const generateSuratDomisili = (
  props: SuratDomisiliProps
): Promise<GeneratedLetter | null> =>
  generateLetter("domisili", buildSuratDomisiliDoc, props, suratDomisiliFilename(props));

export default generateSuratDomisili;
