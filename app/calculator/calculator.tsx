"use client";

import { cn } from "@/lib/utils";
import { CalculatorForm } from "./calculatorForm";
import { computeMaterialCost, computeTotal } from "./formulas";
import { useState } from "react";
import { Breakdown, CalculatorFormValues } from "./types";

export default function Calculator() {
  const [breakdown, setBreakdown] = useState<Breakdown>({
    cogs: 0,
    suggestedPrice: 0,
    extraMaterials: 0,
    total: 0,
    price: 0,
  });

  const handleFormChange = (value: CalculatorFormValues) => {
    setBreakdown(computeTotal(value));
  };

  return (
    <div className="flex h-dvh w-full gap-4 p-4">
      <div className="results w-full">
        <Preview3d />
        <Summary className="mt-7" breakdown={breakdown} />
      </div>
      <div className="inputs flex w-full flex-col gap-4 overflow-y-auto">
        <CalculatorForm
          onChange={handleFormChange}
          className="p-4"
        ></CalculatorForm>
      </div>
    </div>
  );
}

function Preview3d() {
  return <div className="h-[500] w-full bg-gray-500">3d preview</div>;
}

type SummaryProps = {
  className?: string;
  breakdown: Breakdown;
};

function Summary({ className, breakdown }: SummaryProps) {
  return (
    <div className={cn("breakdown flex flex-col gap-4", className)}>
      <h1 className="text-accent text-xl">Your Project Breakdown</h1>
      <div className="details">
        <div className="flex justify-between">
          <p className="text-gray-500">Cost Of Goods Sold (COGS): </p>
          <p className="text-accent">{breakdown.cogs} KWD</p>
        </div>
      </div>
      <div className="totals">
        <div className="flex justify-between">
          <p className="text-2xl">Total Cost: </p>
          <p className="text-2xl">{breakdown.total} KWD </p>
        </div>
        <div className="flex justify-between">
          <p className="text-2xl">Suggested Price: </p>
          <p className="text-2xl">{breakdown.suggestedPrice} KWD </p>
        </div>
        <div className="flex justify-between">
          <p className="text-2xl">Price: </p>
          <p className="text-2xl">{breakdown.price} KWD </p>
        </div>

        <div className="flex justify-between">
          <p className="text-2xl">Profit: </p>
          <p className="text-2xl">{breakdown.price - breakdown.total} KWD </p>
        </div>
      </div>
    </div>
  );
}
