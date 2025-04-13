import { FieldValue } from "@react-native-firebase/firestore";
import { AiResponse } from "./ai-response";

export type Item = {
  id: string;
  name: string;
  clothingType: string;
  clothingCategory: string;
  sustainabilityScore: number;
  imageUrl?: string;
  createdAt?: FieldValue;
};

export type ItemDetails = Item & AiResponse
