export type AiResponse = {
  clothingType: string;
  clothingCategory: string;
  material: string;
  fabricComposition: string;
  longevityScore: number;
  maintenanceTips: string[];
  co2Consumption: string;
  sustainabilityScore: number;
  compatibleItems?: string[];
}