import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import { getEditorial } from '../api/home.api';
import Config from 'react-native-config';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../redux/useTheme';

interface EditorialData {
  image: string;
  name: string;
  designation: string;
  company_name: string;
  place: string;
  description: string;
}

const imgUrl = Config.EDITORIAL_IMAGE_URL;

const fallbackImage =
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop';

const EditorialCard: React.FC = () => {
  const [data, setData] = useState<EditorialData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { colors, isDark } = useTheme();

  const navigation = useNavigation<any>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getEditorial();
        setData(result.data);
      } catch (error) {
        console.error('Error fetching editorial:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stripHtml = (html: string) =>
    html?.replace(/<[^>]*>?/gm, '') || '';

  const imageSource =
    data?.image &&
    data.image !== 'null' &&
    data.image.trim() !== ''
      ? `${imgUrl}/${data.image}`
      : fallbackImage;

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator
          size="small"
          color={colors.primary}
        />
      </View>
    );
  }

  if (!data) return null;

  return (
    <View style={styles.wrapper}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <Text style={[styles.heading, { color: colors.text }]}>Editorial</Text>
        <View style={[styles.redLine, { backgroundColor: colors.primary }]} />
      </View>

      {/* SMALL COMPACT CARD */}
      <TouchableOpacity
        activeOpacity={0.92}
        style={[styles.card, { 
          backgroundColor: colors.card,
          shadowColor: isDark ? '#000' : '#000',
        }]}
        onPress={() =>
          navigation.navigate('EditorialDetail', {
            editorialData: data,
          })
        }
      >
        {/* IMAGE */}
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: imageSource }}
            style={[styles.coverImage, { backgroundColor: isDark ? colors.border : '#f2f2f2' }]}
            resizeMode="cover"
          />

          <LinearGradient
            colors={[
              'transparent',
              'rgba(0,0,0,0.15)',
              'rgba(0,0,0,0.55)',
            ]}
            style={styles.overlay}
          />

          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <Text style={styles.badgeText}>
              FEATURED
            </Text>
          </View>
        </View>

        {/* CONTENT */}
        <View style={styles.content}>
          <Text numberOfLines={1} style={[styles.name, { color: colors.text }]}>
            {data.name}
          </Text>

          <Text numberOfLines={1} style={[styles.company, { color: colors.textSecondary }]}>
            {data.company_name}
          </Text>

          {/* META */}
          <View style={styles.metaRow}>
            <View style={[styles.metaItem, { backgroundColor: colors.background }]}>
              <Icon
                name="briefcase-outline"
                size={13}
                color={colors.primary}
              />
              <Text numberOfLines={1} style={[styles.metaText, { color: colors.textSecondary }]}>
                {data.designation}
              </Text>
            </View>

            <View style={[styles.metaItem, { backgroundColor: colors.background }]}>
              <Icon
                name="location-outline"
                size={13}
                color={colors.primary}
              />
              <Text numberOfLines={1} style={[styles.metaText, { color: colors.textSecondary }]}>
                {data.place}
              </Text>
            </View>
          </View>

          {/* DESCRIPTION */}
          <Text
            numberOfLines={2}
            style={[styles.description, { color: colors.textSecondary }]}
          >
            {stripHtml(data.description)}
          </Text>

          {/* FOOTER */}
          <View style={styles.footer}>
            <Text style={[styles.readMore, { color: colors.primary }]}>
              Read Editorial
            </Text>

            <Icon
              name="arrow-forward"
              size={16}
              color={colors.primary}
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default EditorialCard;

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 18,
    marginBottom: 24,
  },

  loader: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerRow: {
    marginBottom: 12,
  },

  heading: {
    fontSize: 18,
    fontWeight: '800',
  },

  redLine: {
    width: 42,
    height: 4,
    borderRadius: 20,
    marginTop: 5,
  },

  /* CARD */
  card: {
    borderRadius: 18,
    overflow: 'hidden',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },

  /* IMAGE */
  imageWrapper: {
    height: 170,
    position: 'relative',
  },

  coverImage: {
    width: '100%',
    height: '100%',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },

  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
  },

  /* CONTENT */
  content: {
    padding: 14,
  },

  name: {
    fontSize: 18,
    fontWeight: '800',
  },

  company: {
    fontSize: 13,
    marginTop: 2,
    marginBottom: 10,
  },

  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },

  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    maxWidth: '48%',
  },

  metaText: {
    marginLeft: 5,
    fontSize: 11,
    fontWeight: '600',
    flexShrink: 1,
  },

  description: {
    fontSize: 13,
    lineHeight: 20,
  },

  footer: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  readMore: {
    fontWeight: '700',
    fontSize: 13,
  },
});