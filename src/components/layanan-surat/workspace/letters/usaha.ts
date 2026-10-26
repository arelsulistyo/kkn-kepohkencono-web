import type { PersonData } from "@/components/ui/person-search";
import type { SuratKeteranganUsahaProps } from "@/components/layanan-surat/surat-templates/SuratKeteranganUsaha";
import { defineLetter, requireFields, type SectionDef } from "../types";
import { alamatFromRtRw } from "./person";

export const initialValues = {
  namaPeminta: "",
  pekerjaan: "",
  alamat: "",
  jenisUsaha: "",
  jenisGarapan: "",
  luasLahan: "",
  lokasiLahan: "",
  jenisBibit: "",
  hasilPanenTon: "",
  hasilPanenKw: "",
  hasilPanenKg: "",
};

type Values = typeof initialValues;

export const sections: SectionDef<Values>[] = [
  {
    index: "A",
    title: "Data Pemohon",
    fields: [
      { name: "namaPeminta", label: "Nama", kind: "text", placeholder: "Masukkan nama lengkap" },
      { name: "pekerjaan", label: "Pekerjaan", kind: "text", placeholder: "Masukkan pekerjaan" },
      { name: "alamat", label: "Alamat", kind: "text", wide: true, placeholder: "Masukkan alamat lengkap" },
    ],
  },
  {
    index: "B",
    title: "Data Usaha",
    fields: [
      { name: "jenisUsaha", label: "Jenis Usaha", kind: "text", wide: true, placeholder: "Masukkan jenis usaha" },
    ],
  },
  {
    index: "C",
    title: "Usaha Pertanian",
    fields: [
      {
        name: "jenisGarapan",
        label: "Jenis Garapan",
        kind: "select",
        optional: true,
        placeholder: "Pilih jenis garapan",
        options: [
          { value: "Tambak", label: "Tambak" },
          { value: "Sawah", label: "Sawah" },
          { value: "Tegalan", label: "Tegalan" },
        ],
      },
      {
        name: "luasLahan",
        label: "Luas Lahan (Ha)",
        kind: "text",
        optional: true,
        placeholder: "Masukkan luas lahan dalam hektar",
      },
      { name: "lokasiLahan", label: "Lokasi Lahan (Desa)", kind: "text", optional: true, placeholder: "Masukkan lokasi lahan" },
      { name: "jenisBibit", label: "Jenis Bibit", kind: "text", optional: true, placeholder: "Masukkan jenis bibit" },
      { name: "hasilPanenTon", label: "Hasil panen per Ha – ton", kind: "text", optional: true, placeholder: "Ton" },
      { name: "hasilPanenKw", label: "Hasil panen per Ha – kwintal", kind: "text", optional: true, placeholder: "Kw" },
      { name: "hasilPanenKg", label: "Hasil panen per Ha – kilogram", kind: "text", optional: true, placeholder: "Kg" },
    ],
  },
];

export const validate = (values: Values) =>
  requireFields(values, {
    namaPeminta: "Nama peminta surat harus diisi",
    pekerjaan: "Pekerjaan harus diisi",
    alamat: "Alamat harus diisi",
    jenisUsaha: "Jenis usaha harus diisi",
  });

export const fromPerson = (person: PersonData): Partial<Values> => ({
  namaPeminta: person.NAMA,
  pekerjaan: person.PEKERJAAN,
  alamat: alamatFromRtRw(person),
});

export const toTemplateData = (values: Values): SuratKeteranganUsahaProps => ({
  namaPeminta: values.namaPeminta,
  pekerjaan: values.pekerjaan,
  alamat: values.alamat,
  jenisUsaha: values.jenisUsaha,
  jenisGarapan: values.jenisGarapan,
  luasLahan: values.luasLahan,
  lokasiLahan: values.lokasiLahan,
  jenisBibit: values.jenisBibit,
  hasilPanen: {
    ton: values.hasilPanenTon,
    kw: values.hasilPanenKw,
    kg: values.hasilPanenKg,
  },
});

export default defineLetter({
  id: "usaha",
  sections,
  initialValues,
  validate,
  fromPerson,
  toTemplateData,
  loadTemplate: () =>
    import("@/components/layanan-surat/surat-templates/SuratKeteranganUsaha").then((m) => ({
      build: m.buildSuratKeteranganUsahaDoc,
      generate: m.default,
    })),
});
