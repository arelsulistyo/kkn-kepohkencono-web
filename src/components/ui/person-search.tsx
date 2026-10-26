import { authFetch } from "@/lib/auth-fetch";

// Interface for person data from database
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

// Interface for search results
export interface PersonSearchResult {
  NAMA: string;
  NIK: string;
  NO_KK: string;
  RT: string;
  RW: string;
}

/** Thrown when the API refuses the request (not signed in, or not on the staff list). */
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

// API functions
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

// Function to convert religion code to text
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

// Function to convert gender code to text
const getGenderText = (code: string): string => {
  return code === "L" ? "Laki-laki" : code === "P" ? "Perempuan" : code;
};

// Function to convert timestamp to date string
const convertTimestampToDate = (timestamp: string | number): string => {
  // Convert string to number if needed
  const timestampNum = typeof timestamp === 'string' ? parseFloat(timestamp) : timestamp;

  // Validate that conversion was successful
  if (isNaN(timestampNum)) {
    console.warn('Invalid timestamp value:', timestamp);
    return '';
  }

  // Assuming timestamp is days since epoch (Excel date format)
  const date = new Date((timestampNum - 25569) * 86400 * 1000);
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

export { getReligionText, getGenderText, convertTimestampToDate };
