import { jsPDF } from "jspdf";
import {
  generateLetter,
  getImgFromUrl,
  PREVIEW_LETTER_NUMBER,
  type GeneratedLetter,
} from "./shared";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export interface SuratIzinKeramaianProps {
  nama: string;
  jenisKelamin: string; // "Lk" atau "Pr"
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
  // Tambahan fields
  noHP: string; // Non-optional
  jabatan: string; // "Pemilik" atau "Panitia"
  keteranganAcara: {
    namaAcara: string; // Untuk mengisi "keramaian berupa (nama_acara) dan kegiatan"
    tanggalAcara: string;
    waktuAcara: string;
    tempatAcara: string;
    detailAcara: string; // Untuk mengisi bagian "Acara/Hajat"
  };
  // Data pemilik lokasi (required)
  pemilikLokasi: {
    nama: string;
    alamat: string;
    pekerjaan: string;
  };
}

/**
 * Komponen untuk menghasilkan PDF Surat Permohonan Izin Keramaian
 */
export const buildSuratIzinKeramaianDoc = async (
  props: SuratIzinKeramaianProps,
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
    noHP,
    jabatan,
    keteranganAcara,
    pemilikLokasi,
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
  doc.text("SURAT KETERANGAN PENGANTAR DESA", 105, 70, { align: "center" });
  const textWidth = doc.getTextWidth("SURAT KETERANGAN PENGANTAR DESA");
  doc.setLineWidth(0.5);
  doc.line(105 - textWidth / 2, 71, 105 + textWidth / 2, 71);
  doc.setFontSize(12);
  doc.setFont("Bookman Old Style", "normal");
  doc.text(`Nomor : 400.7.22.1 / ${letterNumber}`, 105, 76, {
    align: "center",
  });

  // Add content
  doc.setFontSize(10);
  doc.setFont("Bookman Old Style", "normal");
  doc.text("Yang bertanda tangan di bawah ini, menerangkan bahwa :", 20, 87);

  doc.setFont("Bookman Old Style", "normal");

  // Add user data
  let yPos = 97;
  const lineHeight = 7;

  // 1. Nama
  doc.text("1.", 20, yPos);
  doc.text("Nama", 25, yPos);
  doc.text(": " + nama + " " + "(" + jenisKelamin + ")", 100, yPos);
  yPos += lineHeight;

  // 2. Tempat & tanggal lahir
  doc.text("2.", 20, yPos);
  doc.text("Tempat & tanggal lahir", 25, yPos);
  doc.text(": " + tempatLahir + ", " + tanggalLahir, 100, yPos);
  yPos += lineHeight;

  // 3. Kewarganegaraan & Agama
  doc.text("3.", 20, yPos);
  doc.text("Kewarganegaraan & Agama", 25, yPos);
  doc.text(": Indonesia & " + agama, 100, yPos);
  yPos += lineHeight;

  // 4. Pekerjaan
  doc.text("4.", 20, yPos);
  doc.text("Pekerjaan", 25, yPos);
  doc.text(": " + pekerjaan, 100, yPos);
  yPos += lineHeight;

  // 5. Tempat tinggal
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

  // Kecamatan, Kabupaten, Propinsi
  doc.text("Kecamatan : Pucakwangi", 103, yPos);
  yPos += lineHeight;
  doc.text("Kabupaten : Pati", 103, yPos);
  yPos += lineHeight;
  doc.text("Propinsi : Jawa Tengah", 103, yPos);
  yPos += lineHeight;

  // 6. Surat Bukti Diri
  doc.text("6.", 20, yPos);
  doc.text("Surat Bukti Diri", 25, yPos);
  doc.text(": KTP  " + suratBuktiDiri.ktpNomor, 100, yPos);
  yPos += lineHeight;
  doc.text("KK No. " + suratBuktiDiri.kkNomor, 103, yPos);
  yPos += lineHeight;

  // 7. Keperluan - Using fixed text as requested
  doc.text("7.", 20, yPos);
  doc.text("Keperluan", 25, yPos);

  // Fixed keperluan text
  const fixedKeperluan =
    "Pengajuan Rekomendasi Kepada : \n - Kapolsek Pucakwangi \n - Koramil Pucakwangi \nUntuk Permohonan Ijin kegiatan Keramaian \nMasyarakat.";

  // Split keperluan into multiple lines with wider width and justified alignment
  const splitKeperluan = doc.splitTextToSize(fixedKeperluan, 170);
  doc.text(": " + splitKeperluan[0], 100, yPos, {
    maxWidth: 170,
    align: "justify",
  });

  // Add additional lines if keperluan is multi-line
  for (let i = 1; i < splitKeperluan.length; i++) {
    yPos += lineHeight;
    doc.text(splitKeperluan[i], 100, yPos, {
      maxWidth: 170,
      align: "justify",
    });
  }
  yPos += lineHeight;

  // 8. Berlaku mulai
  doc.text("8.", 20, yPos);
  doc.text("Berlaku mulai", 25, yPos);
  doc.text(": " + berlakuMulai + " s/d " + berlakuSampai, 100, yPos);
  yPos += lineHeight;

  // 9. Keterangan lain-lain - Using fixed text as requested
  doc.text("9.", 20, yPos);
  doc.text("Keterangan lain-lain", 25, yPos);

  // Fixed keterangan lain-lain text
  const fixedKeteranganLain =
    "Orang tersebut benar benar penduduk Desa Kepohkencono Kec.Pucakwangi Kab.Pati dan berkelakuan baik";

  // Split keterangan into multiple lines with wider width and justified alignment
  // const splitKeterangan = doc.splitTextToSize(fixedKeteranganLain, 170);
  doc.text(": " + fixedKeteranganLain, 100, yPos, {
    maxWidth: 90,
    align: "justify",
  });

  // Add additional lines if keterangan is multi-line
  // for (let i = 1; i < splitKeterangan.length; i++) {
  //   yPos += lineHeight;
  //   doc.text(splitKeterangan[i], 100, yPos, {
  //     maxWidth: 170,
  //     align: "justify",
  //   });
  // }

  // Add a new page just for the signature section (this will be page 2)
  // doc.addPage();

  // Set font for the signature page
  doc.setFont("Bookman Old Style", "normal");
  doc.setFontSize(10);

  // Add content for the signature section at the bottom of the page
  // A4 page height is 297mm, which is about 280 in jsPDF units
  let signaturePageY = 230; // Position near the bottom of the page
  const signatureLineHeight = 7;

  // Add closing statement on the signature section
  doc.text(
    "Demikian untuk menjadikan maklum bagi yang berkepentingan",
    20,
    signaturePageY - 5,
    { maxWidth: 170, align: "justify" }
  );
  signaturePageY += signatureLineHeight;

  // Add signature section
  doc.text("Tanda tangan pemegang", 20, signaturePageY);

  // Format tanggal untuk bagian tanda tangan
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

  doc.text(formattedDate, 122, signaturePageY);
  signaturePageY += signatureLineHeight;

  doc.text("Pj. Kepala Desa Kepohkencono", 120, signaturePageY);
  signaturePageY += signatureLineHeight * 4; // Reduced spacing for signatures

  // Add signature names
  doc.setFont("Bookman Old Style", "bold");
  // Fix text positioning to center the text under "Tanda tangan pemegang"
  const signatureText = "(" + nama.toUpperCase() + ")";
  // Calculate the center position under "Tanda tangan pemegang" (which starts at X=20)
  const signatureTextWidth = doc.getTextWidth(signatureText);
  const centerX =
    20 +
    doc.getTextWidth("Tanda tangan pemegang") / 2 -
    signatureTextWidth / 2;
  doc.text(signatureText, centerX, signaturePageY);
  doc.text("NGASIMAN,S.H.", 133, signaturePageY);

  // Add underline for NGASIMAN,S.H.
  const nameWidth = doc.getTextWidth("NGASIMAN,S.H.");
  doc.setLineWidth(0.3);
  doc.line(133, signaturePageY + 1, 133 + nameWidth, signaturePageY + 1);

  signaturePageY += signatureLineHeight;
  doc.setFont("Bookman Old Style", "normal");
  doc.text("NIP. 197006031992031007", 122, signaturePageY);

  // Add the original second page (now becomes the third page)
  doc.addPage();

  // Set font for the third page (original second page)
  doc.setFont("Bookman Old Style", "normal");
  doc.setFontSize(12);

  // Add content for the third page (original second page)
  let y2Pos = 20;
  const lineHeight2 = 7;

  // Perihal
  doc.text("Perihal : Surat Permohonan Ijin Keramaian", 20, y2Pos);
  y2Pos += lineHeight2 * 2;

  // Kepada Yth.
  doc.text("Kepada Yth.", 20, y2Pos);
  y2Pos += lineHeight2;
  doc.text("Bapak KAPOLSEK Pucakwangi", 20, y2Pos);
  y2Pos += lineHeight2;
  doc.text("di PATI", 20, y2Pos);
  y2Pos += lineHeight2 * 2;

  // Dengan Hormat
  doc.text("Dengan Hormat,", 20, y2Pos);
  y2Pos += lineHeight2;
  doc.text("Saya yang bertanda tangan di bawah ini  :", 20, y2Pos);
  y2Pos += lineHeight2 + 2;

  // Personal information
  doc.text("Nama", 20, y2Pos);
  doc.text(":", 80, y2Pos);
  doc.text(nama, 85, y2Pos);
  y2Pos += lineHeight2;

  doc.text("Tempat, tanggal lahir", 20, y2Pos);
  doc.text(":", 80, y2Pos);
  doc.text(tempatLahir + ", " + tanggalLahir, 85, y2Pos);
  y2Pos += lineHeight2;

  doc.text("Pekerjaan", 20, y2Pos);
  doc.text(":", 80, y2Pos);
  doc.text(pekerjaan, 85, y2Pos);
  y2Pos += lineHeight2;

  doc.text("Alamat", 20, y2Pos);
  doc.text(":", 80, y2Pos);
  doc.text(
    "Desa Kepohkencono, RT. " + tempatTinggal.rt + " RW. " + tempatTinggal.rw,
    85,
    y2Pos
  );
  y2Pos += lineHeight2;

  doc.text("Jabatan", 20, y2Pos);
  doc.text(":", 80, y2Pos);
  doc.text(
    jabatan === "Pemilik"
      ? "Pemilik Hajat Keramaian"
      : "Panitia Hajat Keramaian",
    85,
    y2Pos
  );
  y2Pos += lineHeight2;

  doc.text("No.HP", 20, y2Pos);
  doc.text(":", 80, y2Pos);
  doc.text(noHP, 85, y2Pos);
  y2Pos += lineHeight2 * 2;

  // Application text
  const applicationText = `Bersama Surat Permohonan ini kami mengajukan permohonan untuk ijin mengadakan rangkaian kegiatan keramaian berupa (${
    keteranganAcara?.namaAcara || "Acara"
  }) dan kegiatan tersebut akan kami laksanakan pada :`;
  const splitApplicationText = doc.splitTextToSize(applicationText, 170);
  doc.text(splitApplicationText, 20, y2Pos, {
    maxWidth: 170,
    align: "justify",
  });
  y2Pos += lineHeight2 * splitApplicationText.length - 2;

  // Event details
  doc.text("Hari, tanggal", 20, y2Pos);
  doc.text(":", 80, y2Pos);
  doc.text(keteranganAcara?.tanggalAcara || berlakuMulai, 85, y2Pos);
  y2Pos += lineHeight2;

  doc.text("Waktu", 20, y2Pos);
  doc.text(":", 80, y2Pos);
  doc.text(keteranganAcara?.waktuAcara || "", 85, y2Pos);
  y2Pos += lineHeight2;

  doc.text("Tempat", 20, y2Pos);
  doc.text(":", 80, y2Pos);
  doc.text(keteranganAcara?.tempatAcara || "", 85, y2Pos);
  y2Pos += lineHeight2;

  doc.text("Acara/Hajat", 20, y2Pos);
  doc.text(":", 80, y2Pos);
  doc.text(
    keteranganAcara?.detailAcara || "Kegiatan Keramaian Masyarakat",
    85,
    y2Pos
  );
  y2Pos += lineHeight2 * 2;

  // Closing statement
  const closingText =
    "Demikian Surat Permohonan Ijin saya sampaikan kepada bapak beserta Surat Pernyataan sebagaimana terlampir, dan atas pemberian ijinnya kami ucapkan terimakasih.";
  const splitClosingText = doc.splitTextToSize(closingText, 170);
  doc.text(splitClosingText, 20, y2Pos, { maxWidth: 170, align: "justify" });
  y2Pos += lineHeight2 * splitClosingText.length;
  y2Pos += lineHeight2 * 2;

  // Signatures
  doc.text("Mengetahui", 40, y2Pos);
  doc.text(
    "Kepohkencono, " + format(new Date(), "dd MMMM yyyy", { locale: id }),
    120,
    y2Pos
  );
  y2Pos += lineHeight2;

  doc.text("Pj.Kepala Desa Kepohkencono", 20, y2Pos);
  doc.text("Yang Membuat Permohonan", 120, y2Pos);
  y2Pos += lineHeight2 * 5;

  doc.setFont("Bookman Old Style", "bold");
  doc.text("NGASIMAN,S.H.", 35, y2Pos);

  // Add underline for NGASIMAN,S.H. on second page
  const nameWidth2 = doc.getTextWidth("NGASIMAN,S.H.");
  doc.setLineWidth(0.3);
  doc.line(35, y2Pos + 1, 35 + nameWidth2, y2Pos + 1);

  // Center the applicant name under "Yang Membuat Permohonan"
  const applicantName = "(" + nama.toUpperCase() + ")";
  const applicantWidth = doc.getTextWidth(applicantName);
  const centerX2 =
    120 +
    doc.getTextWidth("Yang Membuat Permohonan") / 2 -
    applicantWidth / 2;
  doc.text(applicantName, centerX2, y2Pos);

  y2Pos += lineHeight2;

  doc.setFont("Bookman Old Style", "normal");
  doc.text("NIP.197006031992031007", 25, y2Pos);

  // Add a third page with the same content as the second page but addressed to Kapolsek
  doc.addPage();

  // Set font for the third page
  doc.setFont("Bookman Old Style", "normal");
  doc.setFontSize(12);

  // Add content for the third page
  let y3Pos = 20;
  const lineHeight3 = 7;

  // Perihal
  doc.text("Perihal : Surat Permohonan Ijin Keramaian", 20, y3Pos);
  y3Pos += lineHeight3 * 2;

  // Kepada Yth.
  doc.text("Kepada Yth.", 20, y3Pos);
  y3Pos += lineHeight3;

  // Always set this to Danramil for the third page
  doc.text("Bapak Danramil Pucakwangi", 20, y3Pos);

  y3Pos += lineHeight3;
  doc.text("di PATI", 20, y3Pos);
  y3Pos += lineHeight3 * 2;

  // Dengan Hormat
  doc.text("Dengan Hormat,", 20, y3Pos);
  y3Pos += lineHeight3;
  doc.text("Saya yang bertanda tangan di bawah ini  :", 20, y3Pos);
  y3Pos += lineHeight3 + 2;

  // Personal information
  doc.text("Nama", 20, y3Pos);
  doc.text(":", 80, y3Pos);
  doc.text(nama, 85, y3Pos);
  y3Pos += lineHeight3;

  doc.text("Tempat, tanggal lahir", 20, y3Pos);
  doc.text(":", 80, y3Pos);
  doc.text(tempatLahir + ", " + tanggalLahir, 85, y3Pos);
  y3Pos += lineHeight3;

  doc.text("Pekerjaan", 20, y3Pos);
  doc.text(":", 80, y3Pos);
  doc.text(pekerjaan, 85, y3Pos);
  y3Pos += lineHeight3;

  doc.text("Alamat", 20, y3Pos);
  doc.text(":", 80, y3Pos);
  doc.text(
    "Desa Kepohkencono, RT. " + tempatTinggal.rt + " RW. " + tempatTinggal.rw,
    85,
    y3Pos
  );
  y3Pos += lineHeight3;

  doc.text("Jabatan", 20, y3Pos);
  doc.text(":", 80, y3Pos);
  doc.text(
    jabatan === "Pemilik"
      ? "Pemilik Hajat Keramaian"
      : "Panitia Hajat Keramaian",
    85,
    y3Pos
  );
  y3Pos += lineHeight3;

  doc.text("No.HP", 20, y3Pos);
  doc.text(":", 80, y3Pos);
  doc.text(noHP, 85, y3Pos);
  y3Pos += lineHeight3 * 2;

  // Application text
  const applicationText3 = `Bersama Surat Permohonan ini kami mengajukan permohonan untuk ijin mengadakan rangkaian kegiatan keramaian berupa (${
    keteranganAcara?.namaAcara || "Acara"
  }) dan kegiatan tersebut akan kami laksanakan pada :`;
  const splitApplicationText3 = doc.splitTextToSize(applicationText3, 170);
  doc.text(splitApplicationText3, 20, y3Pos, {
    maxWidth: 170,
    align: "justify",
  });
  y3Pos += lineHeight3 * splitApplicationText.length - 2;

  // Event details
  doc.text("Hari, tanggal", 20, y3Pos);
  doc.text(":", 80, y3Pos);
  doc.text(keteranganAcara?.tanggalAcara || berlakuMulai, 85, y3Pos);
  y3Pos += lineHeight3;

  doc.text("Waktu", 20, y3Pos);
  doc.text(":", 80, y3Pos);
  doc.text(keteranganAcara?.waktuAcara || "", 85, y3Pos);
  y3Pos += lineHeight3;

  doc.text("Tempat", 20, y3Pos);
  doc.text(":", 80, y3Pos);
  doc.text(keteranganAcara?.tempatAcara || "", 85, y3Pos);
  y3Pos += lineHeight3;

  doc.text("Acara/Hajat", 20, y3Pos);
  doc.text(":", 80, y3Pos);
  doc.text(
    keteranganAcara?.detailAcara || "Kegiatan Keramaian Masyarakat",
    85,
    y3Pos
  );
  y3Pos += lineHeight3 * 2;

  // Closing statement
  const closingText3 =
    "Demikian Surat Permohonan Ijin saya sampaikan kepada bapak beserta Surat Pernyataan sebagaimana terlampir, dan atas pemberian ijinnya kami ucapkan terimakasih.";
  const splitClosingText3 = doc.splitTextToSize(closingText3, 170);
  doc.text(splitClosingText3, 20, y3Pos, { maxWidth: 170, align: "justify" });
  y3Pos += lineHeight3 * splitClosingText3.length;
  y3Pos += lineHeight3 * 2;

  // Signatures
  doc.text("Mengetahui", 40, y3Pos);
  doc.text(
    "Kepohkencono, " + format(new Date(), "dd MMMM yyyy", { locale: id }),
    120,
    y3Pos
  );
  y3Pos += lineHeight3;

  doc.text("Pj.Kepala Desa Kepohkencono", 20, y3Pos);
  doc.text("Yang Membuat Permohonan", 120, y3Pos);
  y3Pos += lineHeight3 * 5;

  doc.setFont("Bookman Old Style", "bold");
  doc.text("NGASIMAN,S.H.", 35, y3Pos);

  // Add underline for NGASIMAN,S.H. on third page
  const nameWidth3 = doc.getTextWidth("NGASIMAN,S.H.");
  doc.setLineWidth(0.3);
  doc.line(35, y3Pos + 1, 35 + nameWidth3, y3Pos + 1);

  // Center the applicant name under "Yang Membuat Permohonan"
  const applicantName3 = "(" + nama.toUpperCase() + ")";
  const applicantWidth3 = doc.getTextWidth(applicantName3);
  const centerX3 =
    120 +
    doc.getTextWidth("Yang Membuat Permohonan") / 2 -
    applicantWidth3 / 2;
  doc.text(applicantName3, centerX3, y3Pos);

  y3Pos += lineHeight3;

  doc.setFont("Bookman Old Style", "normal");
  doc.text("NIP.197006031992031007", 25, y3Pos);

  // Add a fourth page with the property owner's permission letter
  doc.addPage();

  // Set font for the fourth page
  doc.setFont("Bookman Old Style", "bold");
  doc.setFontSize(14);

  // Add title for the fourth page
  doc.text("SURAT KETERANGAN / IJIN TEMPAT LOKASI KEGIATAN", 105, 20, {
    align: "center",
  });
  const titleWidth = doc.getTextWidth(
    "SURAT KETERANGAN / IJIN TEMPAT LOKASI KEGIATAN"
  );
  doc.setLineWidth(0.5);
  doc.line(105 - titleWidth / 2, 21, 105 + titleWidth / 2, 21);

  // Reset font to normal
  doc.setFont("Bookman Old Style", "normal");
  doc.setFontSize(12);

  let y4Pos = 40;
  const lineHeight4 = 7;

  // Introduction
  doc.text("Saya yang bertandatangan di bawah ini :", 20, y4Pos);
  y4Pos += lineHeight4 * 2 - 5;

  // Property owner information
  doc.text("Nama", 20, y4Pos);
  doc.text(":", 100, y4Pos);
  doc.text(pemilikLokasi?.nama || "", 105, y4Pos);
  y4Pos += lineHeight4;

  doc.text("Alamat", 20, y4Pos);
  doc.text(":", 100, y4Pos);
  doc.text(pemilikLokasi?.alamat || "", 105, y4Pos);
  y4Pos += lineHeight4;

  doc.text("Pekerjaan", 20, y4Pos);
  doc.text(":", 100, y4Pos);
  doc.text(pemilikLokasi?.pekerjaan || "", 105, y4Pos);
  y4Pos += lineHeight4 * 2;

  // Statement text
  const statementText = `adalah pemilik tempat / lokasi kegiatan keramaian acara (${
    keteranganAcara?.namaAcara || "____"
  }) yang diselenggarakana oleh :`;
  const splitStatementText = doc.splitTextToSize(statementText, 170);
  doc.text(splitStatementText, 20, y4Pos, {
    maxWidth: 170,
    align: "justify",
  });
  y4Pos += lineHeight4 * 2;

  // Applicant information
  doc.text("Nama", 20, y4Pos);
  doc.text(":", 100, y4Pos);
  doc.text(nama, 105, y4Pos);
  y4Pos += lineHeight4;

  doc.text("Tempat, tanggal lahir", 20, y4Pos);
  doc.text(":", 100, y4Pos);
  doc.text(tempatLahir + ", " + tanggalLahir, 105, y4Pos);
  y4Pos += lineHeight4;

  doc.text("Alamat", 20, y4Pos);
  doc.text(":", 100, y4Pos);
  doc.text(
    "Desa Kepohkencono, RT. " + tempatTinggal.rt + " RW. " + tempatTinggal.rw,
    105,
    y4Pos
  );
  y4Pos += lineHeight4;

  doc.text("Pekerjaan", 20, y4Pos);
  doc.text(":", 100, y4Pos);
  doc.text(pekerjaan, 105, y4Pos);
  y4Pos += lineHeight4 * 2;

  // Event information
  const eventInfoText = `Yang akan melaksanakan kegiatan (${
    keteranganAcara?.namaAcara || "Acara"
  }) dan kegiatan tersebut akan kami laksanakan pada :`;
  const splitEventInfoText = doc.splitTextToSize(eventInfoText, 170);
  doc.text(splitEventInfoText, 20, y4Pos, {
    maxWidth: 170,
    align: "justify",
  });
  y4Pos += lineHeight4 * 2;

  doc.text("Hari,tanggal", 20, y4Pos);
  doc.text(":", 100, y4Pos);
  doc.text(keteranganAcara?.tanggalAcara || berlakuMulai, 105, y4Pos);
  y4Pos += lineHeight4;

  doc.text("Waktu", 20, y4Pos);
  doc.text(":", 100, y4Pos);
  doc.text(keteranganAcara?.waktuAcara || "", 105, y4Pos);
  y4Pos += lineHeight4;

  doc.text("Tempat", 20, y4Pos);
  doc.text(":", 100, y4Pos);
  doc.text(keteranganAcara?.tempatAcara || "", 105, y4Pos);
  y4Pos += lineHeight4;

  doc.text("Acara/Hajat", 20, y4Pos);
  doc.text(":", 100, y4Pos);
  doc.text(
    keteranganAcara?.detailAcara || "Kegiatan Keramaian Masyarakat",
    105,
    y4Pos
  );
  y4Pos += lineHeight4 * 2;

  // Closing statement
  const closingText4 =
    "Dengan ini memberikan Ijin Tempat lokasi untuk acara kegiatan dimaksud. Demikian Surat Keterangan yang kami buat untuk dapat dipergunakan sebagaimana mestinya.";
  const splitClosingText4 = doc.splitTextToSize(closingText4, 170);
  doc.text(splitClosingText4, 20, y4Pos, { maxWidth: 170, align: "justify" });
  y4Pos += lineHeight4 * splitClosingText4.length;
  y4Pos += lineHeight4 * 3;

  // Add formatted date
  doc.text(
    "Kepohkencono, " + format(new Date(), "dd MMMM yyyy", { locale: id }),
    120,
    y4Pos
  );
  y4Pos += lineHeight4;

  // Signature
  doc.text("Yang Memberikan Ijin Lokasi", 120, y4Pos);
  y4Pos += lineHeight4 * 5;

  // Property owner's signature
  doc.setFont("Bookman Old Style", "bold");
  const ownerName =
    "(" +
    (pemilikLokasi?.nama
      ? pemilikLokasi.nama.toUpperCase()
      : "........................") +
    ")";
  const ownerNameWidth = doc.getTextWidth(ownerName);
  const centerX4Owner =
    120 +
    doc.getTextWidth("Yang Memberikan Ijin Lokasi") / 2 -
    ownerNameWidth / 2;
  doc.text(ownerName, centerX4Owner, y4Pos);
  doc.setFont("Bookman Old Style", "normal");

  // Add a fourth page with DENAH LOKASI KERAMAIAN
  doc.addPage();

  // Set font for the fourth page
  doc.setFont("Bookman Old Style", "bold");
  doc.setFontSize(14);

  // Add title for the fourth page with underline
  doc.text("DENAH LOKASI KERAMAIAN", 105, 20, {
    align: "center",
  });
  const titleWidthMap = doc.getTextWidth("DENAH LOKASI KERAMAIAN");
  doc.setLineWidth(0.5);
  doc.line(105 - titleWidthMap / 2, 21, 105 + titleWidthMap / 2, 21);

  // Reset font to normal
  doc.setFont("Bookman Old Style", "normal");
  doc.setFontSize(12);

  let y4MapPos = 40;
  const lineHeight4Map = 7;

  // Add location information
  doc.text("NAMA PENANGGUNG JAWAB", 20, y4MapPos);
  doc.text(":", 85, y4MapPos);
  doc.text(nama, 90, y4MapPos);
  y4MapPos += lineHeight4Map;

  doc.text("DESA", 20, y4MapPos);
  doc.text(":", 85, y4MapPos);
  doc.text("KEPOHKENCONO", 90, y4MapPos);
  y4MapPos += lineHeight4Map;

  doc.text("TEMPAT", 20, y4MapPos);
  doc.text(":", 85, y4MapPos);
  doc.text(keteranganAcara?.tempatAcara || "", 90, y4MapPos);
  y4MapPos += lineHeight4Map * 3;

  // Add the map image
  try {
    const mapImageUrl = "/peta_kepohkencono.jpg";
    const mapImageData = await getImgFromUrl(mapImageUrl);

    // Calculate dimensions to maintain aspect ratio while fitting on the page
    const imgWidth = 160;
    const imgHeight = 120;

    // Center the image horizontally
    const xPos = (210 - imgWidth) / 2;

    doc.addImage(mapImageData, "JPEG", xPos, y4MapPos, imgWidth, imgHeight);

    // Add space after the image for signature section
    y4MapPos += imgHeight + 20;

    // Signatures
    doc.text("Mengetahui", 40, y4MapPos);
    doc.text(
      "Kepohkencono, " + format(new Date(), "dd MMMM yyyy", { locale: id }),
      120,
      y4MapPos
    );
    y4MapPos += lineHeight4Map;

    doc.text("Pj.Kepala Desa Kepohkencono", 20, y4MapPos);
    doc.text("Yang Membuat Permohonan", 120, y4MapPos);
    y4MapPos += lineHeight4Map * 5;

    doc.setFont("Bookman Old Style", "bold");
    doc.text("NGASIMAN,S.H.", 35, y4MapPos);

    // Add underline for NGASIMAN,S.H.
    const nameWidth2 = doc.getTextWidth("NGASIMAN,S.H.");
    doc.setLineWidth(0.3);
    doc.line(35, y4MapPos + 1, 35 + nameWidth2, y4MapPos + 1);

    // Center the applicant name under "Yang Membuat Permohonan"
    const applicantName = "(" + nama.toUpperCase() + ")";
    const applicantWidth = doc.getTextWidth(applicantName);
    const centerX4Map =
      120 +
      doc.getTextWidth("Yang Membuat Permohonan") / 2 -
      applicantWidth / 2;
    doc.text(applicantName, centerX4Map, y4MapPos);

    y4MapPos += lineHeight4Map;

    doc.setFont("Bookman Old Style", "normal");
    doc.text("NIP.197006031992031007", 25, y4MapPos);
  } catch (error) {
    console.error("Gagal memuat gambar peta:", error);

    // Add space for signature section even if image fails to load
    y4MapPos += 120;

    // Signatures
    doc.text("Mengetahui", 40, y4MapPos);
    doc.text(
      "Kepohkencono, " + format(new Date(), "dd MMMM yyyy", { locale: id }),
      120,
      y4MapPos
    );
    y4MapPos += lineHeight4Map;

    doc.text("Pj.Kepala Desa Kepohkencono", 20, y4MapPos);
    doc.text("Yang Membuat Permohonan", 120, y4MapPos);
    y4MapPos += lineHeight4Map * 5;

    doc.setFont("Bookman Old Style", "bold");
    doc.text("NGASIMAN,S.H.", 35, y4MapPos);

    // Add underline for NGASIMAN,S.H.
    const nameWidth2 = doc.getTextWidth("NGASIMAN,S.H.");
    doc.setLineWidth(0.3);
    doc.line(35, y4MapPos + 1, 35 + nameWidth2, y4MapPos + 1);

    // Center the applicant name under "Yang Membuat Permohonan"
    const applicantName = "(" + nama.toUpperCase() + ")";
    const applicantWidth = doc.getTextWidth(applicantName);
    const centerX4Map =
      120 +
      doc.getTextWidth("Yang Membuat Permohonan") / 2 -
      applicantWidth / 2;
    doc.text(applicantName, centerX4Map, y4MapPos);

    y4MapPos += lineHeight4Map;

    doc.setFont("Bookman Old Style", "normal");
    doc.text("NIP.197006031992031007", 25, y4MapPos);
  }

  // Add a fifth page with the SURAT PERNYATAAN
  doc.addPage();

  // Set font for the fifth page
  doc.setFont("Bookman Old Style", "bold");
  doc.setFontSize(14);

  // Add title for the fifth page
  doc.text("SURAT PERNYATAAN", 105, 20, {
    align: "center",
  });
  const titleWidth5 = doc.getTextWidth("SURAT PERNYATAAN");
  doc.setLineWidth(0.5);
  doc.line(105 - titleWidth5 / 2, 21, 105 + titleWidth5 / 2, 21);

  // Reset font to normal
  doc.setFont("Bookman Old Style", "normal");
  doc.setFontSize(12);

  let y5Pos = 40;
  const lineHeight5 = 7;

  // Introduction
  doc.text(
    `Yang bertanda tangan di bawah ini Saya Pemilik Hajat / Panitia Hajat :`,
    20,
    y5Pos
  );
  y5Pos += lineHeight5 * 2 - 5;

  // Personal information
  doc.text("Nama", 20, y5Pos);
  doc.text(":", 100, y5Pos);
  doc.text(nama, 105, y5Pos);
  y5Pos += lineHeight5;

  doc.text("Tempat, tanggal lahir", 20, y5Pos);
  doc.text(":", 100, y5Pos);
  doc.text(tempatLahir + ", " + tanggalLahir, 105, y5Pos);
  y5Pos += lineHeight5;

  doc.text("Alamat", 20, y5Pos);
  doc.text(":", 100, y5Pos);
  doc.text(
    "Desa Kepohkencono, RT. " + tempatTinggal.rt + " RW. " + tempatTinggal.rw,
    105,
    y5Pos
  );
  y5Pos += lineHeight5;

  doc.text("Pekerjaan", 20, y5Pos);
  doc.text(":", 100, y5Pos);
  doc.text(pekerjaan, 105, y5Pos);
  y5Pos += lineHeight5 * 2;

  // Statement
  doc.text("Menyatakan dengan sesungguhnya bahwa sanggup :", 20, y5Pos);
  y5Pos += lineHeight5 * 2;

  // Points
  doc.text("1.", 20, y5Pos);
  doc.text("Sanggup menjaga keamanan dan ketertiban umum", 30, y5Pos);
  y5Pos += lineHeight5;

  doc.text("2.", 20, y5Pos);
  doc.text(
    "Patuh dan taat terhadap aturan yang sudah di tentukan",
    30,
    y5Pos
  );
  y5Pos += lineHeight5 * 2;

  // Closing statement
  const closingText5 =
    "Demikian Surat Pernyataan ini di buat untuk Pengajuan Rekomendasi Ijin Keramaian Masyarakat, atas terkabulnya pengajuan ini kami ucapkan banyak terimakasih.";
  const splitClosingText5 = doc.splitTextToSize(closingText5, 170);
  doc.text(splitClosingText5, 20, y5Pos, { maxWidth: 170, align: "justify" });
  y5Pos += lineHeight5 * splitClosingText5.length;
  y5Pos += lineHeight5 * 3;

  // Signatures - same as 2nd page
  doc.text("Mengetahui", 40, y5Pos);
  doc.text(
    "Kepohkencono, " + format(new Date(), "dd MMMM yyyy", { locale: id }),
    120,
    y5Pos
  );
  y5Pos += lineHeight5;

  doc.text("Pj.Kepala Desa Kepohkencono", 20, y5Pos);
  doc.text("Yang Membuat Permohonan", 120, y5Pos);
  y5Pos += lineHeight5 * 5;

  doc.setFont("Bookman Old Style", "bold");
  doc.text("NGASIMAN,S.H.", 35, y5Pos);

  // Add underline for NGASIMAN,S.H.
  const nameWidth5 = doc.getTextWidth("NGASIMAN,S.H.");
  doc.setLineWidth(0.3);
  doc.line(35, y5Pos + 1, 35 + nameWidth5, y5Pos + 1);

  // Center the applicant name under "Yang Membuat Permohonan"
  const applicantName5 = "(" + nama.toUpperCase() + ")";
  const applicantWidth5 = doc.getTextWidth(applicantName5);
  const centerX5 =
    120 +
    doc.getTextWidth("Yang Membuat Permohonan") / 2 -
    applicantWidth5 / 2;
  doc.text(applicantName5, centerX5, y5Pos);

  y5Pos += lineHeight5;

  doc.setFont("Bookman Old Style", "normal");
  doc.text("NIP.197006031992031007", 25, y5Pos);

  return doc;
};

export const suratIzinKeramaianFilename = (props: SuratIzinKeramaianProps) =>
  "Surat_Permohonan_Izin_Keramaian_" + props.nama.replace(/ /g, "_") + ".pdf";

/**
 * Mengambil nomor surat berikutnya, membuat PDF, lalu mengunduhnya.
 */
const generateSuratIzinKeramaian = (
  props: SuratIzinKeramaianProps
): Promise<GeneratedLetter | null> =>
  generateLetter("izin-keramaian", buildSuratIzinKeramaianDoc, props, suratIzinKeramaianFilename(props));

export default generateSuratIzinKeramaian;
