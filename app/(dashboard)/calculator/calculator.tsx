"use client";

import { cn, toNumOrZero } from "@/lib/utils";
import { CalculatorForm } from "./calculatorForm";
import { computeTotal } from "./formulas";
import { useState } from "react";
import { Breakdown, CalculatorFormValues, extraMaterialSchema } from "./types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import {
  ChartBarDecreasing,
  ChartColumnBig,
  ChartColumnDecreasing,
  ClipboardCheck,
  Crown,
  Currency,
  Gem,
  Icon,
  Package,
  TvIcon,
  TrendingUp,
  DollarSign,
  Calculator as CalculatorIcon,
} from "lucide-react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Pie, PieChart } from "recharts";

const currency = "KWD";

function calcPrice(cost: number, margin: number) {
  return cost + (cost * margin) / 100;
}
function profit(price: number, cost: number) {
  return price - cost;
}

export default function Calculator({ className }: { className?: string }) {
  const [breakdown, setBreakdown] = useState<Breakdown>({
    cogs: {
      materials: 0,
      extraMaterials: 0,
      painting: 0,
      sanding: 0,
      printingLabor: 0,
      total: 0,
    },
    fixedCosts: {
      electricity: 0,
      support: 0,
      modeling: 0,
      rent: 0,
      total: 0,
    },
    suggestedPrice: 0,
    total: 0,
    price: 0,
  });

  const [selectedMargin, setSelectedMargin] = useState<string>("Standard");
  const [margin, setMargin] = useState<number>(30);
  const [customMargin, setCustomMargin] = useState<number>(30);

  const competitiveMargin = 25;
  const standardMargin = 30;
  const premiumMargin = 80;
  const luxuryMargin = 100;

  const handleFormChange = (value: CalculatorFormValues) => {
    // check for removed services so they are not included in the calculation

    const copy = { ...value };

    if (!value.services.includes("printing")) {
      copy.materials = [{ costPerKg: 0, weight: 0, material: "" }];
      copy.removalTimeInMinutes = 0;
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
    copy.extraMaterials = copy.extraMaterials.map((e) => ({
      name: e.name,
      unitCost: toNumOrZero(e.unitCost),
      quantity: toNumOrZero(e.quantity),
    }));
    copy.materials = copy.materials.map((e) => ({
      material: e.material,
      costPerKg: toNumOrZero(e.costPerKg),
      weight: toNumOrZero(e.weight),
    }));

    copy.consumableCost = toNumOrZero(copy.consumableCost);
    copy.removalTimeInMinutes = toNumOrZero(copy.removalTimeInMinutes);

    setBreakdown(computeTotal(copy));
  };

  const onMarginSelect = (margin: string, marginAmount: number) => {
    setMargin(marginAmount);
    setSelectedMargin(margin);
  };

  return (
    <div
      className={cn(
        "grid max-w-[900px] grid-cols-1 gap-4 md:grid-cols-2 lg:max-w-[1400px]",
        className,
      )}
    >
      <div className="inputs flex w-full flex-col gap-4">
        <CalculatorForm onChange={handleFormChange}></CalculatorForm>
      </div>

      <div className="results sticky top-0 h-fit w-full self-start">
        <Card className="bg-gray-900">
          <CardHeader className="text-lg font-bold">
            Suggested Pricing
            <CardDescription>
              Select a margin option or set a custom margin
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <MarginOption
              className="bg-gradient-to-br from-orange-950/60 via-orange-900/40 to-slate-800/60 hover:from-orange-950/80 hover:via-orange-900/60 hover:to-slate-800/80"
              selected={selectedMargin === "Competitive"}
              onClick={() => onMarginSelect("Competitive", competitiveMargin)}
              price={calcPrice(toNumOrZero(breakdown.total), competitiveMargin)}
              title="Competitive"
              margin={competitiveMargin}
            >
              <ChartColumnDecreasing className="text-orange-400"></ChartColumnDecreasing>
            </MarginOption>

            <MarginOption
              className="bg-gradient-to-br from-sky-950/60 via-sky-900/40 to-slate-800/60 hover:from-sky-950/80 hover:via-sky-900/60 hover:to-slate-800/80"
              selected={selectedMargin === "Standard"}
              onClick={() => onMarginSelect("Standard", standardMargin)}
              price={calcPrice(toNumOrZero(breakdown.total), standardMargin)}
              title="Standard"
              margin={standardMargin}
            >
              <Package className="text-sky-400"></Package>
            </MarginOption>

            <MarginOption
              className="bg-gradient-to-br from-violet-950/60 via-violet-900/40 to-slate-800/60 hover:from-violet-950/80 hover:via-violet-900/60 hover:to-slate-800/80"
              selected={selectedMargin === "Premium"}
              onClick={() => onMarginSelect("Premium", premiumMargin)}
              price={calcPrice(toNumOrZero(breakdown.total), premiumMargin)}
              title="Premium"
              margin={premiumMargin}
            >
              <Gem className="text-violet-400"></Gem>
            </MarginOption>

            <MarginOption
              className="bg-gradient-to-br from-amber-950/60 via-amber-900/40 to-slate-800/60 hover:from-amber-950/80 hover:via-amber-900/60 hover:to-slate-800/80"
              selected={selectedMargin === "Luxury"}
              onClick={() => onMarginSelect("Luxury", luxuryMargin)}
              price={calcPrice(toNumOrZero(breakdown.total), luxuryMargin)}
              title="Luxury"
              margin={luxuryMargin}
            >
              <Crown className="text-amber-400"></Crown>
            </MarginOption>

            <MarginOption
              className="col-span-1 w-full bg-gradient-to-br from-emerald-950/50 via-emerald-900/30 to-slate-800/50 hover:from-emerald-950/70 hover:via-emerald-900/50 hover:to-slate-800/70 sm:col-span-2"
              variant="custom"
              selected={selectedMargin === "Custom"}
              onClick={() => setSelectedMargin("Custom")}
              price={calcPrice(toNumOrZero(breakdown.total), customMargin)}
              title="Custom"
              onChange={(value) => {
                setMargin(value);
                setCustomMargin(value);
              }}
              margin={customMargin}
            >
              <TvIcon className="text-emerald-400"></TvIcon>
            </MarginOption>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>

        <PriceSummaryCard
          className="mt-4"
          totalCost={breakdown.total}
          margin={margin}
          selectedPrice={calcPrice(toNumOrZero(breakdown.total), margin)}
        />
        {/*<Preview3d />*/}
        <CostsBreakdown className="mt-4" breakdown={breakdown} />
        <ChartPieLegend className="mt-4" breakdown={breakdown}></ChartPieLegend>
      </div>
    </div>
  );
}

function MarginOption({
  title,
  margin,
  price,
  selected,
  variant,
  children,
  onClick,
  className,
  onChange,
}: {
  title: string;
  margin: number;
  selected?: boolean;
  price: number;
  variant?: "custom";
  children: React.ReactNode;
  onClick?: (title: string) => void;
  onChange?: (value: number) => void;
  className?: string;
}) {
  const isCustom = variant === "custom";
  const showDetails = isCustom ? selected : true;

  return (
    <div
      onClick={() => onClick && onClick(title)}
      className={cn(
        className,
        "flex flex-col rounded-xl border-4 border-transparent bg-clip-padding",
        selected && "border-blue-400",
      )}
    >
      <Item className="">
        <ItemContent className="flex flex-row items-center">
          <div className="flex items-center gap-3">
            {children}

            <div className="">
              <ItemTitle>{title}</ItemTitle>
              {showDetails && (
                <ItemDescription>{margin} % profit margin</ItemDescription>
              )}
            </div>
          </div>
        </ItemContent>
        {showDetails && (
          <ItemActions className="items-center">
            <div className="text-lg">
              {price?.toFixed(3)} {currency}
            </div>
          </ItemActions>
        )}
      </Item>
      {isCustom && selected && (
        <div className="mb-4 flex gap-2 pr-4 pl-4">
          <Slider
            max={100}
            step={1}
            value={[margin]}
            onValueChange={(value) => onChange && onChange(value[0])}
          ></Slider>
          <Input
            value={margin}
            className="h-8 w-12"
            onChange={(e) => onChange && onChange(Number(e.target.value))}
          />
          %
        </div>
      )}
    </div>
  );
}
function Preview3d() {
  return <div className="h-[500] w-full bg-gray-500">3d preview</div>;
}

function PriceSummaryCard({
  className,
  totalCost,
  margin,
  selectedPrice,
}: {
  className?: string;
  totalCost: number;
  margin: number;
  selectedPrice: number;
}) {
  const profitAmount = profit(selectedPrice, totalCost);
  const profitPercentage = totalCost > 0 ? (profitAmount / totalCost) * 100 : 0;
  const isProfitable = profitAmount > 0;

  return (
    <Card className={cn("bg-gray-900", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalculatorIcon className="h-5 w-5" />
          Financial Summary
        </CardTitle>
        <CardDescription>Price breakdown for selected margin</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-2 rounded-lg border border-blue-500/20 bg-blue-950/20 p-4">
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4" />
              <span>Price</span>
            </div>
            <div className="text-2xl font-bold text-blue-400">
              {selectedPrice.toFixed(3)} {currency}
            </div>
            <div className="text-muted-foreground text-xs">Customer pays</div>
          </div>

          <div className="flex flex-col gap-2 rounded-lg border border-gray-500/20 bg-gray-800/20 p-4">
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <CalculatorIcon className="h-4 w-4" />
              <span>Cost</span>
            </div>
            <div className="text-2xl font-bold text-gray-300">
              {totalCost.toFixed(3)} {currency}
            </div>
            <div className="text-muted-foreground text-xs">Total expenses</div>
          </div>

          <div
            className={cn(
              "flex flex-col gap-2 rounded-lg border p-4",
              isProfitable
                ? "border-green-500/20 bg-green-950/20"
                : "border-red-500/20 bg-red-950/20",
            )}
          >
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4" />
              <span>Profit</span>
            </div>
            <div
              className={cn(
                "text-2xl font-bold",
                isProfitable ? "text-green-400" : "text-red-400",
              )}
            >
              {profitAmount.toFixed(3)} {currency}
            </div>
            <div className="text-muted-foreground text-xs">
              {profitPercentage.toFixed(1)}% margin
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
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
      <span className="font-medium tabular-nums">
        {value.toFixed(3)} {currency}
      </span>
    </div>
  );
}

function CostsBreakdown({ className, breakdown }: SummaryProps) {
  const profit = breakdown.price - breakdown.total;
  const profitMargin =
    breakdown.price > 0 ? (profit / breakdown.price) * 100 : 0;

  const hasCOGSDetails =
    breakdown.cogs.materials > 0 ||
    breakdown.cogs.extraMaterials > 0 ||
    breakdown.cogs.painting > 0 ||
    breakdown.cogs.sanding > 0 ||
    breakdown.cogs.printingLabor > 0;

  const hasFixedCostsDetails =
    breakdown.fixedCosts.support > 0 ||
    breakdown.fixedCosts.modeling > 0 ||
    breakdown.fixedCosts.electricity > 0 ||
    breakdown.fixedCosts.rent > 0;

  return (
    <Card className={cn("flex flex-col gap-5 bg-gray-900", className)}>
      <CardHeader className="text-lg font-bold">Project Breakdown</CardHeader>
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
                  {breakdown.cogs.total.toFixed(3)} {currency}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {hasCOGSDetails ? (
                <div className="bg-muted/50 rounded-lg px-4 py-2">
                  <CostLineItem
                    label="Material"
                    value={breakdown.cogs.materials}
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

          {/* Operating Costs Section */}
          <AccordionItem value="fixed" className="border-b-0">
            <AccordionTrigger className="py-3 hover:no-underline">
              <div className="flex w-full items-center justify-between pr-2">
                <span className="font-medium">Operating Costs</span>
                <span className="text-accent tabular-nums">
                  {breakdown.fixedCosts.total.toFixed(3)} {currency}
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

                  <CostLineItem
                    label="Electricity"
                    value={breakdown.fixedCosts.electricity}
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
  );
}

function ChartPieLegend({
  breakdown,
  className,
}: {
  breakdown: Breakdown;
  className: string;
}) {
  const chartConfig = {
    value: {
      label: "Value",
      color: "",
    },
    materials: {
      label: "Materials",
      color: "var(--chart-1)",
    },
    extraMaterials: {
      label: "Extra Materials",
      color: "var(--chart-2)",
    },
    painting: {
      label: "Painting",
      color: "var(--chart-3)",
    },
    sanding: {
      label: "Sanding",
      color: "var(--chart-4)",
    },
    printingLabor: {
      label: "Printing Labor",
      color: "var(--chart-5)",
    },
    electricity: {
      label: "Electricity",
      color: "var(--chart-6)",
    },
    support: {
      label: "Support",
      color: "var(--chart-7)",
    },
    modeling: {
      label: "Modeling",
      color: "var(--chart-8)",
    },
    rent: {
      label: "Rent",
      color: "var(--chart-9)",
    },
  } satisfies ChartConfig;

  const chartData: { cost: string; value: number; fill: string }[] = [];

  // Add COGS data (excluding total)
  for (const [key, value] of Object.entries(breakdown.cogs)) {
    if (key !== "total" && value > 0) {
      const configKey = key as keyof typeof chartConfig;
      chartData.push({
        cost: key,
        value: value,
        fill: chartConfig[configKey].color,
      });
    }
  }

  // Add fixed costs data (excluding total)
  for (const [key, value] of Object.entries(breakdown.fixedCosts)) {
    const configKey = key as keyof typeof chartConfig;
    if (key !== "total" && value > 0) {
      chartData.push({
        cost: key,
        value: value,
        fill: chartConfig[configKey].color,
      });
    }
  }

  return (
    <Card className={cn("bg-gray-900", className)}>
      <CardHeader className="items-center pb-0">
        <CardTitle>Cost Breakdown</CardTitle>
        <CardDescription>Distribution of costs</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-[16/9] max-h-[300px]"
        >
          <PieChart layout="horizontal">
            <Pie data={chartData} dataKey="value" nameKey="cost" />
            <ChartLegend
              content={<ChartLegendContent nameKey="cost" />}
              layout="vertical"
              verticalAlign="middle"
              align="right"
              className="flex-col gap-2 *:justify-start"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
