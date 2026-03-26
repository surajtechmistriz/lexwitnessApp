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
import { getLatestMagazines } from "../api/home.api";
import Config from 'react-native-config';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/AppNavigator';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 40) / 2;

const imgUrl = Config.MAGAZINES_BASE_URL;

//  TYPE
type MagazineItem = {
  id: number;
  slug?: string;
  title: string;
  image?: string;
};

const LatestEditions = ({ skipId }: { skipId?: number }) => {
  const [editions, setEditions] = useState<MagazineItem[]>([]);
  const [loading, setLoading] = useState(true);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  //  FETCH
  const fetchEditions = async () => {
    if (skipId === undefined || skipId === null) return; //  FIXED

    try {
      const response = await getLatestMagazines({
        skipId,
        limit: 5,
      });

      setEditions(response || []);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not fetch latest editions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (skipId !== undefined && skipId !== null) {
      fetchEditions();
    }
  }, [skipId]);

  // RENDER ITEM
  const renderItem = ({ item }: { item: MagazineItem }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        console.log("Clicked:", item.slug, item.id);

        navigation.navigate("MagazineDetail", {
          slug: item.slug ?? String(item.id), //  SAFE
        });
      }}
    >
      <Image
        source={{
          uri: item.image
            ? `${imgUrl}/${item.image}`
            : "https://via.placeholder.com/300x400", //  fallback
        }}
        style={styles.coverImage}
        resizeMode="contain"
      />

      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  // LOADING
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
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listPadding}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("MagazinesScreen")}
      >
        <Text style={styles.buttonText}>VIEW ALL EDITIONS</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
     marginRight:2,
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
    // justifyContent: 'space-between',
    gap:10,
    
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
    height: 243,
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
 button: {
  backgroundColor: '#c9060a',
  paddingVertical: 15,
  width: 250,
  
  // This is the "Margin Auto" equivalent for a single element
  alignSelf: 'center', 
  
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 40,
},
    buttonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },

});

export default LatestEditions;
