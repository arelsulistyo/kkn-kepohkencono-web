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
    <section className={`section database-panel ${expanded ? "is-expanded" : ""}`}>
      <button
        type="button"
        className="database-toggle"
        aria-expanded={expanded}
        aria-controls="ls-autofill-content"
        onClick={toggle}
      >
        <span className="database-heading">
          <span className="micro-label">Database</span>
          <strong>Fitur Auto-Fill Database</strong>
          <span>Sistem pencarian otomatis untuk mempercepat pengisian formulir</span>
        </span>
        <span className="toggle-state">
          {expanded ? "Tutup" : "Buka"}
          <span className="chevron">
            <ChevronGlyph />
          </span>
        </span>
      </button>

      <div id="ls-autofill-content" className="database-content" hidden={!expanded}>
        <div className="database-features">
          {features.map(([title, description], index) => (
            <div className="database-feature" key={title}>
              <span className="feature-index" aria-hidden="true">
                {String.fromCharCode(65 + index)}
              </span>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>

        <div className="database-tools">
          <div className="resident-search">
            <span className="micro-label" id="ls-panel-search-label">
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
