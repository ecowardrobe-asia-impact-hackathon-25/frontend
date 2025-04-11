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

const { width } = Dimensions.get("window");

// Placeholder data for AI analysis
const aiAnalysis = {
  fabric: "Cotton (100%)",
  longevity: "2-3 years",
  co2Footprint: "2.5 kg CO₂",
  sustainabilityScore: 85,
  careTips: [
    "Machine wash cold",
    "Line dry when possible",
    "Iron on medium heat",
  ],
};

// Add this after the aiAnalysis constant
const compatibleItems = [
  {
    id: 1,
    name: "Blue Denim Jacket",
    category: "Outerwear",
    sustainabilityScore: 85,
  },
  { id: 2, name: "White T-Shirt", category: "Tops", sustainabilityScore: 90 },
  { id: 3, name: "Black Jeans", category: "Bottoms", sustainabilityScore: 75 },
  {
    id: 4,
    name: "Brown Leather Boots",
    category: "Footwear",
    sustainabilityScore: 65,
  },
];

export default function UploadScreen() {
  const [image, setImage] = useState<string | null>(null);
  const router = useRouter();

  const [status, requestPermission] = ImagePicker.useCameraPermissions();
  
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
    });
    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
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
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleAddToWardrobe = () => {
    // TODO: Implement adding to wardrobe
    console.log("Add to wardrobe");
    // router.navigate("MatchResults");
  };

  const renderCompatibleItem = (item: Item) => (
    <Card key={item.id} style={styles.compatibleCard}>
      <PlaceholderImage
        width="100%"
        height={120}
        text={item.name.substring(0, 2)}
      />
      <View style={styles.compatibleInfo}>
        <Text style={styles.compatibleName}>{item.name}</Text>
        <View style={styles.compatibleFooter}>
          <Text style={styles.compatibleCategory}>{item.category}</Text>
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
            {/* <PlaceholderImage width="100%" height={300} text="Captured Item" /> */}
            <Image
              source={image}
              style={{
                width: "100%",
                height: 300,
              }}
            />
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
                    <Text>{aiAnalysis.fabric}</Text>
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
                    <Text>{aiAnalysis.longevity}</Text>
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
                    <Text>{aiAnalysis.co2Footprint}</Text>
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
                    <Text>{aiAnalysis.sustainabilityScore}%</Text>
                  </View>
                </View>
              </View>

              <View style={styles.careSection}>
                <Text style={styles.careTitle}>Care Instructions</Text>
                {aiAnalysis.careTips.map((tip, index) => (
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
