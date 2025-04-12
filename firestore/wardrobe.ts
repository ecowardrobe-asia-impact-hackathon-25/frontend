import { ItemDetails } from "@/types/item";
import { addDoc, collection } from "@react-native-firebase/firestore";
import { db } from "./db";
import {
  FIRESTORE_USER_COLLECTION,
  FIRESTORE_USER_WARDROBE_COLLECTION,
  FIRESTORE_WARDROBE_BUCKET,
  FIRESTORE_WARDROBE_ITEM_COLLECTION,
} from "./constant";
import storage from "@react-native-firebase/storage";

export async function uploadWardrobeItem(
  userId: string,
  itemData: Omit<ItemDetails, "id" | "imageUrl">,
  imageUri?: string,
  imageMimeType?: string
) {
  try {
    const userWardrobe = collection(
      db,
      FIRESTORE_USER_COLLECTION,
      userId,
      FIRESTORE_USER_WARDROBE_COLLECTION
    );
    const uploadedItem = await addDoc(userWardrobe, {
      name: itemData.name,
      category: itemData.category,
      sustainabilityScore: itemData.sustainabilityScore,
    });
    const fileType = imageUri?.split(".").pop() || "jpg";
    const fileName = `${uploadedItem.id}.${fileType}`;
  
    if (!imageUri) {
      return;
    }
  
    const bucket = storage().ref(`${FIRESTORE_WARDROBE_BUCKET}/${userId}/`);
    const task = bucket.child(fileName).putFile(imageUri, {
      contentType: imageMimeType,
    });
    await task;

    const imageUrl = await bucket.child(fileName).getDownloadURL();
    await uploadedItem.update({
      imageUrl,
    });
    const wardrobeItemCollection = collection(db, FIRESTORE_WARDROBE_ITEM_COLLECTION);
    await addDoc(wardrobeItemCollection, {
      id: `${userId}-${uploadedItem.id}`,
      name: itemData.name,
      category: itemData.category,
      sustainabilityScore: itemData.sustainabilityScore,
      clothingType: itemData.clothingType,
      longevity: itemData.longevity,
      co2Footprint: itemData.co2Footprint,
      careTips: itemData.careTips,
      imageUrl,
    });
  } catch (error) {
    console.error("Error uploading wardrobe item:", error);
  }
}
