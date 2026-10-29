"use client";

import { useState } from "react";
import {
  formatNumber,
  formatPercent,
  jobs,
  jobsWorkingTotal,
  share,
} from "@/lib/village-data";
import {
  CHART_COLORS,
  ChartCard,
  DataTable,
  PanelIntro,
  PieChart,
  RankedBars,
  pct,
  type PieSegment,
  type TableState,
} from "./charts";

const NAMED_SLICES = 3;
const SLICE_COLORS = [CHART_COLORS.male, CHART_COLORS.female, CHART_COLORS.third];

const named = jobs.slice(0, NAMED_SLICES);
const others = jobs.slice(NAMED_SLICES);
const othersTotal = others.reduce((sum, row) => sum + row.total, 0);

const segments: PieSegment[] = [
  ...named.map((row, index) => ({
    label: row.label,
    value: row.total,
    percent: share(row.total, jobsWorkingTotal),
    color: SLICE_COLORS[index],
  })),
  ...(others.length > 0
    ? [
        {
          label: "Lainnya",
          value: othersTotal,
          percent: share(othersTotal, jobsWorkingTotal),
          color: CHART_COLORS.other,
          breakdown: others
            .map((row) => `${row.label} ${formatNumber(row.total)}`)
            .join(" · "),
        },
      ]
    : []),
];

const groups = jobs.map((_, index) => Math.min(index, NAMED_SLICES));
const colors = groups.map((group) => segments[group].color);
const rows = jobs.map((row) => ({ label: row.label, value: row.total }));

export default function EmploymentPanel({ tables }: { tables: TableState }) {
  const [active, setActive] = useState<number | null>(null);
  const [top] = jobs;
  const topShare = share(top.total, jobsWorkingTotal);
  const topLabel = top.label.toLowerCase();

  return (
    <>
      <PanelIntro
        index="pekerjaan"
        title={
          topShare >= 45
            ? `Separuh warga bekerja sebagai ${topLabel}.`
            : `${formatPercent(topShare, 0)}% warga bekerja sebagai ${topLabel}.`
        }
      >
        {top.label === "Petani" ? "Pertanian" : top.label} menjadi mata
        pencaharian utama bagi {formatNumber(top.total)} orang atau{" "}
        {formatPercent(topShare, 0)}% warga yang bekerja.
      </PanelIntro>
      <ChartCard
        title="Pekerjaan utama"
        tableId="jobs"
        tables={tables}
        table={
          <DataTable
            caption="Pekerjaan utama warga"
            columns={["Pekerjaan", "Jumlah", "Persentase"]}
            rows={jobs.map((row) => [
              row.label,
              formatNumber(row.total),
              pct(share(row.total, jobsWorkingTotal)),
            ])}
          />
        }
      >
        <div className="pie-bar-layout">
          <PieChart
            active={active}
            label="Diagram lingkaran pekerjaan utama"
            onActive={setActive}
            segments={segments}
          />
          <div>
            <RankedBars
              active={active}
              colors={colors}
              groups={groups}
              onActive={setActive}
              rows={rows}
              total={jobsWorkingTotal}
            />
            <p className="chart-total">
              Total yang bekerja:{" "}
              <strong>{formatNumber(jobsWorkingTotal)} orang</strong>
            </p>
          </div>
        </div>
      </ChartCard>
    </>
  );
}
