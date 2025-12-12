import { cn } from "@/lib/utils";
import Calculator from "./calculator";

export default function CalculatorPage() {
  return (
    <div className="align-center flex flex-col items-center">
      <h1 className="mt-4 text-4xl font-extrabold">
        3D Printing Pricing Calculator (KWD)
      </h1>
      <Calculator className="p-8" />
    </div>
  );
}
