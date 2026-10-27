export const LETTER_IDS = [
  "domisili",
  "pengantar-desa",
  "izin-keramaian",
  "usaha",
  "tidak-mampu",
  "kelahiran",
  "kematian",
] as const;

export type LetterId = (typeof LETTER_IDS)[number];

export const CATEGORIES = ["Personal", "Administratif", "Bisnis", "Izin"] as const;

export type LetterCategory = (typeof CATEGORIES)[number];

export interface Service {
  id: LetterId;
  code: string;
  number: number;
  title: string;
  description: string;
  requirements: string[];
  category: LetterCategory;
  previewPdf: string;
  templateDocUrl: string;
}

/** Shared Google Drive folder holding every editable template. */
export const DRIVE_FOLDER_URL =
  "https://drive.google.com/drive/u/1/folders/1-jAAhp4eszNutZZOBImcUCHhTN95q6d2";

export const services: Service[] = [
  {
    id: "domisili",
    code: "SKD",
    number: 1,
    title: "Surat Keterangan Domisili",
    description: "Surat yang menyatakan tempat tinggal/domisili seseorang",
    requirements: ["KTP Asli", "Kartu Keluarga", "Surat Pengantar RT/RW"],
    category: "Personal",
    previewPdf: "/pdf_preview/Surat_Keterangan_Domisili_Preview.pdf",
    templateDocUrl:
      "https://docs.google.com/document/d/1VNWZgmVvHC0HWbGXy92nvCtiFTflJlZW/edit",
  },
  {
    id: "pengantar-desa",
    code: "SPD",
    number: 2,
    title: "Surat Keterangan Pengantar Desa",
    description:
      "Surat pengantar dari desa untuk berbagai keperluan administratif",
    requirements: ["KTP Asli", "Kartu Keluarga", "Surat Pengantar RT/RW"],
    category: "Administratif",
    previewPdf: "/pdf_preview/Surat_Keterangan_Pengantar_Desa_Preview.pdf",
    templateDocUrl:
      "https://docs.google.com/document/d/17QoC3EGBAfcJK_6-Y8Keke4fXNTzmF2u/edit",
  },
  {
    id: "izin-keramaian",
    code: "SIK",
    number: 3,
    title: "Surat Permohonan Izin Keramaian",
    description:
      "Surat izin untuk mengadakan acara atau kegiatan yang melibatkan banyak orang",
    requirements: [
      "KTP Asli",
      "Kartu Keluarga",
      "Surat Pengantar RT/RW",
      "Rincian Acara",
    ],
    category: "Izin",
    previewPdf: "/pdf_preview/Surat_Permohonan_Izin_Keramaian_Preview.pdf",
    templateDocUrl:
      "https://docs.google.com/document/d/1BijWyHFzuxUJfaLa6cSJlTQUk2ybfY_d/edit",
  },
  {
    id: "usaha",
    code: "SKU",
    number: 4,
    title: "Surat Keterangan Usaha",
    description: "Surat yang menyatakan seseorang memiliki usaha/berwirausaha",
    requirements: ["KTP Asli", "Kartu Keluarga", "Foto Tempat Usaha"],
    category: "Bisnis",
    previewPdf: "/pdf_preview/Surat_Keterangan_Usaha_Preview.pdf",
    templateDocUrl:
      "https://docs.google.com/document/d/17N_RDvdRmuaQxz6Zj4lkT4kPoAwttdU_/edit",
  },
  {
    id: "tidak-mampu",
    code: "SKTM",
    number: 5,
    title: "Surat Keterangan Tidak Mampu",
    description: "Surat yang menyatakan kondisi ekonomi kurang mampu",
    requirements: ["KTP Asli", "Kartu Keluarga", "Surat Pengantar RT/RW"],
    category: "Personal",
    previewPdf: "/pdf_preview/Surat_Keterangan_Tidak_Mampu_Preview.pdf",
    templateDocUrl:
      "https://docs.google.com/document/d/1MHLYmGWXXuVtRi77zDupsbKJ8xn-YHFF/edit",
  },
  {
    id: "kelahiran",
    code: "SKL",
    number: 6,
    title: "Surat Keterangan Kelahiran",
    description: "Surat pengantar untuk pengurusan akta kelahiran",
    requirements: [
      "Surat Keterangan Lahir dari Bidan/Dokter",
      "KTP Orang Tua",
      "Kartu Keluarga",
    ],
    category: "Personal",
    previewPdf: "/pdf_preview/Surat_Keterangan_Kelahiran_Preview.pdf",
    templateDocUrl:
      "https://docs.google.com/document/d/18jD9y82RSUWBYFBxvDd896UzrMsUfH4Y/edit",
  },
  {
    id: "kematian",
    code: "SKK",
    number: 7,
    title: "Surat Keterangan Kematian",
    description: "Surat yang menyatakan seseorang telah meninggal dunia",
    requirements: [
      "Surat Keterangan Kematian dari Dokter",
      "KTP Almarhum",
      "KTP Pelapor",
    ],
    category: "Personal",
    previewPdf: "/pdf_preview/Surat_Keterangan_Kematian_Preview.pdf",
    templateDocUrl:
      "https://docs.google.com/document/d/1ANlR4Hs0-JPdnWkybG1iwpLGO2GZ0ORp/edit",
  },
];

export const isLetterId = (id: string): id is LetterId =>
  (LETTER_IDS as readonly string[]).includes(id);

export const getService = (id: LetterId): Service =>
  services.find((service) => service.id === id)!;

/** "SKD · No. 01" */
export const letterReference = (service: Service) =>
  `${service.code} · no. ${String(service.number).padStart(2, "0")}`;
