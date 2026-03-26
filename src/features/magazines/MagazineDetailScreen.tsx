import React, { useEffect, useState } from 'react';
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

const imgUrl = Config.MAGAZINES_BASE_URL;
const imgUrl2 = Config.POSTS_BASE_URL;

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function MagazineDetailScreen() {
  const route = useRoute<any>();
  const { slug } = route.params;

  const [magazine, setMagazine] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<NavigationProp>();

  //  Fetch magazine
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

  //  Loader
  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#c9060a"
        style={{ marginTop: 50 }}
      />
    );
  }

  //  Empty state
  if (!magazine) {
    return (
      <View style={styles.center}>
        <Text>No Data</Text>
      </View>
    );
  }
  console.log(magazine);
  return (
    <View style={{ flex: 1 }}>
      <Header />

      {/*  ADD THIS */}
      <Menubar />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* SAME UI */}
        {/* MAGAZINE COVER */}
        <Image
          source={{
            uri: magazine.image
              ? `${imgUrl}/${magazine.image}`
              : 'https://via.placeholder.com/300x400',
          }}
          style={styles.mainImage}
          resizeMode="contain"
        />

        {/* DETAILS */}
        <View style={styles.detailsContainer}>
          <Text style={styles.magazineName}>{magazine.magazine_name}</Text>
          <Text style={styles.issueDate}>{magazine.title || 'No Title'}</Text>

          <View style={styles.separator} />

          <Text style={styles.sectionTitle}>Magazine Details</Text>

          <Text style={styles.description}>
            {magazine.description
              ?.replace(/<[^>]+>/g, '')
              .replace(/&amp;/g, '&')}
          </Text>

          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.previousIssues}>
              Check out our previous issues{' '}
            </Text>

            <Text
              style={styles.linkText}
              onPress={() => navigation.navigate('MagazinesScreen')}
            >
              here
            </Text>
          </View>

          <TouchableOpacity style={styles.subscribeButton}>
            <Text style={styles.subscribeText}>Subscribe now</Text>
          </TouchableOpacity>
        </View>

        {/* ARTICLES */}
        <View style={styles.articlesSection}>
          <Text style={styles.articlesHeading}>ARTICLES</Text>
          <View style={styles.redUnderline} />

          {magazine.posts?.map((post: any) => (
            <View key={post.id} style={styles.articleCard}>
              <Image
                source={{
                  uri: post.image
                    ? `${imgUrl2}/${post.image}`
                    : 'https://via.placeholder.com/150',
                }}
                style={styles.articleImage}
              />

              <View style={styles.articleInfo}>
                <Text style={styles.articleTitle}>{post.title}</Text>
                <Text style={styles.articleCategory}>
                  {post.category?.name || 'Uncategorized'}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/*  LATEST EDITIONS (works correctly now) */}
        {magazine?.id && <LatestEditions skipId={magazine.id} />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  mainImage: {
    width: '100%',
    height: 500,
    backgroundColor: '#f9f9f9',
    marginTop: 30,
  },

  detailsContainer: {
    padding: 20,
  },

  magazineName: {
    fontSize: 24,
    fontWeight: 600,
    marginBottom: 10,
  },

  issueDate: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },

  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 18,
    color: '#c9060a',
    marginBottom: 12,
  },

  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
    marginBottom: 15,
  },

  previousIssues: {
    fontSize: 15,
    marginBottom: 20,
  },

  linkText: {
    color: '#c9060a',
    textDecorationLine: 'underline',
  },

  subscribeButton: {
    backgroundColor: '#c9060a',
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
  },

  subscribeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  articlesSection: {
    marginTop: 20,
    paddingBottom: 40,
  },

  articlesHeading: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },

  redUnderline: {
    width: 40,
    height: 4,
    backgroundColor: '#c9060a',
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 25,
  },

  articleCard: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#efefef',
    elevation: 2,
  },

  articleImage: {
    width: '100%',
    height: 200,
  },

  articleInfo: {
    padding: 15,
  },

  articleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  articleCategory: {
    marginTop: 10,
    color: '#c9060a',
    fontSize: 14,
  },
});
