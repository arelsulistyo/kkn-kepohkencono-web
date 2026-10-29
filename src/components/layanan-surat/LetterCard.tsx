"use client";

import Link, { useLinkStatus } from "next/link";
import { letterReference, type Service } from "@/app/layanan-surat/data/services";
import { EyeGlyph } from "./glyphs";

function CreateLabel() {
  const { pending } = useLinkStatus();
  return pending ? (
    <>Memuat…</>
  ) : (
    <>
      Buat surat <span aria-hidden="true">→</span>
    </>
  );
}

interface CreateLetterLinkProps {
  href: string;
  onBlocked?: () => void;
  className?: string;
  describedBy?: string;
}

export function CreateLetterLink({
  href,
  onBlocked,
  className = "",
  describedBy,
}: CreateLetterLinkProps) {
  return (
    <Link
      href={href}
      className={`primary-button ${className}`}
      aria-describedby={describedBy}
      onClick={(event) => {
        if (onBlocked) {
          event.preventDefault();
          onBlocked();
        }
      }}
    >
      <CreateLabel />
    </Link>
  );
}

interface LetterCardProps {
  service: Service;
  createHref: string;
  onCreateBlocked?: () => void;
  onPreview: (trigger: HTMLButtonElement) => void;
}

export default function LetterCard({ service, createHref, onCreateBlocked, onPreview }: LetterCardProps) {
  const titleId = `ls-card-${service.id}`;
  return (
    <li className="letter-card" aria-labelledby={titleId}>
      <div className="letter-meta">
        <span className="category-chip">{service.category}</span>
        <em>{letterReference(service)}</em>
      </div>
      <h3 id={titleId}>{service.title}</h3>
      <p className="card-description">{service.description}</p>
      <div className="letter-req">
        <em>Syarat</em>
        <ul className="service-requirements">
          {service.requirements.map((requirement) => (
            <li key={requirement}>{requirement}</li>
          ))}
        </ul>
      </div>
      <div className="letter-actions">
        <button
          type="button"
          className="preview-button"
          onClick={(event) => onPreview(event.currentTarget)}
          aria-label={`Lihat contoh ${service.title}`}
        >
          <EyeGlyph />
          Lihat contoh
        </button>
        <CreateLetterLink href={createHref} onBlocked={onCreateBlocked} describedBy={titleId} />
      </div>
    </li>
  );
}
