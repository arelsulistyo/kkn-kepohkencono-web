"use client";

import { useEffect, useId, useState } from "react";
import {
  fetchPersonData,
  PersonAccessError,
  searchPersons,
  type PersonData,
  type PersonSearchResult,
} from "@/components/ui/person-search";
import { SearchGlyph } from "./glyphs";

interface ResidentSearchProps {
  placeholder: string;
  onSelect: (person: PersonData) => void;
  labelledBy: string;
  describedBy?: string;
}

type SearchState =
  | { status: "idle" }
  | { status: "searching" }
  | { status: "done"; results: PersonSearchResult[] }
  | { status: "error"; message: string };

const errorMessage = (error: unknown, fallback: string) =>
  error instanceof PersonAccessError ? error.message : fallback;

export default function ResidentSearch({
  placeholder,
  onSelect,
  labelledBy,
  describedBy,
}: ResidentSearchProps) {
  const listId = useId();
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState<SearchState>({ status: "idle" });
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [loadingPerson, setLoadingPerson] = useState(false);
  const [selectError, setSelectError] = useState("");

  const trimmed = query.trim();

  useEffect(() => {
    if (trimmed.length < 2) {
      setSearch({ status: "idle" });
      return;
    }
    let cancelled = false;
    setSearch({ status: "searching" });
    const timer = setTimeout(async () => {
      try {
        const results = await searchPersons(trimmed);
        if (cancelled) return;
        setSearch({ status: "done", results });
        setActive(results.length ? 0 : -1);
      } catch (error) {
        if (!cancelled) {
          setSearch({ status: "error", message: errorMessage(error, "Pencarian gagal. Silakan coba lagi.") });
        }
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [trimmed]);

  const results = search.status === "done" ? search.results : [];

  const choose = async (result: PersonSearchResult) => {
    setLoadingPerson(true);
    setSelectError("");
    try {
      const person = await fetchPersonData(result.NIK);
      if (!person) {
        setSelectError("Data penduduk tidak ditemukan.");
        return;
      }
      onSelect(person);
      setOpen(false);
      setQuery("");
    } catch (error) {
      setSelectError(errorMessage(error, "Gagal memuat data penduduk."));
    } finally {
      setLoadingPerson(false);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      if (!results.length) return;
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActive((current) => (current + step + results.length) % results.length);
    } else if (event.key === "Enter") {
      if (open && results[active]) {
        event.preventDefault();
        void choose(results[active]);
      }
    } else if (event.key === "Escape" && open) {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
    }
  };

  const statusText = loadingPerson
    ? "Memuat data penduduk…"
    : selectError ||
      (search.status === "searching"
        ? "Mencari…"
        : search.status === "error"
          ? search.message
          : search.status === "done" && !results.length
            ? "Tidak ada data ditemukan."
            : "");

  const expanded = open && trimmed.length >= 2;

  return (
    <div className="resident-search-field">
      <span className="input-wrap">
        <SearchGlyph />
        <input
          type="search"
          role="combobox"
          aria-labelledby={labelledBy}
          aria-describedby={describedBy}
          aria-autocomplete="list"
          aria-expanded={expanded}
          aria-controls={listId}
          aria-activedescendant={expanded && results[active] ? `${listId}-${active}` : undefined}
          placeholder={placeholder}
          autoComplete="off"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setSelectError("");
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
        />
      </span>
      {expanded && (
        <div className="resident-results">
          {statusText && (
            <p className={`resident-status ${search.status === "error" || selectError ? "is-error" : ""}`} role="status">
              {statusText}
            </p>
          )}
          <ul id={listId} role="listbox" aria-labelledby={labelledBy}>
            {results.map((result, index) => (
              <li
                key={result.NIK}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={index === active}
                className={index === active ? "is-active" : ""}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActive(index)}
                onClick={() => void choose(result)}
              >
                <strong>{result.NAMA}</strong>
                <span>
                  NIK {result.NIK}
                  {(result.RT || result.RW) && ` · RT ${result.RT}/RW ${result.RW}`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
