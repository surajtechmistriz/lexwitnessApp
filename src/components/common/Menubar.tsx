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

  // ---------------- FETCH MENU ----------------
  const fetchMenu = useCallback(async () => {
    try {
      setLoading(true);

      // 1️⃣ LOAD CACHE FIRST (IMPORTANT FIX)
      const cached = await getCache(CACHE_KEY);

      if (cached?.data?.length) {
        setMenuItems(cached.data);
        setLoading(false);
      }

      // 2️⃣ CALL API
      const data = await getMenu();

      if (data?.length) {
        setMenuItems(data);

        // 3️⃣ SAVE CACHE PROPERLY
        await setCache(CACHE_KEY, data);
      }
    } catch (error) {
      console.log('Menu error:', error);

      // 4️⃣ FALLBACK CACHE
      const cached = await getCache(CACHE_KEY);
      if (cached?.data?.length) {
        setMenuItems(cached.data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // ---------------- RELOAD ON SCREEN FOCUS ----------------
  useFocusEffect(
    useCallback(() => {
      fetchMenu();
    }, [fetchMenu]),
  );

  // ---------------- AUTO SCROLL ACTIVE ITEM ----------------
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToCenter(currentSlug);
    }, 100);

    return () => clearTimeout(timer);
  }, [currentSlug, menuItems]);

  // ---------------- LAYOUT STORE ----------------
  const handleLayout = (slug: string, event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    itemLayouts.current[slug] = { x, width };
  };

  // ---------------- CENTER SCROLL ----------------
  const scrollToCenter = (slug: string) => {
    const layout = itemLayouts.current[slug];
    if (!layout) return;

    const scrollX = layout.x - screenWidth / 2 + layout.width / 2;

    scrollRef.current?.scrollTo({
      x: scrollX,
      animated: true,
    });
  };

  // ---------------- NAVIGATION ----------------
  const handlePress = (slug: string) => {
    navigation.navigate('Category', { slug });
    scrollToCenter(slug);
  };

  // ---------------- UI ----------------
  return (
    <View style={styles.wrapper}>
      {loading && menuItems.length === 0 ? (
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

// ---------------- STYLES (UNCHANGED) ----------------
const styles = StyleSheet.create({
  wrapper: {
    height: 56,
    backgroundColor: '#f5f5f7',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },

  container: {
    alignItems: 'center',
    paddingRight: 12,
  },

  menuItem: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginRight: 10,
    borderRadius: 18,
    backgroundColor: '#ffffff',
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

// ---------------- SKELETON ----------------
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