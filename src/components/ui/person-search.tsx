import { authFetch } from "@/lib/auth-fetch";

export interface PersonData {
  NAMA: string;
  NIK: string;
  NO_KK: string;
  ALAMAT: string;
  AGAMA: string;
  PEKERJAAN: string;
  RT: string;
  RW: string;
  JK: string;
  TMPT_LHR: string;
  TGL_LHR: string;
  NAMA_AYAH?: string;
  NAMA_IBU?: string;
  STATUS?: string;
  PDDK_AKHIR?: string;
}

export interface PersonSearchResult {
  NAMA: string;
  NIK: string;
  NO_KK: string;
  RT: string;
  RW: string;
}

export class PersonAccessError extends Error {}

const assertAccess = (response: Response) => {
  if (response.status === 401 || response.status === 403) {
    throw new PersonAccessError(
      response.status === 401
        ? "Sesi login berakhir. Silakan login kembali."
        : "Akun ini tidak memiliki akses ke data penduduk."
    );
  }
};

export const searchPersons = async (query: string): Promise<PersonSearchResult[]> => {
  const response = await authFetch(`/api/search-person?q=${encodeURIComponent(query)}`);
  assertAccess(response);
  if (!response.ok) {
    throw new Error("Failed to search persons");
  }
  return response.json();
};

export const fetchPersonData = async (nik: string): Promise<PersonData | null> => {
  const response = await authFetch(`/api/person/${encodeURIComponent(nik)}`);
  assertAccess(response);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error("Failed to fetch person data");
  }
  return response.json();
};

const getReligionText = (code: string): string => {
  const religions: { [key: string]: string } = {
    "1": "Islam",
    "2": "Kristen",
    "3": "Katolik",
    "4": "Hindu",
    "5": "Buddha",
    "6": "Khonghucu"
  };
  return religions[code] || code;
};

const getGenderText = (code: string): string => {
  return code === "L" ? "Laki-laki" : code === "P" ? "Perempuan" : code;
};

const convertTimestampToDate = (timestamp: string | number): string => {
  const timestampNum = typeof timestamp === 'string' ? parseFloat(timestamp) : timestamp;

  if (isNaN(timestampNum)) {
    console.warn('Invalid timestamp value:', timestamp);
    return '';
  }

  const date = new Date((timestampNum - 25569) * 86400 * 1000);
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

export { getReligionText, getGenderText, convertTimestampToDate };
