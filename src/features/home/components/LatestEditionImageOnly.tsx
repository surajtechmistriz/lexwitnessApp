'use client';

import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View, ActivityIndicator } from 'react-native';
import { latesteEdition } from '../../../services/api/latestedition';
import Config from 'react-native-config';
import { Text } from 'react-native';

type Magazine = {
  id: number;
  title: string;
  image: string;
  magazine_name?: string;
  year?: number;
};

type EditionResponse = {
  magazine: Magazine;
};

const MagimgUrl = Config.MAGAZINES_BASE_URL;

const LatestEditionImageOnly = () => {
  const [data, setData] = useState<EditionResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await latesteEdition();
        setData(result.data);
      } catch (error) {
        console.error('Error fetching latest edition:', error);
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

  if (!data || !data.magazine) return null;

  return (
    <View style={styles.container}>
      <View>

       <Text style={styles.headerText}>LATEST EDITION</Text>
      </View>
        <View style={styles.redUnderline} />
      <Image
        source={{ uri: `${MagimgUrl}/${data.magazine.image}` }}
        style={styles.bigImg}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  bigImg: { width: '100%', height: 500 },
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
});

export default LatestEditionImageOnly;