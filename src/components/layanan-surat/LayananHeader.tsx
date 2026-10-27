"use client";

import Link from "next/link";
import { ROUTE_BASE } from "@/app/layanan-surat/route-base";
import { useLayananSession } from "./LayananSession";
import KepohMark from "@/components/site/KepohMark";
import { LockGlyph } from "./glyphs";

interface HeaderFact {
  value: string;
  label: string;
}

interface LayananHeaderProps {
  title: string;
  subtitle: string;
  facts: [HeaderFact, HeaderFact];
  /** Title of the current letter; adds a second crumb and links the first one back to the list. */
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
    <>
      <header className="service-header">
        <div className="service-topbar">
          <nav className="service-identity" aria-label="Breadcrumb">
            <Link href="/" className="service-wordmark">
              <KepohMark />
              Kepohkencono
            </Link>
            {currentLabel ? (
              <>
                <Link href={ROUTE_BASE} className="crumb">
                  Layanan Surat
                </Link>
                <span className="crumb crumb-current" aria-current="page">
                  {currentLabel}
                </span>
              </>
            ) : (
              <span className="crumb crumb-current" aria-current="page">
                Layanan Surat
              </span>
            )}
          </nav>

          <div className="service-account" aria-live="polite">
            {loading ? (
              <span className="account-placeholder" aria-hidden="true" />
            ) : user ? (
              <>
                <span className="account-avatar" aria-hidden="true">
                  {user.email?.charAt(0).toUpperCase()}
                </span>
                <span className="account-email" title={user.email ?? undefined}>
                  {user.email}
                </span>
                <button
                  type="button"
                  className="account-logout"
                  onClick={logout}
                >
                  Keluar
                </button>
              </>
            ) : (
              <>
                <em className="account-helper">khusus perangkat desa</em>
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => requestLogin()}
                >
                  <LockGlyph />
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className={`service-banner ${compact ? "is-compact" : ""}`}>
        <div className="service-banner-copy">
          <p className="ls-kicker">untuk perangkat desa</p>
          <h1>{title}</h1>
          <p className={compact ? "service-code" : "service-subtitle"}>
            {subtitle}
          </p>
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
    </>
  );
}
