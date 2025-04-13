import { Item, ItemDetails } from "@/types/item";
import { addDoc, collection, serverTimestamp } from "@react-native-firebase/firestore";
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
  console.log("Uploading wardrobe item:", userId, itemData, imageUri, imageMimeType);
  try {
    const timestamp = serverTimestamp();
    const userWardrobe = collection(
      db,
      FIRESTORE_USER_COLLECTION,
      userId,
      FIRESTORE_USER_WARDROBE_COLLECTION
    );
    const userWardrobeItem: Omit<Item, "id" | "imageUrl"> = {
      name: itemData.name,
      clothingType: itemData.clothingType,
      clothingCategory: itemData.clothingCategory,
      sustainabilityScore: itemData.sustainabilityScore,
      createdAt: timestamp,
    } 
    const uploadedItem = await addDoc(userWardrobe, userWardrobeItem);
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
    const wardrobeItemDetails: ItemDetails = {
      id: `${userId}-${uploadedItem.id}`,
      imageUrl,
      createdAt: timestamp,
      ...itemData,
    }
    await addDoc(wardrobeItemCollection, wardrobeItemDetails);
  } catch (error) {
    console.error("Error uploading wardrobe item:", error);
  }
}
