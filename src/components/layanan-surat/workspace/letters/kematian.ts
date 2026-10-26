import type { PersonData } from "@/components/ui/person-search";
import type { SuratKematianProps } from "@/components/layanan-surat/surat-templates/SuratKematian";
import { defineLetter, requireFields, type SectionDef } from "../types";
import { alamatFromRtRw, birthDate, defined, genderLP, religion } from "./person";

export const initialValues = {
  nama: "",
  tempatLahir: "Pati",
  tanggalLahir: "",
  jenisKelamin: "L",
  pekerjaan: "",
  alamat: "",
  agama: "",
  hariTanggalKematian: "",
  jamKematian: "",
  sebabKematian: "",
  yangMenerangkan: "",
  tempatKematian: "",
};

type Values = typeof initialValues;

export const sections: SectionDef<Values>[] = [
  {
    index: "A",
    title: "Data Almarhum/Almarhumah",
    fields: [
      { name: "nama", label: "Nama", kind: "text", wide: true, placeholder: "Masukkan nama lengkap" },
      { name: "tempatLahir", label: "Tempat Lahir", kind: "text", placeholder: "Masukkan tempat lahir" },
      { name: "tanggalLahir", label: "Tanggal Lahir", kind: "text", placeholder: "Masukkan tanggal lahir" },
      {
        name: "jenisKelamin",
        label: "Jenis Kelamin",
        kind: "segmented",
        options: [
          { value: "L", label: "Laki-laki" },
          { value: "P", label: "Perempuan" },
        ],
      },
      { name: "pekerjaan", label: "Pekerjaan", kind: "text", placeholder: "Masukkan pekerjaan" },
      { name: "alamat", label: "Alamat", kind: "text", placeholder: "Masukkan alamat lengkap" },
      { name: "agama", label: "Agama", kind: "text", placeholder: "Masukkan agama" },
    ],
  },
  {
    index: "B",
    title: "Data Kematian",
    fields: [
      {
        name: "hariTanggalKematian",
        label: "Hari/Tanggal Kematian",
        kind: "text",
        placeholder: "Contoh: Senin, 10 Januari 2023",
      },
      { name: "jamKematian", label: "Jam Kematian", kind: "text", placeholder: "Contoh: 14:30 WIB" },
      { name: "sebabKematian", label: "Sebab Kematian", kind: "text", placeholder: "Masukkan sebab kematian" },
      {
        name: "yangMenerangkan",
        label: "Yang Menerangkan Kematian",
        kind: "text",
        placeholder: "Contoh: Dokter RS Pati / Keluarga",
      },
      {
        name: "tempatKematian",
        label: "Tempat Kematian",
        kind: "text",
        wide: true,
        placeholder: "Contoh: RS Pati / Rumah",
      },
    ],
  },
];

export const validate = (values: Values) =>
  requireFields(values, {
    nama: "Nama harus diisi",
    tempatLahir: "Tempat lahir harus diisi",
    tanggalLahir: "Tanggal lahir harus diisi",
    pekerjaan: "Pekerjaan harus diisi",
    alamat: "Alamat harus diisi",
    agama: "Agama harus diisi",
    hariTanggalKematian: "Hari/tanggal kematian harus diisi",
    jamKematian: "Jam kematian harus diisi",
    sebabKematian: "Sebab kematian harus diisi",
    yangMenerangkan: "Yang menerangkan harus diisi",
    tempatKematian: "Tempat kematian harus diisi",
  });

export const fromPerson = (person: PersonData): Partial<Values> =>
  defined({
    nama: person.NAMA || "",
    tempatLahir: person.TMPT_LHR || "Pati",
    tanggalLahir: birthDate(person) || undefined,
    jenisKelamin: genderLP(person),
    pekerjaan: person.PEKERJAAN || "",
    alamat: alamatFromRtRw(person),
    agama: religion(person),
  });

export const toTemplateData = (values: Values): SuratKematianProps => ({ ...values });

export default defineLetter({
  id: "kematian",
  searchPlaceholder: "Cari data almarhum/almarhumah…",
  sections,
  initialValues,
  validate,
  fromPerson,
  toTemplateData,
  loadTemplate: () =>
    import("@/components/layanan-surat/surat-templates/SuratKematian").then((m) => ({
      build: m.buildSuratKematianDoc,
      generate: m.default,
    })),
});
