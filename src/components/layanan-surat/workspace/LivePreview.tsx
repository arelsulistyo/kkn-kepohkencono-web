"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CloseGlyph } from "../glyphs";
import type { LetterConfig, LetterValues } from "./types";

const DEBOUNCE_MS = 600;
/** Promote the new frame even if the PDF viewer never fires `load`. */
const LOAD_FALLBACK_MS = 2500;
const VIEWER_PARAMS = "#toolbar=0&navpanes=0&view=FitH";

interface LivePreviewProps {
  config: LetterConfig;
  values: LetterValues;
  title: string;
  enabled: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function LivePreview({
  config,
  values,
  title,
  enabled,
  mobileOpen,
  onMobileClose,
}: LivePreviewProps) {
  const [shown, setShown] = useState<string | null>(null);
  const [pending, setPending] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const shownRef = useRef<string | null>(null);
  const pendingRef = useRef<string | null>(null);
  const hasBuilt = useRef(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const valuesKey = JSON.stringify(values);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    const timer = setTimeout(
      async () => {
        try {
          const doc = await config.buildPreview(JSON.parse(valuesKey));
          if (cancelled) return;
          hasBuilt.current = true;
          const url = URL.createObjectURL(doc.output("blob"));
          pendingRef.current = url;
          setFailed(false);
          setPending(url);
        } catch (error) {
          console.error("Gagal membuat pratinjau:", error);
          if (!cancelled) setFailed(true);
        }
      },
      hasBuilt.current ? DEBOUNCE_MS : 0
    );
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [config, valuesKey, enabled]);

  const promote = useCallback((url: string) => {
    if (url !== pendingRef.current) return;
    pendingRef.current = null;
    shownRef.current = url;
    setShown(url);
    setPending(null);
  }, []);

  // A pending URL is revoked when superseded, unless it was promoted.
  useEffect(() => {
    if (!pending) return;
    const fallback = setTimeout(() => promote(pending), LOAD_FALLBACK_MS);
    return () => {
      clearTimeout(fallback);
      if (pending !== shownRef.current) URL.revokeObjectURL(pending);
    };
  }, [pending, promote]);

  // The shown URL is revoked when replaced and on unmount.
  useEffect(() => {
    if (!shown) return;
    return () => URL.revokeObjectURL(shown);
  }, [shown]);

  useEffect(() => {
    if (!mobileOpen) return;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onMobileClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen, onMobileClose]);

  const updating = enabled && !failed && (pending !== null || !shown);
  const frames = [shown, pending].filter((url): url is string => url !== null);

  return (
    <aside
      className={`live-preview ${mobileOpen ? "is-open" : ""}`}
      aria-label="Pratinjau surat"
      {...(mobileOpen ? { role: "dialog", "aria-modal": true } : {})}
    >
      <div className="live-preview-heading">
        <p className="ls-kicker">pratinjau surat</p>
        <span className={`preview-status ${failed ? "is-error" : ""}`} role="status">
          {failed ? "Pratinjau gagal dimuat" : updating ? "Memperbarui…" : ""}
        </span>
        <button
          ref={closeRef}
          type="button"
          className="round-close mobile-preview-close"
          aria-label="Tutup pratinjau"
          onClick={onMobileClose}
        >
          <CloseGlyph />
        </button>
      </div>

      <div className="preview-desk">
        <div className="letter-frame">
          {!shown && (
            <div className="sheet-placeholder" aria-hidden="true">
              {Array.from({ length: 14 }, (_, i) => (
                <span key={i} />
              ))}
            </div>
          )}
          {frames.map((url) => {
            const buffering = url === pending;
            return (
              <iframe
                key={url}
                src={url + VIEWER_PARAMS}
                title={`Pratinjau ${title}`}
                className={buffering ? "is-buffer" : ""}
                aria-hidden={buffering || undefined}
                tabIndex={buffering ? -1 : undefined}
                onLoad={buffering ? () => promote(url) : undefined}
              />
            );
          })}
        </div>
      </div>
      {shown && (
        <a className="preview-open-link" href={shown} target="_blank" rel="noopener noreferrer">
          Buka pratinjau di tab baru <span aria-hidden="true">↗</span>
        </a>
      )}
    </aside>
  );
}
