import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Text } from '../components/common/Text';
import { theme } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { PlaceholderImage } from '../components/common/PlaceholderImage';
import { MainTabScreenProps } from '../types/navigation';

const { width } = Dimensions.get('window');

// Placeholder data
const user = {
  name: 'John Doe',
  username: '@johndoe',
  stats: {
    following: 3,
    followers: 1,
  }
};

const stylePreferences = [
  { id: 'casual', label: 'casual', icon: 'shirt-outline' },
  { id: 'minimal', label: 'minimal', icon: 'square-outline' },
  { id: 'sustainable', label: 'sustainable', icon: 'leaf-outline' },
  { id: 'vintage', label: 'vintage', icon: 'time-outline' },
  { id: 'formal', label: 'formal', icon: 'business-outline' },
];

const sustainabilityStats = {
  ecoScore: 84,
  co2Saved: '12.5 kg',
  clothesCombinations: 24,
  sustainableItems: 15,
};

const sustainabilityTips = [
  {
    id: 1,
    title: 'Wash Less, Wear More',
    description: 'Many items can be worn multiple times before washing, reducing water usage and extending garment life.',
  },
  {
    id: 2,
    title: 'Air Dry When Possible',
    description: 'Skip the dryer when you can to save energy and prevent fabric damage.',
  },
  {
    id: 3,
    title: 'Repair Instead of Replace',
    description: 'Learn basic mending skills to extend the life of your favorite clothes.',
  },
];

const categories = [
  { id: 'all', label: 'all', icon: 'grid-outline', count: 0 },
  { id: 'places', label: 'all places', icon: 'globe-outline', count: 0 },
  { id: 'wishlist', label: 'want to try', icon: 'bookmark-outline', count: 0 },
  { id: 'favorites', label: 'favorites', icon: 'heart-outline', count: 0 },
  { id: 'recommend', label: 'recommend', icon: 'thumbs-up-outline', count: 0 },
];

export default function ProfileScreen({ navigation }: MainTabScreenProps<'Profile'>) {
  const handleSignOut = () => {
    console.log('Sign out');
  };

  return (
    <ScrollView style={styles.container} bounces={false}>
      <LinearGradient
        colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)', '#121212']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View style={styles.headerActions}>
            <TouchableOpacity>
              <Ionicons name="share-outline" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="ellipsis-horizontal" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.profileInfo}>
          <PlaceholderImage
            width={90}
            height={90}
            text={user.name.substring(0, 2)}
            borderRadius={45}
          />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.username}>{user.username}</Text>
          
          <TouchableOpacity style={styles.editButton}>
            <Text>add your profile info</Text>
          </TouchableOpacity>

          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.stats.following}</Text>
              <Text style={styles.statLabel}>following</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.stats.followers}</Text>
              <Text style={styles.statLabel}>follower</Text>
            </View>
          </View>
        </View>

        <View style={styles.categories}>
          <Text style={styles.sectionTitle}>Style Preferences</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
          >
            {stylePreferences.map(style => (
              <TouchableOpacity key={style.id} style={styles.categoryItem}>
                <Ionicons name={style.icon as any} size={20} color={theme.colors.text} />
                <Text style={styles.categoryLabel}>{style.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.sustainabilityContainer}>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreTitle}>Sustainability Score</Text>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreNumber}>{sustainabilityStats.ecoScore}</Text>
            </View>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.sustainabilityStat}>
              <Ionicons name="leaf-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.statTitle}>CO₂ Saved</Text>
              <Text style={styles.statValue}>{sustainabilityStats.co2Saved}</Text>
            </View>
            <View style={styles.sustainabilityStat}>
              <Ionicons name="git-branch-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.statTitle}>Combinations</Text>
              <Text style={styles.statValue}>{sustainabilityStats.clothesCombinations}</Text>
            </View>
            <View style={styles.sustainabilityStat}>
              <Ionicons name="shirt-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.statTitle}>Sustainable Items</Text>
              <Text style={styles.statValue}>{sustainabilityStats.sustainableItems}</Text>
            </View>
          </View>

          <View style={styles.tipsSection}>
            <Text style={styles.sectionTitle}>Sustainability Tips</Text>
            {sustainabilityTips.map(tip => (
              <Card key={tip.id} style={styles.tipCard}>
                <View style={styles.tipHeader}>
                  <Ionicons name="bulb-outline" size={24} color={theme.colors.primary} />
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                </View>
                <Text style={styles.tipDescription}>{tip.description}</Text>
              </Card>
            ))}
          </View>
        </View>
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
    paddingHorizontal: 20,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 15,
  },
  profileInfo: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
  },
  username: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  editButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 30,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 20,
  },
  categories: {
    marginTop: 20,
    paddingBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  categoryScroll: {
    paddingHorizontal: 20,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryLabel: {
    marginLeft: 8,
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sustainabilityContainer: {
    marginTop: 20,
  },
  scoreCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  sustainabilityStat: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
  },
  statTitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  tipsSection: {
    marginTop: 30,
  },
  tipCard: {
    marginBottom: 12,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  tipDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
}); 