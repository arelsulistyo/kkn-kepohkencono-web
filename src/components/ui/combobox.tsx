"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

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

interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxGroup {
  label: string;
  options: ComboboxOption[];
}

interface ComboboxProps {
  options?: ComboboxOption[];
  groups?: ComboboxGroup[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  searchPlaceholder?: string;
  className?: string;
  disabled?: boolean;
}

export function Combobox({
  options,
  groups,
  value,
  onValueChange,
  placeholder = "Select an option",
  emptyMessage = "No results found.",
  searchPlaceholder = "Cari...",
  className,
  disabled = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  // Flatten all options for finding selected value
  const allOptions = React.useMemo(() => {
    if (options) return options;
    if (groups) return groups.flatMap((group) => group.options);
    return [];
  }, [options, groups]);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between h-12 px-4 py-3 rounded-md border border-input border-gray-600 bg-background text-base ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:border-black disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          disabled={disabled}
        >
          {value ? (
            allOptions.find((option) => option.value === value)?.label
          ) : (
            <span className="text-muted-foreground font-normal">
              {placeholder}
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            {groups ? (
              groups.map((group) => (
                <CommandGroup
                  key={group.label}
                  heading={group.label}
                  className="[&_[cmdk-group-heading]]:text-[#64748B]"
                >
                  {group.options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={(currentValue) => {
                        onValueChange?.(currentValue);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === option.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))
            ) : (
              <CommandGroup>
                {options?.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      onValueChange?.(currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
