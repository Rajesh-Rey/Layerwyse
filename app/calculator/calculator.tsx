"use client";

import { cn } from "@/lib/utils";
import { CalculatorForm } from "./calculatorForm";
import { computeTotal } from "./formulas";
import { useState } from "react";
import { Breakdown, CalculatorFormValues } from "./types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

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
    // check for removed services so they are not included in the calculation

    const copy = { ...value };

    if (!value.services.includes("printing")) {
      copy.volume = 0;
      copy.removalTime = 0;
      copy.printTime = 0;
    }

    if (!value.services.includes("painting")) {
      copy.paintingDifficulty = "none";
    }

    if (!value.services.includes("sanding")) {
      copy.sandingDifficulty = "none";
    }

    if (!value.services.includes("modeling")) {
      copy.modelingDifficulty = "none";
    }

    setBreakdown(computeTotal(copy));
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

type CostLineItemProps = {
  label: string;
  value: number;
  show?: boolean;
};

function CostLineItem({ label, value, show = true }: CostLineItemProps) {
  if (!show || value <= 0) return null;

  return (
    <div className="flex justify-between py-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{value.toFixed(3)} KWD</span>
    </div>
  );
}

function Summary({ className, breakdown }: SummaryProps) {
  const profit = breakdown.price - breakdown.total;
  const profitMargin =
    breakdown.price > 0 ? (profit / breakdown.price) * 100 : 0;

  const hasCOGSDetails =
    breakdown.cogs.material > 0 ||
    breakdown.cogs.extraMaterials > 0 ||
    breakdown.cogs.painting > 0 ||
    breakdown.cogs.sanding > 0 ||
    breakdown.cogs.printingLabor > 0;

  const hasFixedCostsDetails =
    breakdown.fixedCosts.support > 0 ||
    breakdown.fixedCosts.modeling > 0 ||
    breakdown.fixedCosts.rent > 0;

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <h1 className="text-xl font-semibold">Project Breakdown</h1>

      {/* Price Summary Card - Most Important Info */}
      <Card className="border-accent/30 bg-accent/5">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Total Cost</p>
              <p className="text-2xl font-bold tabular-nums">
                {breakdown.total.toFixed(3)}
                <span className="text-muted-foreground ml-1 text-sm font-normal">
                  KWD
                </span>
              </p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Price</p>
              <p className="text-accent text-2xl font-bold tabular-nums">
                {breakdown.price.toFixed(3)}
                <span className="text-muted-foreground ml-1 text-sm font-normal">
                  KWD
                </span>
              </p>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Profit</p>
              <p
                className={cn(
                  "text-xl font-bold tabular-nums",
                  profit >= 0 ? "text-green-600" : "text-destructive",
                )}
              >
                {profit.toFixed(3)} KWD
              </p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground text-sm">Margin</p>
              <p
                className={cn(
                  "text-xl font-bold tabular-nums",
                  profit >= 0 ? "text-green-600" : "text-destructive",
                )}
              >
                {profitMargin.toFixed(1)}%
              </p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground text-sm">Suggested</p>
              <p className="text-muted-foreground text-xl font-semibold tabular-nums">
                {breakdown.suggestedPrice.toFixed(3)} KWD
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cost Breakdown Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Cost Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion
            type="multiple"
            className="w-full"
            defaultValue={["cogs", "fixed"]}
          >
            {/* COGS Section */}
            <AccordionItem value="cogs" className="border-b-0">
              <AccordionTrigger className="py-3 hover:no-underline">
                <div className="flex w-full items-center justify-between pr-2">
                  <span className="font-medium">Cost of Goods Sold</span>
                  <span className="text-accent tabular-nums">
                    {breakdown.cogs.total.toFixed(3)} KWD
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {hasCOGSDetails ? (
                  <div className="bg-muted/50 rounded-lg px-4 py-2">
                    <CostLineItem
                      label="Material"
                      value={breakdown.cogs.material}
                    />
                    <CostLineItem
                      label="Extra Materials"
                      value={breakdown.cogs.extraMaterials}
                    />
                    <CostLineItem
                      label="Painting"
                      value={breakdown.cogs.painting}
                    />
                    <CostLineItem
                      label="Sanding"
                      value={breakdown.cogs.sanding}
                    />
                    <CostLineItem
                      label="Printing Labor"
                      value={breakdown.cogs.printingLabor}
                    />
                  </div>
                ) : (
                  <p className="text-muted-foreground py-2 text-sm">
                    No COGS items yet. Fill in the form to see the breakdown.
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>

            <Separator />

            {/* Fixed Costs Section */}
            <AccordionItem value="fixed" className="border-b-0">
              <AccordionTrigger className="py-3 hover:no-underline">
                <div className="flex w-full items-center justify-between pr-2">
                  <span className="font-medium">Fixed Costs</span>
                  <span className="text-accent tabular-nums">
                    {breakdown.fixedCosts.total.toFixed(3)} KWD
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {hasFixedCostsDetails ? (
                  <div className="bg-muted/50 rounded-lg px-4 py-2">
                    <CostLineItem
                      label="Support"
                      value={breakdown.fixedCosts.support}
                    />
                    <CostLineItem
                      label="Modeling"
                      value={breakdown.fixedCosts.modeling}
                    />
                    <CostLineItem
                      label="Rent"
                      value={breakdown.fixedCosts.rent}
                    />
                  </div>
                ) : (
                  <p className="text-muted-foreground py-2 text-sm">
                    No fixed costs yet. Fill in the form to see the breakdown.
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
