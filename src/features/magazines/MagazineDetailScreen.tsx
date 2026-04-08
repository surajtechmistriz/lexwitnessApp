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
import { getSingleMagazine } from './api/magazine';
import Config from 'react-native-config';
import LatestEditions from '../home/components/Latest5Edition';
import Header from '../../components/common/Header';
import Menubar from '../../components/common/Menubar';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Footer from '../../components/common/Footer';
import { useTabBar } from '../../BotttomTabs/TabBarContext';

const imgUrl = Config.MAGAZINES_BASE_URL;
const imgUrl2 = Config.POSTS_BASE_URL;

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function MagazineDetailScreen() {

    const lastOffset = useRef(0);
    const { hideTabBar, showTabBar } = useTabBar();
  
  const scrollOffset = useRef(0);
  
  const handleScroll = (event: any) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const diff = currentOffset - scrollOffset.current;
  
    if (currentOffset <= 0) {
      showTabBar();
    } else if (diff > 10) {
      hideTabBar();
    } else if (diff < -10) {
      showTabBar();
    }
  
    scrollOffset.current = currentOffset;
  };


  const route = useRoute<any>();
  const { slug } = route.params;

  const [magazine, setMagazine] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    if (slug) {
      fetchMagazine();
    }
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

  if (loading) {
    return <ActivityIndicator size="large" color="#c9060a" style={{ marginTop: 50 }} />;
  }

  if (!magazine) {
    return (
      <View style={styles.center}>
        <Text>No Data</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}  onScroll={handleScroll}
  scrollEventThrottle={16}>

        {/* COVER */}
        <View style={styles.wrapper}>
          <View style={styles.coverCard}>
           <Image
  source={{ uri: getImage(magazine.image, imgUrl) }}
  style={styles.coverImage}
  resizeMode="contain" // Add this
/>
          </View>

          {/* DETAILS */}
          <View style={styles.content}>
            <Text style={styles.subtitle}>{magazine.magazine_name}</Text>
            <Text style={styles.title}>{magazine.title}</Text>

            <View style={styles.divider}/>

            <Text style={styles.text}>Magazine Details</Text>

            <Text style={styles.description}>
              {magazine.description
                ?.replace(/<[^>]+>/g, '')
                .replace(/&amp;/g, '&')}
            </Text>

            <TouchableOpacity style={styles.subscribeBtn}>
              <Text style={styles.subscribeText}>Subscribe Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ARTICLES */}
        <View style={styles.articleSection}>
          <Text style={styles.sectionTitle}>Articles</Text>
          <View style={styles.redLine}/>

          <View style={styles.grid}>
            {magazine.posts?.map((post: any) => (
              <TouchableOpacity
                key={post.id}
                style={styles.card}
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate('ArticleDetail', {
                    slug: post.slug,
                    category: post.category?.slug || 'general',
                  })
                }
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
        <View style={{marginBottom:60}}>

        {magazine?.id && <LatestEditions skipId={magazine.id} />}
        </View>

        {/* <Footer /> */}
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  wrapper: {
    paddingHorizontal: 12,
    marginTop: 10,
  },

  coverCard: {
    borderRadius: 10,
    overflow: 'hidden',
  },

coverImage: {
  width: '100%',
  height: 450, // Reduced height for better mobile perspective
  backgroundColor: '#f9f9f9',
},

cardImage: {
  width: '100%',
  height: 100,      // Smaller height for 2-column grid
  backgroundColor: '#eee',
},
  content: {
    marginTop: 16,
  },

  title: {
    fontSize: 16,
    fontWeight: '400',
    color: '#333',
  },

  subtitle: {
    fontSize: 24,
    color: '#333',
    marginTop: 4,
    fontWeight:700
  },

   divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#b5afb0',
    marginTop: 5,
    marginLeft:1,
    marginBottom:10
  },
  
  text:{
    color:"#c9060a"
  },
  
  description: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    marginTop: 6,
  },

  subscribeBtn: {
    backgroundColor: '#c9060a',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 14,
  },
  
  subscribeText: {
    color: '#fff',
    fontWeight: '600',
  },
  
  /* ARTICLES */
  articleSection: {
    marginTop: 24,
    paddingHorizontal: 12,
  },
  
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    color: '#111',
  },
  redLine: {
 width: 40,
 height: 4,
 backgroundColor: '#c9060a',
 marginTop: -10,
 marginLeft:1,
 marginBottom:10
},
  
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  card: {
    width: '48%',
    marginBottom: 14,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#fff',

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
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
    color: '#ff3b30',
    marginTop: 4,
  },
});
