import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toNumOrZero(value: string | number): number {
  const num = Number(value);
  if (isNaN(num)) {
    return 0;
  }

  return num;
}
