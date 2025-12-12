"use client";

import { useCurrency } from "./currency-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const currencies = [
  { value: "KWD", label: "KWD" },
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
  { value: "SAR", label: "SAR" },
];

export function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();

  return (
    <Select value={currency} onValueChange={(value) => setCurrency(value as any)}>
      <SelectTrigger className="h-auto w-auto border-0 bg-transparent p-0 text-4xl font-extrabold shadow-none hover:bg-transparent focus:ring-0 data-[state=open]:bg-transparent">
        <SelectValue>
          <span className="text-muted-foreground">({currency})</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {currencies.map((curr) => (
          <SelectItem key={curr.value} value={curr.value}>
            {curr.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
