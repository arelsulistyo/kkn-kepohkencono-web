import type { PersonData } from "@/components/ui/person-search";
import type { SuratPengantarDesaProps } from "@/components/layanan-surat/surat-templates/SuratPengantarDesa";
import { defineLetter, requireFields, sixteenDigitError, type SectionDef } from "../types";
import { birthDate, defined, genderLP, religion } from "./person";

export const initialValues = {
  nama: "",
  jenisKelamin: "Lk",
  tempatLahir: "Pati",
  tanggalLahir: "",
  agama: "",
  pekerjaan: "",
  rt: "",
  rw: "",
  ktpNomor: "",
  kkNomor: "",
  keperluan: "",
  berlakuMulai: "",
  berlakuSampai: "",
  keteranganLain: "",
};

type Values = typeof initialValues;

export const sections: SectionDef<Values>[] = [
  {
    index: "A",
    title: "Data Pemohon",
    fields: [
      { name: "nama", label: "Nama", kind: "text", placeholder: "Masukkan nama lengkap" },
      {
        name: "jenisKelamin",
        label: "Jenis Kelamin",
        kind: "segmented",
        options: [
          { value: "Lk", label: "Laki-laki" },
          { value: "Pr", label: "Perempuan" },
        ],
      },
      { name: "tempatLahir", label: "Tempat Lahir", kind: "text", optional: true, placeholder: "Masukkan tempat lahir" },
      { name: "tanggalLahir", label: "Tanggal Lahir", kind: "text", placeholder: "Masukkan tanggal lahir" },
      { name: "agama", label: "Agama", kind: "text", placeholder: "Masukkan agama" },
      { name: "pekerjaan", label: "Pekerjaan", kind: "text", placeholder: "Masukkan pekerjaan" },
    ],
  },
  {
    index: "B",
    title: "Data Alamat",
    fields: [
      { name: "rt", label: "RT", kind: "number", placeholder: "Masukkan RT" },
      { name: "rw", label: "RW", kind: "number", placeholder: "Masukkan RW" },
    ],
  },
  {
    index: "C",
    title: "Data Dokumen",
    fields: [
      { name: "ktpNomor", label: "Nomor KTP", kind: "number", digits: 16, placeholder: "Masukkan nomor KTP" },
      { name: "kkNomor", label: "Nomor KK", kind: "number", digits: 16, placeholder: "Masukkan nomor KK" },
    ],
  },
  {
    index: "D",
    title: "Data Keperluan",
    fields: [
      { name: "keperluan", label: "Keperluan", kind: "textarea", wide: true, placeholder: "Masukkan keperluan" },
      { name: "berlakuMulai", label: "Berlaku Mulai", kind: "date", placeholder: "Masukkan tanggal mulai" },
      { name: "berlakuSampai", label: "Berlaku Sampai", kind: "date", placeholder: "Masukkan tanggal akhir" },
      {
        name: "keteranganLain",
        label: "Keterangan Lain-lain",
        kind: "textarea",
        wide: true,
        optional: true,
        placeholder: "Masukkan keterangan lain (opsional)",
      },
    ],
  },
];

export const validatePemohon = (values: Values, namaMessage: string) => {
  const errors = requireFields(values, {
    nama: namaMessage,
    tanggalLahir: "Tanggal lahir harus diisi",
    agama: "Agama harus diisi",
    pekerjaan: "Pekerjaan harus diisi",
    rt: "RT harus diisi",
    rw: "RW harus diisi",
    ktpNomor: "Nomor KTP harus diisi",
    kkNomor: "Nomor KK harus diisi",
    keperluan: "Keperluan harus diisi",
    berlakuMulai: "Tanggal mulai berlaku harus diisi",
    berlakuSampai: "Tanggal akhir berlaku harus diisi",
  });
  errors.ktpNomor ??= sixteenDigitError(values.ktpNomor, "Nomor KTP");
  errors.kkNomor ??= sixteenDigitError(values.kkNomor, "Nomor KK");
  return errors;
};

export const validate = (values: Values) =>
  validatePemohon(
    values,
    "Nama harus diisi. Gunakan pencarian untuk memilih data dari database."
  );

export const fromPerson = (person: PersonData): Partial<Values> => {
  const gender = genderLP(person);
  return defined({
    nama: person.NAMA,
    ktpNomor: person.NIK,
    kkNomor: person.NO_KK,
    agama: religion(person),
    pekerjaan: person.PEKERJAAN,
    rt: person.RT,
    rw: person.RW,
    jenisKelamin: gender && (gender === "L" ? "Lk" : "Pr"),
    tempatLahir: person.TMPT_LHR || undefined,
    tanggalLahir: birthDate(person) || undefined,
  });
};

export const toTemplateData = (values: Values): SuratPengantarDesaProps => ({
  nama: values.nama,
  jenisKelamin: values.jenisKelamin,
  tempatLahir: values.tempatLahir,
  tanggalLahir: values.tanggalLahir,
  agama: values.agama,
  pekerjaan: values.pekerjaan,
  tempatTinggal: { rt: values.rt, rw: values.rw },
  suratBuktiDiri: { ktpNomor: values.ktpNomor, kkNomor: values.kkNomor },
  keperluan: values.keperluan,
  berlakuMulai: values.berlakuMulai,
  berlakuSampai: values.berlakuSampai,
  keteranganLain: values.keteranganLain,
});

export default defineLetter({
  id: "pengantar-desa",
  sections,
  initialValues,
  validate,
  fromPerson,
  toTemplateData,
  loadTemplate: () =>
    import("@/components/layanan-surat/surat-templates/SuratPengantarDesa").then((m) => ({
      build: m.buildSuratPengantarDesaDoc,
      generate: m.default,
    })),
});
