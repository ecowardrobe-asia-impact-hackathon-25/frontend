import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Modal,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Card } from "../../../components/common/Card";
import { Text } from "../../../components/common/Text";
import { theme } from "../../../constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { PlaceholderImage } from "../../../components/common/PlaceholderImage";
import { Item, ItemDetails } from "@/types/item";
import { useAuth } from "@/ctx/Session";
import { collection, getFirestore } from "@react-native-firebase/firestore";
import {
  FIRESTORE_USER_COLLECTION,
  FIRESTORE_USER_WARDROBE_COLLECTION,
  FIRESTORE_WARDROBE_ITEM_COLLECTION,
} from "@/firestore/constant";
import { useFocusEffect } from "expo-router";

const { width } = Dimensions.get("window");

// Placeholder data for AI analysis
const aiAnalysis = {
  clothingType: "Cotton (100%)",
  longevity: "2-3 years",
  co2Footprint: "2.5 kg CO₂",
  sustainabilityScore: 85,
  careTips: [
    "Machine wash cold",
    "Line dry when possible",
    "Iron on medium heat",
  ],
};

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

const pccategories = [
  { id: "tops", label: "Tops", icon: "shirt-outline" },
  { id: "bottoms", label: "Bottoms", icon: "layers-outline" },
  // { id: 'outerwear', label: 'outerwear', icon: 'jacket-outline' },
  { id: "footwear", label: "Footwear", icon: "footsteps-outline" },
  { id: "accessories", label: "Accessories", icon: "watch-outline" },
];

const items = [
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
    name: "Blue Dress Shirt",
    category: "Tops",
    sustainabilityScore: 80,
  },
  {
    id: 5,
    name: "Brown Leather Boots",
    category: "Footwear",
    sustainabilityScore: 65,
  },
  {
    id: 6,
    name: "Beige Chino Pants",
    category: "Bottoms",
    sustainabilityScore: 82,
  },
];

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
          <Ionicons name="leaf-outline" size={14} color={theme.colors.white} />
          <Text style={styles.sustainabilityScore}>
            {item.sustainabilityScore}
          </Text>
        </View>
      </View>
    </View>
  </Card>
);

export default function WardrobeScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] =
    useState<{ id: string; label: string }[]>([]);
  const { user } = useAuth();

  useFocusEffect(
    useCallback(() => {
      const f = async () => {
        const userWardrobeCollection = collection(
          getFirestore(),
          FIRESTORE_USER_COLLECTION
        )
          .doc(user?.uid)
          .collection(FIRESTORE_USER_WARDROBE_COLLECTION);
        const snapshot = await userWardrobeCollection.get();
        const itemsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as unknown as Item[];

        const categories: { id: string; label: string }[] = [];
        const uniqueCategories = new Set(
          itemsData.map((item) => item.category)
        );
        for (const category of uniqueCategories) {
          categories.push({ id: category, label: category });
        }

        setCategories(categories);
        setItems(itemsData);
      };
      f();
    }, [user?.uid])
  );

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isAnalysisVisible, setIsAnalysisVisible] = useState(false);

  const filteredItems =
    selectedCategory === null
      ? items
      : items.filter(
          (item) => item.category.toLowerCase() === selectedCategory
        );

  const handleItemPress = (item: Item) => {
    setSelectedItem(item);
    setIsAnalysisVisible(true);
  };

  const renderItem = ({ item }: { item: Item }) => (
    <TouchableOpacity
      style={styles.itemCard}
      onPress={() => handleItemPress(item)}
    >
      <PlaceholderImage
        width="100%"
        height={150}
        text={item.name.substring(0, 2)}
      />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <View style={styles.itemFooter}>
          <Text style={styles.itemCategory}>{item.category}</Text>
          <View style={styles.sustainabilityBadge}>
            <Text style={styles.sustainabilityScore}>
              {item.sustainabilityScore}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <ScrollView style={styles.container} bounces={false}>
        <LinearGradient
          colors={[
            "rgba(255,255,255,0.1)",
            "rgba(255,255,255,0.05)",
            "#121212",
          ]}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <Text style={styles.title}>My Wardrobe</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity>
                <Ionicons
                  name="search-outline"
                  size={24}
                  color={theme.colors.text}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons
                  name="filter-outline"
                  size={24}
                  color={theme.colors.text}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.categories}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryItem,
                    selectedCategory === category.id &&
                      styles.selectedCategoryItem,
                  ]}
                  onPress={() =>
                    setSelectedCategory((prev) =>
                      prev === category.id ? null : category.id
                    )
                  }
                >
                  {/* <Ionicons 
                    name={category.icon as any} 
                    size={20} 
                    color={selectedCategory === category.id ? theme.colors.white : theme.colors.text} 
                  /> */}
                  <Text
                    style={[
                      styles.categoryLabel,
                      selectedCategory === category.id &&
                        styles.selectedCategoryLabel,
                    ]}
                  >
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <FlatList
            data={filteredItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.itemsGrid}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
      {selectedItem && user && (
        <ItemDetailModal
          itemId={`${user.uid}-${selectedItem.id}`}
          visible={isAnalysisVisible}
          onClose={() => setIsAnalysisVisible(false)}
        />
      )}
    </>
  );
}

function ItemDetailModal({
  itemId,
  visible,
  onClose,
}: {
  itemId: string;
  visible: boolean;
  onClose: () => void;
}) {
  const [item, setItem] = useState<(Item & ItemDetails) | null>(null);

  useEffect(() => {
    const fetchItemDetails = async () => {
      const item = await collection(
        getFirestore(),
        FIRESTORE_WARDROBE_ITEM_COLLECTION
      )
        .where("id", "==", itemId)
        .get();
      if (!item.empty) {
        const itemData = item.docs[0].data() as Item & ItemDetails;
        console.log("Item data:", itemData);
        setItem(itemData);
      }
    };
    fetchItemDetails();
  }, [itemId]);

  if (!item) {
    return null; // or a loading indicator
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>AI Analysis</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView>
            <Image
              source={item.imageUrl}
              style={{
                width: "100%",
                height: 300,
              }}
            />

            <View style={styles.analysisContent}>
              <Text style={styles.itemNameLarge}>{item.name}</Text>

              <View style={styles.analysisGrid}>
                <View style={styles.analysisItem}>
                  <Ionicons
                    name="shirt-outline"
                    size={24}
                    color={theme.colors.primary}
                  />
                  <View style={styles.analysisText}>
                    <Text variant="caption">Fabric</Text>
                    <Text>{aiAnalysis.clothingType}</Text>
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
                    <Text>{item.sustainabilityScore}%</Text>
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
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  headerGradient: {
    paddingTop: 60,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  headerActions: {
    flexDirection: "row",
    gap: 15,
  },
  categories: {
    marginTop: 20,
    paddingBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  categoryScroll: {
    paddingHorizontal: 20,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
  },
  selectedCategoryItem: {
    backgroundColor: theme.colors.primary,
  },
  categoryLabel: {
    marginLeft: 8,
    fontSize: 14,
  },
  selectedCategoryLabel: {
    color: theme.colors.white,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  itemsGrid: {
    gap: 15,
  },
  itemCard: {
    flex: 0.5,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    overflow: "hidden",
    marginHorizontal: 5,
  },
  itemInfo: {
    padding: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemCategory: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  sustainabilityBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sustainabilityScore: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#121212",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  analysisContent: {
    padding: 20,
  },
  itemNameLarge: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
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
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  analysisText: {
    marginLeft: 12,
  },
  careSection: {
    marginBottom: 32,
  },
  careTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  careTip: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  careTipText: {
    marginLeft: 12,
    flex: 1,
    color: theme.colors.textSecondary,
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
  seeAll: {
    color: theme.colors.primary,
    fontSize: 14,
  },
  compatibleScroll: {
    marginLeft: -20,
    paddingLeft: 20,
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
});
