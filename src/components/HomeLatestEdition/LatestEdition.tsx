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
import { latesteEdition } from '../../services/api/latestedition';
import Config from 'react-native-config';

type Post = {
  short_description: ReactNode;
  id: number;
  title: string;
  image?: string;
  description?: string;
};

type Magazine = {
  magazine_name: ReactNode;
  id: number;
  title: string;
  image: string;
  year: number;
};

type EditionResponse = {
  magazine: Magazine;
  posts: Post[];
};
const MagimgUrl = Config.MAGAZINES_BASE_URL;
const PostimgUrl = Config.POSTS_BASE_URL;

const LatestEdition = ({ onData }: { onData: (data: any) => void }) => {
  const [data, setData] = useState<EditionResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await latesteEdition();
        // Check console to confirm if it's result.data or result.data.data
        setData(result.data);
        onData(result.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <ActivityIndicator
        size="large"
        color="#D80000"
        style={{ marginTop: 50 }}
      />
    );
  if (!data) return null;

  // console.log('Data', data);
  // console.log('IMAGE', data.posts);


  return (
    <View style={styles.container}>
      {/* --- LATEST EDITION SECTION --- */}
      <Text style={styles.headerText}>LATEST EDITION</Text>
      <View style={styles.redUnderline} />

      {/* FIXED: Added imgUrl prefix */}
      <Image
        source={{ uri: `${MagimgUrl}/${data?.magazine?.image}` }}
        style={styles.bigImg}
        resizeMode="contain"
      />

      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>{data?.magazine?.title}</Text>
          <View style={styles.divider} />
          <Text style={styles.subTitleText}>
            {data.magazine?.magazine_name}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          data.magazine?.link && Linking.openURL(data.magazine.link)
        }
      >
        <Text style={styles.buttonText}>SUBSCRIBE NOW!</Text>
      </TouchableOpacity>

      {/* --- READERS' FEEDBACK SECTION --- */}

      {data?.posts?.map((item, index) => (
        <View key={index} style={styles.feedbackSection}>
          <View style={styles.content}>
            <View style={styles.smallImgContainer}>
              <Image
                source={{ uri: `${PostimgUrl}/${item.image}` }}
                style={styles.smallImg}
                resizeMode="cover"
              />
            </View>
          </View>

          <Text style={styles.feedbackTitle}>{item.title}</Text>
          <View style={styles.divider} />
          <Text
            style={styles.feedbackDescription}
            numberOfLines={3}
            ellipsizeMode="tail"
          >
            {item.short_description}
          </Text>

          <TouchableOpacity>
            <Text style={styles.readMore}>Read More</Text>
          </TouchableOpacity>

          <View style={styles.dottedLine} />
        </View>
      ))}
    </View>
  );
};

// ... styles remain the same
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
  bigImg: { width: '93%', height: 500, marginBottom: 15, marginHorizontal:11 },
  textContainer: { marginVertical: 10 },
  titleText: { fontSize: 22, fontWeight: '800', color: '#000', marginLeft: 4 },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
    marginHorizontal: 16,
  },
  subTitleText: { fontSize: 16, color: '#444', marginLeft: 4 },
  button: {
    backgroundColor: '#c9060a',
    paddingVertical: 15,
    marginHorizontal: 16,
    alignItems: 'center',
    marginBottom: 40,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  /* Feedback Styles */
  feedbackSection: { marginTop: 20 },
  smallImgContainer: {
    // backgroundColor: '#F5F5F5', // Light grey background like your image
    // padding: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  smallImg: { width: 335, height: 240, marginRight:2 },
  feedbackTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginHorizontal: 16,
  },
  feedbackDescription: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
    marginHorizontal: 16,
  },
  readMore: {
    color: '#D80000',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginHorizontal: 16,
  },
  dottedLine: {
    borderStyle: 'dotted',
    borderWidth: 1,
    borderRadius: 1,
    borderColor: '#CCC',
    marginTop: 25,
    height: 0,
    marginHorizontal:15
  },
  content: {
    paddingHorizontal: 12,
  },
});

export default LatestEdition;
