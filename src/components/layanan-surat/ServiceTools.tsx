import { CATEGORIES, type LetterCategory } from "@/app/layanan-surat/data/services";
import { SearchGlyph } from "./glyphs";

export type CategoryFilter = "Semua" | LetterCategory;

interface ServiceToolsProps {
  query: string;
  onQueryChange: (query: string) => void;
  category: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
  counts: Record<CategoryFilter, number>;
}

export default function ServiceTools({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  counts,
}: ServiceToolsProps) {
  return (
    <div className="service-tools">
      <label className="service-search">
        <span className="sr-only">Cari layanan surat</span>
        <SearchGlyph />
        <input
          type="search"
          placeholder="Cari layanan surat…"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </label>
      <div className="filters-scroller">
        <div className="filters" role="group" aria-label="Filter kategori">
          {(["Semua", ...CATEGORIES] as const).map((filter) => (
            <button
              type="button"
              key={filter}
              className={category === filter ? "active" : ""}
              aria-pressed={category === filter}
              onClick={() => onCategoryChange(filter)}
            >
              <span>{filter}</span>
              <small>{counts[filter]}</small>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
