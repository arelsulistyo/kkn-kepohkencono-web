import generateSuratDomisili from './SuratDomisili';
import generateSuratKeteranganUsaha from './SuratKeteranganUsaha';
import generateSuratPengantarDesa from './SuratPengantarDesa';
import generateSuratIzinKeramaian from './SuratIzinKeramaian';
import generateSuratKematian from './SuratKematian';
import generateSuratKelahiran from './SuratKelahiran';
import generateSuratTidakMampu from './SuratTidakMampu';

// Ekspor semua template surat
export {
  generateSuratDomisili,
  generateSuratKeteranganUsaha,
  generateSuratPengantarDesa,
  generateSuratIzinKeramaian,
  generateSuratKematian,
  generateSuratKelahiran,
  generateSuratTidakMampu
};

// Tipe untuk template surat
export type SuratTemplateType = 'domisili' | 'usaha' | 'tidak-mampu' | 'kelahiran' | 'kematian' | 'pengantar-desa' | 'izin-keramaian';

// Fungsi untuk mendapatkan template surat berdasarkan tipe
export const getSuratTemplate = async (type: SuratTemplateType) => {
  switch (type) {
    case 'domisili':
      return generateSuratDomisili;
    case 'usaha':
      return generateSuratKeteranganUsaha;
    case 'pengantar-desa':
      return generateSuratPengantarDesa;
    case 'izin-keramaian':
      return generateSuratIzinKeramaian;
    case 'kematian':
      return generateSuratKematian;
    case 'kelahiran':
      return generateSuratKelahiran;
    case 'tidak-mampu':
      return generateSuratTidakMampu;
    // Tambahkan case untuk template surat lainnya di masa depan
    // dll.
    default:
      throw new Error(`Template surat untuk tipe ${type} belum tersedia`);
  }
};