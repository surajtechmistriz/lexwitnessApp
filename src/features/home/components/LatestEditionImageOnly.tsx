import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { useTheme } from '../../../store/hooks/useTheme';
import { getMagazineImageUrl } from '../../../utils/helpers/imageHelper';
import { latesteEdition } from '../api/latestedition';
import type { EditionResponse } from '../types';

const LatestEditionImageOnly = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();

  const [data, setData] = useState<EditionResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLatestEdition = useCallback(async () => {
    try {
      const result = await latesteEdition();
      setData(result.data);
    } catch (error) {
      console.error('Failed to load latest edition:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLatestEdition();
  }, [fetchLatestEdition]);

  const handleMagazinePress = useCallback(() => {
    if (!data?.magazine) {
      return;
    }

    navigation.navigate('MagazineDetail', {
      slug: data.magazine.slug ?? String(data.magazine.id),
    });
  }, [data, navigation]);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color={colors.primary}
        style={styles.loading}
      />
    );
  }

  if (!data?.magazine) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <Text
        style={[
          styles.headerText,
          {
            color: colors.text,
          },
        ]}
      >
        LATEST EDITION
      </Text>

      <View
        style={[
          styles.redUnderline,
          {
            backgroundColor: colors.primary,
          },
        ]}
      />

      <TouchableOpacity onPress={handleMagazinePress} activeOpacity={0.8}>
        <Image
          source={{
            uri: getMagazineImageUrl(data.magazine.image),
          }}
          style={styles.bigImg}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

export default LatestEditionImageOnly;

const styles = StyleSheet.create({
  loading: {
    marginTop: 50,
  },

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
