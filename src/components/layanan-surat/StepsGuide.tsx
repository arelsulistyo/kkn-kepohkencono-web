const steps = [
  ["Pilih Surat", "Pilih jenis surat yang ingin dibuat dari berbagai template yang tersedia"],
  ["Isi Formulir", "Lengkapi data dan informasi yang diperlukan sesuai dengan jenis surat"],
  ["Unduh Surat", 'Klik tombol "Unduh Surat" untuk menghasilkan dokumen final'],
  ["Cetak Surat", "Cetak surat dan serahkan kepada warga yang membutuhkan"],
] as const;

export default function StepsGuide() {
  return (
    <section className="section intro-section" aria-labelledby="ls-steps-heading">
      <div className="section-heading">
        <h2 id="ls-steps-heading">Cara Membuat Surat</h2>
        <p>
          Ikuti langkah-langkah sederhana berikut untuk membuat surat resmi dengan mudah dan cepat
        </p>
      </div>
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
    </section>
  );
}
