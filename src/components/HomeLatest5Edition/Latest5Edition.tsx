import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { getLatestMagazines } from './service';
import Config from 'react-native-config';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 60) / 2;

const imgUrl = Config.MAGAZINES_BASE_URL;

const LatestEditions = ({ skipId }: { skipId?: number }) => {
  const [editions, setEditions] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch data from your API
  const fetchEditions = async () => {
     if (!skipId) return; // wait until we get id
    try {
      const response = await getLatestMagazines({
      skipId: skipId,
      limit: 5,
    }); 
      setEditions(response);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not fetch latest editions.');
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  if (skipId) {
    fetchEditions();
  }
}, [skipId]); // re-run when skipId updates

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => console.log('Opening edition:', item.id)}
    >
      <Image
        source={{ uri: `${imgUrl}/${item.image}` }}
        style={styles.coverImage}
        resizeMode="contain"
      />
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#d32f2f" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>LATEST EDITIONS</Text>
      <View style={styles.underline} />

      <FlatList
        data={editions}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listPadding}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    color: '#1a2a3a',
    letterSpacing: 1,
  },
  underline: {
    height: 3,
    width: 35,
    backgroundColor: '#d32f2f',
    alignSelf: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  listPadding: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    gap:10
  },
  card: {
    width: COLUMN_WIDTH,
    // width:"50%",
    backgroundColor: '#fff',
    marginBottom: 15,
    // borderRadius: 6,
    elevation: 3,
    shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    // shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    overflow: 'hidden', // Ensures image corners respect border radius
  },
  coverImage: {
    width: '100%',
    height: 230,
  },
  dateContainer: {
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  dateText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 5,
  },
});

export default LatestEditions;
