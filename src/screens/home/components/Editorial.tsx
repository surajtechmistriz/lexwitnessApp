import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getEditorial } from '../api/home.api';
import Config from 'react-native-config';
import { useNavigation } from '@react-navigation/native'; // 1. Import Navigation
import { COLORS } from '../../../theme/colors';

interface EditorialData {
  image: any;
  name: string;
  designation: string;
  company_name: string;
  place: string;
  description: string;
}

const imgUrl = Config.EDITORIAL_IMAGE_URL;

const EditorialCard: React.FC = () => {
  const [data, setData] = useState<EditorialData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // 2. Initialize Navigation
  const navigation = useNavigation<any>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getEditorial();
        setData(result.data);
      } catch (error) {
        console.error("Error fetching editorial:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Helper to strip HTML tags if the description contains them
  const stripHtml = (html: string) => html?.replace(/<[^>]*>?/gm, '') || "";

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="small" color={COLORS.primary}/>
      </View>
    );
  }

  if (!data) return null;

 return (
  <View style={styles.wrapper}>
    {/* Header */}
    <Text style={styles.heading}>Editorial</Text>
     <View style={styles.redLine} />

    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.card}
      onPress={() =>
        navigation.navigate('EditorialDetail', {
          editorialData: data,
        })
      }
    >
      {/* Top Profile */}
      <View style={styles.topRow}>
        <Image
          source={{ uri: `${imgUrl}/${data.image}` }}
          style={styles.avatar}
        />

        <View style={styles.info}>
          <Text style={styles.name}>{data.name}</Text>
          <Text style={styles.meta}>
            {data.designation} • {data.company_name}
          </Text>
          <Text style={styles.location}>{data.place}</Text>
        </View>
      </View>

      {/* Description */}
      <Text numberOfLines={4} style={styles.description}>
        {stripHtml(data.description)}
      </Text>

      {/* CTA */}
      <Text style={styles.readMore}>Read Full Editorial →</Text>
    </TouchableOpacity>
  </View>
);
};


const styles = StyleSheet.create({
  wrapper: {
    // paddingHorizontal: 12,
    marginTop: 20,
    marginBottom: 30,
  },

  heading: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#111',
  },
    redLine: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.primary,
    marginTop: -10,
    marginBottom:10,
    marginLeft:1
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 14,

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  topRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 6,
    backgroundColor: '#eee',
  },

  info: {
    flex: 1,
    justifyContent: 'center',
  },

  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },

  meta: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },

  location: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },

  description: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    marginBottom: 10,
  },

  readMore: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
});

export default EditorialCard;