import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Config from 'react-native-config';
import { SafeAreaView } from 'react-native-safe-area-context';

const EditorialDetail = ({ route }: any) => {
  const { editorialData } = route.params;

  const imgUrl = Config.EDITORIAL_IMAGE_URL;

  const cleanDescription =
    editorialData?.description?.replace(/<[^>]*>?/gm, '').trim() || '';

  const fallbackImage =
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop';

  const initialImage =
    editorialData?.image &&
    editorialData.image !== 'null' &&
    editorialData.image.trim() !== ''
      ? `${imgUrl}/${editorialData.image}`
      : fallbackImage;

  const [imageSource, setImageSource] = useState({
    uri: initialImage,
  });

  return (
<SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>      
      {/* FIX: StatusBar controlled by SafeArea */}
      <StatusBar
        translucent={false}
        backgroundColor="#f8f9fa"
        barStyle="dark-content"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
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
              '#f8f9fa',
            ]}
            style={styles.overlay}
          />

          <View style={styles.heroContent}>
            <View style={styles.badge}>
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
        <View style={styles.infoGrid}>
          <View style={styles.infoBox}>
            <Icon name="briefcase-outline" size={22} color="#c9060a" />
            <Text style={styles.infoLabel}>DESIGNATION</Text>
            <Text style={styles.infoValue} numberOfLines={2}>
              {editorialData?.designation || 'Editor'}
            </Text>
          </View>

          <View style={[styles.infoBox, styles.borderLeft]}>
            <Icon name="location-outline" size={22} color="#c9060a" />
            <Text style={styles.infoLabel}>LOCATION</Text>
            <Text style={styles.infoValue}>
              {editorialData?.place || 'India'}
            </Text>
          </View>
        </View>

        {/* CONTENT */}
        <View style={styles.contentBody}>
          <View style={styles.sectionHeader}>
            <View style={styles.accentBar} />
            <Text style={styles.sectionTitle}>The Insight</Text>
          </View>

          <Text style={styles.description}>
            {cleanDescription || 'No description available.'}
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
    backgroundColor: '#f8f9fa',
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
    // FIX: prevents header overlap feeling
    paddingTop: 20,
  },

  badge: {
    backgroundColor: '#c9060a',
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
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: -35,
    borderRadius: 18,
    paddingVertical: 22,
    elevation: 5,
  },

  infoBox: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  borderLeft: {
    borderLeftWidth: 1,
    borderLeftColor: '#eee',
  },

  infoLabel: {
    marginTop: 8,
    fontSize: 11,
    color: '#888',
    fontWeight: '700',
    letterSpacing: 1,
  },

  infoValue: {
    marginTop: 5,
    fontSize: 15,
    color: '#222',
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
    backgroundColor: '#c9060a',
    borderRadius: 10,
    marginRight: 12,
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
  },

  description: {
    fontSize: 16,
    lineHeight: 30,
    color: '#444',
  },
});