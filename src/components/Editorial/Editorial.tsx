import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getEditorial } from './service';
import Config from 'react-native-config';


interface EditorialData {
  image: any;
  name: string;
  designation: string;
  company_name: string;
  place: string;
  description: string;
  image_url?: string; // Optional, in case  service provides the avatar
}

const imgUrl = Config.EDITORIAL_IMAGE_URL

const EditorialCard: React.FC = () => {
  const [data, setData] = useState<EditorialData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getEditorial();
        console.log("Editorial", result.data);
        setData(result.data);
      } catch (error) {
        console.error("Error fetching editorial:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Guard clause to prevent rendering 'undefined' properties
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="small" color="#C41E3A" />
      </View>
    );
  }

  if (!data) return null;

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>EDITORIAL</Text>
        <View style={styles.redLine} />
      </View>

      {/* Main Card */}
      <View style={styles.card}>
        <View style={styles.profileSection}>
          <Image
            source={{ uri: `${imgUrl}/${data.image}` }}
            style={styles.avatar}
          />
          <View style={styles.info}>
            <Text style={styles.nameText}>{data.name}</Text>
            <Text style={styles.roleText}>{data.designation}</Text>
            <Text style={styles.companyText}>{data.company_name}</Text>
            <Text style={styles.locationText}>{data.place}</Text>
          </View>
        </View>

        {/* Using numberOfLines if you want to truncate long text like the screenshot */}
        <Text style={styles.bodyText} >
          {data.description}
        </Text>

        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.readMore}>Read More</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  headerContainer: {
    marginBottom: 15,
  },
  headerText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#333',
    letterSpacing: 0.5,
  },
  redLine: {
    width: 40,
    height: 4,
    backgroundColor: '#C41E3A',
    marginTop: 5,
  },
  card: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 18,
    borderRadius: 2,
  },
  profileSection: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 2,
    backgroundColor: '#f0f0f0',
  },
  info: {
    marginLeft: 15,
    flex: 1,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    lineHeight: 22,
  },
  roleText: {
    fontSize: 15,
    color: '#444',
    marginTop: 4,
  },
  companyText: {
    fontSize: 15,
    color: '#C41E3A',
    fontWeight: '700',
    marginTop: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
    textAlign: 'left',
    marginBottom: 12,
  },
  readMore: {
    color: '#C41E3A',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default EditorialCard;