"use client";

import { useState } from "react";
import {
  ageGroups,
  familyRelations,
  familyRelationsTotal,
  formatNumber,
  religion,
  religionTotal,
  share,
  totals,
  type SexBreakdown,
} from "@/lib/village-data";
import {
  CHART_COLORS,
  ChartCard,
  DataTable,
  PanelIntro,
  PieChart,
  SexLegend,
  Tooltip,
  describeValue,
  pct,
  type PieSegment,
  type TableState,
} from "./charts";

const FAMILY_COLORS = [
  CHART_COLORS.male,
  CHART_COLORS.female,
  CHART_COLORS.third,
  CHART_COLORS.other,
];

const sexColumns = (first: string) => [first, "Laki-laki", "Perempuan", "Total"];
const sexRows = (rows: SexBreakdown[]) =>
  rows.map((row) => [
    row.label,
    formatNumber(row.male),
    formatNumber(row.female),
    formatNumber(row.total),
  ]);

function PyramidBar({
  row,
  sex,
  max,
}: {
  row: SexBreakdown;
  sex: "male" | "female";
  max: number;
}) {
  const value = row[sex];
  const label = `${row.label} · ${sex === "male" ? "Laki-laki" : "Perempuan"}`;
  const percent = share(value, row.total);
  return (
    <div className={`pyramid-side ${sex === "male" ? "left" : "right"}`}>
      <span
        aria-label={describeValue(`Usia ${label}`, value, percent)}
        role="img"
        style={{ width: `${(value / max) * 100}%` }}
        tabIndex={0}
      >
        <Tooltip label={label} value={value} percent={percent} />
      </span>
    </div>
  );
}

export default function DemographyPanel({ tables }: { tables: TableState }) {
  const [activeFamily, setActiveFamily] = useState<number | null>(null);

  const { population, male, female } = totals;
  const gap = Math.abs(male - female);
  const balanced = share(gap, population) < 5;
  const malePercent = share(male, population);
  const femalePercent = share(female, population);

  const pyramidMax = Math.max(...ageGroups.flatMap((row) => [row.male, row.female]));
  const familyMax = Math.max(...familyRelations.map((row) => row.total));
  const familySegments: PieSegment[] = familyRelations.map((row, index) => ({
    label: row.label,
    value: row.total,
    percent: share(row.total, familyRelationsTotal),
    color: FAMILY_COLORS[index] ?? CHART_COLORS.other,
  }));

  const [mainReligion, ...otherReligions] = religion;

  return (
    <>
      <PanelIntro
        index="demografi"
        title={
          balanced
            ? "Jumlah laki-laki dan perempuan hampir seimbang."
            : `Penduduk ${male > female ? "laki-laki" : "perempuan"} lebih banyak.`
        }
      >
        Komposisi penduduk berbeda {balanced ? "hanya " : ""}
        {formatNumber(gap)} orang dari total {formatNumber(population)} warga.
      </PanelIntro>

      <ChartCard
        title="Komposisi penduduk"
        tableId="gender"
        tables={tables}
        table={
          <DataTable
            caption="Komposisi penduduk menurut jenis kelamin"
            columns={["Kategori", "Jumlah", "Persentase"]}
            rows={[
              ["Laki-laki", formatNumber(male), pct(malePercent)],
              ["Perempuan", formatNumber(female), pct(femalePercent)],
            ]}
          />
        }
      >
        <SexLegend />
        <div className="split-summary">
          <div className="split-labels" aria-hidden="true">
            <span>
              <strong>{formatNumber(male)}</strong> laki-laki
            </span>
            <span>
              <strong>{formatNumber(female)}</strong> perempuan
            </span>
          </div>
          <div className="split-bar">
            {(
              [
                ["Laki-laki", "male", male, malePercent],
                ["Perempuan", "female", female, femalePercent],
              ] as const
            ).map(([label, sex, value, percent]) => (
              <span
                aria-label={describeValue(label, value, percent)}
                className={sex}
                key={sex}
                role="img"
                style={{ width: `${percent}%` }}
                tabIndex={0}
              >
                <Tooltip label={label} value={value} percent={percent} />
              </span>
            ))}
          </div>
        </div>
      </ChartCard>

      <ChartCard
        title="Usia berdasarkan jenis kelamin"
        tableId="ages"
        tables={tables}
        table={
          <DataTable
            caption="Kelompok usia menurut jenis kelamin"
            columns={sexColumns("Kelompok usia")}
            rows={sexRows(ageGroups)}
          />
        }
      >
        <SexLegend />
        <div className="pyramid">
          {ageGroups.map((row) => (
            <div className="pyramid-row" key={row.label}>
              <span className="pyramid-count" aria-hidden="true">
                {formatNumber(row.male)}
              </span>
              <PyramidBar row={row} sex="male" max={pyramidMax} />
              <strong aria-hidden="true">{row.label}</strong>
              <PyramidBar row={row} sex="female" max={pyramidMax} />
              <span className="pyramid-count" aria-hidden="true">
                {formatNumber(row.female)}
              </span>
            </div>
          ))}
        </div>
      </ChartCard>

      {mainReligion && (
        <article className="religion-card">
          <strong>{pct(share(mainReligion.total, religionTotal))}</strong>
          <p>
            penduduk beragama {mainReligion.label} (
            {formatNumber(mainReligion.total)} orang)
            {otherReligions.length > 0 &&
              `, ${otherReligions
                .map((row) => `${formatNumber(row.total)} orang beragama ${row.label}`)
                .join(", ")}`}
            .
          </p>
        </article>
      )}

      <ChartCard
        title="Hubungan keluarga"
        tableId="family"
        tables={tables}
        table={
          <DataTable
            caption="Hubungan dalam keluarga menurut jenis kelamin"
            columns={sexColumns("Hubungan")}
            rows={sexRows(familyRelations)}
          />
        }
      >
        <div className="pie-bar-layout">
          <PieChart
            active={activeFamily}
            label="Diagram lingkaran hubungan keluarga"
            onActive={setActiveFamily}
            segments={familySegments}
          />
          <div>
            <SexLegend />
            <div className="family-bars">
              {familyRelations.map((row, index) => (
                <div
                  aria-label={`${row.label}: ${formatNumber(row.male)} laki-laki, ${formatNumber(row.female)} perempuan, total ${formatNumber(row.total)}`}
                  className={`family-row ${
                    activeFamily !== null && activeFamily !== index ? "muted" : ""
                  }`}
                  key={row.label}
                  onBlur={() => setActiveFamily(null)}
                  onFocus={() => setActiveFamily(index)}
                  onMouseEnter={() => setActiveFamily(index)}
                  onMouseLeave={() => setActiveFamily(null)}
                  role="img"
                  tabIndex={0}
                >
                  <span aria-hidden="true">{row.label}</span>
                  <div
                    aria-hidden="true"
                    className="family-scale"
                    style={{ width: `${(row.total / familyMax) * 100}%` }}
                  >
                    {row.male > 0 && (
                      <i className="male" style={{ width: `${share(row.male, row.total)}%` }} />
                    )}
                    {row.female > 0 && (
                      <i
                        className="female"
                        style={{ width: `${share(row.female, row.total)}%` }}
                      />
                    )}
                    <Tooltip
                      label={row.label}
                      value={row.total}
                      percent={share(row.total, population)}
                    />
                  </div>
                  <strong aria-hidden="true">{formatNumber(row.total)}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ChartCard>
    </>
  );
}
