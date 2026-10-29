"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDialog } from "./hooks";
import KepohMark from "./KepohMark";

export type NavId =
  | "beranda"
  | "tentang"
  | "dukuh"
  | "budaya"
  | "data"
  | "galeri"
  | "kontak";

const NAV_ITEMS: { id: NavId; label: string; href: string }[] = [
  { id: "beranda", label: "Beranda", href: "/" },
  { id: "tentang", label: "Tentang", href: "/#tentang" },
  { id: "dukuh", label: "Dukuh", href: "/#dukuh" },
  { id: "budaya", label: "Budaya", href: "/#budaya" },
  { id: "data", label: "Data", href: "/visualisasi-data" },
  { id: "galeri", label: "Galeri", href: "/#galeri" },
  { id: "kontak", label: "Kontak", href: "/#kontak" },
];

type SiteNavProps = { active: NavId } & (
  | { variant: "solid" }
  | { variant: "overlay"; revealAfter: string }
);

export default function SiteNav(props: SiteNavProps) {
  const { variant, active } = props;
  const revealAfter = props.variant === "overlay" ? props.revealAfter : null;
  const [revealed, setRevealed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  useDialog(menuOpen, closeMenu, sheetRef, menuButtonRef);

  useEffect(() => {
    if (revealAfter === null) return;
    const target = document.getElementById(revealAfter);
    const onScroll = () => {
      const covered = target?.getBoundingClientRect().bottom ?? 0;
      setRevealed(covered <= (headerRef.current?.offsetHeight ?? 0));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [revealAfter]);

  const hidden = variant === "overlay" && !revealed;

  return (
    <>
      <header
        className={`site-nav ${hidden ? "is-hidden" : ""}`}
        ref={headerRef}
      >
        <Link className="wordmark" href="/" aria-label="Kepohkencono, beranda">
          <KepohMark />
          Kepohkencono
        </Link>
        <nav className="desktop-nav" aria-label="Navigasi utama">
          {NAV_ITEMS.map((item) => (
            <Link
              className={item.id === active ? "active" : ""}
              aria-current={item.id === active ? "page" : undefined}
              href={item.href}
              key={item.id}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          className="menu-button"
          aria-expanded={menuOpen}
          aria-controls="kp-mobile-menu"
          aria-label="Buka menu"
          onClick={() => setMenuOpen(true)}
          ref={menuButtonRef}
          type="button"
        >
          <Menu aria-hidden="true" size={26} strokeWidth={1.7} />
        </button>
      </header>

      <div
        className={`mobile-sheet ${menuOpen ? "is-open" : ""}`}
        id="kp-mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu navigasi"
        inert={!menuOpen}
        ref={sheetRef}
      >
        <div className="mobile-sheet-top">
          <span className="wordmark">
            <KepohMark />
            Kepohkencono
          </span>
          <button aria-label="Tutup menu" onClick={closeMenu} type="button">
            <X aria-hidden="true" size={28} strokeWidth={1.7} />
          </button>
        </div>
        <nav aria-label="Navigasi seluler">
          {NAV_ITEMS.map((item, index) => (
            <Link
              aria-current={item.id === active ? "page" : undefined}
              href={item.href}
              key={item.id}
              onClick={closeMenu}
            >
              <span aria-hidden="true">0{index + 1}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
