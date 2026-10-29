import { jsPDF } from "jspdf";
import {
  generateLetter,
  getImgFromUrl,
  PREVIEW_LETTER_NUMBER,
  type GeneratedLetter,
} from "./shared";

export interface SuratPengantarDesaProps {
  nama: string;
  jenisKelamin: string;
  tempatLahir: string;
  tanggalLahir: string;
  agama: string;
  pekerjaan: string;
  tempatTinggal: {
    rt: string;
    rw: string;
  };
  suratBuktiDiri: {
    ktpNomor: string;
    kkNomor: string;
  };
  keperluan: string;
  berlakuMulai: string;
  berlakuSampai: string;
  keteranganLain: string;
}

export const buildSuratPengantarDesaDoc = async (
  props: SuratPengantarDesaProps,
  letterNumber: string = PREVIEW_LETTER_NUMBER
): Promise<jsPDF> => {
  const {
    nama,
    jenisKelamin,
    tempatLahir,
    tanggalLahir,
    agama,
    pekerjaan,
    tempatTinggal,
    suratBuktiDiri,
    keperluan,
    berlakuMulai,
    berlakuSampai,
    keteranganLain,
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
  doc.text("SURAT KETERANGAN PENGANTAR DESA", 105, 70, { align: "center" });
  const textWidth = doc.getTextWidth("SURAT KETERANGAN PENGANTAR DESA");
  doc.setLineWidth(0.5);
  doc.line(105 - textWidth / 2, 71, 105 + textWidth / 2, 71);
  doc.setFontSize(12);
  doc.setFont("Bookman Old Style", "normal");
  doc.text(`Nomor : 400.7.22.1 / ${letterNumber}`, 105, 76, {
    align: "center",
  });

  doc.setFontSize(12);
  doc.setFont("Bookman Old Style", "normal");
  doc.text("Yang bertanda tangan di bawah ini, menerangkan bahwa :", 20, 93);

  let yPos = 105;
  const lineHeight = 7;

  doc.text("1.", 20, yPos);
  doc.text("Nama", 25, yPos);
  doc.text(": " + nama + " " + "(" + jenisKelamin + ")", 100, yPos);
  yPos += lineHeight;

  doc.text("2.", 20, yPos);
  doc.text("Tempat & tanggal lahir", 25, yPos);
  doc.text(": " + tempatLahir + ", " + tanggalLahir, 100, yPos);
  yPos += lineHeight;

  doc.text("3.", 20, yPos);
  doc.text("Kewarganegaraan & Agama", 25, yPos);
  doc.text(": Indonesia & " + agama, 100, yPos);
  yPos += lineHeight;

  doc.text("4.", 20, yPos);
  doc.text("Pekerjaan", 25, yPos);
  doc.text(": " + pekerjaan, 100, yPos);
  yPos += lineHeight;

  doc.text("5.", 20, yPos);
  doc.text("Tempat tinggal", 25, yPos);
  doc.text(
    ": Desa Kepohkencono, RT. " +
      tempatTinggal.rt +
      " RW. " +
      tempatTinggal.rw,
    100,
    yPos
  );
  yPos += lineHeight;

  doc.text("Kecamatan : Pucakwangi", 103, yPos);
  yPos += lineHeight;
  doc.text("Kabupaten : Pati", 103, yPos);
  yPos += lineHeight;
  doc.text("Propinsi : Jawa Tengah", 103, yPos);
  yPos += lineHeight;

  doc.text("6.", 20, yPos);
  doc.text("Surat Bukti Diri", 25, yPos);
  doc.text(": KTP  " + suratBuktiDiri.ktpNomor, 100, yPos);
  yPos += lineHeight;
  doc.text("KK No. " + suratBuktiDiri.kkNomor, 103, yPos);
  yPos += lineHeight;

  doc.text("7.", 20, yPos);
  doc.text("Keperluan", 25, yPos);

  const splitKeperluan = doc.splitTextToSize(keperluan, 80);
  doc.text(": " + splitKeperluan[0], 100, yPos);

  for (let i = 1; i < splitKeperluan.length; i++) {
    yPos += lineHeight;
    doc.text(splitKeperluan[i], 100, yPos);
  }
  yPos += lineHeight;

  doc.text("8.", 20, yPos);
  doc.text("Berlaku mulai", 25, yPos);
  doc.text(": " + berlakuMulai + " s/d " + berlakuSampai, 100, yPos);
  yPos += lineHeight;

  doc.text("9.", 20, yPos);
  doc.text("Keterangan lain-lain", 25, yPos);

  const splitKeterangan = doc.splitTextToSize(keteranganLain, 80);
  doc.text(": " + splitKeterangan[0], 100, yPos);

  for (let i = 1; i < splitKeterangan.length; i++) {
    yPos += lineHeight;
    doc.text(splitKeterangan[i], 100, yPos);
  }
  yPos += lineHeight * 2;

  doc.text(
    "Demikian untuk menjadikan maklum bagi yang berkepentingan",
    20,
    yPos
  );
  yPos += lineHeight * 2;

  doc.text("Tanda tangan pemegang", 20, yPos);
  doc.text("Mengetahui", 85, yPos);

  const today = new Date();
  const formattedDate = `Kepohkencono, ${today.getDate()} ${
    [
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
    ][today.getMonth()]
  } ${today.getFullYear()}`;

  doc.text(formattedDate, 140, yPos);
  yPos += lineHeight;

  doc.text("Camat Pucakwangi", 85, yPos);
  doc.text("Plt.Sekretaris Desa", 140, yPos);
  yPos += lineHeight;
  doc.text("Kepohkencono", 140, yPos);
  yPos += lineHeight * 5;

  doc.text("______________________", 20, yPos);
  doc.text("______________________", 85, yPos);
  doc.setFont("Bookman Old Style", "bold");
  doc.text("AGUS SUMANTO", 147, yPos);

  const nameWidth = doc.getTextWidth("AGUS SUMANTO");
  doc.setLineWidth(0.3);
  doc.line(147, yPos + 1, 147 + nameWidth, yPos + 1);

  yPos += lineHeight;
  doc.setFont("Bookman Old Style", "normal");
  doc.text("NIP. _______________", 85, yPos);

  return doc;
};

export const suratPengantarDesaFilename = (props: SuratPengantarDesaProps) =>
  "Surat_Keterangan_Pengantar_Desa_" + props.nama.replace(/ /g, "_") + ".pdf";

const generateSuratPengantarDesa = (
  props: SuratPengantarDesaProps
): Promise<GeneratedLetter | null> =>
  generateLetter("pengantar-desa", buildSuratPengantarDesaDoc, props, suratPengantarDesaFilename(props));

export default generateSuratPengantarDesa;
