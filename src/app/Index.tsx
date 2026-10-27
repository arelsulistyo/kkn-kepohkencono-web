"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, ExternalLink, Play, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type RefObject,
} from "react";
import SiteFooter from "@/components/site/SiteFooter";
import SiteNav, { type NavId } from "@/components/site/SiteNav";
import {
  nextTabIndex,
  useActiveSection,
  useDialog,
  useReveal,
} from "@/components/site/hooks";
import { KP_ROOT_CLASS } from "@/lib/fonts";
import {
  ageGroups,
  education,
  formatNumber,
  formatPercent,
  jobs,
  jobsWorkingTotal,
  share,
  totals,
  type SexBreakdown,
} from "@/lib/village-data";
import "@/styles/kepohkencono.css";

import baldes from "../../public/images/home/baldes_kepohkencono.jpg";
import bancaan from "../../public/images/home/bancaan.jpg";
import campursari from "../../public/images/home/campursari.jpg";
import gallery1 from "../../public/images/home/galeri_desa/galeri_desa_1.jpg";
import gallery2 from "../../public/images/home/galeri_desa/galeri_desa_2.jpg";
import gallery3 from "../../public/images/home/galeri_desa/galeri_desa_3.jpg";
import gallery4 from "../../public/images/home/galeri_desa/galeri_desa_4.jpg";
import gallery5 from "../../public/images/home/galeri_desa/galeri_desa_5.jpg";
import gallery6 from "../../public/images/home/galeri_desa/galeri_desa_6.jpg";
import gallery7 from "../../public/images/home/galeri_desa/galeri_desa_7.jpg";
import gallery8 from "../../public/images/home/galeri_desa/galeri_desa_8.jpg";
import ketoprak from "../../public/images/home/ketoprak.jpg";
import sedekahBumi from "../../public/images/home/sedekah_bumi.jpg";
import sunset from "../../public/images/home/sunset_kepohkencono_centered.jpg";

const DUKUH = [
  {
    name: "Manding",
    leader: "—",
    mapLink: "https://maps.app.goo.gl/69K3brhnb2fCAeYG9",
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15845.282238606706!2d111.13487324999998!3d-6.852124999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e77337a065a0ca9%3A0x402f608a3a862ff!2sManding%2C%20Kepohkencono%2C%20Pucakwangi%2C%20Pati%20Regency%2C%20Central%20Java!5e0!3m2!1sen!2sid!4v1753696946278!5m2!1sen!2sid",
  },
  {
    name: "Panggang",
    leader: "Bapak Pardi",
    mapLink: "https://maps.app.goo.gl/2dxwjwUrxk3MrXMDA",
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15845.570175924187!2d111.1301171!3d-6.8434551!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e77347c2f18d4e9%3A0xb5a29788e3c841b!2sPanggang%2C%20Kepohkencono%2C%20Pucakwangi%2C%20Pati%20Regency%2C%20Central%20Java!5e0!3m2!1sen!2sid!4v1753697081840!5m2!1sen!2sid",
  },
  {
    name: "Prau",
    leader: "Bapak Ngasmani",
    mapLink: "https://maps.app.goo.gl/D4Zv955qhTAHaqLZ7",
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.4776241579593!2d111.1516987!3d-6.8331938!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e77334abf4a08bd%3A0x865f9762969b0383!2sDk.%20Prahu%20Ds.%20kepohkencono%20Kec.%20Pucakwangi%20Kab.%20Pati%20Jawa%20Tengah%20Indonesia!5e0!3m2!1sen!2sid!4v1753697107468!5m2!1sen!2sid",
  },
  {
    name: "Ngepoh",
    leader: "Bapak Zamzuri",
    mapLink: "https://maps.app.goo.gl/965Cm1wVJyUFyQMVA",
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15845.570172605165!2d111.14043835!3d-6.8434552!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7733756e2640f3%3A0x436d0d32ed3f7eb4!2sKepoh%2C%20Kepohkencono%2C%20Pucakwangi%2C%20Pati%20Regency%2C%20Central%20Java!5e0!3m2!1sen!2sid!4v1753697121727!5m2!1sen!2sid",
  },
  {
    name: "Jatikebo",
    leader: "Bapak Muntono",
    mapLink: "https://maps.app.goo.gl/WgCyGsxMdCPLsSj29",
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15845.520969435069!2d111.1459171!3d-6.8449375!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e773399f1c7880f%3A0x62c00c74b263e449!2sJati%20Kebo%2C%20Kepohkencono%2C%20Pucakwangi%2C%20Pati%20Regency%2C%20Central%20Java!5e0!3m2!1sen!2sid!4v1753697134464!5m2!1sen!2sid",
  },
  {
    name: "Dangklik",
    leader: "Bapak Moh Santoso Edi",
    mapLink: "https://maps.app.goo.gl/krLRQB5LBxvuKf489",
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15845.740101319167!2d111.15134735000001!3d-6.8383334499999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7733a31c434147%3A0x263764942683a661!2sDangklik%2C%20Kepohkencono%2C%20Pucakwangi%2C%20Pati%20Regency%2C%20Central%20Java!5e0!3m2!1sen!2sid!4v1753697149731!5m2!1sen!2sid",
  },
];

const EVENTS = [
  {
    image: bancaan,
    title: "Banca’an di Punden",
    label: "Punden desa",
    description:
      "Banca’an di punden melambangkan rasa syukur dan penghormatan kepada leluhur dengan membawa hasil bumi dan makanan tradisional.",
  },
  {
    image: ketoprak,
    title: "Kesenian Ketoprak",
    label: "Pertunjukan tradisional",
    description:
      "Ketoprak adalah seni pertunjukan rakyat yang menyampaikan nilai moral, sejarah, dan budaya melalui cerita dan dialog.",
  },
  {
    image: campursari,
    title: "Campursari",
    label: "Musik kebersamaan",
    description:
      "Campursari adalah musik perpaduan tradisional dan modern yang memperkuat suasana kebersamaan dalam Sedekah Bumi.",
  },
];

/** Order and alt text follow the mosaic's grid areas a–h. */
const GALLERY: { image: StaticImageData; alt: string }[] = [
  { image: gallery3, alt: "Matahari terbenam di atas padang rumput desa" },
  { image: gallery4, alt: "Gapura dan jalan di tepi desa" },
  { image: gallery1, alt: "Pohon besar dan gazebo di tepi sawah saat senja" },
  { image: gallery6, alt: "Petani di tengah sawah hijau" },
  { image: gallery2, alt: "Papan nama Kantor Kepala Desa Kepohkencono" },
  { image: gallery5, alt: "Papan penunjuk arah Desa Kepohkencono" },
  { image: gallery7, alt: "Pohon rindang di tengah hamparan sawah" },
  { image: gallery8, alt: "Petani di sawah yang mulai menguning" },
];

const MARQUEE = DUKUH.map((dukuh) => dukuh.name).join(" · ");

/** Three largest rows of a breakdown, as shares of `whole`. */
function topShares(rows: SexBreakdown[], whole: number) {
  return [...rows]
    .sort((a, b) => b.total - a.total)
    .slice(0, 3)
    .map((row) => ({ label: row.label, percent: share(row.total, whole) }));
}

const LEDGERS = [
  {
    title: "Kelompok usia",
    rows: topShares(ageGroups, totals.population).map((row) => ({
      ...row,
      label: `${row.label} tahun`,
    })),
    caption: (label: string) => `berusia ${label}`,
  },
  {
    title: "Pekerjaan utama",
    rows: topShares(jobs, jobsWorkingTotal),
    caption: (label: string) => `bekerja sebagai ${label.toLowerCase()}`,
  },
  {
    title: "Tingkat pendidikan",
    rows: topShares(education, totals.population),
    caption: (label: string) => label,
  },
];

/** Page sections, in page order, whose ids match the nav items. */
const SECTIONS: readonly NavId[] = [
  "beranda",
  "tentang",
  "dukuh",
  "budaya",
  "data",
  "galeri",
  "kontak",
];

export default function Index() {
  useReveal();
  const active = useActiveSection(SECTIONS);

  return (
    <div className={`${KP_ROOT_CLASS} site-shell`}>
      <SiteNav variant="overlay" active={active} revealAfter="hero-title" />
      <main>
        <Hero />
        <About />
        <DukuhSection />
        <Culture />
        <SedekahBumi />
        <DataPreview />
        <Gallery />
      </main>
      <SiteFooter />
    </div>
  );
}

function Hero() {
  return (
    <>
      <section className="hero" id="beranda">
        <Image
          alt="Matahari terbenam di hamparan sawah Kepohkencono"
          className="hero-image"
          fill
          placeholder="blur"
          preload
          sizes="100vw"
          src={sunset}
        />
        <div className="hero-scrim hero-scrim-top" />
        <div className="hero-scrim hero-scrim-bottom" />
        <div className="hero-top">
          <p className="hero-welcome">selamat datang di</p>
          <h1 id="hero-title">Kepohkencono</h1>
          <p className="hero-place">
            Kecamatan Pucakwangi · Kabupaten Pati · Jawa Tengah
          </p>
        </div>
        <div className="hero-copy-block">
          <p className="hero-copy">
            Sebuah desa di mana waktu mengalir perlahan, kehidupan tumbuh
            bersama, dan senja bercerita di antara hamparan rumput dan sawah
            yang membentang.
          </p>
          <div className="hero-actions">
            <a className="button button-light" href="#tentang">
              Jelajahi desa <ArrowRight aria-hidden="true" size={18} />
            </a>
            <Link className="button button-outline" href="/visualisasi-data">
              Lihat data desa
            </Link>
          </div>
        </div>
        <div className="hero-wave" aria-hidden="true" />
      </section>
      <div className="fact-wrap">
        <dl className="fact-strip">
          <div>
            <dt>penduduk</dt>
            <dd>{formatNumber(totals.population)}</dd>
          </div>
          <div>
            <dt>kepala keluarga</dt>
            <dd>{formatNumber(totals.households)}</dd>
          </div>
          <div>
            <dt>dukuh</dt>
            <dd>{DUKUH.length}</dd>
          </div>
          <div>
            <dt>tradisi tahunan</dt>
            <dd className="fact-word">Sedekah Bumi</dd>
          </div>
        </dl>
      </div>
    </>
  );
}

function Squiggle() {
  return (
    <svg viewBox="0 0 82 12" aria-hidden="true">
      <path d="M2 8C15 2 24 11 38 6S61 3 80 7" />
    </svg>
  );
}

function About() {
  return (
    <section className="section about-section" id="tentang">
      <div className="about-grid">
        <div className="about-copy" data-reveal>
          <p className="section-index">tentang kami</p>
          <h2>Tentang Desa Kepohkencono</h2>
          <p className="intro">
            Desa Kepohkencono adalah sepotong harmoni yang tumbuh di antara
            hamparan sawah dan bisik angin pagi.
          </p>
          <p>
            Terletak di hamparan sawah hijau, di mana udara pagi terasa sejuk
            dan lembut. Mayoritas warganya bekerja sebagai petani, hidup
            berdampingan harmonis dengan alam. Tradisi yang paling dikenal
            adalah Sedekah Bumi, yang dirayakan dengan membawa hasil panen ke
            punden, menikmati pertunjukan ketoprak dan musik campursari bersama
            seluruh warga.
          </p>
          <p>
            Di desa ini, budaya bukan hanya warisan, tapi bagian hidup yang
            selalu dijaga kebersamaan dan maknanya.
          </p>
          <div className="about-highlights">
            <div>
              <h3>
                Lingkungan{" "}
                <span className="squiggle-word sage">
                  asri
                  <Squiggle />
                </span>
              </h3>
              <p>Udara segar &amp; pemandangan hijau</p>
            </div>
            <div>
              <h3>
                Komunitas{" "}
                <span className="squiggle-word terracotta">
                  solid
                  <Squiggle />
                </span>
              </h3>
              <p>Gotong royong &amp; kekeluargaan</p>
            </div>
          </div>
        </div>
        <figure className="about-photo" data-reveal>
          <div className="image-frame">
            <Image
              alt="Kantor Kepala Desa Kepohkencono"
              fill
              placeholder="blur"
              sizes="(max-width: 720px) 90vw, 55vw"
              src={baldes}
            />
          </div>
          <figcaption>Balai Desa Kepohkencono</figcaption>
        </figure>
      </div>
    </section>
  );
}

function DukuhSection() {
  const [selected, setSelected] = useState(2);
  const dukuh = DUKUH[selected];

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const next = nextTabIndex(event.key, index, DUKUH.length);
    if (next === null) return;
    event.preventDefault();
    setSelected(next);
    document.getElementById(`dukuh-tab-${next}`)?.focus();
  };

  return (
    <section className="section dukuh-section" id="dukuh">
      <div className="dukuh-marquee" aria-hidden="true">
        <div>
          {MARQUEE} · {MARQUEE} ·
        </div>
      </div>
      <div className="section-heading" data-reveal>
        <p className="section-index">wilayah desa</p>
        <h2>Dukuh-dukuh Desa Kepohkencono</h2>
        <p>
          Desa Kepohkencono terdiri dari enam dukuh (dusun) yang masing-masing
          memiliki karakteristik dan pesona unik, membentuk mozaik kehidupan
          desa yang kaya.
        </p>
      </div>
      <div className="dukuh-layout" data-reveal>
        <div className="dukuh-list" role="tablist" aria-label="Pilih dukuh">
          {DUKUH.map((item, index) => (
            <button
              aria-controls="dukuh-panel"
              aria-selected={selected === index}
              className={selected === index ? "active" : ""}
              id={`dukuh-tab-${index}`}
              key={item.name}
              onClick={() => setSelected(index)}
              onKeyDown={(event) => onKeyDown(event, index)}
              role="tab"
              tabIndex={selected === index ? 0 : -1}
              type="button"
            >
              <strong>{item.name}</strong>
              <small>Kepala Dukuh: {item.leader}</small>
            </button>
          ))}
        </div>
        <div
          aria-labelledby={`dukuh-tab-${selected}`}
          className="map-panel"
          id="dukuh-panel"
          role="tabpanel"
        >
          <div className="map-image" key={dukuh.name}>
            <iframe
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={dukuh.embedUrl}
              title={`Peta Dukuh ${dukuh.name}`}
            />
            <a
              className="map-link"
              href={dukuh.mapLink}
              rel="noopener noreferrer"
              target="_blank"
            >
              Buka di Google Maps{" "}
              <ExternalLink aria-hidden="true" size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Culture() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    setPlaying(true);
    void videoRef.current?.play();
  };

  return (
    <section className="section culture-section" id="budaya">
      <div className="culture-grid">
        <figure className="video-feature" data-reveal>
          <div className={`video-poster ${playing ? "is-playing" : ""}`}>
            <video
              aria-label="Video profil Desa Kepohkencono"
              controls={playing}
              playsInline
              preload="metadata"
              ref={videoRef}
              src="/video/video_profil_kepohkencono.mp4#t=1"
            />
            {!playing && (
              <button
                aria-label="Putar video profil Desa Kepohkencono"
                onClick={play}
                type="button"
              >
                <Play aria-hidden="true" fill="currentColor" size={28} />
              </button>
            )}
          </div>
          <figcaption>
            Video Profil Desa Kepohkencono — Saksikan keindahan dan kehidupan
            sehari-hari di Desa Kepohkencono.
          </figcaption>
        </figure>
        <div className="culture-copy" data-reveal>
          <p className="section-index">warisan lokal</p>
          <h2>Budaya &amp; Tradisi</h2>
          <p className="culture-lead">
            “Di desa ini, budaya bukan hanya warisan, tapi bagian hidup yang
            selalu dijaga kebersamaan dan maknanya.”
          </p>
          <p>
            Desa Kepohkencono memiliki kekayaan budaya dan tradisi yang telah
            diwariskan secara turun-temurun dari generasi ke generasi.
            Nilai-nilai luhur yang terkandung dalam setiap tradisi mencerminkan
            kearifan lokal masyarakat yang masih sangat dijaga dan dilestarikan
            hingga saat ini.
          </p>
          <p>
            Keberagaman tradisi yang ada di desa ini tidak hanya menjadi
            identitas budaya, tetapi juga menjadi perekat sosial yang
            memperkuat rasa kebersamaan dan gotong royong antarwarga. Setiap
            upacara dan kegiatan budaya selalu melibatkan partisipasi aktif
            seluruh masyarakat.
          </p>
          <div className="culture-notes">
            <div>
              <span className="culture-initial" aria-hidden="true">
                K
              </span>
              <span>
                <strong>Kearifan lokal</strong>
                <em>Nilai-nilai luhur turun-temurun</em>
              </span>
            </div>
            <div>
              <span className="culture-initial" aria-hidden="true">
                P
              </span>
              <span>
                <strong>Persatuan budaya</strong>
                <em>Tradisi yang mempersatukan</em>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SedekahBumi() {
  return (
    <section className="section earth-section">
      <div className="earth-feature" data-reveal>
        <div className="earth-photo">
          <span className="earth-tag">Tradisi turun-temurun</span>
          <Image
            alt="Warga dalam tradisi Sedekah Bumi"
            fill
            placeholder="blur"
            sizes="(max-width: 720px) 100vw, 60vw"
            src={sedekahBumi}
          />
        </div>
        <div className="earth-copy">
          <p className="section-index">tradisi tahunan</p>
          <h2>Sedekah Bumi</h2>
          <p className="intro">
            Sedekah Bumi adalah sebuah tradisi adat masyarakat yang dilakukan
            sebagai bentuk rasa syukur kepada Tuhan atas hasil panen dan rezeki
            yang diberikan melalui bumi.
          </p>
          <p>
            Dalam pelaksanaannya, warga desa biasanya membawa hasil bumi ke
            tempat sakral seperti punden atau balai desa, lalu menggelar doa
            bersama, makan bersama (banca&apos;an), serta pertunjukan kesenian
            seperti ketoprak dan campursari.
          </p>
          <p>
            Tradisi ini juga menjadi ajang mempererat kebersamaan antarwarga dan
            menjaga warisan budaya yang telah ada secara turun-temurun.
          </p>
        </div>
      </div>
      <div className="procession-heading" data-reveal>
        <p className="section-index">rangkaian acara</p>
        <h2>Rangkaian acara Sedekah Bumi</h2>
      </div>
      <ol className="procession">
        {EVENTS.map((event, index) => (
          <li data-reveal key={event.title}>
            <div className="event-image">
              <Image
                alt={event.title}
                fill
                placeholder="blur"
                sizes="(max-width: 720px) 84vw, 34vw"
                src={event.image}
              />
            </div>
            <span className="event-number" aria-hidden="true">
              {index + 1}
            </span>
            <h3>{event.title}</h3>
            <small>{event.label}</small>
            <p>{event.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function DataPreview() {
  return (
    <section className="section data-section" id="data">
      <div className="section-heading" data-reveal>
        <p className="section-index">dalam angka</p>
        <h2>Data Desa Terkini</h2>
        <p>
          Jelajahi wawasan komprehensif tentang komunitas kami melalui
          visualisasi data interaktif.
        </p>
      </div>
      <div className="ledger-grid">
        {LEDGERS.map((block) => {
          const [top] = block.rows;
          return (
            <article className="ledger" data-reveal key={block.title}>
              <h3>{block.title}</h3>
              <p className="ledger-highlight">
                <strong>{formatPercent(top.percent, 0)}%</strong>
                <em>{block.caption(top.label)}</em>
              </p>
              <ul className="ledger-rows">
                {block.rows.map((row, index) => (
                  <li className="ledger-row" key={row.label}>
                    <div>
                      <span>{row.label}</span>
                      <strong>{formatPercent(row.percent, 0)}%</strong>
                    </div>
                    <i aria-hidden="true">
                      <b
                        className={index === 0 ? "largest" : ""}
                        style={{ width: `${row.percent}%` }}
                      />
                    </i>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
      <div className="data-action" data-reveal>
        <Link className="button button-brand" href="/visualisasi-data">
          Jelajahi dashboard data lengkap{" "}
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </div>
    </section>
  );
}

function Gallery() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const close = useCallback(() => setLightbox(null), []);

  return (
    <section className="section gallery-section" id="galeri">
      <div className="gallery-heading" data-reveal>
        <div>
          <p className="section-index">potret desa</p>
          <h2>Galeri Desa</h2>
        </div>
        <p>Saksikan keindahan dan kehidupan sehari-hari di Desa Kepohkencono.</p>
      </div>
      <div className="gallery-mosaic" data-reveal>
        {GALLERY.map((photo, index) => (
          <button
            aria-label={`Buka foto: ${photo.alt}`}
            key={photo.image.src}
            onClick={(event) => {
              openerRef.current = event.currentTarget;
              setLightbox(index);
            }}
            type="button"
          >
            <Image
              alt={photo.alt}
              fill
              placeholder="blur"
              sizes={
                index === 0
                  ? "(max-width: 639px) 100vw, (max-width: 1023px) 66vw, 50vw"
                  : "(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 25vw"
              }
              src={photo.image}
            />
            <span aria-hidden="true">Sehari-hari di Kepohkencono</span>
          </button>
        ))}
      </div>
      {lightbox !== null && (
        <Lightbox
          index={lightbox}
          onChange={setLightbox}
          onClose={close}
          returnFocusRef={openerRef}
        />
      )}
    </section>
  );
}

function Lightbox({
  index,
  onChange,
  onClose,
  returnFocusRef,
}: {
  index: number;
  onChange: (index: number) => void;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialog(true, onClose, dialogRef, returnFocusRef);
  const count = GALLERY.length;
  const photo = GALLERY[index];
  const step = useCallback(
    (delta: number) => onChange((index + delta + count) % count),
    [index, count, onChange],
  );

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [step]);

  return (
    <div
      aria-label={`Foto ${index + 1} dari ${count}`}
      aria-modal="true"
      className="lightbox"
      ref={dialogRef}
      role="dialog"
    >
      <button
        aria-label="Tutup galeri"
        className="lightbox-close"
        onClick={onClose}
        type="button"
      >
        <X aria-hidden="true" size={28} />
      </button>
      <button
        aria-label="Foto sebelumnya"
        className="lightbox-prev"
        onClick={() => step(-1)}
        type="button"
      >
        <ChevronRight aria-hidden="true" size={34} />
      </button>
      <figure>
        <Image
          alt={photo.alt}
          key={photo.image.src}
          placeholder="blur"
          sizes="(max-width: 720px) 100vw, 80vw"
          src={photo.image}
        />
        <figcaption>
          <span>{photo.alt}</span>
          <strong aria-live="polite">
            {index + 1} / {count}
          </strong>
        </figcaption>
      </figure>
      <button
        aria-label="Foto berikutnya"
        className="lightbox-next"
        onClick={() => step(1)}
        type="button"
      >
        <ChevronRight aria-hidden="true" size={34} />
      </button>
    </div>
  );
}
