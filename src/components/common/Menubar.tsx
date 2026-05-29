import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  LayoutChangeEvent,
  Dimensions,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { getMenu } from '../../services/api/category';
import { getCache, setCache } from '../../utils/cache';

type MenuItem = {
  id: number;
  name: string;
  slug: string;
};

const screenWidth = Dimensions.get('window').width;
const CACHE_KEY = 'TOP_MENU';

const TopMenu = ({ activeSlug }: { activeSlug?: string }) => {
  const navigation = useNavigation<any>();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const scrollRef = useRef<ScrollView>(null);
  const itemLayouts = useRef<{ [key: string]: { x: number; width: number } }>({});

  const currentSlug = activeSlug || '';

  const fetchMenu = useCallback(async () => {
    try {
      setLoading(true);

      // 1️⃣ ALWAYS LOAD CACHE FIRST
      const cached = await getCache(CACHE_KEY);

      if (cached?.length) {
        setMenuItems(cached);
        setLoading(false);
      }

      // 2️⃣ TRY API
      const data = await getMenu();

      if (data?.length) {
        setMenuItems(data);
        await setCache(CACHE_KEY, data);
      }

    } catch (error) {
      console.log('Menu error:', error);

      // 3️⃣ FALLBACK: keep cache if API fails
      const cached = await getCache(CACHE_KEY);
      if (cached?.length) {
        setMenuItems(cached);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔥 IMPORTANT: reload when screen comes back
  useFocusEffect(
    useCallback(() => {
      fetchMenu();
    }, [fetchMenu]),
  );

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
    navigation.navigate('Category', { slug });
    scrollToCenter(slug);
  };

  return (
    <View style={styles.wrapper}>
      {loading ? (
        <MenuSkeleton />
      ) : (
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
                onLayout={e => handleLayout(item.slug, e)}
                style={[styles.menuItem, isActive && styles.activeItem]}
              >
                <Text style={[styles.menuText, isActive && styles.activeText]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

export default TopMenu;

const styles = StyleSheet.create({
  wrapper: {
    height: 56,
    backgroundColor: '#f5f5f7', //  subtle app bg
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
    backgroundColor: '#fff',
    borderColor: '#c9060a',
    borderWidth: 1.5,
  },

  menuText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#444',
  },

  activeText: {
    color: '#c9060a',
    fontWeight: '600',
  },
  skeletonItem: {
  width: 80,
  height: 28,
  borderRadius: 18,
  backgroundColor: '#e5e7eb',
  marginRight: 10,
},
});


const MenuSkeleton = () => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <View key={index} style={styles.skeletonItem} />
      ))}
    </ScrollView>
  );
};