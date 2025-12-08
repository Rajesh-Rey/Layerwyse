import { nullable, z } from "zod";

export type Breakdown = {
  cogs: number;
  extraMaterials: number;
  total: number;
  price: number;
  suggestedPrice: number;
};

export type DifficultyLevel = "none" | "easy" | "medium" | "hard" | "expert";
export type DifficultyLevels = {
  [K in DifficultyLevel]: number;
} & {
  [key: string]: number; // enables string indexing
};

type CategoryPrice = {
  sanding: {
    basePrice: number;
    levels: DifficultyLevels;
  };
  painting: {
    basePrice: number;
    levels: DifficultyLevels;
  };
  support: {
    basePrice: number;
    levels: DifficultyLevels;
  };
  modeling: {
    basePrice: number;
    levels: DifficultyLevels;
  };
};
export type CategoryPrices = {
  [k in string]: CategoryPrice;
};

export const extraMaterialSchema = z.object({
  name: z.string().min(1, "Material name is required"),
  unitPrice: z.number().min(0, "Unit price must be positive"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

export type ExtraMaterial = z.infer<typeof extraMaterialSchema>;

export const calculatorFormSchema = z.object({
  name: z.string(),
  services: z.array(z.string()),
  category: z.string(),
  customer: z.string(),
  date: z.string(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  margin: z.number().min(0, "Margin must be positive"),
  price: z.coerce.number(),
  packaging: z.boolean(),
  delivery: z.boolean(),
  material: z.string(),
  materialCost: z.number().min(0, "Material cost must be positive"),
  volume: z.number().min(0, "Volume must be positive"),
  printer: z.string(),
  printTime: z.number().min(0, "Print time must be positive"),
  removalTime: z.number().min(0, "Removal time must be positive"),
  sandingDifficulty: z.string(),
  paintingDifficulty: z.string(),
  supportDifficulty: z.string(),
  modelingDifficulty: z.string(),
  images: z.array(z.string()),
  files: z.array(z.string()),
  extraMaterials: z.array(extraMaterialSchema),

  country: z.string(),
  electricityCost: z.number(),
  printerWattage: z.number(),
  machinePrice: z.number(),
  machineDepreciationRate: z.number(),
  machinePurchaseDate: z.string(),
  consumableCost: z.number(),
  failureRate: z.number(),
  hourlyLaborRate: z.number().min(0, "Hourly labor rate must be positive"),
});
export type CalculatorFormValues = z.infer<typeof calculatorFormSchema>;
