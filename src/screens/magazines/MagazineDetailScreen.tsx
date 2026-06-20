import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getSingleMagazine } from './api/magazine';
import Config from 'react-native-config';
import LatestEditions from '../home/components/Latest5Edition';
import { useTheme } from '../../redux/hooks/useTheme';

const imgUrl = Config.MAGAZINES_BASE_URL;
const imgUrl2 = Config.POSTS_BASE_URL;

export default function MagazineDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { colors, isDark } = useTheme();
  
  const { slug } = route.params || {};

  const [magazine, setMagazine] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) fetchMagazine();
  }, [slug]);

  const fetchMagazine = async () => {
    try {
      setLoading(true);
      const data = await getSingleMagazine(slug);
      setMagazine(data);
    } catch (err) {
      console.error('Detail error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getImage = (img: string, base: string) => {
    if (!img) return 'https://via.placeholder.com/300x200';
    return img.startsWith('http') ? img : `${base}/${img}`;
  };

  //  NAVIGATION FUNCTIONS
  const handleBack = () => {
    navigation.goBack();
  };

  const handleSubscribe = () => {
    navigation.navigate('Subscription');
  };

  const handleArticlePress = (post: any) => {
    navigation.navigate('ArticleDetail', {
      slug: post.slug,
    });
  };

  const handleMagazinePress = (item: any) => {
    navigation.navigate('MagazineDetail', {
      slug: item.slug,
    });
  };

  const handleViewAllMagazines = () => {
    navigation.navigate('MagazinesTab');
  };

  if (loading) {
    return (
      <View style={[styles.loader, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!magazine) {
    return (
      <View style={[styles.loader, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textSecondary }}>No Data</Text>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/*  BACK BUTTON */}
      <TouchableOpacity 
        style={[styles.backButton, { 
          backgroundColor: colors.card,
          shadowColor: isDark ? '#000' : '#000',
        }]} 
        onPress={handleBack}
        activeOpacity={0.7}
      >
        <Icon name="arrow-back" size={24} color={colors.primary} />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* MAGAZINE HERO */}
        <View style={styles.heroSection}>
          <View style={[styles.heroCard, { backgroundColor: colors.card }]}>
            <Image
              source={{ uri: getImage(magazine.image, imgUrl) }}
              style={[styles.heroImage, { backgroundColor: isDark ? colors.border : '#f9f9f9' }]}
              resizeMode="contain"
            />
          </View>

          {/* DETAILS */}
          <View style={[styles.content, { backgroundColor: colors.card }]}>
            <Text style={[styles.kicker, { color: colors.text }]}>
              {magazine.magazine_name}
            </Text>

            <Text style={[styles.title, { color: colors.text }]}>
              {magazine.title}
            </Text>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <Text style={[styles.sectionLabel, { color: colors.primary }]}>
              Magazine Details
            </Text>

            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {magazine.description
                ?.replace(/<[^>]+>/g, '')
                .replace(/&amp;/g, '&')}
            </Text>

            <TouchableOpacity 
              style={[styles.subscribeBtn, { backgroundColor: colors.primary }]}
              onPress={handleSubscribe}
            >
              <Text style={styles.subscribeText}>Subscribe Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ARTICLES */}
        <View style={styles.articleSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Articles</Text>
          <View style={[styles.redLine, { backgroundColor: colors.primary }]} />

          <View style={styles.grid}>
            {magazine.posts?.map((post: any) => (
              <TouchableOpacity
                key={post.id}
                style={[styles.card, { 
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  shadowColor: isDark ? '#000' : '#000',
                }]}
                activeOpacity={0.85}
                onPress={() => handleArticlePress(post)}
              >
                <Image
                  source={{ uri: getImage(post.image, imgUrl2) }}
                  style={[styles.cardImage, { backgroundColor: isDark ? colors.border : '#f9f9f9' }]}
                />

                <View style={styles.cardContent}>
                  <Text numberOfLines={2} style={[styles.cardTitle, { color: colors.text }]}>
                    {post.title}
                  </Text>

                  <Text style={[styles.cardCategory, { color: colors.primary }]}>
                    {post.category?.name || 'General'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* MORE EDITIONS */}
        <View style={styles.moreSection}>
          {magazine?.id && (
            <LatestEditions
              skipId={magazine.id}
              onPressItem={handleMagazinePress}
              onPressViewAll={handleViewAllMagazines}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  //  BACK BUTTON STYLES
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  heroSection: {
    padding: 14,
    paddingTop: 20,
  },

  heroCard: {
    borderRadius: 14,
    overflow: 'hidden',
  },

  heroImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 3 / 4,
  },

  content: {
    marginTop: 14,
    padding: 16,
    borderRadius: 14,
  },

  kicker: {
    fontSize: 20,
    fontWeight: '700',
  },

  title: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 6,
    lineHeight: 30,
  },

  divider: {
    height: 1,
    marginVertical: 12,
  },

  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },

  description: {
    fontSize: 14,
    lineHeight: 22,
  },

  subscribeBtn: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  subscribeText: {
    color: '#fff',
    fontWeight: '700',
  },

  articleSection: {
    paddingHorizontal: 14,
    marginTop: 20,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
  },

  redLine: {
    width: 50,
    height: 4,
    marginTop: 6,
    marginBottom: 14,
    borderRadius: 2,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  card: {
    width: '48%',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 14,
    borderWidth: 1,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },

  cardImage: {
    width: '100%',
    height: 110,
  },

  cardContent: {
    padding: 10,
  },

  cardTitle: {
    fontSize: 13,
    fontWeight: '600',
  },

  cardCategory: {
    fontSize: 11,
    marginTop: 6,
    fontWeight: '500',
  },

  moreSection: {
    marginTop: 20,
    paddingBottom: 0,
    paddingLeft: 10,
  },
});