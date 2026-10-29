import type { jsPDF } from "jspdf";
import type { LetterId } from "@/app/layanan-surat/data/services";
import type { PersonData } from "@/components/ui/person-search";
import type { GeneratedLetter } from "@/components/layanan-surat/surat-templates/shared";

export type LetterValues = Record<string, string>;

export type FieldErrors<V extends LetterValues = LetterValues> = Partial<
  Record<keyof V & string, string>
>;

export interface FieldOption {
  value: string;
  label: string;
}

interface FieldBase<V extends LetterValues> {
  name: keyof V & string;
  label: string;
  optional?: boolean;
  wide?: boolean;
  placeholder?: string;
}

export type FieldDef<V extends LetterValues = LetterValues> = FieldBase<V> &
  (
    | { kind: "text"; inputMode?: "tel" }
    | { kind: "number"; digits?: number }
    | { kind: "textarea" }
    | { kind: "date" }
    | { kind: "select"; options?: FieldOption[]; groups?: { label: string; options: FieldOption[] }[] }
    | { kind: "segmented"; options: [FieldOption, FieldOption] }
  );

export interface SectionDef<V extends LetterValues = LetterValues> {
  index: string;
  title: string;
  fields: FieldDef<V>[];
  autofill?: {
    placeholder: string;
    fromPerson: (person: PersonData) => Partial<V>;
  };
}

interface LetterTemplate<T> {
  build: (data: T) => Promise<jsPDF>;
  generate: (data: T) => Promise<GeneratedLetter | null>;
}

export interface LetterSpec<V extends LetterValues, T> {
  id: LetterId;
  searchPlaceholder?: string;
  sections: SectionDef<V>[];
  initialValues: V;
  validate: (values: V) => FieldErrors<V>;
  fromPerson: (person: PersonData) => Partial<V>;
  toTemplateData: (values: V) => T;
  loadTemplate: () => Promise<LetterTemplate<T>>;
}

export interface LetterConfig {
  id: LetterId;
  searchPlaceholder: string;
  sections: SectionDef[];
  initialValues: LetterValues;
  validate: (values: LetterValues) => FieldErrors;
  fromPerson: (person: PersonData) => Partial<LetterValues>;
  buildPreview: (values: LetterValues) => Promise<jsPDF>;
  download: (values: LetterValues) => Promise<GeneratedLetter | null>;
}

export function defineLetter<V extends LetterValues, T>(spec: LetterSpec<V, T>): LetterConfig {
  // The workspace only ever passes back values shaped by `initialValues`.
  const typed = (values: LetterValues) => values as V;
  return {
    id: spec.id,
    searchPlaceholder: spec.searchPlaceholder ?? "Cari data pemohon…",
    sections: spec.sections as SectionDef[],
    initialValues: spec.initialValues,
    validate: (values) => spec.validate(typed(values)),
    fromPerson: spec.fromPerson,
    buildPreview: async (values) =>
      (await spec.loadTemplate()).build(spec.toTemplateData(typed(values))),
    download: async (values) =>
      (await spec.loadTemplate()).generate(spec.toTemplateData(typed(values))),
  };
}

export function requireFields<V extends LetterValues>(
  values: V,
  messages: Partial<Record<keyof V & string, string>>
): FieldErrors<V> {
  const errors: FieldErrors<V> = {};
  for (const name of Object.keys(messages) as (keyof V & string)[]) {
    if (!values[name]?.trim()) errors[name] = messages[name];
  }
  return errors;
}

export function sixteenDigitError(value: string, label: string): string | undefined {
  const digits = value.trim();
  return digits && digits.length !== 16 ? `${label} harus 16 digit` : undefined;
}

export const sectionProgressLabel = (section: SectionDef) =>
  section.title.replace(/^Data /, "").toLowerCase();

export const requiredFields = (sections: SectionDef[]) =>
  sections.flatMap((section) => section.fields).filter((field) => !field.optional);
