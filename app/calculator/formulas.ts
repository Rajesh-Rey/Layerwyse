import { Breakdown, CalculatorFormValues, CategoryPrices } from "./types";

export function computeTotal(v: CalculatorFormValues): Breakdown {
  let extraSum = 0;
  for (const m of v.extraMaterials) {
    extraSum += m.unitPrice * m.quantity;
  }

  const c = categoryPricesKWD?.[v.category];

  let laborCogs = 0;
  let laborCost = 0;
  if (c != null) {
    const paintingMult = c.painting.levels[v.paintingDifficulty];
    const paintingPrice = c.painting.basePrice;
    const paintingLaborCost = paintingPrice * paintingMult;

    const sandingMult = c.sanding.levels[v.sandingDifficulty];
    const sandingPrice = c.sanding.basePrice;
    const sandingLaborCost = sandingPrice * sandingMult;

    const supportMult = c.support.levels[v.supportDifficulty];
    const supportPrice = c.support.basePrice;
    const supportLaborCost = supportPrice * supportMult;

    const printingLaborCost = v.removalTime * v.hourlyLaborRate;

    const modelingMult = c.modeling.levels[v.modelingDifficulty];
    const modelingPrice = c.modeling.basePrice;
    const modelingLaborCost = modelingPrice * modelingMult;

    laborCogs = paintingLaborCost + sandingLaborCost + printingLaborCost;
    laborCost = supportLaborCost + modelingLaborCost;
  }

  const materials = v.materialCost * v.volume + extraSum;
  let cogs = materials + laborCogs;

  // we need to show to the user that the more they print the less this will cost them
  const total = cogs + laborCost / v.quantity;

  const suggestedPrice = total + (total * v.margin) / 100;

  return {
    cogs,
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
