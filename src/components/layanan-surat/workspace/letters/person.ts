import {
  convertTimestampToDate,
  getReligionText,
  type PersonData,
} from "@/components/ui/person-search";

/** "RT 3/RW 1, Desa Kepohkencono" — the address format the old forms autofilled. */
export const alamatFromRtRw = (person: PersonData) =>
  `RT ${person.RT || ""}/RW ${person.RW || ""}, Desa Kepohkencono`;

/** Database birth dates are Excel serial numbers; anything else is passed through. */
export const birthDate = (person: PersonData) => {
  const raw = person.TGL_LHR?.toString().trim() ?? "";
  return /^\d+(\.\d+)?$/.test(raw) ? convertTimestampToDate(raw) : raw;
};

export const religion = (person: PersonData) => getReligionText(person.AGAMA || "");

/** Gender as "L"/"P", or undefined when the record has an unknown value. */
export const genderLP = (person: PersonData): "L" | "P" | undefined => {
  const code = (person.JK || "").trim().toUpperCase();
  if (code === "L" || code === "LK" || code === "LAKI-LAKI") return "L";
  if (code === "P" || code === "PR" || code === "PEREMPUAN") return "P";
  return undefined;
};

/** Drops undefined entries so an unknown database value never clears a field. */
export const defined = <V extends Record<string, string | undefined>>(values: V) =>
  Object.fromEntries(
    Object.entries(values).filter(([, value]) => value !== undefined)
  ) as { [K in keyof V]?: string };
