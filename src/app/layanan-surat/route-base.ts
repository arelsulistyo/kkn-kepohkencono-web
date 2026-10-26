/** Base path of the Layanan Surat section. Rename the folder and this constant together. */
export const ROUTE_BASE = "/layanan-surat";

export const createLetterHref = (id: string) => `${ROUTE_BASE}/buat/${id}`;
