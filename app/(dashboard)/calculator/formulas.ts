import {
  Breakdown,
  CalculatorFormValues,
  CategoryPrices,
  CogsBreakdown,
  FixedCostsBreakdown,
} from "./types";

export function computeTotal(v: CalculatorFormValues): Breakdown {
  console.log("raw values", v);
  let extraSum = 0;
  for (const m of v.extraMaterials) {
    extraSum += m.unitCost * m.quantity;
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

    const modelingMult = c.modeling.levels[v.modelingDifficulty];
    const modelingPrice = c.modeling.basePrice;
    modelingLaborCost = modelingPrice * modelingMult;
  }

  let materialCost = 0;
  for (const m of v.materials) {
    const costPerGram = m.costPerKg / 1000;
    materialCost += m.weight * costPerGram;
  }

  printingLaborCost = (v.removalTimeInMinutes * v.hourlyLaborRate) / 60;

  // let packaging = 0;

  const cogsTotal =
    materialCost +
    extraSum +
    paintingLaborCost +
    sandingLaborCost +
    printingLaborCost;

  const cogs: CogsBreakdown = {
    materials: materialCost,
    extraMaterials: extraSum,
    painting: paintingLaborCost,
    sanding: sandingLaborCost,
    printingLabor: printingLaborCost,
    total: cogsTotal,
  };
  console.log("cogs", cogs);

  const costPerWat = v.electricityCost / 1000;
  const printerElectricalCost = v.printerWattage * v.printTime * costPerWat;

  // how much money do we lose by running the printer?
  // how much money do we lose by just having the printer? how much we can sell it for? this one is dependent on date and the market
  //const printerOperatingCost = v.machineDepreciationRate

  const printerOperationalCost = printerElectricalCost;

  const rent = 0; // Placeholder for future rent cost
  const fixedCostsTotal =
    supportLaborCost + modelingLaborCost + rent + printerElectricalCost;

  const fixedCosts: FixedCostsBreakdown = {
    support: supportLaborCost,
    electricity: printerElectricalCost,
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
    total,
    suggestedPrice,
    price: suggestedPrice,
  };
}

const categoryPricesKWD: CategoryPrices | undefined = {
  miniatures: {
    painting: {
      basePrice: 8,
      levels: { none: 0, easy: 1, medium: 3, hard: 7, expert: 20 },
    },
    sanding: {
      basePrice: 4,
      levels: { none: 0, easy: 1, medium: 2, hard: 4, expert: 10 },
    },
    support: {
      basePrice: 6,
      levels: { none: 0, easy: 1, medium: 2, hard: 5, expert: 12 },
    },
    modeling: {
      basePrice: 10,
      levels: { none: 0, easy: 1, medium: 3, hard: 6, expert: 15 },
    },
  },
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
  prototypes: {
    painting: {
      basePrice: 3,
      levels: { none: 0, easy: 1, medium: 1.5, hard: 3, expert: 8 },
    },
    sanding: {
      basePrice: 4,
      levels: { none: 0, easy: 1, medium: 2, hard: 4, expert: 10 },
    },
    support: {
      basePrice: 6,
      levels: { none: 0, easy: 1, medium: 2, hard: 5, expert: 12 },
    },
    modeling: {
      basePrice: 15,
      levels: { none: 0, easy: 1, medium: 2, hard: 5, expert: 15 },
    },
  },
  functional: {
    painting: {
      basePrice: 2,
      levels: { none: 0, easy: 1, medium: 1.5, hard: 2, expert: 5 },
    },
    sanding: {
      basePrice: 5,
      levels: { none: 0, easy: 1, medium: 2, hard: 5, expert: 12 },
    },
    support: {
      basePrice: 4,
      levels: { none: 0, easy: 1, medium: 2, hard: 4, expert: 10 },
    },
    modeling: {
      basePrice: 12,
      levels: { none: 0, easy: 1, medium: 2, hard: 5, expert: 15 },
    },
  },
  art: {
    painting: {
      basePrice: 10,
      levels: { none: 0, easy: 1, medium: 3, hard: 8, expert: 25 },
    },
    sanding: {
      basePrice: 6,
      levels: { none: 0, easy: 1, medium: 2, hard: 5, expert: 15 },
    },
    support: {
      basePrice: 5,
      levels: { none: 0, easy: 1, medium: 2, hard: 5, expert: 12 },
    },
    modeling: {
      basePrice: 15,
      levels: { none: 0, easy: 1, medium: 3, hard: 8, expert: 20 },
    },
  },
  cosplay: {
    painting: {
      basePrice: 8,
      levels: { none: 0, easy: 1, medium: 2, hard: 6, expert: 18 },
    },
    sanding: {
      basePrice: 8,
      levels: { none: 0, easy: 1, medium: 3, hard: 7, expert: 20 },
    },
    support: {
      basePrice: 7,
      levels: { none: 0, easy: 1, medium: 3, hard: 6, expert: 15 },
    },
    modeling: {
      basePrice: 12,
      levels: { none: 0, easy: 1, medium: 2, hard: 5, expert: 15 },
    },
  },
  magnets: {
    painting: {
      basePrice: 2,
      levels: { none: 0, easy: 1, medium: 1.5, hard: 3, expert: 8 },
    },
    sanding: {
      basePrice: 2,
      levels: { none: 0, easy: 1, medium: 1.5, hard: 3, expert: 8 },
    },
    support: {
      basePrice: 2,
      levels: { none: 0, easy: 1, medium: 1.5, hard: 3, expert: 8 },
    },
    modeling: {
      basePrice: 5,
      levels: { none: 0, easy: 1, medium: 2, hard: 4, expert: 10 },
    },
  },
  other: {
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
      basePrice: 8,
      levels: { none: 0, easy: 1, medium: 2, hard: 5, expert: 15 },
    },
  },
};
