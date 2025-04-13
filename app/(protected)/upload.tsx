import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Text } from "../../components/common/Text";
import { theme } from "../../constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { PlaceholderImage } from "../../components/common/PlaceholderImage";
import { Item } from "@/types/item";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { useAuth } from "@/ctx/Session";
import { uploadWardrobeItem } from "@/firestore/wardrobe";
import { httpsCallable, getFunctions } from "@react-native-firebase/functions";
import { AiResponse } from "@/types/ai-response";
import { fetch } from "expo/fetch";
import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  queryEqual,
  where,
} from "@react-native-firebase/firestore";
import { db } from "@/firestore/db";
import {
  FIRESTORE_USER_COLLECTION,
  FIRESTORE_USER_WARDROBE_COLLECTION,
} from "@/firestore/constant";
import { toPascalCase } from "@/utils/string";

const { width } = Dimensions.get("window");

export default function UploadScreen() {
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const router = useRouter();

  const [aiAnalysis, setAiAnalysis] = useState<AiResponse | null>(null);

  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  const [status, requestPermission] = ImagePicker.useCameraPermissions();
  const [compatibleItems, setCompatibleItems] = useState<Item[]>([]);

  const getAiAnalysis = async (imageBase64: string) => {
    try {
      const response = await fetch(
        "https://ai-image-860207425286.asia-southeast1.run.app",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: imageBase64,
          }),
        }
      );
      const data = await response.json();
      console.log("AI Analysis Response:", data);
      if (!data || data.error) {
        console.error("Error in AI analysis response:", data.error);
        setLoading(false);
        return;
      }
      let compatCat: string;
      if (data.clothingCategory === "top") {
        compatCat = "bottom";
      } else if (data.clothingCategory === "bottom") {
        compatCat = "top";
      } else {
        compatCat = "accessory";
      }
      console.log("Compatible Category:", compatCat);
      const matchingItems = await getDocs(
        query(
          collection(
            db,
            FIRESTORE_USER_COLLECTION,
            user!.uid,
            FIRESTORE_USER_WARDROBE_COLLECTION
          ),
          where("clothingCategory", "==", compatCat),
          limit(3)
        )
      );
      console.log("Matching Items:", matchingItems.docs.length);
      if (!matchingItems.empty) {
        setCompatibleItems(
          matchingItems.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() } as Item)
          )
        );
      }
      setAiAnalysis(data);
      setLoading(false);
    } catch (error) {
      console.error("Error getting AI analysis:", error);
    }
  };

  const handleCapture = async () => {
    // TODO: Implement camera capture
    console.log("Capture photo");

    if (status?.status !== "granted") {
      console.log("Camera permission not granted");
      await requestPermission();
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });
    console.log(result);

    if (!result.canceled && result.assets[0].base64) {
      setImage(result.assets[0]);
      setLoading(true);
      await getAiAnalysis(result.assets[0].base64);
    }
  };

  const handleUpload = async () => {
    // TODO: Implement image upload
    console.log("Upload photo");
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setImage(result.assets[0]);
      setLoading(true);
      await getAiAnalysis(result.assets[0].base64);
    }
  };

  const handleAddToWardrobe = async () => {
    if (!image || !user || !aiAnalysis) {
      console.log("No image selected");
      return;
    }
    await uploadWardrobeItem(
      user.uid,
      {
        name: toPascalCase(aiAnalysis.clothingType),
        compatibleItems: compatibleItems.map((item) => item.id),
        ...aiAnalysis,
      },
      image.uri,
      image.mimeType
    );
    console.log("Item added to wardrobe");
    router.navigate("/wardrobe");
  };

  const renderCompatibleItem = (item: Item) => (
    <Card key={item.id} style={styles.compatibleCard}>
      <Image
        source={item.imageUrl}
        style={{
          width: "100%",
          height: 120,
        }}
        contentFit="cover"
      />
      <View style={styles.compatibleInfo}>
        <Text style={styles.compatibleName}>{item.name}</Text>
        <View style={styles.compatibleFooter}>
          <Text style={styles.compatibleCategory}>{item.clothingType}</Text>
          <View style={styles.sustainabilityBadge}>
            <Ionicons
              name="leaf-outline"
              size={14}
              color={theme.colors.white}
            />
            <Text style={styles.sustainabilityScore}>
              {item.sustainabilityScore}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );

  return (
    <LinearGradient colors={["#121212", "#1E1E1E"]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text variant="h2">Add New Item</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {!image ? (
          <Card style={styles.captureCard}>
            <View style={styles.captureContent}>
              <View style={styles.captureIcon}>
                <Ionicons
                  name="camera"
                  size={48}
                  color={theme.colors.primary}
                />
              </View>
              <Text variant="h3" style={styles.captureTitle}>
                Take a Photo
              </Text>
              <Text variant="caption" style={styles.captureSubtitle}>
                Position your item in good lighting
              </Text>
              <View style={styles.captureButtons}>
                <Button
                  title="Take Photo"
                  onPress={handleCapture}
                  style={styles.captureButton}
                />
                <Button
                  title="Upload"
                  variant="secondary"
                  onPress={handleUpload}
                  style={styles.captureButton}
                />
              </View>
            </View>
          </Card>
        ) : (
          <Card style={styles.analysisCard}>
            <Image
              source={image.uri}
              style={{
                width: "100%",
                height: 300,
              }}
            />
            {aiAnalysis && (
              <View style={styles.analysisContent}>
                <Text variant="h3" style={styles.analysisTitle}>
                  AI Analysis
                </Text>

                <View style={styles.analysisGrid}>
                  <View style={styles.analysisItem}>
                    <Ionicons
                      name="shirt-outline"
                      size={24}
                      color={theme.colors.primary}
                    />
                    <View style={styles.analysisText}>
                      <Text variant="caption">Fabric</Text>
                      <Text>{aiAnalysis?.material}</Text>
                    </View>
                  </View>

                  <View style={styles.analysisItem}>
                    <Ionicons
                      name="time-outline"
                      size={24}
                      color={theme.colors.primary}
                    />
                    <View style={styles.analysisText}>
                      <Text variant="caption">Longevity</Text>
                      <Text>{aiAnalysis.longevityScore}/10</Text>
                    </View>
                  </View>

                  <View style={styles.analysisItem}>
                    <Ionicons
                      name="leaf-outline"
                      size={24}
                      color={theme.colors.primary}
                    />
                    <View style={styles.analysisText}>
                      <Text variant="caption">CO₂ Footprint</Text>
                      <Text>{aiAnalysis.co2Consumption}kg</Text>
                    </View>
                  </View>

                  <View style={styles.analysisItem}>
                    <Ionicons
                      name="star-outline"
                      size={24}
                      color={theme.colors.primary}
                    />
                    <View style={styles.analysisText}>
                      <Text variant="caption">Sustainability</Text>
                      <Text>{aiAnalysis.sustainabilityScore}/10</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.careSection}>
                  <Text style={styles.careTitle}>Care Instructions</Text>
                  {aiAnalysis.maintenanceTips.map((tip, index) => (
                    <View key={index} style={styles.careTip}>
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color={theme.colors.primary}
                      />
                      <Text style={styles.careTipText}>{tip}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.compatibleSection}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Can Combine With</Text>
                    <TouchableOpacity>
                      <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.compatibleScroll}
                  >
                    {compatibleItems.map((item) => renderCompatibleItem(item))}
                  </ScrollView>
                </View>

                <Button
                  title="Add to Wardrobe"
                  onPress={handleAddToWardrobe}
                  style={styles.addButton}
                />
              </View>
            )}
          </Card>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  captureCard: {
    padding: 24,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  captureContent: {
    alignItems: "center",
  },
  captureIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(76, 175, 80, 0.2)",
  },
  captureTitle: {
    marginBottom: 8,
    fontSize: 24,
    fontWeight: "bold",
  },
  captureSubtitle: {
    textAlign: "center",
    marginBottom: 32,
    color: theme.colors.textSecondary,
  },
  captureButtons: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    gap: 12,
  },
  captureButton: {
    flex: 1,
  },
  analysisCard: {
    padding: 0,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  analysisContent: {
    padding: 24,
  },
  analysisTitle: {
    marginBottom: 24,
    fontSize: 24,
    fontWeight: "bold",
  },
  analysisGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 32,
  },
  analysisItem: {
    flex: 1,
    minWidth: "45%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  analysisText: {
    marginLeft: 12,
  },
  careSection: {
    marginBottom: 32,
  },
  careTitle: {
    marginBottom: 20,
    fontSize: 20,
    fontWeight: "bold",
  },
  careTip: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  careTipText: {
    marginLeft: 12,
    flex: 1,
    color: theme.colors.textSecondary,
  },
  addButton: {
    marginBottom: 24,
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    padding: 16,
    elevation: 8,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  compatibleSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  seeAll: {
    color: theme.colors.primary,
    fontSize: 14,
  },
  compatibleScroll: {
    marginLeft: -10,
    marginRight: -10,
    paddingRight: 10,
    paddingLeft: 10,
  },
  compatibleCard: {
    width: width * 0.4,
    marginRight: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    overflow: "hidden",
  },
  compatibleInfo: {
    padding: 12,
  },
  compatibleName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  compatibleCategory: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  compatibleFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sustainabilityBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  sustainabilityScore: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: "bold",
  },
});
