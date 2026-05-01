import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 2 - 20;

interface Magazine {
  id: number;
  title: string;
  image: string;
  year?: number;
}

interface MagazineListProps {
  data: Magazine[];
  loading?: boolean;
  numColumns?: number;
  onPressItem?: (item: Magazine) => void;
}

const MagazineList: React.FC<MagazineListProps> = ({
  data,
  loading = false,
  numColumns = 2,
  onPressItem,
}) => {
  const renderItem = ({ item }: { item: Magazine }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPressItem && onPressItem(item)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.readMore}>Read more</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#c9060a" style={{ marginTop: 50 }} />;
  }

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      numColumns={numColumns}
      columnWrapperStyle={{ justifyContent: 'space-between' }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );
};

export default MagazineList;

const styles = StyleSheet.create({
  card: {
    width: ITEM_WIDTH,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 4,
  },
  cardContent: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  title: {
    fontSize: 13,
    color: '#333',
  },
  readMore: {
    color: '#c9060a',
    fontWeight: '500',
    marginTop: 4,
  },
});