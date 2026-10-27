import { akta, formatNumber, ktp, share } from "@/lib/village-data";
import {
  DataTable,
  PanelIntro,
  TableToggle,
  Tooltip,
  describeValue,
  pct,
  type TableState,
} from "./charts";

function Progress({ label, value, percent }: { label: string; value: number; percent: number }) {
  return (
    <div className="admin-progress">
      <span
        aria-label={describeValue(label, value, percent)}
        role="img"
        style={{ width: `${percent}%` }}
        tabIndex={0}
      >
        <Tooltip label={label} value={value} percent={percent} />
      </span>
    </div>
  );
}

export default function AdministrationPanel({ tables }: { tables: TableState }) {
  return (
    <>
      <PanelIntro
        index="administrasi"
        title={
          akta.percent >= 95
            ? "Dokumen dasar warga hampir seluruhnya tercatat."
            : `${pct(akta.percent)} anak sudah memiliki akta kelahiran.`
        }
      >
        Data menunjukkan kewajiban KTP dan kepemilikan akta kelahiran anak.
      </PanelIntro>
      <div className="admin-grid">
        <article className="admin-card">
          <strong>{pct(ktp.percent)}</strong>
          <h3>Penduduk sudah wajib KTP</h3>
          <p>
            {formatNumber(ktp.wajib)} dari {formatNumber(ktp.total)} orang
          </p>
          <Progress label="Penduduk wajib KTP" value={ktp.wajib} percent={ktp.percent} />
          <TableToggle id="ktp" tables={tables}>
            <DataTable
              caption="Penduduk wajib KTP"
              columns={["Kategori", "Jumlah", "Persentase"]}
              rows={[
                ["Wajib KTP", formatNumber(ktp.wajib), pct(ktp.percent)],
                ["Belum wajib KTP", formatNumber(ktp.belum), pct(share(ktp.belum, ktp.total))],
              ]}
            />
          </TableToggle>
        </article>
        <article className="admin-card">
          <strong>{pct(akta.percent)}</strong>
          <h3>Anak memiliki akta kelahiran</h3>
          <p>
            {formatNumber(akta.has)} dari {formatNumber(akta.totalU17)} anak di
            bawah 17 tahun
          </p>
          <Progress label="Anak memiliki akta" value={akta.has} percent={akta.percent} />
          <em>{formatNumber(akta.missing)} anak belum memiliki akta.</em>
          <TableToggle id="birth" tables={tables}>
            <DataTable
              caption="Kepemilikan akta kelahiran anak di bawah 17 tahun"
              columns={["Kategori", "Jumlah", "Persentase"]}
              rows={[
                ["Memiliki akta", formatNumber(akta.has), pct(akta.percent)],
                [
                  "Belum memiliki akta",
                  formatNumber(akta.missing),
                  pct(share(akta.missing, akta.totalU17)),
                ],
              ]}
            />
          </TableToggle>
        </article>
      </div>
    </>
  );
}
