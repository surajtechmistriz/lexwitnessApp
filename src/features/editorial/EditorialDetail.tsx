import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Config from 'react-native-config';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTheme } from '../../store/hooks/useTheme';
import { getEditorial } from '../../services/home.service';

// ---------- Types ----------

interface EditorialData {
  id?: number;
  name?: string;
  company_name?: string;
  designation?: string;
  place?: string;
  image?: string;
  description?: string;
  [key: string]: any;
}

type EditorialDetailParams = {
  editorialData?: EditorialData;
};

type EditorialDetailRoute = RouteProp<
  { EditorialDetail: EditorialDetailParams },
  'EditorialDetail'
>;

// ---------- Constants & helpers ----------

// Same red as the other screens so the status bar matches across the app.
const STATUS_BAR_COLOR = '#D32F2F';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop';

/** Turns the API's HTML description into plain-text paragraphs. */
const toParagraphs = (html?: string): string[] => {
  if (!html) return [];

  return html
    .replace(/<\/p>|<br\s*\/?>/gi, '\n\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(Boolean);
};

const hasText = (value?: string) =>
  !!value && value !== 'null' && value.trim() !== '';

// ---------- Component ----------

const EditorialDetail = () => {
  const route = useRoute<EditorialDetailRoute>();
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();

  // Hero scales with the screen height.
  const heroHeight = Math.min(Math.max(windowHeight * 0.55, 380), 560);

  const imgUrl = Config.EDITORIAL_IMAGE_URL || '';

  // Use what the previous screen passed; otherwise load it here.
  const passedData = route.params?.editorialData;

  const [data, setData] = useState<EditorialData | null>(passedData ?? null);
  const [loading, setLoading] = useState(!passedData);
  const [imageFailed, setImageFailed] = useState(false);

  // Keep in sync if the screen is reused with new params.
  useEffect(() => {
    if (passedData) {
      setData(passedData);
      setLoading(false);
      setImageFailed(false);
    }
  }, [passedData]);

  // No data passed: fetch the editorial from the same endpoint the Home card uses.
  useEffect(() => {
    if (passedData) return;

    let alive = true;

    const load = async () => {
      try {
        setLoading(true);
        const res = await getEditorial();
        if (alive) setData(res?.data ?? null);
      } catch (error) {
        console.error('Error fetching editorial:', error);
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();

    return () => {
      alive = false;
    };
  }, [passedData]);

  const imageUri = useMemo(() => {
    if (!imageFailed && hasText(data?.image)) {
      return `${imgUrl}/${data?.image}`;
    }
    return FALLBACK_IMAGE;
  }, [data?.image, imgUrl, imageFailed]);

  const paragraphs = useMemo(
    () => toParagraphs(data?.description),
    [data?.description],
  );

  // Only show info boxes that actually have a value.
  const infoItems = useMemo(
    () =>
      [
        {
          key: 'designation',
          icon: 'briefcase-outline',
          label: 'DESIGNATION',
          value: data?.designation,
        },
        {
          key: 'place',
          icon: 'location-outline',
          label: 'LOCATION',
          value: data?.place,
        },
      ].filter(item => hasText(item.value)),
    [data?.designation, data?.place],
  );

  const handleBack = () => {
    navigation.goBack();
  };

  // Red fills the top inset, so the image starts below the status bar / notch.
  const renderScreen = (children: React.ReactNode) => (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <View style={[styles.body, { backgroundColor: colors.background }]}>
        {children}
      </View>
    </SafeAreaView>
  );

  if (loading) {
    return renderScreen(
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>,
    );
  }

  if (!data) {
    return renderScreen(
      <View style={styles.centered}>
        <Icon
          name="document-text-outline"
          size={48}
          color={colors.textMuted}
        />
        <Text style={[styles.emptyTitle, { color: colors.text }]}>
          Editorial not available
        </Text>
        <TouchableOpacity
          style={[styles.emptyButton, { backgroundColor: colors.primary }]}
          onPress={handleBack}
          activeOpacity={0.8}
        >
          <Text style={styles.emptyButtonText}>Go back</Text>
        </TouchableOpacity>
      </View>,
    );
  }

  return renderScreen(
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingBottom: 50 + insets.bottom },
      ]}
    >
      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: 'rgba(0,0,0,0.3)' }]}
        onPress={handleBack}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <View style={[styles.heroWrapper, { height: heroHeight }]}>
        <Image
          source={{ uri: imageUri }}
          style={styles.heroImage}
          resizeMode="cover"
          onError={() => setImageFailed(true)}
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

          {hasText(data.name) && (
            <Text style={styles.name} numberOfLines={3}>
              {data.name}
            </Text>
          )}

          {hasText(data.company_name) && (
            <View style={styles.companyRow}>
              <Icon name="business-outline" size={16} color="#fff" />
              <Text style={styles.company}>{data.company_name}</Text>
            </View>
          )}
        </View>
      </View>

      {infoItems.length > 0 && (
        <View
          style={[
            styles.infoGrid,
            {
              backgroundColor: colors.card,
              shadowColor: '#000',
              borderColor: colors.border,
            },
          ]}
        >
          {infoItems.map((item, index) => (
            <View
              key={item.key}
              style={[
                styles.infoBox,
                index > 0 && styles.borderLeft,
                index > 0 && { borderLeftColor: colors.border },
              ]}
            >
              <Icon name={item.icon} size={22} color={colors.primary} />
              <Text style={[styles.infoLabel, { color: colors.textMuted }]}>
                {item.label}
              </Text>
              <Text
                style={[styles.infoValue, { color: colors.text }]}
                numberOfLines={2}
              >
                {item.value}
              </Text>
            </View>
          ))}
        </View>
      )}

      {paragraphs.length > 0 && (
        <View
          style={[
            styles.contentBody,
            infoItems.length === 0 && styles.contentBodyNoInfo,
          ]}
        >
          <View style={styles.sectionHeader}>
            <View
              style={[styles.accentBar, { backgroundColor: colors.primary }]}
            />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              The Insight
            </Text>
          </View>

          {paragraphs.map((paragraph, index) => (
            <Text
              key={index}
              style={[
                styles.description,
                { color: colors.textSecondary },
                index < paragraphs.length - 1 && styles.paragraphGap,
              ]}
            >
              {paragraph}
            </Text>
          ))}
        </View>
      )}
    </ScrollView>,
  );
};

export default EditorialDetail;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: STATUS_BAR_COLOR,
  },
  body: { flex: 1 },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '600',
  },
  emptyButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  scrollContent: {},
  heroWrapper: { width: '100%' },
  heroImage: { width: '100%', height: '100%', position: 'absolute' },
  overlay: { ...StyleSheet.absoluteFillObject },
  heroContent: {
    position: 'absolute',
    bottom: 60,
    left: 24,
    right: 24,
    paddingTop: 20,
  },
  backButton: {
    position: 'absolute',
    top: 12,
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
  borderLeft: { borderLeftWidth: 1 },
  infoLabel: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: '600',
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
  contentBodyNoInfo: {
    marginTop: 8,
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
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    lineHeight: 30,
  },
  paragraphGap: {
    marginBottom: 16,
  },
});