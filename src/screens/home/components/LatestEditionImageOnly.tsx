'use client';

import React, { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import { latesteEdition } from '../../../services/api/latestedition';
import Config from 'react-native-config';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

/* ---------- TYPES ---------- */

type Magazine = {
  slug: string;
  id: number;
  title: string;
  image: string;
  magazine_name?: string;
  year?: number;
};

type EditionResponse = {
  magazine: Magazine;
};

type RootStackParamList = {
  MagazineDetail: { slug: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/* ---------- CONSTANT ---------- */

const MagimgUrl = Config.MAGAZINES_BASE_URL;

/* ---------- COMPONENT ---------- */

const LatestEditionImageOnly = () => {
  const [data, setData] = useState<EditionResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<NavigationProp>();

  /* fetch latest edition */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await latesteEdition();
        setData(result.data); // set api data
      } catch (error) {
        console.error('Fetch Error:', error);
      } finally {
        setLoading(false); // stop loader
      }
    };

    fetchData();
  }, []);

  /* loader */
  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#D80000"
        style={{ marginTop: 50 }}
      />
    );
  }

  /* no data */
  if (!data?.magazine) return null;

  const goToMagazine = () => {
     navigation.navigate('Magazines', {
                screen: 'MagazineDetail',
                params: {
                  slug: data.magazine?.slug ?? String(data.magazine.id),
                },
              })
  };

  /* UI */
  return (
    <View style={styles.container}>
      {/* header */}
      <Text style={styles.headerText}>LATEST EDITION</Text>
      <View style={styles.redUnderline} />

      {/* magazine image */}
      <TouchableOpacity onPress={goToMagazine}>
        <Image
          source={{ uri: `${MagimgUrl}/${data.magazine.image}` }}
          style={styles.bigImg}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

export default LatestEditionImageOnly;

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  bigImg: {
    width: '100%',
    height: 500,
  },

  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 30,
    // marginLeft: 16,
  },

  redUnderline: {
    width: 60,
    height: 4,
    backgroundColor: '#D80000',
    marginTop: 4,
    // marginBottom: 10,
    // marginLeft: 14,
  },
});
