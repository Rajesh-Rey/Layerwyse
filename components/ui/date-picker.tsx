"use client";

import * as React from "react";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { isToday } from "date-fns";

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function parseDate(value: string): Date | undefined {
  // Try to parse dd/mm/yyyy format
  const ddmmyyyy = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (ddmmyyyy) {
    const [, day, month, year] = ddmmyyyy;
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    if (isValidDate(date)) {
      return date;
    }
  }

  // Fallback to native Date parsing
  const date = new Date(value);
  if (isValidDate(date)) {
    return date;
  }

  return undefined;
}

function isValidDate(date: Date | undefined): date is Date {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

type DatePickerProps = {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  /** Whether the input field is directly editable. If false, only calendar selection is allowed. Defaults to true. */
  editable?: boolean;
};

function DatePicker({
  value,
  onChange,
  placeholder = "yy-dd-yyyy",
  disabled = false,
  className,
  id,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (date: Date | undefined) => {
    onChange?.(date);
    setOpen(false);
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id={id}
          disabled={disabled}
          type="button"
          className={cn("justify-between font-normal", className)}
        >
          {value ? value.toISOString().split("T")[0] : placeholder}
          <ChevronDownIcon className="size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          classNames={{
            today:
              "bg-muted text-accent-foreground rounded-md data-[selected=true]:rounded-none",
          }}
          mode="single"
          selected={value}
          captionLayout="dropdown"
          onSelect={handleSelect}
        />
      </PopoverContent>
    </Popover>
  );
}

DatePicker.displayName = "DatePicker";

export { DatePicker };
