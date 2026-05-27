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
import { COLORS } from '../../../theme/colors';

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
          color={COLORS.primary}
        />
      </View>
    );
  }

  if (!data) return null;

  return (
    <View style={styles.wrapper}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Editorial</Text>
        <View style={styles.redLine} />
      </View>

      {/* SMALL COMPACT CARD */}
      <TouchableOpacity
        activeOpacity={0.92}
        style={styles.card}
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
            style={styles.coverImage}
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

          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              FEATURED
            </Text>
          </View>
        </View>

        {/* CONTENT */}
        <View style={styles.content}>
          <Text numberOfLines={1} style={styles.name}>
            {data.name}
          </Text>

          <Text numberOfLines={1} style={styles.company}>
            {data.company_name}
          </Text>

          {/* META */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Icon
                name="briefcase-outline"
                size={13}
                color={COLORS.primary}
              />
              <Text numberOfLines={1} style={styles.metaText}>
                {data.designation}
              </Text>
            </View>

            <View style={styles.metaItem}>
              <Icon
                name="location-outline"
                size={13}
                color={COLORS.primary}
              />
              <Text numberOfLines={1} style={styles.metaText}>
                {data.place}
              </Text>
            </View>
          </View>

          {/* DESCRIPTION */}
          <Text
            numberOfLines={2}
            style={styles.description}
          >
            {stripHtml(data.description)}
          </Text>

          {/* FOOTER */}
          <View style={styles.footer}>
            <Text style={styles.readMore}>
              Read Editorial
            </Text>

            <Icon
              name="arrow-forward"
              size={16}
              color={COLORS.primary}
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
    color: '#111',
  },

  redLine: {
    width: 42,
    height: 4,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    marginTop: 5,
  },

  /* CARD */
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    overflow: 'hidden',

    shadowColor: '#000',
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
    backgroundColor: '#f2f2f2',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: COLORS.primary,
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
    color: '#111',
  },

  company: {
    fontSize: 13,
    color: '#666',
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
    backgroundColor: '#fafafa',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    maxWidth: '48%',
  },

  metaText: {
    marginLeft: 5,
    fontSize: 11,
    color: '#444',
    fontWeight: '600',
    flexShrink: 1,
  },

  description: {
    fontSize: 13,
    lineHeight: 20,
    color: '#555',
  },

  footer: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  readMore: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 13,
  },
});