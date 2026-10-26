import type { PersonData } from "@/components/ui/person-search";
import type { SuratIzinKeramaianProps } from "@/components/layanan-surat/surat-templates/SuratIzinKeramaian";
import { defineLetter, requireFields, type SectionDef } from "../types";
import * as pengantar from "./pengantar-desa";
import { alamatFromRtRw } from "./person";

export const initialValues = {
  ...pengantar.initialValues,
  noHP: "",
  jabatan: "Pemilik",
  namaAcara: "",
  tanggalAcara: "",
  waktuAcara: "",
  tempatAcara: "",
  detailAcara: "",
  pemilikLokasiNama: "",
  pemilikLokasiAlamat: "",
  pemilikLokasiPekerjaan: "",
};

type Values = typeof initialValues;

export const sections: SectionDef<Values>[] = [
  ...(pengantar.sections as SectionDef<Values>[]),
  {
    index: "E",
    title: "Data Kontak Pemohon",
    fields: [{ name: "noHP", label: "Nomor HP", kind: "text", inputMode: "tel", placeholder: "Masukkan nomor HP" }],
  },
  {
    index: "F",
    title: "Data Acara",
    fields: [
      {
        name: "jabatan",
        label: "Jabatan",
        kind: "segmented",
        wide: true,
        options: [
          { value: "Pemilik", label: "Pemilik Hajat Keramaian" },
          { value: "Panitia", label: "Panitia Hajat Keramaian" },
        ],
      },
      { name: "namaAcara", label: "Nama Acara/Hajat", kind: "text", placeholder: "Masukkan nama acara/hajat" },
      { name: "tanggalAcara", label: "Tanggal Acara", kind: "date", placeholder: "Masukkan tanggal acara" },
      {
        name: "waktuAcara",
        label: "Waktu Acara",
        kind: "text",
        placeholder: "Contoh: 09.00 - 17.00 WIB",
      },
      { name: "tempatAcara", label: "Tempat Acara", kind: "text", placeholder: "Masukkan tempat acara" },
      {
        name: "detailAcara",
        label: "Detail Acara/Hajat",
        kind: "textarea",
        wide: true,
        placeholder: "Masukkan detail acara/hajat",
      },
    ],
  },
  {
    index: "G",
    title: "Data Pemilik Lokasi",
    autofill: {
      placeholder: "Cari data pemilik lokasi…",
      fromPerson: (person: PersonData) => ({
        pemilikLokasiNama: person.NAMA || "",
        pemilikLokasiAlamat: alamatFromRtRw(person),
        pemilikLokasiPekerjaan: person.PEKERJAAN || "",
      }),
    },
    fields: [
      {
        name: "pemilikLokasiNama",
        label: "Nama Pemilik Lokasi",
        kind: "text",
        placeholder: "Masukkan nama pemilik lokasi",
      },
      {
        name: "pemilikLokasiPekerjaan",
        label: "Pekerjaan Pemilik Lokasi",
        kind: "text",
        placeholder: "Masukkan pekerjaan pemilik lokasi",
      },
      {
        name: "pemilikLokasiAlamat",
        label: "Alamat Pemilik Lokasi",
        kind: "text",
        wide: true,
        placeholder: "Masukkan alamat pemilik lokasi",
      },
    ],
  },
];

export const validate = (values: Values) => ({
  ...pengantar.validatePemohon(values, "Nama harus diisi"),
  ...requireFields(values, {
    noHP: "Nomor HP harus diisi",
    namaAcara: "Nama acara/hajat harus diisi",
    tanggalAcara: "Tanggal acara harus diisi",
    waktuAcara: "Waktu acara harus diisi",
    tempatAcara: "Tempat acara harus diisi",
    detailAcara: "Detail acara/hajat harus diisi",
    pemilikLokasiNama: "Nama pemilik lokasi harus diisi",
    pemilikLokasiAlamat: "Alamat pemilik lokasi harus diisi",
    pemilikLokasiPekerjaan: "Pekerjaan pemilik lokasi harus diisi",
  }),
});

export const fromPerson = pengantar.fromPerson;

export const toTemplateData = (values: Values): SuratIzinKeramaianProps => ({
  ...pengantar.toTemplateData(values),
  noHP: values.noHP,
  jabatan: values.jabatan,
  keteranganAcara: {
    namaAcara: values.namaAcara,
    tanggalAcara: values.tanggalAcara,
    waktuAcara: values.waktuAcara,
    tempatAcara: values.tempatAcara,
    detailAcara: values.detailAcara,
  },
  pemilikLokasi: {
    nama: values.pemilikLokasiNama,
    alamat: values.pemilikLokasiAlamat,
    pekerjaan: values.pemilikLokasiPekerjaan,
  },
});

export default defineLetter({
  id: "izin-keramaian",
  sections,
  initialValues,
  validate,
  fromPerson,
  toTemplateData,
  loadTemplate: () =>
    import("@/components/layanan-surat/surat-templates/SuratIzinKeramaian").then((m) => ({
      build: m.buildSuratIzinKeramaianDoc,
      generate: m.default,
    })),
});
