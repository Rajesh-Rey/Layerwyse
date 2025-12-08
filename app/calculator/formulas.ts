import {
  Breakdown,
  CalculatorFormValues,
  CategoryPrices,
  CogsBreakdown,
  FixedCostsBreakdown,
} from "./types";

export function computeTotal(v: CalculatorFormValues): Breakdown {
  let extraSum = 0;
  for (const m of v.extraMaterials) {
    extraSum += m.unitPrice * m.quantity;
  }

  const c = categoryPricesKWD?.[v.category];

  let paintingLaborCost = 0;
  let sandingLaborCost = 0;
  let printingLaborCost = 0;
  let supportLaborCost = 0;
  let modelingLaborCost = 0;

  if (c != null) {
    const paintingMult = c.painting.levels[v.paintingDifficulty];
    const paintingPrice = c.painting.basePrice;
    paintingLaborCost = paintingPrice * paintingMult;

    const sandingMult = c.sanding.levels[v.sandingDifficulty];
    const sandingPrice = c.sanding.basePrice;
    sandingLaborCost = sandingPrice * sandingMult;

    const supportMult = c.support.levels[v.supportDifficulty];
    const supportPrice = c.support.basePrice;
    supportLaborCost = supportPrice * supportMult;

    printingLaborCost = v.removalTime * v.hourlyLaborRate;

    const modelingMult = c.modeling.levels[v.modelingDifficulty];
    const modelingPrice = c.modeling.basePrice;
    modelingLaborCost = modelingPrice * modelingMult;
  }

  const materialCost = v.materialCost * v.volume;
  const cogsTotal =
    materialCost +
    extraSum +
    paintingLaborCost +
    sandingLaborCost +
    printingLaborCost;

  const cogs: CogsBreakdown = {
    material: materialCost,
    extraMaterials: extraSum,
    painting: paintingLaborCost,
    sanding: sandingLaborCost,
    printingLabor: printingLaborCost,
    total: cogsTotal,
  };

  const rent = 0; // Placeholder for future rent cost
  const fixedCostsTotal = supportLaborCost + modelingLaborCost + rent;

  const fixedCosts: FixedCostsBreakdown = {
    support: supportLaborCost,
    modeling: modelingLaborCost,
    rent: rent,
    total: fixedCostsTotal,
  };

  // we need to show to the user that the more they print the less this will cost them
  const total = cogsTotal + fixedCostsTotal / v.quantity;

  const suggestedPrice = total + (total * v.margin) / 100;

  return {
    cogs,
    fixedCosts,
    extraMaterials: extraSum,
    total,
    suggestedPrice,
    price: v.price,
  };
}

export function computeMaterialCost(values: CalculatorFormValues) {
  const { materialCost, extraMaterials, volume } = values;
}

const categoryPricesKWD: CategoryPrices | undefined = {
  figures: {
    painting: {
      basePrice: 5,
      levels: { none: 0, easy: 1, medium: 2, hard: 5, expert: 15 },
    },
    sanding: {
      basePrice: 5,
      levels: { none: 0, easy: 1, medium: 2, hard: 5, expert: 15 },
    },
    support: {
      basePrice: 5,
      levels: { none: 0, easy: 1, medium: 2, hard: 5, expert: 15 },
    },
    modeling: {
      basePrice: 5,
      levels: { none: 0, easy: 1, medium: 2, hard: 5, expert: 15 },
    },
  },
};
