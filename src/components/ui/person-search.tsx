"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

interface PersonSearchProps {
  value?: string;
  onPersonSelect?: (person: PersonData) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}



// Interface for search results
interface PersonSearchResult {
  NAMA: string;
  NIK: string;
  NO_KK: string;
}

// API functions
export const searchPersons = async (query: string): Promise<PersonSearchResult[]> => {
  try {
    const response = await fetch(`/api/search-person?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search persons');
    }
    return await response.json();
  } catch (error) {
    console.error('Error searching persons:', error);
    return [];
  }
};

export const fetchPersonData = async (nik: string): Promise<PersonData | null> => {
  try {
    const response = await fetch(`/api/person/${encodeURIComponent(nik)}`);
    if (!response.ok) {
      if (response.status === 404) {
        console.error('Person not found');
        return null;
      }
      throw new Error('Failed to fetch person data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching person data:', error);
    return null;
  }
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

export function PersonSearch({
  value,
  onPersonSelect,
  placeholder = "Cari nama, NIK, atau No. KK...",
  className,
  disabled = false,
  required = false,
}: PersonSearchProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedPerson, setSelectedPerson] = React.useState<PersonData | null>(null);
  const [searchResults, setSearchResults] = React.useState<PersonSearchResult[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [isLoadingPersonData, setIsLoadingPersonData] = React.useState(false);

  // Debounced search effect
  React.useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        try {
          const results = await searchPersons(searchQuery);
          setSearchResults(results);
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handlePersonSelect = async (searchResult: PersonSearchResult) => {
    setIsLoadingPersonData(true);
    try {
      const fullPersonData = await fetchPersonData(searchResult.NIK);
      
      if (fullPersonData) {
        setSelectedPerson(fullPersonData);
        onPersonSelect?.(fullPersonData);
        setOpen(false);
      }
    } catch (error) {
      console.error('Error fetching person data:', error);
      // You can add toast notification here if needed
    } finally {
      setIsLoadingPersonData(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between h-12 px-4 py-3 rounded-md border border-input border-gray-400 bg-background text-base ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:border-black disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          disabled={disabled}
        >
          {isLoadingPersonData ? (
            <span className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Memuat data...
            </span>
          ) : selectedPerson ? (
            <span className="truncate">
              {selectedPerson.NAMA} - {selectedPerson.NIK}
            </span>
          ) : (
            <span className="text-muted-foreground font-normal">
              {placeholder}
              {required && <span className="ml-1">⭐</span>}
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Cari nama, NIK, atau No. KK..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            {isSearching ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm text-muted-foreground">Mencari...</span>
              </div>
            ) : (
              <>
                {searchQuery.length < 2 ? (
                  <CommandEmpty>
                    Ketik minimal 2 karakter untuk mencari
                  </CommandEmpty>
                ) : searchResults.length === 0 ? (
                  <CommandEmpty>
                    Tidak ada data ditemukan.
                  </CommandEmpty>
                ) : (
                  <CommandGroup>
                    {searchResults.map((searchResult) => (
                      <CommandItem
                        key={searchResult.NIK}
                        value={searchResult.NIK}
                        onSelect={() => handlePersonSelect(searchResult)}
                        className="flex flex-col items-start py-3"
                      >
                        <div className="flex items-center w-full">
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4 flex-shrink-0",
                              selectedPerson?.NIK === searchResult.NIK ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{searchResult.NAMA}</div>
                            <div className="text-sm text-muted-foreground">
                              NIK: {searchResult.NIK} | KK: {searchResult.NO_KK}
                            </div>
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { getReligionText, getGenderText, convertTimestampToDate };