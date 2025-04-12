export type Item = {
  id: number;
  name: string;
  category: string;
  sustainabilityScore: number;
  imageUrl?: string;
};

export type ItemDetails = {
  id: number;
  name: string;
  category: string;
  sustainabilityScore: number;
  imageUrl?: string;
  clothingType: string;
  longevity: string;
  co2Footprint: string;
  careTips: string[];
};
