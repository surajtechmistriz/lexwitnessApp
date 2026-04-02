'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { latesteEdition } from '../../../services/api/latestedition';
import Config from 'react-native-config';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

/* ---------- TYPES ---------- */

type Post = {
  id: number;
  title: string;
  image?: string;
  description?: string;
  short_description: string;
  slug: string;
  category?: {
    slug: string;
    name?: string;
  };
};

type Magazine = {
  magazine_name: ReactNode;
  id: number;
  title: string;
  image: string;
  year: number;
  slug?: string; // safe slug
  link?: string; // subscribe link
};

type EditionResponse = {
  magazine: Magazine;
  posts: Post[];
};

type RootStackParamList = {
  ArticleDetail: { slug: string; category: string };
  MagazineDetail: { slug: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/* ---------- CONSTANTS ---------- */

const MagimgUrl = Config.MAGAZINES_BASE_URL;
const PostimgUrl = Config.POSTS_BASE_URL;

/* ---------- COMPONENT ---------- */

const LatestEdition = ({ onData }: { onData: (data: any) => void }) => {
  const [data, setData] = useState<EditionResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<NavigationProp>();

  /* ---------- FETCH DATA ---------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await latesteEdition();
        setData(result.data); // set api data
        onData(result.data);  // pass parent
      } catch (error) {
        console.error('API Error:', error);
      } finally {
        setLoading(false); // stop loader
      }
    };

    fetchData();
  }, []);

  /* ---------- LOADING ---------- */
  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#D80000"
        style={{ marginTop: 50 }}
      />
    );
  }

  if (!data) return null;

  /* ---------- NAVIGATION ---------- */

  // article navigation
  const goToArticle = (item: Post) => {
    navigation.navigate('ArticleDetail', {
      slug: item.slug,
      category: item.category?.slug ?? 'general',
    });
  };

  // magazine navigation
  const goToMagazine = () => {
    navigation.navigate('MagazineDetail', {
      slug: data.magazine?.slug ?? String(data.magazine.id),
    });
  };

  /* ---------- UI ---------- */

  return (
    <View style={styles.container}>
      {/* header */}
      <Text style={styles.headerText}>LATEST EDITION</Text>
      <View style={styles.redUnderline} />

      {/* magazine image */}
      <TouchableOpacity onPress={goToMagazine}>
        <Image
          source={{ uri: `${MagimgUrl}/${data.magazine?.image}` }}
          style={styles.bigImg}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* magazine info */}
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>{data.magazine?.title}</Text>
          <View style={styles.divider} />
          <Text style={styles.subTitleText}>
            {data.magazine?.magazine_name}
          </Text>
        </View>
      </View>

      {/* subscribe button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          data.magazine?.link && Linking.openURL(data.magazine.link)
        }
      >
        <Text style={styles.buttonText}>SUBSCRIBE NOW!</Text>
      </TouchableOpacity>

      {/* posts list */}
     {data.posts?.map((item) => (
  <View key={item.id} style={styles.feedbackSection}>
    
    <View style={styles.row}>
      
      {/* LEFT: IMAGE */}
      <TouchableOpacity onPress={() => goToArticle(item)}>
        <Image
          source={{ uri: `${PostimgUrl}/${item.image}` }}
          style={styles.smallImg}
          resizeMode="cover"
        />
      </TouchableOpacity>

      {/* RIGHT: CONTENT */}
      <View style={styles.rightContent}>
        
        <TouchableOpacity onPress={() => goToArticle(item)}>
          <Text numberOfLines={1} style={styles.feedbackTitle}>{item.title}</Text>
        </TouchableOpacity>

        <Text
          style={styles.feedbackDescription}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {item.short_description}
        </Text>

        <TouchableOpacity onPress={() => goToArticle(item)}>
          <Text style={styles.readMore}>Read More</Text>
        </TouchableOpacity>

      </View>
    </View>

    <View style={styles.dottedLine} />
  </View>
))}
    </View>
  );
};

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 30,
    marginLeft: 16,
  },

  redUnderline: {
    width: 60,
    height: 4,
    backgroundColor: '#D80000',
    marginTop: 4,
    marginBottom: 20,
    marginLeft: 18,
  },

  bigImg: {
    width: '93%',
    height: 500,
    marginBottom: 15,
    marginHorizontal: 11,
  },

  textContainer: { marginVertical: 10 },

  titleText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#000',
    marginLeft: 4,
  },

  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
    marginHorizontal: 16,
  },

  subTitleText: {
    fontSize: 16,
    color: '#444',
    marginLeft: 4,
  },

  button: {
    backgroundColor: '#c9060a',
    paddingVertical: 15,
    marginHorizontal: 16,
    alignItems: 'center',
    marginBottom: 40,
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  /* feedback */
  feedbackSection: { marginTop: 20, flexDirection:'column' },

  smallImgContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  smallImg: {
    width: 100,
    height: 80,
    // borderRadius: 6,
  },

  feedbackTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    marginHorizontal: 16,
    marginTop:-5
  },

  feedbackDescription: {
    fontSize: 12,
    color: '#555',
    lineHeight: 22,
    marginHorizontal: 16,
  },

  readMore: {
    color: '#D80000',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
    marginHorizontal: 16,
  },

  dottedLine: {
    borderStyle: 'dotted',
    borderWidth: 1,
    borderColor: '#CCC',
    marginTop: 25,
    height: 0,
    marginHorizontal: 15,
  },

  content: {
    paddingHorizontal: 12,
  },

  row: {
  flexDirection: 'row',
  paddingHorizontal: 16,
  gap: 12,
  alignItems: 'flex-start',
},

rightContent: {
  flex: 1,
  justifyContent: 'flex-start',
},

});

export default LatestEdition;