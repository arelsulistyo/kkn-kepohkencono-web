"use client";

import { useState, type CSSProperties } from "react";
import {
  HIGHER_EDUCATION_START,
  education,
  formatNumber,
  formatPercent,
  share,
  totals,
} from "@/lib/village-data";
import {
  ChartCard,
  DataTable,
  EDUCATION_RAMP,
  PanelIntro,
  PieChart,
  RankedBars,
  SexLegend,
  pct,
  type PieSegment,
  type TableState,
} from "./charts";

const { population } = totals;
const schooling = education.slice(0, HIGHER_EDUCATION_START);
const higher = education.slice(HIGHER_EDUCATION_START);
const higherTotal = higher.reduce((sum, row) => sum + row.total, 0);

const segments: PieSegment[] = [
  ...schooling.map((row, index) => ({
    label: row.label.replace("/Sederajat", ""),
    value: row.total,
    percent: share(row.total, population),
    color: EDUCATION_RAMP[index],
  })),
  {
    label: "Perguruan Tinggi",
    value: higherTotal,
    percent: share(higherTotal, population),
    color: EDUCATION_RAMP[HIGHER_EDUCATION_START],
    breakdown: higher
      .map((row) => `${row.label} ${formatNumber(row.total)}`)
      .join(" · "),
  },
];

const groups = education.map((_, index) => Math.min(index, HIGHER_EDUCATION_START));
const colors = groups.map((group) => EDUCATION_RAMP[group]);
const rows = education.map((row) => ({ label: row.label, value: row.total }));

const ranked = [...education].sort((a, b) => b.total - a.total);
const primaryToJunior = share(
  (education.find((row) => row.label === "Tamat SD")?.total ?? 0) +
    (education.find((row) => row.label === "SLTP/Sederajat")?.total ?? 0),
  population,
);

/** Two-line axis label: break at the space or slash nearest the middle. */
function splitLabel(label: string): [string, string] {
  let best = -1;
  for (let i = 1; i < label.length; i++) {
    const breakable = label[i - 1] === " " || label[i - 1] === "/";
    if (breakable && (best < 0 || Math.abs(i - label.length / 2) <= Math.abs(best - label.length / 2))) {
      best = i;
    }
  }
  if (best < 0) return [label, ""];
  return [label.slice(0, best).trimEnd(), label.slice(best)];
}

/** Round axis maximum and tick step for `max` split into ~`ticks` steps. */
function niceScale(max: number, ticks = 4) {
  const raw = max / ticks;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const step =
    ([1, 1.5, 2, 2.5, 5, 10].find((nice) => raw / magnitude <= nice) ?? 10) * magnitude;
  const top = Math.ceil(max / step) * step;
  return { top, ticks: Array.from({ length: top / step + 1 }, (_, i) => top - i * step) };
}

const scale = niceScale(Math.max(...education.flatMap((row) => [row.male, row.female])));

const barSize = (value: number) =>
  ({ "--bar-size": `${value ? Math.max((value / scale.top) * 100, 0.7) : 0}%` }) as CSSProperties;

export default function EducationPanel({ tables }: { tables: TableState }) {
  const [active, setActive] = useState<number | null>(null);
  const [activePair, setActivePair] = useState<number | null>(null);
  const [first, second] = ranked;

  return (
    <>
      <PanelIntro
        index="pendidikan"
        title={
          primaryToJunior >= 50
            ? "Sebagian besar warga berpendidikan SD hingga SLTP."
            : primaryToJunior >= 45
              ? "Hampir separuh warga berpendidikan SD hingga SLTP."
              : `${formatPercent(primaryToJunior, 0)}% warga berpendidikan SD hingga SLTP.`
        }
      >
        {first.label} menjadi kelompok terbesar, diikuti {second.label}.
      </PanelIntro>

      <ChartCard
        title="Distribusi tingkat pendidikan"
        tableId="education"
        tables={tables}
        table={
          <DataTable
            caption="Distribusi tingkat pendidikan"
            columns={["Pendidikan", "Jumlah", "Persentase"]}
            rows={education.map((row) => [
              row.label,
              formatNumber(row.total),
              pct(share(row.total, population)),
            ])}
          />
        }
      >
        <div className="pie-bar-layout">
          <PieChart
            active={active}
            label="Diagram lingkaran tingkat pendidikan"
            onActive={setActive}
            segments={segments}
          />
          <RankedBars
            active={active}
            colors={colors}
            groups={groups}
            onActive={setActive}
            rows={rows}
            total={population}
          />
        </div>
      </ChartCard>

      <ChartCard
        title="Pendidikan berdasarkan jenis kelamin"
        tableId="education-gender"
        tables={tables}
        table={
          <DataTable
            caption="Tingkat pendidikan menurut jenis kelamin"
            columns={["Pendidikan", "Laki-laki", "Perempuan"]}
            rows={education.map((row) => [
              row.label,
              formatNumber(row.male),
              formatNumber(row.female),
            ])}
          />
        }
      >
        <SexLegend />
        <div className="grouped-chart">
          <div className="grouped-axis" aria-hidden="true">
            {scale.ticks.map((tick) => (
              <span key={tick} style={{ bottom: `${(tick / scale.top) * 100}%` }}>
                <i>{formatNumber(tick)}</i>
              </span>
            ))}
          </div>
          <div className="grouped-bars">
            {education.map((row, index) => (
              <div
                aria-label={`${row.label}: ${formatNumber(row.male)} laki-laki, ${formatNumber(row.female)} perempuan`}
                className={`grouped-pair ${
                  activePair === index ? "active" : activePair !== null ? "muted" : ""
                }`}
                key={row.label}
                onBlur={() => setActivePair(null)}
                onFocus={() => setActivePair(index)}
                onMouseEnter={() => setActivePair(index)}
                onMouseLeave={() => setActivePair(null)}
                role="img"
                tabIndex={0}
              >
                <div className="vertical-pair" aria-hidden="true">
                  <span className="male" style={barSize(row.male)}>
                    <b>{formatNumber(row.male)}</b>
                  </span>
                  <span className="female" style={barSize(row.female)}>
                    <b>{formatNumber(row.female)}</b>
                  </span>
                </div>
                <span className="group-label" aria-hidden="true">
                  {splitLabel(row.label).map((part) => (
                    <span key={part}>{part}</span>
                  ))}
                </span>
                <div className="pair-tooltip" aria-hidden="true">
                  <strong>{row.label}</strong>
                  <span>Laki-laki · {formatNumber(row.male)}</span>
                  <span>Perempuan · {formatNumber(row.female)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ChartCard>
    </>
  );
}
