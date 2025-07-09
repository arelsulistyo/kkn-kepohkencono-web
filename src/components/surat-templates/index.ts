import generateSuratDomisili from './SuratDomisili';

// Ekspor semua template surat
export {
  generateSuratDomisili
};

// Tipe untuk template surat
export type SuratTemplateType = 'domisili' | 'skck' | 'usaha' | 'tidak-mampu' | 'kelahiran' | 'kematian';

// Fungsi untuk mendapatkan template surat berdasarkan tipe
export const getSuratTemplate = async (type: SuratTemplateType) => {
  switch (type) {
    case 'domisili':
      return generateSuratDomisili;
    // Tambahkan case untuk template surat lainnya di masa depan
    // case 'skck':
    //   return generateSuratSKCK;
    // case 'usaha':
    //   return generateSuratUsaha;
    // dll.
    default:
      throw new Error(`Template surat untuk tipe ${type} belum tersedia`);
  }
};