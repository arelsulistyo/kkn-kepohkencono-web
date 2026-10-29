"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { formatNumber, formatPercent, share } from "@/lib/village-data";

export const CHART_COLORS = {
  male: "var(--chart-male)",
  female: "var(--chart-female)",
  third: "var(--chart-third)",
  other: "var(--chart-other)",
};

export const EDUCATION_RAMP = [
  "#D3E2D5",
  "#A9C6AF",
  "#7FA88A",
  "#568A66",
  "#356B48",
  "#1F4A30",
];

export const pct = (value: number) => `${formatPercent(value)}%`;

export const describeValue = (label: string, value: number, percent: number) =>
  `${label}: ${formatNumber(value)} orang, ${pct(percent)}`;

function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export function CountUp({
  value,
  decimals = 0,
  suffix = "",
}: {
  value: number;
  decimals?: number;
  suffix?: string;
}) {
  const [display, setDisplay] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const animate = (time: number) => {
          const progress = Math.min((time - start) / 900, 1);
          setDisplay(value * (1 - Math.pow(1 - progress, 3)));
          if (progress < 1) frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
      },
      { threshold: 0.5 },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  const shown = display.toLocaleString("id-ID", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref}>
      {shown}
      {suffix && <small>{suffix}</small>}
    </span>
  );
}

export function PanelIntro({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="data-section-intro">
      <p className="section-index">{index}</p>
      <h2>{title}</h2>
      <p>{children}</p>
    </div>
  );
}

export function Tooltip({
  label,
  value,
  percent,
}: {
  label: string;
  value: number;
  percent: number;
}) {
  return (
    <span className="data-tooltip" aria-hidden="true">
      <strong>{label}</strong>
      <span>{formatNumber(value)} orang</span>
      <span>{pct(percent)}</span>
    </span>
  );
}

export function SexLegend() {
  return (
    <div className="chart-legend">
      <span>
        <i className="legend-dot male" /> Laki-laki
      </span>
      <span>
        <i className="legend-dot female" /> Perempuan
      </span>
    </div>
  );
}

export function DataTable({
  caption,
  columns,
  rows,
}: {
  caption: string;
  columns: string[];
  rows: (string | number)[][];
}) {
  return (
    <div className="data-table-wrap">
      <table>
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column} scope="col">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([first, ...rest]) => (
            <tr key={first}>
              <th scope="row">{first}</th>
              {rest.map((cell, index) => (
                <td key={index}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export type TableState = {
  isOpen: (id: string) => boolean;
  toggle: (id: string) => void;
};

export function TableToggle({
  id,
  tables,
  children,
}: {
  id: string;
  tables: TableState;
  children: ReactNode;
}) {
  const open = tables.isOpen(id);
  return (
    <div className="table-toggle">
      <button
        aria-controls={`table-${id}`}
        aria-expanded={open}
        onClick={() => tables.toggle(id)}
        type="button"
      >
        {open ? "Sembunyikan tabel" : "Lihat tabel"}
      </button>
      <div hidden={!open} id={`table-${id}`}>
        {children}
      </div>
    </div>
  );
}

export function ChartCard({
  title,
  tableId,
  tables,
  table,
  children,
}: {
  title: string;
  tableId: string;
  tables: TableState;
  table: ReactNode;
  children: ReactNode;
}) {
  return (
    <article className="data-chart-card">
      <h3>{title}</h3>
      {children}
      <TableToggle id={tableId} tables={tables}>
        {table}
      </TableToggle>
    </article>
  );
}


export type PieSegment = {
  label: string;
  value: number;
  percent: number;
  color: string;
  breakdown?: string;
};

const CX = 180;
const CY = 140;
const RADIUS = 104;
const LABEL_GAP = 14;
const SMALL_SLICE = 5;

function polarPoint(radius: number, angle: number, cx = CX, cy = CY) {
  const radians = ((angle - 90) * Math.PI) / 180;
  return { x: cx + radius * Math.cos(radians), y: cy + radius * Math.sin(radians) };
}

function slicePath(startAngle: number, endAngle: number) {
  const start = polarPoint(RADIUS, endAngle);
  const end = polarPoint(RADIUS, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${CX} ${CY} L ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
}

function layoutSlices(segments: PieSegment[]) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  let cursor = 0;
  const slices = segments.map((segment) => {
    const start = cursor;
    const end = cursor + (segment.value / total) * 360;
    cursor = end;
    const middle = (start + end) / 2;
    const small = segment.percent < SMALL_SLICE;
    const label = polarPoint(small ? 138 : 128, middle);
    return {
      ...segment,
      start,
      end,
      middle,
      small,
      labelX: label.x,
      labelY: label.y,
      right: label.x >= CX,
    };
  });
  for (const right of [true, false]) {
    const side = slices
      .filter((slice) => slice.right === right)
      .sort((a, b) => a.labelY - b.labelY);
    for (let i = 1; i < side.length; i++) {
      side[i].labelY = Math.max(side[i].labelY, side[i - 1].labelY + LABEL_GAP);
    }
  }
  return slices;
}

export function PieChart({
  label,
  segments,
  active,
  onActive,
}: {
  label: string;
  segments: PieSegment[];
  active: number | null;
  onActive: (index: number | null) => void;
}) {
  // Narrow screens drop the outside labels (the legend and bars carry them)
  // so the pie itself can stay large.
  const compact = useMediaQuery("(max-width: 600px)");
  const slices = layoutSlices(segments);
  const activeSegment = active === null ? null : segments[active];

  return (
    <div className="pie-figure">
      <svg
        aria-label={label}
        className={active !== null ? "has-active" : ""}
        role="group"
        viewBox={compact ? "64 24 232 232" : "-90 0 540 290"}
      >
        {slices.map((slice, index) => {
          const offset =
            active === index ? polarPoint(6, slice.middle, 0, 0) : { x: 0, y: 0 };
          const lineStart = polarPoint(RADIUS + 2, slice.middle);
          return (
            <g
              aria-label={describeValue(slice.label, slice.value, slice.percent)}
              className={`pie-slice ${active === index ? "active" : ""}`}
              key={slice.label}
              onBlur={() => onActive(null)}
              onFocus={() => onActive(index)}
              onMouseEnter={() => onActive(index)}
              onMouseLeave={() => onActive(null)}
              role="img"
              style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
              tabIndex={0}
            >
              <path d={slicePath(slice.start, slice.end)} fill={slice.color} />
              {!compact && slice.small && (
                <line
                  x1={lineStart.x}
                  x2={slice.labelX}
                  y1={lineStart.y}
                  y2={slice.labelY}
                />
              )}
              {!compact && (
                <text
                  dominantBaseline="middle"
                  textAnchor={slice.right ? "start" : "end"}
                  x={slice.labelX + (slice.right ? 3 : -3)}
                  y={slice.labelY}
                >
                  {slice.label} · {pct(slice.percent)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {activeSegment && (
        <div className="pie-tooltip" aria-hidden="true">
          <strong>{activeSegment.label}</strong>
          <span>
            {formatNumber(activeSegment.value)} orang · {pct(activeSegment.percent)}
          </span>
          {activeSegment.breakdown && <em>{activeSegment.breakdown}</em>}
        </div>
      )}
      <div className="pie-legend">
        {segments.map((segment) => (
          <span key={segment.label}>
            <i style={{ background: segment.color }} />
            {segment.label}
          </span>
        ))}
      </div>
    </div>
  );
}


export function RankedBars({
  rows,
  total,
  colors,
  groups,
  active,
  onActive,
}: {
  rows: { label: string; value: number }[];
  total: number;
  colors: string[];
  groups: number[];
  active: number | null;
  onActive: (group: number | null) => void;
}) {
  const max = Math.max(...rows.map((row) => row.value));
  return (
    <div className="ranked-bars">
      {rows.map((row, index) => {
        const percent = share(row.value, total);
        const muted = active !== null && groups[index] !== active;
        return (
          <div
            aria-label={describeValue(row.label, row.value, percent)}
            className={`ranked-row ${muted ? "muted" : ""}`}
            key={row.label}
            onBlur={() => onActive(null)}
            onFocus={() => onActive(groups[index])}
            onMouseEnter={() => onActive(groups[index])}
            onMouseLeave={() => onActive(null)}
            role="img"
            tabIndex={0}
          >
            <div className="bar-meta" aria-hidden="true">
              <span>{row.label}</span>
              <strong>
                {formatNumber(row.value)} · {pct(percent)}
              </strong>
            </div>
            <div className="bar-track" aria-hidden="true">
              <span
                style={{
                  width: `${Math.max((row.value / max) * 100, 1)}%`,
                  background: colors[index],
                }}
              />
              <Tooltip label={row.label} value={row.value} percent={percent} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

