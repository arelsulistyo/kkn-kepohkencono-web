"use client";

import { useState } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { format, isValid, parse } from "date-fns";
import { id as localeId } from "date-fns/locale";
import IndonesianCalendar from "@/components/ui/indonesian-calendar";
import { LS_ROOT_CLASS } from "@/app/layanan-surat/fonts";
import { CalendarGlyph } from "../../glyphs";
import type { FieldDef } from "../types";

export const fieldId = (name: string) => `field-${name}`;

const DATE_FORMAT = "dd MMMM yyyy";

interface FieldProps<F extends FieldDef = FieldDef> {
  field: F;
  value: string;
  error?: string;
  autofilled: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
}

const controlProps = ({ field, error, onBlur }: FieldProps) => ({
  id: fieldId(field.name),
  name: field.name,
  "aria-invalid": Boolean(error),
  "aria-required": !field.optional,
  "aria-describedby": error ? `${fieldId(field.name)}-error` : undefined,
  onBlur,
});

function FieldShell({
  field,
  error,
  autofilled,
  asGroup = false,
  children,
}: Pick<FieldProps, "field" | "error" | "autofilled"> & { asGroup?: boolean; children: React.ReactNode }) {
  const id = fieldId(field.name);
  const labelContent = (
    <>
      {field.label}{" "}
      {field.optional ? <small>(opsional)</small> : <b aria-hidden="true">*</b>}
    </>
  );
  return (
    <div
      className={[
        "form-field",
        field.wide && "field-wide",
        autofilled && "is-autofilled",
        error && "has-error",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="field-label-row">
        {asGroup ? (
          <span className="field-label" id={`${id}-label`}>
            {labelContent}
          </span>
        ) : (
          <label className="field-label" htmlFor={id}>
            {labelContent}
          </label>
        )}
        {autofilled && <em className="field-source">dari database</em>}
      </div>
      {children}
      {error && (
        <em className="field-error" id={`${id}-error`}>
          <span className="error-badge" aria-hidden="true">
            !
          </span>
          {error}
        </em>
      )}
    </div>
  );
}

export function TextField(props: FieldProps<Extract<FieldDef, { kind: "text" }>>) {
  const { field, value, onChange } = props;
  return (
    <FieldShell {...props}>
      <input
        {...controlProps(props)}
        type={field.inputMode === "tel" ? "tel" : "text"}
        inputMode={field.inputMode}
        placeholder={field.placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </FieldShell>
  );
}

export function NumberField(props: FieldProps<Extract<FieldDef, { kind: "number" }>>) {
  const { field, value, onChange } = props;
  const counterId = `${fieldId(field.name)}-count`;
  const base = controlProps(props);
  return (
    <FieldShell {...props}>
      <span className="counted-input">
        <input
          {...base}
          aria-describedby={[base["aria-describedby"], field.digits && counterId].filter(Boolean).join(" ") || undefined}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          maxLength={field.digits}
          placeholder={field.placeholder}
          value={value}
          onChange={(event) =>
            onChange(field.digits ? event.target.value.replace(/\D/g, "") : event.target.value)
          }
        />
        {field.digits && (
          <small
            id={counterId}
            className={value.length === field.digits ? "is-complete" : undefined}
            aria-label={`${value.length} dari ${field.digits} digit`}
          >
            {value.length}/{field.digits}
          </small>
        )}
      </span>
    </FieldShell>
  );
}

export function TextareaField(props: FieldProps<Extract<FieldDef, { kind: "textarea" }>>) {
  const { field, value, onChange } = props;
  return (
    <FieldShell {...props}>
      <textarea
        {...controlProps(props)}
        rows={3}
        placeholder={field.placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </FieldShell>
  );
}

export function SelectField(props: FieldProps<Extract<FieldDef, { kind: "select" }>>) {
  const { field, value, onChange } = props;
  return (
    <FieldShell {...props}>
      <select {...controlProps(props)} value={value} onChange={(event) => onChange(event.target.value)}>
        {field.placeholder && <option value="">{field.placeholder}</option>}
        {field.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        {field.groups?.map((group) => (
          <optgroup key={group.label} label={group.label}>
            {group.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </FieldShell>
  );
}

export function SegmentedField(props: FieldProps<Extract<FieldDef, { kind: "segmented" }>>) {
  const { field, value, onChange, onBlur } = props;
  const id = fieldId(field.name);
  return (
    <FieldShell {...props} asGroup>
      <div className="gender-control" role="radiogroup" aria-labelledby={`${id}-label`}>
        {field.options.map((option, index) => (
          <label key={option.value} className={value === option.value ? "active" : ""}>
            <input
              type="radio"
              className="sr-only"
              id={index === 0 ? id : undefined}
              name={field.name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              onBlur={onBlur}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </FieldShell>
  );
}

export function DateField(props: FieldProps<Extract<FieldDef, { kind: "date" }>>) {
  const { field, value, onChange, onBlur } = props;
  const [open, setOpen] = useState(false);
  const parsed = value ? parse(value, DATE_FORMAT, new Date(), { locale: localeId }) : undefined;
  const selected = parsed && isValid(parsed) ? parsed : undefined;

  return (
    <FieldShell {...props}>
      <PopoverPrimitive.Root
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) onBlur();
        }}
      >
        <span className="date-control">
          <PopoverPrimitive.Trigger asChild>
            <button
              type="button"
              {...controlProps(props)}
              aria-required={undefined}
              onBlur={undefined}
              className={`date-trigger ${value ? "" : "is-empty"}`}
            >
              {value || field.placeholder}
            </button>
          </PopoverPrimitive.Trigger>
          <CalendarGlyph />
        </span>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            className={`${LS_ROOT_CLASS} ls-popover`}
            align="start"
            sideOffset={4}
            aria-label={`Pilih ${field.label.toLowerCase()}`}
          >
            <IndonesianCalendar
              value={selected}
              onChange={(date) => {
                if (!date) return;
                onChange(format(date, DATE_FORMAT, { locale: localeId }));
                setOpen(false);
                onBlur();
              }}
            />
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </FieldShell>
  );
}

export function FieldControl(props: FieldProps) {
  const { field } = props;
  switch (field.kind) {
    case "text":
      return <TextField {...props} field={field} />;
    case "number":
      return <NumberField {...props} field={field} />;
    case "textarea":
      return <TextareaField {...props} field={field} />;
    case "select":
      return <SelectField {...props} field={field} />;
    case "segmented":
      return <SegmentedField {...props} field={field} />;
    case "date":
      return <DateField {...props} field={field} />;
  }
}
