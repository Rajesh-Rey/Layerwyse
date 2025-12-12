"use client";

import { cn } from "@/lib/utils";
import Calculator from "./calculator";
import { CurrencyProvider } from "./currency-context";
import { CurrencySelector } from "./currency-selector";

export default function CalculatorPage() {
  return (
    <CurrencyProvider>
      <div className="align-center flex flex-col items-center">
        <div className="mt-4 flex items-center gap-3">
          <h1 className="text-4xl font-extrabold">
            3D Printing Pricing Calculator
          </h1>
          <CurrencySelector />
        </div>
        <Calculator className="p-8" />
      </div>
    </CurrencyProvider>
  );
}
