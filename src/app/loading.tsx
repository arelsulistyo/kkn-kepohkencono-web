import KepohMark from "@/components/site/KepohMark";
import { KP_ROOT_CLASS } from "@/lib/fonts";
import "@/styles/kepohkencono.css";

export default function Loading() {
  return (
    <div className={`${KP_ROOT_CLASS} page-loading`} role="status">
      <div className="page-loading-inner">
        <KepohMark className="page-loading-mark" />
        <p className="page-loading-name">Kepohkencono</p>
        <p className="page-loading-note">memuat halaman…</p>
        <span className="page-loading-bar" aria-hidden="true">
          <span />
        </span>
      </div>
    </div>
  );
}
