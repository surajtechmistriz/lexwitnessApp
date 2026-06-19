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
import { useTheme } from '../../../redux/useTheme';

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
  const { colors } = useTheme();

  const renderItem = ({ item }: { item: Magazine }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }]}
      onPress={() => onPressItem && onPressItem(item)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
        <Text style={[styles.readMore, { color: colors.primary }]}>Read more</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />;
  }

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      numColumns={numColumns}
      columnWrapperStyle={styles.columnWrapper}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    />
  );
};

export default MagazineList;

const styles = StyleSheet.create({
  card: {
    width: ITEM_WIDTH,
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
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
  },
  readMore: {
    fontWeight: '500',
    marginTop: 4,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  contentContainer: {
    paddingBottom: 20,
  },
});