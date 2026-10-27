"use client";

import { useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { LS_ROOT_CLASS } from "@/app/layanan-surat/fonts";
import { DRIVE_FOLDER_URL, letterReference, type Service } from "@/app/layanan-surat/data/services";
import { CreateLetterLink } from "./LetterCard";
import { CloseGlyph } from "./glyphs";

interface PreviewOverlayProps {
  service: Service | null;
  createHref: string;
  onCreateBlocked?: () => void;
  onClose: () => void;
  /** Element to refocus after closing (the "Lihat contoh" button that opened it). */
  returnFocusTo: HTMLElement | null;
}

type SheetState = "loading" | "ready" | "error";

function SampleSheet({ service }: { service: Service }) {
  const [state, setState] = useState<SheetState>("loading");

  useEffect(() => {
    // Ignore a late result instead of aborting: an aborted fetch surfaces as an
    // AbortError in the Next dev overlay.
    let active = true;
    fetch(service.previewPdf, { method: "HEAD" })
      .then((response) => {
        if (active && !response.ok) setState("error");
      })
      .catch(() => {
        if (active) setState("error");
      });
    return () => {
      active = false;
    };
  }, [service.previewPdf]);

  if (state === "error") {
    return (
      <div className="sheet-error" role="alert">
        <p>Contoh surat tidak dapat dimuat.</p>
        <a href={DRIVE_FOLDER_URL} target="_blank" rel="noopener noreferrer">
          Buka folder Google Drive <span aria-hidden="true">↗</span>
        </a>
      </div>
    );
  }

  return (
    <div className="sheet-frame">
      {state === "loading" && (
        <div className="sheet-placeholder" aria-label="Memuat contoh surat" role="status">
          {Array.from({ length: 14 }, (_, i) => (
            <span key={i} />
          ))}
        </div>
      )}
      <iframe
        src={service.previewPdf}
        title={`Contoh ${service.title}`}
        className={state === "ready" ? "is-ready" : ""}
        onLoad={() => setState((current) => (current === "error" ? current : "ready"))}
      />
    </div>
  );
}

export default function PreviewOverlay({
  service,
  createHref,
  onCreateBlocked,
  onClose,
  returnFocusTo,
}: PreviewOverlayProps) {
  return (
    <DialogPrimitive.Root open={service !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={`${LS_ROOT_CLASS} ls-backdrop preview-backdrop`} />
        <DialogPrimitive.Content
          className={`${LS_ROOT_CLASS} preview-dialog`}
          aria-describedby={undefined}
          onCloseAutoFocus={(event) => {
            if (returnFocusTo) {
              event.preventDefault();
              returnFocusTo.focus();
            }
          }}
        >
          {service && (
            <>
              <header className="preview-topbar">
                <div>
                  <p className="preview-ref">
                    {letterReference(service)} · {service.category}
                  </p>
                  <DialogPrimitive.Title asChild>
                    <h2>{service.title}</h2>
                  </DialogPrimitive.Title>
                </div>
                <div className="preview-top-actions">
                  <CreateLetterLink
                    href={createHref}
                    onBlocked={onCreateBlocked}
                    className="desktop-only"
                  />
                  <DialogPrimitive.Close className="round-close" aria-label="Tutup">
                    <CloseGlyph />
                  </DialogPrimitive.Close>
                </div>
              </header>

              <div className="preview-body">
                <section className="preview-desk document-reader" aria-label="Contoh surat">
                  <SampleSheet key={service.id} service={service} />
                </section>

                <aside className="sample-detail">
                  <h3 className="ls-kicker">detail template</h3>
                  <dl className="template-stats">
                    <div>
                      <dt>Format</dt>
                      <dd>PDF</dd>
                    </div>
                    <div>
                      <dt>Kategori</dt>
                      <dd>{service.category}</dd>
                    </div>
                    <div>
                      <dt>Kode</dt>
                      <dd>{service.code}</dd>
                    </div>
                  </dl>

                  <h3 className="ls-kicker detail-label">persyaratan dokumen</h3>
                  <ul className="service-requirements">
                    {service.requirements.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>

                  <h3 className="ls-kicker detail-label">tautan</h3>
                  <nav className="template-links" aria-label="Tautan template">
                    {[
                      ["Edit manual", service.templateDocUrl],
                      ["Buka di Google Drive", DRIVE_FOLDER_URL],
                      ["Lihat PDF penuh", service.previewPdf],
                    ].map(([label, href]) => (
                      <a key={label} href={href} target="_blank" rel="noopener noreferrer">
                        {label}
                        <span aria-hidden="true">↗</span>
                        <span className="sr-only"> (tab baru)</span>
                      </a>
                    ))}
                  </nav>
                </aside>
              </div>

              <div className="preview-mobile-action">
                <CreateLetterLink href={createHref} onBlocked={onCreateBlocked} className="ls-block-button" />
              </div>
            </>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
