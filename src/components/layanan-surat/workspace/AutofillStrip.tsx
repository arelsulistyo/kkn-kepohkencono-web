"use client";

import type { PersonData } from "@/components/ui/person-search";
import ResidentSearch from "../ResidentSearch";

interface AutofillStripProps {
  id: string;
  label: string;
  placeholder: string;
  person: PersonData | undefined;
  onSelect: (person: PersonData) => void;
  onClear: () => void;
  compact?: boolean;
}

export default function AutofillStrip({
  id,
  label,
  placeholder,
  person,
  onSelect,
  onClear,
  compact = false,
}: AutofillStripProps) {
  return (
    <div className={`create-autofill ${compact ? "is-compact" : ""}`}>
      <p className="ls-kicker" id={`${id}-label`}>
        {label}
      </p>
      {person ? (
        <div className="selected-resident" role="status">
          <span>
            Data diisi dari <strong>{person.NAMA}</strong> · NIK {person.NIK}
          </span>
          <button type="button" className="chip-button" onClick={onClear}>
            Ganti
          </button>
        </div>
      ) : (
        <>
          <ResidentSearch
            labelledBy={`${id}-label`}
            describedBy={`${id}-help`}
            placeholder={placeholder}
            onSelect={onSelect}
          />
          <p id={`${id}-help`}>
            Pilih nama dari hasil pencarian, data akan terisi otomatis ke formulir di bawah.
          </p>
        </>
      )}
    </div>
  );
}
