import type { PersonData } from "@/components/ui/person-search";
import type { SuratKelahiranProps } from "@/components/layanan-surat/surat-templates/SuratKelahiran";
import { defineLetter, requireFields, type FieldOption, type SectionDef } from "../types";
import { alamatFromRtRw, birthDate, defined, genderLP } from "./person";

export const initialValues = {
  namaPemohon: "",
  tempatLahirPemohon: "Pati",
  tanggalLahirPemohon: "",
  jenisKelaminPemohon: "L",
  pekerjaanPemohon: "",
  alamatPemohon: "",
  namaAnak: "",
  tempatLahirAnak: "",
  tanggalLahirAnak: "",
  jenisKelaminAnak: "L",
  agamaAnak: "",
  alamatAnak: "",
  namaAyah: "",
  namaIbu: "",
};

type Values = typeof initialValues;

const genderOptions: [FieldOption, FieldOption] = [
  { value: "L", label: "Laki-laki" },
  { value: "P", label: "Perempuan" },
];

export const sections: SectionDef<Values>[] = [
  {
    index: "A",
    title: "Data Pemohon",
    fields: [
      { name: "namaPemohon", label: "Nama", kind: "text", wide: true, placeholder: "Masukkan nama lengkap" },
      { name: "tempatLahirPemohon", label: "Tempat Lahir", kind: "text", placeholder: "Masukkan tempat lahir" },
      { name: "tanggalLahirPemohon", label: "Tanggal Lahir", kind: "text", placeholder: "Masukkan tanggal lahir" },
      { name: "jenisKelaminPemohon", label: "Jenis Kelamin", kind: "segmented", options: genderOptions },
      { name: "pekerjaanPemohon", label: "Pekerjaan", kind: "text", placeholder: "Masukkan pekerjaan" },
      { name: "alamatPemohon", label: "Alamat", kind: "text", wide: true, placeholder: "Masukkan alamat lengkap" },
    ],
  },
  {
    index: "B",
    title: "Data Anak",
    fields: [
      { name: "namaAnak", label: "Nama", kind: "text", wide: true, placeholder: "Masukkan nama lengkap anak" },
      { name: "tempatLahirAnak", label: "Tempat Lahir", kind: "text", placeholder: "Masukkan tempat lahir anak" },
      { name: "tanggalLahirAnak", label: "Tanggal Lahir", kind: "text", placeholder: "Masukkan tanggal lahir anak" },
      { name: "jenisKelaminAnak", label: "Jenis Kelamin", kind: "segmented", options: genderOptions },
      { name: "agamaAnak", label: "Agama", kind: "text", placeholder: "Masukkan agama anak" },
      { name: "alamatAnak", label: "Alamat", kind: "text", wide: true, placeholder: "Masukkan alamat anak" },
    ],
  },
  {
    index: "C",
    title: "Data Orang Tua",
    fields: [
      { name: "namaAyah", label: "Nama Ayah", kind: "text", placeholder: "Masukkan nama ayah" },
      { name: "namaIbu", label: "Nama Ibu", kind: "text", placeholder: "Masukkan nama ibu" },
    ],
  },
];

export const validate = (values: Values) =>
  requireFields(values, {
    namaPemohon: "Nama pemohon harus diisi",
    tempatLahirPemohon: "Tempat lahir pemohon harus diisi",
    tanggalLahirPemohon: "Tanggal lahir pemohon harus diisi",
    pekerjaanPemohon: "Pekerjaan pemohon harus diisi",
    alamatPemohon: "Alamat pemohon harus diisi",
    namaAnak: "Nama anak harus diisi",
    tempatLahirAnak: "Tempat lahir anak harus diisi",
    tanggalLahirAnak: "Tanggal lahir anak harus diisi",
    agamaAnak: "Agama anak harus diisi",
    alamatAnak: "Alamat anak harus diisi",
    namaAyah: "Nama ayah harus diisi",
    namaIbu: "Nama ibu harus diisi",
  });

/** Fills the applicant (pemohon) only, as before. */
export const fromPerson = (person: PersonData): Partial<Values> =>
  defined({
    namaPemohon: person.NAMA || "",
    tempatLahirPemohon: person.TMPT_LHR || "",
    tanggalLahirPemohon: birthDate(person) || undefined,
    jenisKelaminPemohon: genderLP(person),
    pekerjaanPemohon: person.PEKERJAAN || "",
    alamatPemohon: person.RT && person.RW ? alamatFromRtRw(person) : undefined,
  });

export const toTemplateData = (values: Values): SuratKelahiranProps => ({ ...values });

export default defineLetter({
  id: "kelahiran",
  sections,
  initialValues,
  validate,
  fromPerson,
  toTemplateData,
  loadTemplate: () =>
    import("@/components/layanan-surat/surat-templates/SuratKelahiran").then((m) => ({
      build: m.buildSuratKelahiranDoc,
      generate: m.default,
    })),
});
