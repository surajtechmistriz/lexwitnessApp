import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import Config from 'react-native-config';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../store/hooks/useTheme';
import { getEditorial } from '../../../services/home.service';

// ---------- Types ----------

interface EditorialData {
  image: string;
  name: string;
  designation: string;
  company_name: string;
  place: string;
  description: string;
  [key: string]: any;
}

interface EditorialCardProps {
  /** Optional: parent-controlled tap handler. If omitted, the card navigates internally. */
  onPressItem?: (item: EditorialData) => void;
}

// ---------- Constants ----------

const imgUrl = Config.EDITORIAL_IMAGE_URL;

const fallbackImage =
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop';

const hasText = (value?: string) =>
  !!value && value !== 'null' && value.trim() !== '';

// ---------- Component ----------

const EditorialCard: React.FC<EditorialCardProps> = ({ onPressItem }) => {
  const [data, setData] = useState<EditorialData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [imageFailed, setImageFailed] = useState(false);
  const { colors, isDark } = useTheme();

  const navigation = useNavigation<any>();

  useEffect(() => {
    let alive = true;

    const fetchData = async () => {
      try {
        const result = await getEditorial();
        if (alive) setData(result.data);
      } catch (error) {
        console.error('Error fetching editorial:', error);
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchData();
    return () => {
      alive = false;
    };
  }, []);

  const imageSource =
    !imageFailed && hasText(data?.image)
      ? `${imgUrl}/${data?.image}`
      : fallbackImage;

  const handlePress = () => {
    if (!data) return;

    if (onPressItem) {
      onPressItem(data);
      return;
    }

    navigation.navigate('EditorialDetail', {
      editorialData: data,
    });
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="small" color={colors.primary} />
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

      {/* COMPACT CARD: small photo on the left, details on the right */}
      <TouchableOpacity
        activeOpacity={0.92}
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
        onPress={handlePress}
      >
        <Image
          source={{ uri: imageSource }}
          style={[
            styles.thumb,
            { backgroundColor: isDark ? colors.border : '#f2f2f2' },
          ]}
          resizeMode="cover"
          onError={() => setImageFailed(true)}
        />

        <View style={styles.content}>
          <Text style={[styles.featured, { color: colors.primary }]}>
            FEATURED
          </Text>

          {hasText(data.name) && (
            <Text
              numberOfLines={1}
              style={[styles.name, { color: colors.text }]}
            >
              {data.name}
            </Text>
          )}

          {hasText(data.company_name) && (
            <Text
              numberOfLines={1}
              style={[styles.company, { color: colors.textSecondary }]}
            >
              {data.company_name}
            </Text>
          )}

          {(hasText(data.designation) || hasText(data.place)) && (
            <View style={styles.metaRow}>
              {hasText(data.designation) && (
                <View
                  style={[
                    styles.metaItem,
                    { backgroundColor: colors.background },
                  ]}
                >
                  <Icon
                    name="briefcase-outline"
                    size={11}
                    color={colors.primary}
                  />
                  <Text
                    numberOfLines={1}
                    style={[styles.metaText, { color: colors.textSecondary }]}
                  >
                    {data.designation}
                  </Text>
                </View>
              )}

              {hasText(data.place) && (
                <View
                  style={[
                    styles.metaItem,
                    { backgroundColor: colors.background },
                  ]}
                >
                  <Icon
                    name="location-outline"
                    size={11}
                    color={colors.primary}
                  />
                  <Text
                    numberOfLines={1}
                    style={[styles.metaText, { color: colors.textSecondary }]}
                  >
                    {data.place}
                  </Text>
                </View>
              )}
            </View>
          )}

          <View style={styles.footer}>
            <Text style={[styles.readMore, { color: colors.primary }]}>
              Read Editorial
            </Text>
            <Icon name="arrow-forward" size={14} color={colors.primary} />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default EditorialCard;

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 14,
    marginBottom: 16,
  },
  loader: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRow: {
    marginBottom: 10,
  },
  heading: {
    fontSize: 15,
    fontWeight: '800',
  },
  redLine: {
    width: 42,
    height: 4,
    borderRadius: 20,
    marginTop: 3,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  thumb: {
    width: 88,
    height: 112,
    borderRadius: 10,
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  featured: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 3,
  },
  name: {
    fontSize: 14,
    fontWeight: '800',
  },
  company: {
    fontSize: 12,
    marginTop: 1,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    maxWidth: '100%',
  },
  metaText: {
    marginLeft: 4,
    fontSize: 10.5,
    fontWeight: '600',
    flexShrink: 1,
  },
  footer: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMore: {
    fontWeight: '600',
    fontSize: 12,
    marginRight: 4,
  },
});