"use client";

import { cn } from "@/lib/utils";
import { CalculatorForm } from "./calculatorForm";
import { computeMaterialCost, computeTotal } from "./formulas";
import { useState } from "react";
import { Breakdown, CalculatorFormValues } from "./types";

export default function Calculator() {
  const [breakdown, setBreakdown] = useState<Breakdown>({
    cogs: {
      material: 0,
      extraMaterials: 0,
      painting: 0,
      sanding: 0,
      printingLabor: 0,
      total: 0,
    },
    fixedCosts: {
      support: 0,
      modeling: 0,
      rent: 0,
      total: 0,
    },
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

      {/* COGS Section */}
      <div className="cogs-details border-b pb-4">
        <h2 className="mb-2 text-lg font-semibold">
          Cost Of Goods Sold (COGS)
        </h2>
        <div className="flex justify-between pl-4">
          <p className="text-gray-500">Material:</p>
          <p>{breakdown.cogs.material.toFixed(3)} KWD</p>
        </div>
        <div className="flex justify-between pl-4">
          <p className="text-gray-500">Extra Materials:</p>
          <p>{breakdown.cogs.extraMaterials.toFixed(3)} KWD</p>
        </div>
        <div className="flex justify-between pl-4">
          <p className="text-gray-500">Painting:</p>
          <p>{breakdown.cogs.painting.toFixed(3)} KWD</p>
        </div>
        <div className="flex justify-between pl-4">
          <p className="text-gray-500">Sanding:</p>
          <p>{breakdown.cogs.sanding.toFixed(3)} KWD</p>
        </div>
        <div className="flex justify-between pl-4">
          <p className="text-gray-500">Printing Labor:</p>
          <p>{breakdown.cogs.printingLabor.toFixed(3)} KWD</p>
        </div>
        <div className="mt-2 flex justify-between font-medium">
          <p>COGS Total:</p>
          <p className="text-accent">{breakdown.cogs.total.toFixed(3)} KWD</p>
        </div>
      </div>

      {/* Fixed Costs Section */}
      <div className="fixed-costs-details border-b pb-4">
        <h2 className="mb-2 text-lg font-semibold">Fixed Costs</h2>
        <div className="flex justify-between pl-4">
          <p className="text-gray-500">Support:</p>
          <p>{breakdown.fixedCosts.support.toFixed(3)} KWD</p>
        </div>
        <div className="flex justify-between pl-4">
          <p className="text-gray-500">Modeling:</p>
          <p>{breakdown.fixedCosts.modeling.toFixed(3)} KWD</p>
        </div>
        <div className="flex justify-between pl-4">
          <p className="text-gray-500">Rent:</p>
          <p>{breakdown.fixedCosts.rent.toFixed(3)} KWD</p>
        </div>
        <div className="mt-2 flex justify-between font-medium">
          <p>Fixed Costs Total:</p>
          <p className="text-accent">
            {breakdown.fixedCosts.total.toFixed(3)} KWD
          </p>
        </div>
      </div>

      {/* Totals Section */}
      <div className="totals">
        <div className="flex justify-between">
          <p className="text-2xl">Total Cost:</p>
          <p className="text-2xl">{breakdown.total.toFixed(3)} KWD</p>
        </div>
        <div className="flex justify-between">
          <p className="text-2xl">Suggested Price:</p>
          <p className="text-2xl">{breakdown.suggestedPrice.toFixed(3)} KWD</p>
        </div>
        <div className="flex justify-between">
          <p className="text-2xl">Price:</p>
          <p className="text-2xl">{breakdown.price.toFixed(3)} KWD</p>
        </div>
        <div className="flex justify-between">
          <p className="text-2xl">Profit:</p>
          <p className="text-2xl">
            {(breakdown.price - breakdown.total).toFixed(3)} KWD
          </p>
        </div>
      </div>
    </div>
  );
}
