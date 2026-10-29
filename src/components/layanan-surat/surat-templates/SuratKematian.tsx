import { jsPDF } from "jspdf";
import {
  generateLetter,
  getImgFromUrl,
  PREVIEW_LETTER_NUMBER,
  type GeneratedLetter,
} from "./shared";

export interface SuratKematianProps {
  nama: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: string;
  pekerjaan: string;
  alamat: string;
  agama: string;
  hariTanggalKematian: string;
  jamKematian: string;
  sebabKematian: string;
  yangMenerangkan: string;
  tempatKematian: string;
}

export const buildSuratKematianDoc = async (
  props: SuratKematianProps,
  letterNumber: string = PREVIEW_LETTER_NUMBER
): Promise<jsPDF> => {
  const {
    nama,
    tempatLahir,
    tanggalLahir,
    jenisKelamin,
    pekerjaan,
    alamat,
    agama,
    hariTanggalKematian,
    jamKematian,
    sebabKematian,
    yangMenerangkan,
    tempatKematian,
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
  doc.text("SURAT KETERANGAN KEMATIAN", 105, 70, { align: "center" });
  const textWidth = doc.getTextWidth("SURAT KETERANGAN KEMATIAN");
  doc.setLineWidth(0.5);
  doc.line(105 - textWidth / 2, 71, 105 + textWidth / 2, 71);
  doc.setFontSize(12);
  doc.setFont("Bookman Old Style", "normal");
  doc.text(`Nomor : 400.7.22.1 / ${letterNumber}`, 105, 76, {
    align: "center",
  });

  doc.setFontSize(12);
  doc.setFont("Bookman Old Style", "normal");
  doc.text(
    "Yang bertanda tangan di bawah ini, Kepala Desa Kepohkencono, Kecamatan Pucakwangi, Kabupaten Pati, dengan ini menerangkan bahwa:",
    20,
    93,
    { maxWidth: 170, align: "justify" }
  );

  let yPos = 110;
  const lineHeight = 7;

  doc.text("Nama", 20, yPos);
  doc.text(": " + nama, 100, yPos);
  yPos += lineHeight;

  doc.text("Tempat/Tgl Lahir", 20, yPos);
  doc.text(": " + tempatLahir + ", " + tanggalLahir, 100, yPos);
  yPos += lineHeight;

  doc.text("Jenis Kelamin", 20, yPos);
  doc.text(": " + jenisKelamin, 100, yPos);
  yPos += lineHeight;

  doc.text("Pekerjaan", 20, yPos);
  doc.text(": " + pekerjaan, 100, yPos);
  yPos += lineHeight;

  doc.text("Alamat", 20, yPos);
  doc.text(": " + alamat, 100, yPos);
  yPos += lineHeight;

  doc.text("Agama", 20, yPos);
  doc.text(": " + agama, 100, yPos);
  yPos += lineHeight * 2;

  doc.text("Yang bersangkutan benar telah meninggal dunia pada:", 20, yPos);
  yPos += lineHeight * 1.5;

  doc.text("Hari/tanggal", 20, yPos);
  doc.text(": " + hariTanggalKematian, 100, yPos);
  yPos += lineHeight;

  doc.text("Jam", 20, yPos);
  doc.text(": " + jamKematian, 100, yPos);
  yPos += lineHeight;

  doc.text("Sebab kematian", 20, yPos);
  doc.text(": " + sebabKematian, 100, yPos);
  yPos += lineHeight;

  doc.text("Yang menerangkan kematian", 20, yPos);
  doc.text(": " + yangMenerangkan, 100, yPos);
  yPos += lineHeight;

  doc.text("Tempat kematian", 20, yPos);
  doc.text(": " + tempatKematian, 100, yPos);
  yPos += lineHeight * 2;

  doc.text(
    "Demikian surat keterangan ini dibuat untuk dapat dipergunakan sebagaimana mestinya.",
    20,
    yPos,
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

  const signatureY = yPos + 15;

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

  return doc;
};

export const suratKematianFilename = (props: SuratKematianProps) =>
  "Surat_Keterangan_Kematian_" + props.nama.replace(/ /g, "_") + ".pdf";

const generateSuratKematian = (
  props: SuratKematianProps
): Promise<GeneratedLetter | null> =>
  generateLetter("kematian", buildSuratKematianDoc, props, suratKematianFilename(props));

export default generateSuratKematian;
