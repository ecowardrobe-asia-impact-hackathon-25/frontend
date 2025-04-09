import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@/components/common/Card';
import { Text } from '@/components/common/Text';
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { PlaceholderImage } from '@/components/common/PlaceholderImage';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const recentItems = [
  { id: 1, name: 'Blue Denim Jacket', category: 'Outerwear' },
  { id: 2, name: 'White T-Shirt', category: 'Tops' },
  { id: 3, name: 'Black Jeans', category: 'Bottoms' },
];

const sustainabilityStats = {
  totalItems: 15,
  sustainableItems: 8,
  co2Saved: '12.5 kg',
  waterSaved: '2,450 L',
};

const suggestedOutfits = [
  {
    id: 1,
    name: 'Casual Day Out',
    items: ['White T-Shirt', 'Blue Jeans', 'Sneakers'],
    sustainabilityScore: 85,
  },
  {
    id: 2,
    name: 'Office Ready',
    items: ['Blue Shirt', 'Black Pants', 'Leather Shoes'],
    sustainabilityScore: 78,
  },
];

export default function HomeScreen() {
  const router = useRouter();
  return (
    <ScrollView style={styles.container} bounces={false} contentContainerStyle={{ paddingBottom: 70 }}>
      <LinearGradient
        colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)', '#121212']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Good morning,</Text>
              <Text style={styles.name}>John</Text>
            </View>
            <TouchableOpacity onPress={() => router.navigate('/(tabs)/profile')}>
              <PlaceholderImage
                width={50}
                height={50}
                text="JD"
                borderRadius={25}
              />
            </TouchableOpacity>
          </View>

          <Card style={styles.statsCard}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="shirt-outline" size={24} color={theme.colors.primary} />
                <Text style={styles.statValue}>{sustainabilityStats.totalItems}</Text>
                <Text style={styles.statLabel}>Items</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Ionicons name="leaf-outline" size={24} color={theme.colors.primary} />
                <Text style={styles.statValue}>{sustainabilityStats.sustainableItems}</Text>
                <Text style={styles.statLabel}>Sustainable</Text>
              </View>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="cloud-outline" size={24} color={theme.colors.primary} />
                <Text style={styles.statValue}>{sustainabilityStats.co2Saved}</Text>
                <Text style={styles.statLabel}>CO₂ Saved</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Ionicons name="water-outline" size={24} color={theme.colors.primary} />
                <Text style={styles.statValue}>{sustainabilityStats.waterSaved}</Text>
                <Text style={styles.statLabel}>Water Saved</Text>
              </View>
            </View>
          </Card>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Picks</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.outfitsScroll}
          >
            {suggestedOutfits.map(outfit => (
              <Card key={outfit.id} style={styles.outfitCard}>
                <PlaceholderImage
                  width="100%"
                  height={150}
                  text={outfit.name.substring(0, 2)}
                />
                <View style={styles.outfitInfo}>
                  <Text style={styles.outfitName}>{outfit.name}</Text>
                  <Text style={styles.outfitItems}>{outfit.items.join(' • ')}</Text>
                  <View style={styles.sustainabilityBadge}>
                    <Ionicons name="leaf-outline" size={14} color={theme.colors.white} />
                    <Text style={styles.sustainabilityScore}>{outfit.sustainabilityScore}</Text>
                  </View>
                </View>
              </Card>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recently Added</Text>
            <TouchableOpacity onPress={() => router.navigate('/(tabs)/wardrobe')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.recentScroll}
          >
            {recentItems.map(item => (
              <Card key={item.id} style={styles.recentCard}>
                <PlaceholderImage
                  width="100%"
                  height={120}
                  text={item.name.substring(0, 2)}
                />
                <View style={styles.recentInfo}>
                  <Text style={styles.recentName}>{item.name}</Text>
                  <Text style={styles.recentCategory}>{item.category}</Text>
                </View>
              </Card>
            ))}
          </ScrollView>
        </View>

        <TouchableOpacity 
          style={styles.uploadButton}
          onPress={() => router.navigate('/upload')}
        >
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.secondary]}
            style={styles.uploadGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="camera-outline" size={24} color={theme.colors.white} />
            <Text style={styles.uploadText}>Add New Item</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  headerGradient: {
    paddingTop: 60,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  header: {
    padding: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  statsCard: {
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 15,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    color: theme.colors.primary,
    fontSize: 14,
  },
  outfitsScroll: {
    marginLeft: -20,
    paddingLeft: 20,
  },
  outfitCard: {
    width: width * 0.7,
    marginRight: 15,
    backgroundColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
  outfitInfo: {
    padding: 15,
  },
  outfitName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  outfitItems: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  sustainabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sustainabilityScore: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  recentScroll: {
    marginLeft: -20,
    paddingLeft: 20,
  },
  recentCard: {
    width: width * 0.4,
    marginRight: 15,
    backgroundColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
  recentInfo: {
    padding: 12,
  },
  recentName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  recentCategory: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  uploadButton: {
    marginTop: 10,
    marginBottom: 30,
  },
  uploadGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
  },
  uploadText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 