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
import { useTheme } from '../../../redux/useTheme';

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

/* ---------- CONSTANT ---------- */

const MagimgUrl = Config.MAGAZINES_BASE_URL;

/* ---------- COMPONENT ---------- */

const LatestEditionImageOnly = () => {
  const { colors, isDark } = useTheme();
  const [data, setData] = useState<EditionResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<any>();

  /* fetch latest edition */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await latesteEdition();
        setData(result.data);
      } catch (error) {
        console.error('Fetch Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* loader */
  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color={colors.primary}
        style={{ marginTop: 50 }}
      />
    );
  }

  /* no data */
  if (!data?.magazine) return null;

  //  FIXED - Direct navigation
  const goToMagazine = () => {
    navigation.navigate('MagazineDetail', {
      slug: data.magazine?.slug ?? String(data.magazine.id),
    });
  };

  /* UI */
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* header */}
      <Text style={[styles.headerText, { color: colors.text }]}>
        LATEST EDITION
      </Text>
      <View style={[styles.redUnderline, { backgroundColor: colors.primary }]} />

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
  },

  bigImg: {
    width: '100%',
    height: 500,
  },

  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 30,
  },

  redUnderline: {
    width: 60,
    height: 4,
    marginTop: 4,
  },
});