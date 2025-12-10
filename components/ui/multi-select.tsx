"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
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
import { Item } from "@radix-ui/react-select";

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  disabled?: boolean;
}

function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select items...",
  searchPlaceholder = "Search...",
  emptyMessage = "No items found.",
  className,
  disabled = false,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const handleRemove = (e: React.MouseEvent, value: string) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(selected.filter((item) => item !== value));
  };

  const selectedLabels = selected.map(
    (value) => options.find((opt) => opt.value === value)?.label,
  );
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <div
          role="combobox"
          aria-expanded={open}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              if (!disabled) setOpen(true);
            }
          }}
          className={cn(
            "border-input bg-focus-visible:border-ring focus-visible:ring-ring/50 flex min-h-9 w-full cursor-pointer items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]",
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            disabled && "pointer-events-none cursor-not-allowed opacity-50",
            !selected.length && "text-muted-foreground",
            className,
          )}
        >
          <div className="flex flex-1 flex-wrap gap-1">
            {selected.length === 0 ? (
              <span>{placeholder}</span>
            ) : (
              selectedLabels.map((label, index) => (
                <span
                  key={selected[index]}
                  className="bg-secondary text-secondary-foreground inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium"
                >
                  {label}
                  <span
                    role="button"
                    tabIndex={0}
                    className="hover:bg-secondary-foreground/20 cursor-pointer rounded-sm"
                    onClick={(e) => handleRemove(e, selected[index])}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        onChange(
                          selected.filter((item) => item !== selected[index]),
                        );
                      }
                    }}
                    aria-label={`Remove ${label}`}
                  >
                    <XIcon className="size-3" />
                  </span>
                </span>
              ))
            )}
          </div>
          <ChevronsUpDownIcon className="size-4 shrink-0 opacity-50" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selected.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleSelect(option.value)}
                  >
                    <div
                      className={cn(
                        "border-primary mr-2 flex size-4 items-center justify-center rounded-sm border",
                        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <CheckIcon className="size-3" />
                    </div>
                    {option.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { MultiSelect };
