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
import Icon from 'react-native-vector-icons/Ionicons'; //  ADDED
import { getSingleMagazine } from './api/magazine';
import Config from 'react-native-config';
import LatestEditions from '../home/components/Latest5Edition';

const imgUrl = Config.MAGAZINES_BASE_URL;
const imgUrl2 = Config.POSTS_BASE_URL;

export default function MagazineDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  
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
    navigation.navigate('Magazines');
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#c9060a" />
      </View>
    );
  }

  if (!magazine) {
    return (
      <View style={styles.loader}>
        <Text>No Data</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {/*  BACK BUTTON */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={handleBack}
        activeOpacity={0.7}
      >
        <Icon name="arrow-back" size={24} color="#c9060a" />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* MAGAZINE HERO */}
        <View style={styles.heroSection}>
          <View style={styles.heroCard}>
            <Image
              source={{ uri: getImage(magazine.image, imgUrl) }}
              style={styles.heroImage}
              resizeMode="contain"
            />
          </View>

          {/* DETAILS */}
          <View style={styles.content}>
            <Text style={styles.kicker}>{magazine.magazine_name}</Text>

            <Text style={styles.title}>{magazine.title}</Text>

            <View style={styles.divider} />

            <Text style={styles.sectionLabel}>Magazine Details</Text>

            <Text style={styles.description}>
              {magazine.description
                ?.replace(/<[^>]+>/g, '')
                .replace(/&amp;/g, '&')}
            </Text>

            <TouchableOpacity 
              style={styles.subscribeBtn}
              onPress={handleSubscribe}
            >
              <Text style={styles.subscribeText}>Subscribe Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ARTICLES */}
        <View style={styles.articleSection}>
          <Text style={styles.sectionTitle}>Articles</Text>
          <View style={styles.redLine} />

          <View style={styles.grid}>
            {magazine.posts?.map((post: any) => (
              <TouchableOpacity
                key={post.id}
                style={styles.card}
                activeOpacity={0.85}
                onPress={() => handleArticlePress(post)}
              >
                <Image
                  source={{ uri: getImage(post.image, imgUrl2) }}
                  style={styles.cardImage}
                />

                <View style={styles.cardContent}>
                  <Text numberOfLines={2} style={styles.cardTitle}>
                    {post.title}
                  </Text>

                  <Text style={styles.cardCategory}>
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
    backgroundColor: '#f5f5f5',
  },

  //  BACK BUTTON STYLES
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 30,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
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
    backgroundColor: '#fff',
  },

  heroImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 3 / 4,
    backgroundColor: '#f9f9f9',
  },

  content: {
    backgroundColor: '#fff',
    marginTop: 14,
    padding: 16,
    borderRadius: 14,
  },

  kicker: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },

  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111',
    marginTop: 6,
    lineHeight: 30,
  },

  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },

  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#c9060a',
    marginBottom: 6,
  },

  description: {
    fontSize: 14,
    color: '#444',
    lineHeight: 22,
  },

  subscribeBtn: {
    marginTop: 16,
    backgroundColor: '#c9060a',
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
    color: '#111',
  },

  redLine: {
    width: 50,
    height: 4,
    backgroundColor: '#c9060a',
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
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
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
    color: '#111',
  },

  cardCategory: {
    fontSize: 11,
    color: '#c9060a',
    marginTop: 6,
    fontWeight: '500',
  },

  moreSection: {
    marginTop: 20,
    paddingBottom: 0,
    paddingLeft: 10,
  },
});