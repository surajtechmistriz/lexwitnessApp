import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getMenu } from '../../services/api/category';

type MenuItem = {
  id: number;
  name: string;
  slug: string;
};

const TopMenu = ({ activeSlug }: { activeSlug?: string }) => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // ✅ FIX: use prop first, fallback to route
  const currentSlug = activeSlug || route.params?.slug || '';

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await getMenu();
        setMenuItems(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMenu();
  }, []);

  const handlePress = (slug: string) => {
    navigation.navigate('CategoryScreen', { slug });
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {menuItems.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={() => handlePress(item.slug)}
          >
            <Text
              style={[
                styles.menuText,
                currentSlug === item.slug && styles.activeText, // ✅ FIXED
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default TopMenu;

const styles = StyleSheet.create({
  wrapper: {
    height: 50,
    backgroundColor: '#f0efeff0',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  activeText: {
    color: 'red',
    fontWeight: 'bold',
  },
  container: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  menuItem: {
    marginRight: 20,
  },
  menuText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
});