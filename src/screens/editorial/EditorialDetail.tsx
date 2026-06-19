import React, { useState, useMemo } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Config from 'react-native-config';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../redux/useTheme';

const EditorialDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  
  const editorialData = route.params?.editorialData || {};
  
  const imgUrl = Config.EDITORIAL_IMAGE_URL || '';

  // ===== CLEAN DESCRIPTION =====
  const cleanDescription = useMemo(() => {
    return editorialData?.description?.replace(/<[^>]*>?/gm, '').trim() || 'No description available.';
  }, [editorialData?.description]);

  // ===== FALLBACK IMAGE =====
  const fallbackImage = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop';

  // ===== IMAGE URL =====
  const initialImage = useMemo(() => {
    const image = editorialData?.image;
    if (image && image !== 'null' && image.trim() !== '') {
      return `${imgUrl}/${image}`;
    }
    return fallbackImage;
  }, [editorialData?.image, imgUrl]);

  const [imageSource, setImageSource] = useState({ uri: initialImage });

  // ===== NAVIGATION FUNCTIONS =====
  const handleBack = () => {
    navigation.goBack();
  };

  // ===== RENDER =====
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['left', 'right', 'bottom']}>
      <StatusBar
        translucent={false}
        backgroundColor={colors.background}
        barStyle={isDark ? 'light-content' : 'dark-content'}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* BACK BUTTON */}
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: 'rgba(0,0,0,0.3)' }]} 
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        {/* HERO SECTION */}
        <View style={styles.heroWrapper}>
          <Image
            source={imageSource}
            style={styles.heroImage}
            resizeMode="cover"
            onError={() => setImageSource({ uri: fallbackImage })}
          />

          <LinearGradient
            colors={[
              'rgba(0,0,0,0.1)',
              'rgba(0,0,0,0.45)',
              isDark ? 'rgba(18,18,18,0.95)' : '#f8f9fa',
            ]}
            style={styles.overlay}
          />

          <View style={styles.heroContent}>
            <View style={[styles.badge, { backgroundColor: colors.primary }]}>
              <Text style={styles.badgeText}>FEATURED STORY</Text>
            </View>

            <Text style={styles.name} numberOfLines={2}>
              {editorialData?.name || 'Editorial Author'}
            </Text>

            <View style={styles.companyRow}>
              <Icon name="business-outline" size={16} color="#fff" />
              <Text style={styles.company}>
                {editorialData?.company_name || 'Editorial Team'}
              </Text>
            </View>
          </View>
        </View>

        {/* INFO GRID */}
        <View style={[styles.infoGrid, { 
          backgroundColor: colors.card,
          shadowColor: isDark ? '#000' : '#000',
          borderColor: colors.border,
        }]}>
          <View style={styles.infoBox}>
            <Icon name="briefcase-outline" size={22} color={colors.primary} />
            <Text style={[styles.infoLabel, { color: colors.textMuted }]}>
              DESIGNATION
            </Text>
            <Text style={[styles.infoValue, { color: colors.text }]} numberOfLines={2}>
              {editorialData?.designation || 'Editor'}
            </Text>
          </View>

          <View style={[styles.infoBox, styles.borderLeft, { borderLeftColor: colors.border }]}>
            <Icon name="location-outline" size={22} color={colors.primary} />
            <Text style={[styles.infoLabel, { color: colors.textMuted }]}>
              LOCATION
            </Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {editorialData?.place || 'India'}
            </Text>
          </View>
        </View>

        {/* CONTENT */}
        <View style={styles.contentBody}>
          <View style={styles.sectionHeader}>
            <View style={[styles.accentBar, { backgroundColor: colors.primary }]} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              The Insight
            </Text>
          </View>

          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {cleanDescription}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditorialDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 50,
  },

  heroWrapper: {
    height: 500,
    width: '100%',
  },

  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

  heroContent: {
    position: 'absolute',
    bottom: 60,
    left: 24,
    right: 24,
    paddingTop: 20,
  },

  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    borderRadius: 30,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
    marginBottom: 14,
  },

  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },

  name: {
    fontSize: 38,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 46,
  },

  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  company: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },

  infoGrid: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: -35,
    borderRadius: 18,
    paddingVertical: 22,
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
  },

  infoBox: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  borderLeft: {
    borderLeftWidth: 1,
  },

  infoLabel: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },

  infoValue: {
    marginTop: 5,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },

  contentBody: {
    paddingHorizontal: 24,
    marginTop: 36,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  accentBar: {
    width: 4,
    height: 24,
    borderRadius: 10,
    marginRight: 12,
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
  },

  description: {
    fontSize: 16,
    lineHeight: 30,
  },
});