"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import type { PersonData } from "@/components/ui/person-search";
import { getService, letterReference, type LetterId } from "@/app/layanan-surat/data/services";
import { ROUTE_BASE } from "@/app/layanan-surat/route-base";
import LayananHeader from "../LayananHeader";
import { useLayananSession } from "../LayananSession";
import AutofillStrip from "./AutofillStrip";
import LivePreview from "./LivePreview";
import { FieldControl, fieldId } from "./fields";
import { letterConfigs } from "./letters";
import {
  requiredFields,
  sectionProgressLabel,
  type LetterValues,
  type SectionDef,
} from "./types";

const MAIN_SLOT = "main";

function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

const scrollBehavior = (): ScrollBehavior =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

interface Downloaded {
  filename: string;
  url: string;
}

export default function LetterWorkspace({ letterId }: { letterId: LetterId }) {
  const service = getService(letterId);
  const config = letterConfigs[letterId];
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading, requestLogin } = useLayananSession();
  const isDesktop = useMediaQuery("(min-width: 900px)");

  const [values, setValues] = useState<LetterValues>(config.initialValues);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  /** Field name → autofill slot that filled it; removed once the user edits the field. */
  const [autofilled, setAutofilled] = useState<Record<string, string>>({});
  const [sources, setSources] = useState<Record<string, PersonData>>({});
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState<Downloaded | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const required = useMemo(() => requiredFields(config.sections), [config]);
  const errors = useMemo(() => config.validate(values), [config, values]);
  const filledCount = required.filter((field) => values[field.name]?.trim()).length;
  const dirty = Object.keys(values).some((name) => values[name] !== config.initialValues[name]);

  useEffect(() => {
    if (!downloaded) return;
    return () => URL.revokeObjectURL(downloaded.url);
  }, [downloaded]);

  const setValue = (name: string, value: string) => {
    setValues((current) => ({ ...current, [name]: value }));
    setAutofilled(({ [name]: _removed, ...rest }) => rest);
    setDownloaded(null);
  };

  const applyPerson = (slot: string, person: PersonData, partial: Partial<LetterValues>) => {
    const filled = Object.entries(partial).filter(
      (entry): entry is [string, string] => typeof entry[1] === "string"
    );
    setValues((current) => ({ ...current, ...Object.fromEntries(filled) }));
    setAutofilled((current) => ({
      ...Object.fromEntries(Object.entries(current).filter(([, owner]) => owner !== slot)),
      ...Object.fromEntries(filled.filter(([, value]) => value.trim()).map(([name]) => [name, slot])),
    }));
    setSources((current) => ({ ...current, [slot]: person }));
    setDownloaded(null);
  };

  const clearSource = (slot: string) => {
    setSources(({ [slot]: _removed, ...rest }) => rest);
    setAutofilled((current) =>
      Object.fromEntries(Object.entries(current).filter(([, owner]) => owner !== slot))
    );
  };

  const reset = () => {
    setValues(config.initialValues);
    setTouched({});
    setSubmitted(false);
    setAutofilled({});
    setSources({});
    setDownloaded(null);
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
  };

  const visibleError = (name: string) =>
    submitted || touched[name] ? errors[name] : undefined;

  const sectionComplete = (section: SectionDef) =>
    section.fields.every(
      (field) => !errors[field.name] && (field.optional || values[field.name]?.trim())
    );

  const scrollToSection = (index: string) => {
    document
      .getElementById(`section-${index}`)
      ?.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
  };

  const handleDownload = async () => {
    setSubmitted(true);
    const firstError = config.sections
      .flatMap((section) => section.fields)
      .find((field) => errors[field.name]);
    if (firstError) {
      const element = document.getElementById(fieldId(firstError.name));
      element?.scrollIntoView({ behavior: scrollBehavior(), block: "center" });
      element?.focus({ preventScroll: true });
      return;
    }

    setDownloading(true);
    try {
      const result = await config.download(values);
      if (result) {
        toast({
          title: "Surat Berhasil Dibuat",
          description: `${service.title} telah berhasil dibuat dan diunduh`,
        });
        setDownloaded({ filename: result.filename, url: URL.createObjectURL(result.blob) });
      } else {
        toast({
          title: "Gagal Membuat Surat",
          description: "Terjadi kesalahan saat membuat surat. Silakan coba lagi.",
          variant: "destructive",
        });
      }
    } finally {
      setDownloading(false);
    }
  };

  const handleCancel = () => {
    if (dirty && !window.confirm("Batalkan pembuatan surat? Data yang sudah diisi akan hilang.")) {
      return;
    }
    router.push(ROUTE_BASE);
  };

  const closePreview = useCallback(() => setPreviewOpen(false), []);

  const header = (
    <LayananHeader
      compact
      title={service.title}
      subtitle={`${letterReference(service)} · ${service.category}`}
      currentLabel={service.title}
      facts={[
        { value: String(required.length), label: "Kolom wajib" },
        { value: "PDF", label: "Hasil unduhan" },
      ]}
    />
  );

  if (loading) {
    return (
      <>
        {header}
        <main className="workspace" aria-busy="true">
          <div className="form-column workspace-skeleton" aria-label="Memuat formulir">
            <span className="skeleton-block is-strip" />
            <span className="skeleton-block is-line" />
            <span className="skeleton-block is-field" />
            <span className="skeleton-block is-field" />
            <span className="skeleton-block is-field" />
          </div>
          <div className="workspace-skeleton desktop-only">
            <span className="skeleton-block is-sheet" />
          </div>
        </main>
      </>
    );
  }

  if (!user) {
    return (
      <>
        {header}
        <main className="workspace is-logged-out">
          <div className="login-ledger">
            <span className="micro-label">Akses petugas</span>
            <h2>Masuk untuk membuat surat</h2>
            <p>Gunakan akun petugas desa untuk mengisi dan mengunduh surat.</p>
            <button className="primary-button" type="button" onClick={() => requestLogin()}>
              Login
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      {header}
      <main className="workspace">
        <div className="form-column">
          <AutofillStrip
            id="ls-autofill-main"
            label="Isi otomatis dari database"
            placeholder={config.searchPlaceholder}
            person={sources[MAIN_SLOT]}
            onSelect={(person) => applyPerson(MAIN_SLOT, person, config.fromPerson(person))}
            onClear={() => clearSource(MAIN_SLOT)}
          />

          <nav className="section-progress" aria-label="Bagian formulir">
            {config.sections.map((section) => {
              const done = sectionComplete(section);
              return (
                <button type="button" key={section.index} onClick={() => scrollToSection(section.index)}>
                  {done && (
                    <span className="progress-check" aria-label="lengkap">
                      ✓
                    </span>
                  )}
                  <b>{section.index}</b> {sectionProgressLabel(section)}
                </button>
              );
            })}
          </nav>

          <form noValidate onSubmit={(event) => event.preventDefault()}>
            {config.sections.map((section) => (
              <section
                className="form-section"
                id={`section-${section.index}`}
                key={section.index}
                aria-labelledby={`section-${section.index}-title`}
              >
                <div className="form-section-heading">
                  <span aria-hidden="true">{section.index}</span>
                  <h2 id={`section-${section.index}-title`}>{section.title}</h2>
                </div>
                {section.autofill && (
                  <AutofillStrip
                    compact
                    id={`ls-autofill-${section.index}`}
                    label={`Isi otomatis ${section.title.replace(/^Data /, "").toLowerCase()}`}
                    placeholder={section.autofill.placeholder}
                    person={sources[section.index]}
                    onSelect={(person) =>
                      applyPerson(section.index, person, section.autofill!.fromPerson(person))
                    }
                    onClear={() => clearSource(section.index)}
                  />
                )}
                <div className="field-grid">
                  {section.fields.map((field) => (
                    <FieldControl
                      key={field.name}
                      field={field}
                      value={values[field.name] ?? ""}
                      error={visibleError(field.name)}
                      autofilled={field.name in autofilled}
                      onChange={(value) => setValue(field.name, value)}
                      onBlur={() => setTouched((current) => ({ ...current, [field.name]: true }))}
                    />
                  ))}
                </div>
              </section>
            ))}
          </form>
        </div>

        <LivePreview
          config={config}
          values={values}
          title={service.title}
          enabled={isDesktop || previewOpen}
          mobileOpen={previewOpen}
          onMobileClose={closePreview}
        />
      </main>

      <div className="workspace-actions">
        <div className="workspace-action-inner">
          {downloaded ? (
            <div className="download-status" role="status">
              <span>
                Surat diunduh · <span className="download-filename">{downloaded.filename}</span>
              </span>
              <button type="button" onClick={reset}>
                Buat surat lain
              </button>
              <button
                type="button"
                onClick={() => window.open(downloaded.url, "_blank", "noopener,noreferrer")}
              >
                Cetak
              </button>
            </div>
          ) : (
            <span className="completion-status">
              <strong>{filledCount}</strong> / <strong>{required.length}</strong> kolom wajib terisi
            </span>
          )}
          <div className="workspace-buttons">
            <button className="preview-trigger" type="button" onClick={() => setPreviewOpen(true)}>
              Lihat pratinjau
            </button>
            <button className="text-action muted-action cancel-action" type="button" onClick={handleCancel}>
              Batal
            </button>
            <button
              className="primary-button download-button"
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              aria-busy={downloading}
            >
              {downloading ? (
                "Memproses…"
              ) : (
                <>
                  Unduh surat <span aria-hidden="true">↓</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
