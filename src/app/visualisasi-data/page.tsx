"use client";

import { useState, useSyncExternalStore, type KeyboardEvent } from "react";
import SiteFooter from "@/components/site/SiteFooter";
import SiteNav from "@/components/site/SiteNav";
import { nextTabIndex } from "@/components/site/hooks";
import AdministrationPanel from "@/components/visualisasi-data/AdministrationPanel";
import DemographyPanel from "@/components/visualisasi-data/DemographyPanel";
import EducationPanel from "@/components/visualisasi-data/EducationPanel";
import EmploymentPanel from "@/components/visualisasi-data/EmploymentPanel";
import { CountUp, type TableState } from "@/components/visualisasi-data/charts";
import { akta, formatNumber, ktp, share, totals } from "@/lib/village-data";

const TABS = [
  { id: "demografi", label: "Demografi", Panel: DemographyPanel },
  { id: "pekerjaan", label: "Pekerjaan", Panel: EmploymentPanel },
  { id: "pendidikan", label: "Pendidikan", Panel: EducationPanel },
  { id: "administrasi", label: "Administrasi", Panel: AdministrationPanel },
] as const;

type TabId = (typeof TABS)[number]["id"];

const subscribeToHash = (onChange: () => void) => {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
};

function useHashTab(): TabId {
  const hash = useSyncExternalStore(
    subscribeToHash,
    () => window.location.hash.slice(1),
    () => "",
  );
  return TABS.find((tab) => tab.id === hash)?.id ?? TABS[0].id;
}

const selectTab = (id: TabId) => {
  // No element carries the bare tab id, so this pushes history without scrolling.
  window.location.hash = id;
};

export default function VisualisasiData() {
  const activeTab = useHashTab();
  const [openTables, setOpenTables] = useState<ReadonlySet<string>>(
    () => new Set(["gender"]),
  );
  const tables: TableState = {
    isOpen: (id) => openTables.has(id),
    toggle: (id) =>
      setOpenTables((current) => {
        const next = new Set(current);
        if (!next.delete(id)) next.add(id);
        return next;
      }),
  };

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const next = nextTabIndex(event.key, index, TABS.length);
    if (next === null) return;
    event.preventDefault();
    selectTab(TABS[next].id);
    document.getElementById(`tab-${TABS[next].id}`)?.focus();
  };

  const { Panel } = TABS.find((tab) => tab.id === activeTab) ?? TABS[0];
  const malePercent = share(totals.male, totals.population);

  return (
    <>
      <SiteNav variant="solid" active="data" />
      <main>
        <section className="data-hero">
          <div>
            <p className="section-index">dalam angka</p>
            <h1>Kepohkencono dalam angka</h1>
            <p>
              Jumlah penduduk, pekerjaan, pendidikan, dan dokumen kependudukan
              warga, dirangkum dari data desa.
            </p>
            <div className="key-numbers">
              <div>
                <strong>
                  <CountUp value={totals.population} />
                </strong>
                <span className="key-label">penduduk</span>
                <div className="key-split" aria-hidden="true">
                  <i className="male" style={{ width: `${malePercent}%` }} />
                  <i className="female" style={{ width: `${100 - malePercent}%` }} />
                </div>
                <em>
                  {formatNumber(totals.male)} L ·{" "}
                  {formatNumber(totals.female)} P
                </em>
              </div>
              <div>
                <strong>
                  <CountUp value={totals.households} />
                </strong>
                <span className="key-label">kepala keluarga</span>
                <em>
                  ± {formatNumber(totals.population / totals.households, 1)} jiwa
                  per keluarga
                </em>
              </div>
              <div>
                <strong>
                  <CountUp value={ktp.percent} decimals={1} suffix="%" />
                </strong>
                <span className="key-label">penduduk wajib KTP</span>
                <div className="key-progress" aria-hidden="true">
                  <i style={{ width: `${ktp.percent}%` }} />
                </div>
              </div>
              <div>
                <strong>
                  <CountUp value={akta.percent} suffix="%" />
                </strong>
                <span className="key-label">anak memiliki akta kelahiran</span>
                <div className="key-progress" aria-hidden="true">
                  <i style={{ width: `${akta.percent}%` }} />
                </div>
                <em>{formatNumber(akta.missing)} anak belum</em>
              </div>
            </div>
          </div>
        </section>

        <div className="data-tabs-shell">
          <div className="data-tabs" role="tablist" aria-label="Bagian data desa">
            {TABS.map((tab, index) => {
              const selected = tab.id === activeTab;
              return (
                <button
                  aria-controls={selected ? `panel-${tab.id}` : undefined}
                  aria-selected={selected}
                  className={selected ? "active" : ""}
                  id={`tab-${tab.id}`}
                  key={tab.id}
                  onClick={() => selectTab(tab.id)}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                  role="tab"
                  tabIndex={selected ? 0 : -1}
                  type="button"
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="data-content">
          <section
            aria-labelledby={`tab-${activeTab}`}
            className="data-view"
            id={`panel-${activeTab}`}
            key={activeTab}
            role="tabpanel"
            tabIndex={0}
          >
            <Panel tables={tables} />
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
