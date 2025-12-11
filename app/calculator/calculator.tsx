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
export default function Calculator() {
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

  const competitiveMargin = 25;
  const standardMargin = 30;
  const premiumMargin = 80;
  const luxuryMargin = 100;

  function price(price: number, margin: number) {
    return price + (price * margin) / 100;
  }
  function profit(price: number, cost: number) {
    return price - cost;
  }

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

  const onMarginSelect = (margin: string) => {
    setSelectedMargin(margin);
  };

  return (
    <div className="mx-auto grid max-w-[900px] grid-cols-1 flex-wrap gap-4 md:grid-cols-2 md:px-6 lg:max-w-[1400px]">
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
              className="bg-red-500"
              selected={selectedMargin === "Competitive"}
              onClick={onMarginSelect}
              price={price(toNumOrZero(breakdown.total), competitiveMargin)}
              title="Competitive"
              margin={competitiveMargin}
            >
              <ChartColumnDecreasing></ChartColumnDecreasing>
            </MarginOption>

            <MarginOption
              className="bg-blue-600"
              selected={selectedMargin === "Standard"}
              onClick={() => onMarginSelect("Standard")}
              price={price(toNumOrZero(breakdown.total), standardMargin)}
              title="Standard"
              margin={standardMargin}
            >
              <Package></Package>
            </MarginOption>

            <MarginOption
              className="bg-amber-600"
              selected={selectedMargin === "Premium"}
              onClick={() => onMarginSelect("Premium")}
              price={price(toNumOrZero(breakdown.total), premiumMargin)}
              title="Premium"
              margin={premiumMargin}
            >
              <Gem></Gem>
            </MarginOption>

            <MarginOption
              className="bg-green-800"
              selected={selectedMargin === "Luxury"}
              onClick={() => onMarginSelect("Luxury")}
              price={price(toNumOrZero(breakdown.total), luxuryMargin)}
              title="Luxury"
              margin={luxuryMargin}
            >
              <Crown></Crown>
            </MarginOption>

            <MarginOption
              className="col-span-1 w-full bg-gray-600 sm:col-span-2"
              variant="custom"
              selected={selectedMargin === "Custom"}
              onClick={() => onMarginSelect("Custom")}
              price={price(toNumOrZero(breakdown.total), margin)}
              title="Custom"
              onChange={(value) => {
                setMargin(value);
              }}
              margin={margin}
            >
              <TvIcon></TvIcon>
            </MarginOption>

            <div className="col-span-1 mt-4 flex w-full justify-between bg-gray-900 text-3xl sm:col-span-2">
              <div className="font-bold">Profit </div>
              <div
                className={cn(
                  "",
                  profit(price(breakdown.total, margin), breakdown.total) > 0
                    ? "text-green-500"
                    : "text-red-500",
                )}
              >
                {profit(
                  price(breakdown.total, margin),
                  breakdown.total,
                ).toFixed(3)}{" "}
                {currency}
              </div>
            </div>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
        {/*<Preview3d />*/}
        <CostsBreakdown className="mt-7" breakdown={breakdown} />
        <ChartPieLegend className="mt-7" breakdown={breakdown}></ChartPieLegend>
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
  return (
    <div
      onClick={() => onClick && onClick(title)}
      className={cn(
        className,
        "flex flex-col rounded-xl",
        selected && "border-4 border-blue-400",
      )}
    >
      <Item className="p-4">
        <ItemContent className="flex flex-row items-center">
          <div className="flex items-center gap-3">
            {children}

            <div className="">
              <ItemTitle>{title}</ItemTitle>
              <ItemDescription>{margin} % profit margin</ItemDescription>
            </div>
          </div>
        </ItemContent>
        <ItemActions className="items-center">
          <div className="text-lg">
            {price?.toFixed(3)} {currency}
          </div>
        </ItemActions>
      </Item>
      {variant == "custom" && (
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
        fill: `var(--color-${key})`,
      });
    }
  }

  // Add fixed costs data (excluding total)
  for (const [key, value] of Object.entries(breakdown.fixedCosts)) {
    if (key !== "total" && value > 0) {
      chartData.push({
        cost: key,
        value: value,
        fill: `var(--color-${key})`,
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
