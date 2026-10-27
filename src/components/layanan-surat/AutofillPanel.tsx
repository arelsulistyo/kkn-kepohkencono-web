"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { PersonData } from "@/components/ui/person-search";
import ExcelUploadModal from "./ExcelUploadModal";
import ResidentSearch from "./ResidentSearch";
import { useLayananSession } from "./LayananSession";
import { ChevronGlyph } from "./glyphs";

const STORAGE_KEY = "ls-autofill-panel-open";

const features = [
  [
    "Pencarian Otomatis",
    "Ketik nama atau NIK untuk mencari data warga secara otomatis. Sistem akan menampilkan saran yang sesuai.",
  ],
  [
    "Pengisian Cepat",
    "Pilih dari hasil pencarian untuk mengisi formulir secara otomatis. Hemat waktu dan hindari kesalahan input.",
  ],
  ["Perbarui Data Database", "Perbarui data warga secara massal dengan mengupload file Excel."],
] as const;

export default function AutofillPanel() {
  const { user, requestLogin } = useLayananSession();
  const { toast } = useToast();
  const [expanded, setExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [person, setPerson] = useState<PersonData | null>(null);

  useEffect(() => {
    try {
      setExpanded(window.localStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      // Storage unavailable (private mode); keep the collapsed default.
    }
  }, []);

  const toggle = () => {
    const next = !expanded;
    setExpanded(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch {
      // Ignore: the panel still works, it just won't remember its state.
    }
  };

  const handleUploadExcelClick = () => {
    if (!user) {
      toast({
        title: "Login Diperlukan",
        description: "Silakan login terlebih dahulu untuk menggunakan fitur upload Excel.",
        variant: "destructive",
      });
      requestLogin(() => setIsModalOpen(true));
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <section
      className={`autofill-panel ${expanded ? "is-expanded" : ""}`}
      aria-labelledby="ls-autofill-heading"
    >
      <div className="autofill-heading">
        <p className="ls-kicker">database warga</p>
        <h3 id="ls-autofill-heading">Fitur Auto-Fill Database</h3>
        <p>Sistem pencarian otomatis untuk mempercepat pengisian formulir</p>
      </div>
      <button
        type="button"
        className="autofill-toggle"
        aria-expanded={expanded}
        aria-controls="ls-autofill-content"
        onClick={toggle}
      >
        {expanded ? "Tutup" : "Buka"}
        <span className="sr-only"> fitur auto-fill</span>
        <ChevronGlyph />
      </button>

      <div id="ls-autofill-content" className="autofill-open" hidden={!expanded}>
        <div className="autofill-cards">
          {features.map(([title, description], index) => (
            <article key={title}>
              <strong aria-hidden="true">{String.fromCharCode(65 + index)}</strong>
              <div>
                <h4>{title}</h4>
                <p>{description}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="autofill-tools">
          <div className="resident-search">
            <span className="sr-only" id="ls-panel-search-label">
              Pencarian data penduduk
            </span>
            {user ? (
              <ResidentSearch
                labelledBy="ls-panel-search-label"
                placeholder="Ketik nama atau NIK…"
                onSelect={setPerson}
              />
            ) : (
              <p className="login-hint">
                Pencarian data penduduk hanya untuk petugas.{" "}
                <button type="button" className="text-action" onClick={() => requestLogin()}>
                  Login
                </button>
              </p>
            )}
          </div>
          <button type="button" className="upload-button" onClick={handleUploadExcelClick}>
            Upload data Excel
          </button>
        </div>

        {person && user && (
          <div className="selected-resident panel-resident" role="status">
            <span>
              <strong>{person.NAMA}</strong> · NIK {person.NIK} · KK {person.NO_KK} · RT {person.RT}/RW{" "}
              {person.RW}
            </span>
            <button type="button" onClick={() => setPerson(null)}>
              Tutup
            </button>
          </div>
        )}
      </div>

      <ExcelUploadModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </section>
  );
}
