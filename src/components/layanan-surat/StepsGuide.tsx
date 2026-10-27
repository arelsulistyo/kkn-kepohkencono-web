const steps = [
  ["Pilih Surat", "Pilih jenis surat yang ingin dibuat dari berbagai template yang tersedia"],
  ["Isi Formulir", "Lengkapi data dan informasi yang diperlukan sesuai dengan jenis surat"],
  ["Unduh Surat", 'Klik tombol "Unduh Surat" untuk menghasilkan dokumen final'],
  ["Cetak Surat", "Cetak surat dan serahkan kepada warga yang membutuhkan"],
] as const;

export default function StepsGuide() {
  return (
    <section className="section steps-section" aria-labelledby="ls-steps-heading">
      <p className="ls-kicker">langkah demi langkah</p>
      <h2 id="ls-steps-heading">Cara Membuat Surat</h2>
      <p className="section-lede">
        Ikuti langkah-langkah sederhana berikut untuk membuat surat resmi dengan mudah dan cepat
      </p>
      <div className="steps-wrap">
        <svg
          className="steps-path"
          viewBox="0 0 1000 120"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M40 80 C220 10 310 110 480 55 S760 20 960 70" />
        </svg>
        <ol className="steps">
          {steps.map(([title, description], index) => (
            <li className="step" key={title}>
              <span className="step-number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
