import { alamatGroups } from "@/app/layanan-surat/data/alamatGroups";
import type { PersonData } from "@/components/ui/person-search";
import type { SuratDomisiliProps } from "@/components/layanan-surat/surat-templates/SuratDomisili";
import { defineLetter, requireFields, type SectionDef } from "../types";

export const initialValues = {
  namaPeminta: "",
  alamatDomisili: "",
  signatureType: "sekretaris",
};

type Values = typeof initialValues;

export const sections: SectionDef<Values>[] = [
  {
    index: "A",
    title: "Data Pemohon",
    fields: [
      { name: "namaPeminta", label: "Nama", kind: "text", placeholder: "Masukkan nama lengkap" },
      {
        name: "alamatDomisili",
        label: "Alamat Domisili",
        kind: "select",
        placeholder: "Pilih alamat domisili",
        groups: alamatGroups,
      },
    ],
  },
  {
    index: "B",
    title: "Tanda Tangan",
    fields: [
      {
        name: "signatureType",
        label: "Penandatangan",
        kind: "select",
        options: [
          { value: "sekretaris", label: "Plt. Sekretaris Desa – AGUS SUMANTO" },
          { value: "kepala", label: "Pj. Kepala Desa – NGASIMAN S.H." },
        ],
      },
    ],
  },
];

export const validate = (values: Values) =>
  requireFields(values, {
    namaPeminta: "Nama peminta surat harus diisi",
    alamatDomisili: "Alamat domisili harus dipilih",
  });

const pad2 = (value: string) => String(parseInt(value, 10)).padStart(2, "0");

const alamatOption = (person: PersonData) => {
  if (!person.RT || !person.RW) return undefined;
  const rtRw = `${pad2(person.RT)}/${pad2(person.RW)}`;
  return alamatGroups
    .flatMap((group) => group.options)
    .find((option) => option.value.split(" ")[1] === rtRw)?.value;
};

export const fromPerson = (person: PersonData): Partial<Values> => {
  const alamatDomisili = alamatOption(person);
  return { namaPeminta: person.NAMA, ...(alamatDomisili && { alamatDomisili }) };
};

export const toTemplateData = (values: Values): SuratDomisiliProps => ({
  namaPeminta: values.namaPeminta,
  alamatDomisili: values.alamatDomisili,
  signatureType: values.signatureType === "kepala" ? "kepala" : "sekretaris",
});

export default defineLetter({
  id: "domisili",
  sections,
  initialValues,
  validate,
  fromPerson,
  toTemplateData,
  loadTemplate: () =>
    import("@/components/layanan-surat/surat-templates/SuratDomisili").then((m) => ({
      build: m.buildSuratDomisiliDoc,
      generate: m.default,
    })),
});
