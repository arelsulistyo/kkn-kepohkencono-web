import { NextRequest } from 'next/server';
import type { DocumentData } from 'firebase-admin/firestore';
import { adminDb } from '@/lib/firebase-admin';
import { noStoreJson, requireStaff } from '@/lib/require-staff';

// Basic person info for search results
interface PersonSearchResult {
  NAMA: string;
  NIK: string;
  NO_KK: string;
  RT: string;
  RW: string;
}

// Simple in-memory cache for search results (server-side only)
const searchCache = new Map<string, { results: PersonSearchResult[], timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to normalize search terms
function normalizeSearchTerm(term: string): string {
  return term.toLowerCase().trim();
}

const hasIdentity = (data: DocumentData) => Boolean(data.NAMA && data.NIK && data.NO_KK);

const toSearchResult = (data: DocumentData): PersonSearchResult => ({
  NAMA: data.NAMA.toString(),
  NIK: data.NIK.toString(),
  NO_KK: data.NO_KK.toString(),
  RT: data.NO_RT?.toString() || '',
  RW: data.NO_RW?.toString() || '',
});

export async function GET(request: NextRequest) {
  const denied = await requireStaff(request);
  if (denied) return denied;

  try {
    const { searchParams } = new URL(request.url);
    const rawQuery = searchParams.get('q') || '';
    const query = normalizeSearchTerm(rawQuery);

    if (query.length < 2) {
      return noStoreJson([]);
    }

    // Check cache first
    const cacheKey = query;
    const cached = searchCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return noStoreJson(cached.results);
    }

    const villagersRef = adminDb().collection('villagers');
    const searchResults: PersonSearchResult[] = [];

    // Strategy 1: Try exact NIK match first (fastest)
    if (/^\d+$/.test(query)) {
      const nikQuery = await villagersRef
        .where('NIK', '==', query)
        .limit(1)
        .get();

      if (!nikQuery.empty) {
        const data = nikQuery.docs[0].data();
        if (hasIdentity(data)) {
          const result = toSearchResult(data);
          searchCache.set(cacheKey, { results: [result], timestamp: Date.now() });
          return noStoreJson([result]);
        }
      }
    }

    // Strategy 2: Try exact KK match
    if (/^\d+$/.test(query)) {
      const kkQuery = await villagersRef
        .where('NO_KK', '==', query)
        .limit(10)
        .get();

      kkQuery.forEach(doc => {
        const data = doc.data();
        if (hasIdentity(data)) {
          searchResults.push(toSearchResult(data));
        }
      });

      if (searchResults.length > 0) {
        const sortedResults = searchResults
          .sort((a, b) => a.NAMA.localeCompare(b.NAMA))
          .slice(0, 10);
        searchCache.set(cacheKey, { results: sortedResults, timestamp: Date.now() });
        return noStoreJson(sortedResults);
      }
    }

    // Strategy 3: Name search using range queries for better performance
    const upperQuery = query.slice(0, -1) + String.fromCharCode(query.charCodeAt(query.length - 1) + 1);

    const nameQuery = await villagersRef
      .where('NAMA_LOWER', '>=', query)
      .where('NAMA_LOWER', '<', upperQuery)
      .limit(20)
      .get();

    nameQuery.forEach(doc => {
      const data = doc.data();
      if (hasIdentity(data) && data.NAMA.toString().toLowerCase().includes(query)) {
        searchResults.push(toSearchResult(data));
      }
    });

    // If no results from optimized queries, fall back to broader search (limited)
    if (searchResults.length === 0) {
      const fallbackQuery = await villagersRef
        .limit(500) // Limit to prevent timeout
        .get();

      fallbackQuery.forEach(doc => {
        const data = doc.data();
        if (hasIdentity(data)) {
          const nameMatch = data.NAMA.toString().toLowerCase().includes(query);
          const nikMatch = data.NIK.toString().includes(query);
          const kkMatch = data.NO_KK.toString().includes(query);

          if (nameMatch || nikMatch || kkMatch) {
            searchResults.push(toSearchResult(data));
          }
        }
      });
    }

    // Sort results by name and limit to 10
    const sortedResults = searchResults
      .sort((a, b) => a.NAMA.localeCompare(b.NAMA))
      .slice(0, 10);

    // Cache the results
    searchCache.set(cacheKey, { results: sortedResults, timestamp: Date.now() });

    return noStoreJson(sortedResults);
  } catch (error) {
    console.error('Error searching persons:', error);
    return noStoreJson(
      { error: 'Failed to search persons' },
      { status: 500 }
    );
  }
}
