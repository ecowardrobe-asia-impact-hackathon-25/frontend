import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { Item, ItemDetails } from "@/types/item";
import { useAuth } from "@/ctx/Session";
import {
  collection,
  getFirestore,
} from "@react-native-firebase/firestore";
import {
  FIRESTORE_USER_COLLECTION,
  FIRESTORE_USER_WARDROBE_COLLECTION,
  FIRESTORE_WARDROBE_ITEM_COLLECTION,
} from "@/firestore/constant";
import { useFocusEffect } from "expo-router";
import { toPascalCase } from "@/utils/string";

const { width } = Dimensions.get("window");

const categoryIcon: Record<string, string> = {
  tops: "shirt-outline",
  shirt: "shirt-outline",
  bottoms: "layers-outline",
  outerwear: "jacket-outline",
  footwear: "footsteps-outline",
  accessories: "watch-outline",
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
  const [categories, setCategories] = useState<
    { id: string; label: string; iconName: string }[]
  >([]);
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

        const categories: { id: string; label: string; iconName: string }[] =
          [];
        const uniqueCategories = new Set(
          itemsData.map((item) => item.clothingType)
        );
        for (const category of uniqueCategories) {
          categories.push({
            id: category,
            label: toPascalCase(category),
            iconName: categoryIcon[category] ?? "help-outline",
          });
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

  const filteredItems = useMemo(
    () =>
      selectedCategory === null
        ? items
        : items.filter(
            (item) => item.clothingType.toLowerCase() === selectedCategory
          ),
    [items, selectedCategory]
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
      <Image
        source={item.imageUrl}
        style={{
          width: "100%",
          height: 150,
        }}
      />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <View style={styles.itemFooter}>
          <Text style={styles.itemCategory}>{toPascalCase(item.clothingType)}</Text>
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
      <ScrollView style={styles.container} bounces={false} contentContainerStyle={{ paddingBottom: 90 }}>
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
                  <Ionicons
                    name={category.iconName as any}
                    size={20}
                    color={
                      selectedCategory === category.id
                        ? theme.colors.white
                        : theme.colors.text
                    }
                  />
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
          items={items}
        />
      )}
    </>
  );
}

function ItemDetailModal({
  itemId,
  visible,
  onClose,
  items,
}: {
  itemId: string;
  visible: boolean;
  onClose: () => void;
  items: Item[];
}) {
  const [item, setItem] = useState<ItemDetails | null>(null);
  const [compatibleItems, setCompatibleItems] = useState<Item[]>([]);

  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const fetchItemDetails = async () => {
      const item = await collection(
        getFirestore(),
        FIRESTORE_WARDROBE_ITEM_COLLECTION
      )
        .where("id", "==", itemId)
        .get();
      if (!item.empty) {
        const itemData = item.docs[0].data() as ItemDetails;
        if (!itemData.compatibleItems) {
          itemData.compatibleItems = [];
        }
        setItem(itemData);
        if (itemData.compatibleItems && itemData.compatibleItems.length > 0) {
          setCompatibleItems(
            items.filter((i) => itemData.compatibleItems?.includes(i.id))
          );
        }
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
                    <Text>{item.clothingType}</Text>
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
                    <Text>{item.longevityScore}</Text>
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
                    <Text>{item.co2Consumption}</Text>
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
                {item.maintenanceTips.map((tip, index) => (
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

              {item.compatibleItems && item.compatibleItems.length > 0 && (
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
                    {compatibleItems.map((item) =>
                      renderCompatibleItem(item)
                    )}
                  </ScrollView>
                </View>
              )}
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
