"use client";

import Link from "next/link";
import { ROUTE_BASE } from "@/app/layanan-surat/route-base";
import { useLayananSession } from "./LayananSession";
import { LockGlyph } from "./glyphs";

interface HeaderFact {
  value: string;
  label: string;
}

interface LayananHeaderProps {
  title: string;
  subtitle: string;
  facts: [HeaderFact, HeaderFact];
  /** Title of the current letter; adds a third breadcrumb and links the middle one back to the list. */
  currentLabel?: string;
  compact?: boolean;
}

export default function LayananHeader({
  title,
  subtitle,
  facts,
  currentLabel,
  compact = false,
}: LayananHeaderProps) {
  const { user, loading, logout, requestLogin } = useLayananSession();

  return (
    <header className={`service-header ${compact ? "is-compact" : ""}`}>
      <div className="service-header-inner">
        <div className="service-nav-row">
          <nav className="service-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Beranda</Link>
            <span aria-hidden="true">/</span>
            {currentLabel ? (
              <>
                <Link href={ROUTE_BASE}>Layanan Surat</Link>
                <span aria-hidden="true">/</span>
                <strong aria-current="page">{currentLabel}</strong>
              </>
            ) : (
              <strong aria-current="page">Layanan Surat</strong>
            )}
          </nav>

          <div className="service-account" aria-live="polite">
            {loading ? (
              <span className="account-placeholder" aria-hidden="true" />
            ) : user ? (
              <>
                <span className="account-helper">Masuk sebagai</span>
                <span className="account-email" title={user.email ?? undefined}>
                  {user.email}
                </span>
                <button type="button" className="account-button" onClick={logout}>
                  Keluar
                </button>
              </>
            ) : (
              <>
                <span className="account-helper">Khusus perangkat desa</span>
                <button
                  type="button"
                  className="account-button"
                  onClick={() => requestLogin()}
                >
                  <LockGlyph />
                  Login
                </button>
              </>
            )}
          </div>
        </div>

        <div className="service-title-row">
          <div className="service-title-copy">
            <h1>{title}</h1>
            <p>{subtitle}</p>
            {user?.email && <p className="mobile-account-email">Masuk sebagai {user.email}</p>}
          </div>
          <div className="service-facts">
            {facts.map((fact) => (
              <div key={fact.label}>
                <strong>{fact.value}</strong>
                <span>{fact.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
