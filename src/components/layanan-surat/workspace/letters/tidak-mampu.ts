import type { PersonData } from "@/components/ui/person-search";
import type { SuratTidakMampuProps } from "@/components/layanan-surat/surat-templates/SuratTidakMampu";
import { defineLetter, requireFields, type SectionDef } from "../types";
import { alamatFromRtRw, birthDate, defined, genderLP } from "./person";

export const initialValues = {
  namaPemohon: "",
  tempatLahirPemohon: "Pati",
  tanggalLahirPemohon: "",
  jenisKelaminPemohon: "L",
  pekerjaanPemohon: "",
  alamatPemohon: "",
  persyaratan: "",
};

type Values = typeof initialValues;

export const sections: SectionDef<Values>[] = [
  {
    index: "A",
    title: "Data Pemohon",
    fields: [
      { name: "namaPemohon", label: "Nama", kind: "text", wide: true, placeholder: "Masukkan nama lengkap" },
      { name: "tempatLahirPemohon", label: "Tempat Lahir", kind: "text", placeholder: "Masukkan tempat lahir" },
      { name: "tanggalLahirPemohon", label: "Tanggal Lahir", kind: "text", placeholder: "Masukkan tanggal lahir" },
      {
        name: "jenisKelaminPemohon",
        label: "Jenis Kelamin",
        kind: "segmented",
        options: [
          { value: "L", label: "Laki-laki" },
          { value: "P", label: "Perempuan" },
        ],
      },
      { name: "pekerjaanPemohon", label: "Pekerjaan", kind: "text", placeholder: "Masukkan pekerjaan" },
      { name: "alamatPemohon", label: "Alamat", kind: "text", wide: true, placeholder: "Masukkan alamat lengkap" },
      {
        name: "persyaratan",
        label: "Persyaratan",
        kind: "text",
        wide: true,
        placeholder: "Masukkan persyaratan yang diperlukan",
      },
    ],
  },
];

export const validate = (values: Values) =>
  requireFields(values, {
    namaPemohon: "Nama harus diisi",
    tempatLahirPemohon: "Tempat lahir harus diisi",
    tanggalLahirPemohon: "Tanggal lahir harus diisi",
    pekerjaanPemohon: "Pekerjaan harus diisi",
    alamatPemohon: "Alamat harus diisi",
    persyaratan: "Persyaratan harus diisi",
  });

export const fromPerson = (person: PersonData): Partial<Values> =>
  defined({
    namaPemohon: person.NAMA || "",
    tempatLahirPemohon: person.TMPT_LHR || "",
    tanggalLahirPemohon: birthDate(person) || undefined,
    jenisKelaminPemohon: genderLP(person),
    pekerjaanPemohon: person.PEKERJAAN || "",
    alamatPemohon: person.RT && person.RW ? alamatFromRtRw(person) : undefined,
  });

export const toTemplateData = (values: Values): SuratTidakMampuProps => ({ ...values });

export default defineLetter({
  id: "tidak-mampu",
  sections,
  initialValues,
  validate,
  fromPerson,
  toTemplateData,
  loadTemplate: () =>
    import("@/components/layanan-surat/surat-templates/SuratTidakMampu").then((m) => ({
      build: m.buildSuratTidakMampuDoc,
      generate: m.default,
    })),
});
