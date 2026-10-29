import { jsPDF } from "jspdf";
import {
  generateLetter,
  getImgFromUrl,
  PREVIEW_LETTER_NUMBER,
  type GeneratedLetter,
} from "./shared";

export interface SuratKelahiranProps {
  namaPemohon: string;
  tempatLahirPemohon: string;
  tanggalLahirPemohon: string;
  jenisKelaminPemohon: string;
  pekerjaanPemohon: string;
  alamatPemohon: string;
  namaAnak: string;
  tempatLahirAnak: string;
  tanggalLahirAnak: string;
  jenisKelaminAnak: string;
  agamaAnak: string;
  alamatAnak: string;
  namaAyah: string;
  namaIbu: string;
}

export const buildSuratKelahiranDoc = async (
  props: SuratKelahiranProps,
  letterNumber: string = PREVIEW_LETTER_NUMBER
): Promise<jsPDF> => {
  const {
    namaPemohon,
    tempatLahirPemohon,
    tanggalLahirPemohon,
    jenisKelaminPemohon,
    pekerjaanPemohon,
    alamatPemohon,
    namaAnak,
    tempatLahirAnak,
    tanggalLahirAnak,
    jenisKelaminAnak,
    agamaAnak,
    alamatAnak,
    namaAyah,
    namaIbu,
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
  doc.text("SURAT KETERANGAN KELAHIRAN", 105, 70, { align: "center" });
  const textWidth = doc.getTextWidth("SURAT KETERANGAN KELAHIRAN");
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
  doc.text(": " + namaPemohon, 100, yPos);
  yPos += lineHeight;

  doc.text("Tempat/Tgl Lahir", 20, yPos);
  doc.text(": " + tempatLahirPemohon + ", " + tanggalLahirPemohon, 100, yPos);
  yPos += lineHeight;

  doc.text("Jenis Kelamin", 20, yPos);
  doc.text(": " + jenisKelaminPemohon, 100, yPos);
  yPos += lineHeight;

  doc.text("Pekerjaan", 20, yPos);
  doc.text(": " + pekerjaanPemohon, 100, yPos);
  yPos += lineHeight;

  doc.text("Alamat", 20, yPos);
  doc.text(": " + alamatPemohon, 100, yPos);
  yPos += lineHeight * 2;

  doc.text("Bahwa benar telah lahir seorang anak:", 20, yPos);
  yPos += lineHeight * 1.5;

  doc.text("Nama", 20, yPos);
  doc.text(": " + namaAnak, 100, yPos);
  yPos += lineHeight;

  doc.text("Tempat tanggal lahir", 20, yPos);
  doc.text(": " + tempatLahirAnak + ", " + tanggalLahirAnak, 100, yPos);
  yPos += lineHeight;

  doc.text("Jenis kelamin", 20, yPos);
  doc.text(": " + jenisKelaminAnak, 100, yPos);
  yPos += lineHeight;

  doc.text("Agama", 20, yPos);
  doc.text(": " + agamaAnak, 100, yPos);
  yPos += lineHeight;

  doc.text("Alamat", 20, yPos);
  doc.text(": " + alamatAnak, 100, yPos);
  yPos += lineHeight * 1.5;

  doc.text("Orang tersebut merupakan anak dari:", 20, yPos);
  yPos += lineHeight * 1.5;

  doc.text("Nama ayah", 20, yPos);
  doc.text(": " + namaAyah, 100, yPos);
  yPos += lineHeight;

  doc.text("Nama ibu", 20, yPos);
  doc.text(": " + namaIbu, 100, yPos);
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

export const suratKelahiranFilename = (props: SuratKelahiranProps) =>
  "Surat_Keterangan_Kelahiran_" + props.namaAnak.replace(/ /g, "_") + ".pdf";

const generateSuratKelahiran = (
  props: SuratKelahiranProps
): Promise<GeneratedLetter | null> =>
  generateLetter("kelahiran", buildSuratKelahiranDoc, props, suratKelahiranFilename(props));

export default generateSuratKelahiran;
