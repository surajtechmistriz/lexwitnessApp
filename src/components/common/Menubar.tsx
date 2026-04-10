import React, { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  LayoutChangeEvent,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getMenu } from '../../services/api/category';

type MenuItem = {
  id: number;
  name: string;
  slug: string;
};

const screenWidth = Dimensions.get('window').width;

const TopMenu = ({ activeSlug }: { activeSlug?: string }) => {
  const navigation = useNavigation<any>();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const scrollRef = useRef<ScrollView>(null);
  const itemLayouts = useRef<{
    [key: string]: { x: number; width: number };
  }>({});

  const currentSlug = activeSlug || '';

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await getMenu();
        setMenuItems(data);
      } catch (error) {
        console.log('Menu fetch error:', error);
      }
    };
    fetchMenu();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToCenter(currentSlug);
    }, 100);

    return () => clearTimeout(timer);
  }, [currentSlug, menuItems]);

  const handleLayout = (slug: string, event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    itemLayouts.current[slug] = { x, width };
  };

  const scrollToCenter = (slug: string) => {
    const layout = itemLayouts.current[slug];
    if (!layout) return;

    const scrollX = layout.x - screenWidth / 2 + layout.width / 2;

    scrollRef.current?.scrollTo({
      x: scrollX,
      animated: true,
    });
  };

  const handlePress = (slug: string) => {
    navigation.navigate('CategoryScreen', { slug });
    scrollToCenter(slug);
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {menuItems.map(item => {
          const isActive = currentSlug === item.slug;

          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => handlePress(item.slug)}
              onLayout={(e) => handleLayout(item.slug, e)}
              style={[
                styles.menuItem,
                isActive && styles.activeItem,
              ]}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.menuText,
                  isActive && styles.activeText,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default TopMenu;

const styles = StyleSheet.create({
  wrapper: {
    height: 56,
    backgroundColor: '#f5f5f7', // 🔥 subtle app bg
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },

  container: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  menuItem: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginRight: 10,
    borderRadius: 18,
    backgroundColor: '#ffffff',

    // subtle depth (important!)
    borderWidth: 1,
    borderColor: '#eeeeee',
  },

  activeItem: {
    backgroundColor: '#111', // keep strong but clean
    borderColor: '#111',
  },

  menuText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#444',
  },

  activeText: {
    color: '#fff',
    fontWeight: '600',
  },
});