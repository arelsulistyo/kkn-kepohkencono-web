/**
 * Village statistics for the public site, aggregated from the source tables in
 * /public/data. Imported at build time so every number renders on first paint.
 */
import aktaJson from "../../public/data/Akta_U17.json";
import ageJson from "../../public/data/Demografi_Umur.json";
import familyJson from "../../public/data/Hubungan_Keluarga.json";
import religionJson from "../../public/data/Jenis_Agama.json";
import jobsJson from "../../public/data/Jenis_Pekerjaan.json";
import educationJson from "../../public/data/Jenis_Pendidikan.json";
import householdJson from "../../public/data/Kepala_Keluarga.json";
import ktpJson from "../../public/data/Wajib_KTP.json";

type SourceRow = Record<string, number | string>;

export type SexBreakdown = {
  label: string;
  male: number;
  female: number;
  total: number;
};

const firstRow = (table: unknown) => (table as SourceRow[])[0];
const num = (row: SourceRow, key: string) => Number(row[key]) || 0;

/** Sums the "<KEY> L" / "<KEY> P" columns of every key into one entry. */
function bySex(
  row: SourceRow,
  label: string,
  keys: string[],
  femaleKeys = keys,
): SexBreakdown {
  const male = keys.reduce((sum, key) => sum + num(row, `${key} L`), 0);
  const female = femaleKeys.reduce((sum, key) => sum + num(row, `${key} P`), 0);
  return { label, male, female, total: male + female };
}

const byTotalDesc = (a: SexBreakdown, b: SexBreakdown) => b.total - a.total;

export const share = (part: number, whole: number) =>
  whole > 0 ? (part / whole) * 100 : 0;

const formats = [0, 1].map(
  (digits) =>
    new Intl.NumberFormat("id-ID", { maximumFractionDigits: digits }),
);

/** 4212 → "4.212"; 2.644 with 1 digit → "2,6" */
export const formatNumber = (value: number, digits: 0 | 1 = 0) =>
  formats[digits].format(value);

/** 78.63 → "78,6" (no % sign, so callers can style it). */
export const formatPercent = (value: number, digits: 0 | 1 = 1) =>
  formats[digits].format(value);

// ---------- Age ----------

const ageRow = firstRow(ageJson);

const AGE_GROUPS: { label: string; bands: string[] }[] = [
  { label: "0–19", bands: ["00-04", "05-09", "10-14", "15-19"] },
  { label: "20–34", bands: ["20-24", "25-29", "30-34"] },
  { label: "35–54", bands: ["35-39", "40-44", "45-49", "50-54"] },
  { label: "55–74", bands: ["55-59", "60-64", "65-69", "70-74"] },
  { label: "75+", bands: [">75"] },
];

export const ageGroups = AGE_GROUPS.map(({ label, bands }) =>
  bySex(ageRow, label, bands),
);

// ---------- Totals ----------

const sumOf = (rows: SexBreakdown[], key: "male" | "female" | "total") =>
  rows.reduce((sum, row) => sum + row[key], 0);

export const totals = {
  population: sumOf(ageGroups, "total"),
  male: sumOf(ageGroups, "male"),
  female: sumOf(ageGroups, "female"),
  households: num(firstRow(householdJson), "KEPALA KELUARGA JML"),
};

// ---------- Religion ----------

const religionRow = firstRow(religionJson);

export const religion = (
  [
    ["Islam", "ISLAM"],
    ["Kristen", "KRISTEN"],
    ["Katolik", "KATHOLIK"],
    ["Hindu", "HINDU"],
    ["Buddha", "BUDHA"],
    ["Khonghucu", "KHONGHUCU"],
    ["Kepercayaan", "KEPERCAYAAN"],
  ] as const
)
  .map(([label, key]) => bySex(religionRow, label, [key]))
  .filter((row) => row.total > 0)
  .sort(byTotalDesc);

export const religionTotal = sumOf(religion, "total");

// ---------- Family relations ----------

const familyRow = firstRow(familyJson);

export const familyRelations = (
  [
    ["Kepala Keluarga", "KEPALA KELUARGA"],
    ["Istri", "ISTERI"],
    ["Anak", "ANAK"],
    ["Orang Tua", "ORANG TUA"],
  ] as const
)
  .map(([label, key]) => bySex(familyRow, label, [key]))
  .filter((row) => row.total > 0)
  .sort(byTotalDesc);

export const familyRelationsTotal = sumOf(familyRelations, "total");

// ---------- Jobs ----------

const jobsRow = firstRow(jobsJson);

const JOB_GROUPS: { label: string; keys: string[] }[] = [
  { label: "Petani", keys: ["PETANI/PEKEBUN", "BURUH TANI/PERKEBUNAN"] },
  { label: "Wiraswasta", keys: ["WIRASWASTA", "PEDAGANG", "PERDAGANGAN"] },
  {
    label: "PNS",
    keys: ["PEGAWAI NEGERI SIPIL (PNS)", "GURU", "PERANGKAT DESA", "KEPALA DESA"],
  },
  { label: "Swasta", keys: ["KARYAWAN SWASTA", "BURUH HARIAN LEPAS"] },
  {
    label: "TNI/Polri",
    keys: ["TENTARA NASIONAL INDONESIA (TNI)", "KEPOLISIAN RI (POLRI)"],
  },
  { label: "Ibu Rumah Tangga", keys: ["MENGURUS RUMAH TANGGA"] },
  { label: "Belum Bekerja", keys: ["BELUM/TIDAK BEKERJA"] },
  {
    label: "Tukang",
    keys: [
      "TUKANG CUKUR",
      "TUKANG LISTRIK",
      "TUKANG BATU",
      "TUKANG KAYU",
      "TUKANG SOL SEPATU",
      "TUKANG LAS/PANDAI BESI",
      "TUKANG JAHIT",
      "TUKANG GIGI",
      "MEKANIK",
    ],
  },
  { label: "Pensiunan", keys: ["PENSIUNAN"] },
];

/** Grouped occupations, largest first. */
export const jobs = JOB_GROUPS.map(({ label, keys }) =>
  bySex(jobsRow, label, keys),
)
  .filter((row) => row.total > 0)
  .sort(byTotalDesc);

export const jobsWorkingTotal = sumOf(jobs, "total");

// ---------- Education ----------

const educationRow = firstRow(educationJson);

/** All levels in education order (not ranked). */
export const education = [
  bySex(educationRow, "Tidak/Belum Sekolah", ["TIDAK/BLM SEKOLAH"]),
  bySex(educationRow, "Belum Tamat SD", ["BELUM TAMAT SD/SEDERAJAT"]),
  bySex(educationRow, "Tamat SD", ["TAMAT SD/SEDERAJAT"]),
  bySex(educationRow, "SLTP/Sederajat", ["SLTP/SEDERAJAT"]),
  bySex(educationRow, "SLTA/Sederajat", ["SLTA/SEDERAJAT"]),
  // The source table spells this column differently for L and P.
  bySex(
    educationRow,
    "Akademi/Diploma III",
    ["AKADEMI/DIPL.III/S. MUDA"],
    ["AKADEMI/DIPL.III/S.MUDA"],
  ),
  bySex(educationRow, "Diploma IV/Strata I", ["DIPLOMA IV/STRATA I"]),
  bySex(educationRow, "Strata II", ["STRATA-II"]),
];

/** Index of the first higher-education level in `education`. */
export const HIGHER_EDUCATION_START = 5;

// ---------- Administration ----------

const ktpRow = firstRow(ktpJson);
const ktpEligible = num(ktpRow, "JML_WKTP");
const ktpPopulation = num(ktpRow, "JML");

export const ktp = {
  wajib: ktpEligible,
  belum: ktpPopulation - ktpEligible,
  total: ktpPopulation,
  percent: share(ktpEligible, ktpPopulation),
};

const aktaRow = firstRow(aktaJson);
const aktaHas = num(aktaRow, "MEMILIKI");
const aktaMissing = num(aktaRow, "BELUM_MEMILIKI");

export const akta = {
  has: aktaHas,
  missing: aktaMissing,
  totalU17: aktaHas + aktaMissing,
  percent: share(aktaHas, aktaHas + aktaMissing),
};
