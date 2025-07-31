export interface Service {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  estimatedTime: string;
  status: string;
  category: string;
  categoryColor: string;
}

export const services: Service[] = [
  {
    id: "domisili",
    title: "Surat Keterangan Domisili",
    description: "Surat yang menyatakan tempat tinggal/domisili seseorang",
    requirements: ["KTP Asli", "Kartu Keluarga", "Surat Pengantar RT/RW"],
    estimatedTime: "1-2 Hari Kerja",
    status: "Tersedia",
    category: "Personal",
    categoryColor: "bg-green-100 text-green-800",
  },
  {
    id: "pengantar-desa",
    title: "Surat Keterangan Pengantar Desa",
    description:
      "Surat pengantar dari desa untuk berbagai keperluan administratif",
    requirements: ["KTP Asli", "Kartu Keluarga", "Surat Pengantar RT/RW"],
    estimatedTime: "1 Hari Kerja",
    status: "Tersedia",
    category: "Administratif",
    categoryColor: "bg-green-100 text-green-800",
  },
  {
    id: "izin-keramaian",
    title: "Surat Permohonan Izin Keramaian",
    description:
      "Surat izin untuk mengadakan acara atau kegiatan yang melibatkan banyak orang",
    requirements: [
      "KTP Asli",
      "Kartu Keluarga",
      "Surat Pengantar RT/RW",
      "Rincian Acara",
    ],
    estimatedTime: "1-2 Hari Kerja",
    status: "Tersedia",
    category: "Izin",
    categoryColor: "bg-green-100 text-green-800",
  },
  {
    id: "usaha",
    title: "Surat Keterangan Usaha",
    description: "Surat yang menyatakan seseorang memiliki usaha/berwirausaha",
    requirements: ["KTP Asli", "Kartu Keluarga", "Foto Tempat Usaha"],
    estimatedTime: "2-3 Hari Kerja",
    status: "Tersedia",
    category: "Bisnis",
    categoryColor: "bg-green-100 text-green-800",
  },
  {
    id: "tidak-mampu",
    title: "Surat Keterangan Tidak Mampu",
    description: "Surat yang menyatakan kondisi ekonomi kurang mampu",
    requirements: ["KTP Asli", "Kartu Keluarga", "Surat Pengantar RT/RW"],
    estimatedTime: "1-2 Hari Kerja",
    status: "Tersedia",
    category: "Personal",
    categoryColor: "bg-green-100 text-green-800",
  },
  {
    id: "kelahiran",
    title: "Surat Keterangan Kelahiran",
    description: "Surat pengantar untuk pengurusan akta kelahiran",
    requirements: [
      "Surat Keterangan Lahir dari Bidan/Dokter",
      "KTP Orang Tua",
      "Kartu Keluarga",
    ],
    estimatedTime: "1 Hari Kerja",
    status: "Tersedia",
    category: "Personal",
    categoryColor: "bg-green-100 text-green-800",
  },
  {
    id: "kematian",
    title: "Surat Keterangan Kematian",
    description: "Surat yang menyatakan seseorang telah meninggal dunia",
    requirements: [
      "Surat Keterangan Kematian dari Dokter",
      "KTP Almarhum",
      "KTP Pelapor",
    ],
    estimatedTime: "1 Hari Kerja",
    status: "Tersedia",
    category: "Personal",
    categoryColor: "bg-green-100 text-green-800",
  },
];
