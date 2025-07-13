import generateSuratDomisili from './SuratDomisili';
import generateSuratKeteranganUsaha from './SuratKeteranganUsaha';
import generateSuratPengantarDesa from './SuratPengantarDesa';

// Ekspor semua template surat
export {
  generateSuratDomisili,
  generateSuratKeteranganUsaha,
  generateSuratPengantarDesa
};

// Tipe untuk template surat
export type SuratTemplateType = 'domisili' | 'skck' | 'usaha' | 'tidak-mampu' | 'kelahiran' | 'kematian' | 'pengantar-desa';

// Fungsi untuk mendapatkan template surat berdasarkan tipe
export const getSuratTemplate = async (type: SuratTemplateType) => {
  switch (type) {
    case 'domisili':
      return generateSuratDomisili;
    case 'usaha':
      return generateSuratKeteranganUsaha;
    case 'pengantar-desa':
      return generateSuratPengantarDesa;
    // Tambahkan case untuk template surat lainnya di masa depan
    // case 'skck':
    //   return generateSuratSKCK;
    // dll.
    default:
      throw new Error(`Template surat untuk tipe ${type} belum tersedia`);
  }
};