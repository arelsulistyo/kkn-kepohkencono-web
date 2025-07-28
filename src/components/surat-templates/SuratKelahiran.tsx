import { jsPDF } from "jspdf";
import { callAddFont } from "@/fonts/Bookman Old Style-normal.js";
import { callAddFontBold } from "@/fonts/Bookman Old Style-bold.js";
import { getNextLetterNumber } from "@/lib/firebase";

interface SuratKelahiranProps {
  // Data pemohon
  namaPemohon: string;
  tempatLahirPemohon: string;
  tanggalLahirPemohon: string;
  jenisKelaminPemohon: string; // "L" atau "P"
  pekerjaanPemohon: string;
  alamatPemohon: string;
  // Data anak
  namaAnak: string;
  tempatLahirAnak: string;
  tanggalLahirAnak: string;
  jenisKelaminAnak: string; // "L" atau "P"
  agamaAnak: string;
  alamatAnak: string;
  // Data orang tua
  namaAyah: string;
  namaIbu: string;
}

/**
 * Fungsi untuk mengkonversi URL gambar ke base64
 */
const getImgFromUrl = (imgUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // Penting untuk gambar dari domain lain

    img.onload = () => {
      // Buat canvas untuk mengkonversi gambar ke base64
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      // Konversi ke base64
      const dataUrl = canvas.toDataURL("image/png");
      resolve(dataUrl);
    };

    img.onerror = () => {
      reject(new Error("Gagal memuat gambar"));
    };

    img.src = imgUrl;
  });
};

/**
 * Komponen untuk menghasilkan PDF Surat Keterangan Kelahiran
 */
const generateSuratKelahiran = async (
  props: SuratKelahiranProps
): Promise<boolean> => {
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

  try {
    // Get the next letter number for this template
    const letterNumber = await getNextLetterNumber("kelahiran");

    // Buat instance jsPDF
    const doc = new jsPDF();
    jsPDF.API.events.push(["addFonts", callAddFont, callAddFontBold]);

    // Set font ke Bookman Old Style
    doc.setFont("Bookman Old Style", "normal");

    // Coba untuk mendapatkan gambar kop surat
    try {
      // Gunakan gambar kop surat dari folder public
      const kopSuratDataUrl = await getImgFromUrl("/kop_kepohkencono.png");

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
    doc.text("SURAT KETERANGAN KELAHIRAN", 105, 70, { align: "center" });
    const textWidth = doc.getTextWidth("SURAT KETERANGAN KELAHIRAN");
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

    // Keterangan kelahiran
    doc.text("Bahwa benar telah lahir seorang anak:", 20, yPos);
    yPos += lineHeight * 1.5;

    // Nama Anak
    doc.text("Nama", 20, yPos);
    doc.text(": " + namaAnak, 100, yPos);
    yPos += lineHeight;

    // Tempat tanggal lahir Anak
    doc.text("Tempat tanggal lahir", 20, yPos);
    doc.text(": " + tempatLahirAnak + ", " + tanggalLahirAnak, 100, yPos);
    yPos += lineHeight;

    // Jenis kelamin Anak
    doc.text("Jenis kelamin", 20, yPos);
    doc.text(": " + jenisKelaminAnak, 100, yPos);
    yPos += lineHeight;

    // Agama Anak
    doc.text("Agama", 20, yPos);
    doc.text(": " + agamaAnak, 100, yPos);
    yPos += lineHeight;

    // Alamat Anak
    doc.text("Alamat", 20, yPos);
    doc.text(": " + alamatAnak, 100, yPos);
    yPos += lineHeight * 1.5;

    // Orang tua
    doc.text("Orang tersebut merupakan anak dari:", 20, yPos);
    yPos += lineHeight * 1.5;

    // Nama ayah
    doc.text("Nama ayah", 20, yPos);
    doc.text(": " + namaAyah, 100, yPos);
    yPos += lineHeight;

    // Nama ibu
    doc.text("Nama ibu", 20, yPos);
    doc.text(": " + namaIbu, 100, yPos);
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

    // Calculate signature position based on closing statement position
    const signatureY = yPos + 15; // Add space after closing statement

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

    // Save the PDF with cross-platform compatibility
    const filename = "Surat_Keterangan_Kelahiran_" + namaAnak.replace(/ /g, "_") + ".pdf";
    
    // Use blob approach for better cross-platform compatibility
    const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    
    // Create a temporary download link
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = filename;
    downloadLink.style.display = 'none';
    
    // Add to DOM, click, and remove
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    // Clean up the URL object
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);

    // Return success
    return true;
  } catch (error) {
    console.error("Gagal membuat PDF:", error);
    return false;
  }
};

export default generateSuratKelahiran;
