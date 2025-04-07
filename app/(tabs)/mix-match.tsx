import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '../../components/common/Card';
import { Text } from '../../components/common/Text';
import { theme } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { PlaceholderImage } from '../../components/common/PlaceholderImage';

const { width } = Dimensions.get('window');

const styleOptions = [
  { id: 'casual', label: 'Casual', icon: 'shirt-outline' },
  { id: 'formal', label: 'Formal', icon: 'business-outline' },
  { id: 'sporty', label: 'Sporty', icon: 'basketball-outline' },
  { id: 'minimal', label: 'Minimal', icon: 'square-outline' },
  { id: 'vintage', label: 'Vintage', icon: 'time-outline' },
];

// Placeholder data for outfit combinations
const outfitSuggestions = [
  {
    id: 1,
    name: 'Casual Day Out',
    items: {
      top: 'White T-Shirt',
      bottom: 'Blue Jeans',
      outerwear: 'Denim Jacket',
      shoes: 'White Sneakers',
      accessories: 'Silver Watch'
    },
    sustainabilityScore: 85
  },
  {
    id: 2,
    name: 'Smart Casual',
    items: {
      top: 'Blue Dress Shirt',
      bottom: 'Beige Chinos',
      outerwear: 'Brown Blazer',
      shoes: 'Brown Loafers',
      accessories: 'Leather Belt'
    },
    sustainabilityScore: 78
  }
];

export default function MixMatchScreen() {
  const [selectedStyle, setSelectedStyle] = useState('casual');

  const handleRegenerate = () => {
    // TODO: Implement regeneration logic
    console.log('Regenerating outfits for style:', selectedStyle);
  };

  return (
    <ScrollView style={styles.container} bounces={false}>
      <LinearGradient
        colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)', '#121212']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Mix & Match</Text>
          <TouchableOpacity style={styles.shuffleButton}>
            <Ionicons name="shuffle" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.styleScroll}
        >
          {styleOptions.map(style => (
            <TouchableOpacity
              key={style.id}
              style={[
                styles.stylePill,
                selectedStyle === style.id && styles.selectedStylePill
              ]}
              onPress={() => setSelectedStyle(style.id)}
            >
              <Ionicons 
                name={style.icon as any} 
                size={20} 
                color={selectedStyle === style.id ? theme.colors.white : theme.colors.text} 
              />
              <Text style={[
                styles.styleLabel,
                selectedStyle === style.id && styles.selectedStyleLabel
              ]}>
                {style.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Suggested Combinations</Text>
          <TouchableOpacity 
            style={styles.regenerateButton}
            onPress={handleRegenerate}
          >
            <Ionicons name="refresh" size={18} color={theme.colors.primary} />
            <Text style={styles.regenerateText}>Regenerate</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.suggestionsScroll}
        >
          {outfitSuggestions.map(outfit => (
            <Card key={outfit.id} style={styles.outfitCard}>
              <PlaceholderImage
                width="100%"
                height={200}
                text={outfit.name.substring(0, 2)}
              />
              <View style={styles.outfitInfo}>
                <Text style={styles.outfitName}>{outfit.name}</Text>
                <View style={styles.itemsList}>
                  {Object.entries(outfit.items).map(([key, value]) => (
                    <Text key={key} style={styles.itemText}>
                      • {value}
                    </Text>
                  ))}
                </View>
                <View style={styles.sustainabilityBadge}>
                  <Ionicons name="leaf-outline" size={14} color={theme.colors.white} />
                  <Text style={styles.sustainabilityScore}>{outfit.sustainabilityScore}</Text>
                </View>
              </View>
            </Card>
          ))}
        </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  shuffleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  styleScroll: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  stylePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
  },
  selectedStylePill: {
    backgroundColor: theme.colors.primary,
  },
  styleLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: theme.colors.text,
  },
  selectedStyleLabel: {
    color: theme.colors.white,
  },
  content: {
    flex: 1,
    padding: 20,
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
  regenerateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  regenerateText: {
    marginLeft: 6,
    fontSize: 14,
    color: theme.colors.primary,
  },
  suggestionsScroll: {
    marginLeft: -20,
    paddingLeft: 20,
  },
  outfitCard: {
    width: width * 0.8,
    marginRight: 15,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  outfitInfo: {
    padding: 16,
  },
  outfitName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  itemsList: {
    marginBottom: 12,
  },
  itemText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 4,
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
}); 