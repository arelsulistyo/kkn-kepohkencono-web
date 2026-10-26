"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import LayananHeader from "@/components/layanan-surat/LayananHeader";
import StepsGuide from "@/components/layanan-surat/StepsGuide";
import AutofillPanel from "@/components/layanan-surat/AutofillPanel";
import ServiceTools, { type CategoryFilter } from "@/components/layanan-surat/ServiceTools";
import LetterCard from "@/components/layanan-surat/LetterCard";
import PreviewOverlay from "@/components/layanan-surat/PreviewOverlay";
import SiteFooter from "@/components/layanan-surat/SiteFooter";
import { useLayananSession } from "@/components/layanan-surat/LayananSession";
import { CATEGORIES, services, type Service } from "./data/services";
import { createLetterHref } from "./route-base";

const categoryCounts = Object.fromEntries([
  ["Semua", services.length],
  ...CATEGORIES.map((category) => [
    category,
    services.filter((service) => service.category === category).length,
  ]),
]) as Record<CategoryFilter, number>;

export default function LayananSuratPage() {
  const router = useRouter();
  const { user, loading, requestLogin } = useLayananSession();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("Semua");
  const [previewService, setPreviewService] = useState<Service | null>(null);
  const [previewTrigger, setPreviewTrigger] = useState<HTMLElement | null>(null);

  const filteredServices = useMemo(() => {
    const needle = query.toLowerCase().trim();
    return services.filter(
      (service) =>
        (category === "Semua" || service.category === category) &&
        (!needle ||
          `${service.code} ${service.title} ${service.description}`.toLowerCase().includes(needle))
    );
  }, [category, query]);

  // Logged out: "Buat surat" asks for login first, then continues to the letter.
  // While auth is still resolving, navigate normally; the create page has its own gate.
  const blockedCreate = (service: Service) =>
    user || loading
      ? undefined
      : () => {
          setPreviewService(null);
          requestLogin(() => router.push(createLetterHref(service.id)));
        };

  return (
    <>
      <LayananHeader
        title="Layanan Surat Desa"
        subtitle="Template Siap Pakai untuk Administrasi Desa Kepohkencono"
        facts={[
          { value: String(services.length), label: "Template surat" },
          { value: "PDF", label: "Siap cetak" },
        ]}
      />

      <main>
        <StepsGuide />
        <AutofillPanel />

        <section className="section services-section" aria-labelledby="ls-services-heading">
          <div className="services-heading">
            <h2 id="ls-services-heading">Pilih Jenis Surat</h2>
            <p className="result-count" aria-live="polite">
              Menunjukkan <strong>{filteredServices.length}</strong> dari{" "}
              <strong>{services.length}</strong> template
            </p>
          </div>

          <ServiceTools
            query={query}
            onQueryChange={setQuery}
            category={category}
            onCategoryChange={setCategory}
            counts={categoryCounts}
          />

          {filteredServices.length > 0 ? (
            <ul className="letter-grid">
              {filteredServices.map((service) => (
                <LetterCard
                  key={service.id}
                  service={service}
                  createHref={createLetterHref(service.id)}
                  onCreateBlocked={blockedCreate(service)}
                  onPreview={(trigger) => {
                    setPreviewTrigger(trigger);
                    setPreviewService(service);
                  }}
                />
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              <p>Tidak ada surat yang cocok dengan pencarian.</p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCategory("Semua");
                }}
              >
                Hapus pencarian
              </button>
            </div>
          )}
        </section>
      </main>

      <SiteFooter />

      <PreviewOverlay
        service={previewService}
        createHref={previewService ? createLetterHref(previewService.id) : ""}
        onCreateBlocked={previewService ? blockedCreate(previewService) : undefined}
        onClose={() => setPreviewService(null)}
        returnFocusTo={previewTrigger}
      />
    </>
  );
}
