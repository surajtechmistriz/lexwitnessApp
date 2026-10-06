import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  LayoutChangeEvent,
  useWindowDimensions,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// import { getMenu } from '../../services/api/category';
import { getCache, setCache } from '../../utils/cache';
import { useTheme } from '../../store/hooks/useTheme';
import { getMenu } from '../../services/category.service';

type MenuItem = {
  id: number;
  name: string;
  slug: string;
};

const CACHE_KEY = 'TOP_MENU';

const TopMenu = ({ activeSlug }: { activeSlug?: string }) => {
  const navigation = useNavigation<any>();
  const { colors, isDark } = useTheme();

  const { width: screenWidth } = useWindowDimensions();
  const menuHeight = screenWidth >= 768 ? 60 : 45;

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const scrollRef = useRef<ScrollView>(null);
  const itemLayouts = useRef<{ [key: string]: { x: number; width: number } }>(
    {},
  );

  const currentSlug = activeSlug || '';

  // ---------------- FETCH MENU ----------------
  const fetchMenu = useCallback(async () => {
    try {
      setLoading(true);

      // LOAD CACHE FIRST
      const cached = await getCache(CACHE_KEY);

      if (cached?.data?.length) {
        setMenuItems(cached.data);
        setLoading(false);
      }

      // CALL API
      const data = await getMenu();

      if (data?.length) {
        setMenuItems(data);

        // SAVE CACHE PROPERLY
        await setCache(CACHE_KEY, data);
      }
    } catch (error) {
      console.log('Menu error:', error);

      // FALLBACK CACHE
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

  // ---------------- CENTER SCROLL ----------------
  const scrollToCenter = useCallback(
    (slug: string) => {
      if (!slug) return;

      const layout = itemLayouts.current[slug];
      if (!layout) return;

      const scrollX = layout.x - screenWidth / 2 + layout.width / 2;

      scrollRef.current?.scrollTo({
        x: Math.max(0, scrollX),
        animated: true,
      });
    },
    [screenWidth],
  );

  // ---------------- AUTO SCROLL ACTIVE ITEM ----------------
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToCenter(currentSlug);
    }, 200);

    return () => clearTimeout(timer);
  }, [currentSlug, menuItems, scrollToCenter]);

  // ---------------- LAYOUT STORE ----------------
  const handleLayout = (slug: string, event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    itemLayouts.current[slug] = { x, width };
  };

  // ------ FIXED NAVIGATION ------
  const handlePress = (slug: string) => {
    navigation.navigate('Category', { slug });
    scrollToCenter(slug);
  };

  // ---------------- UI ----------------
  return (
    <View
      style={[
        styles.wrapper,
        {
          height: menuHeight,
        },
        {
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
        },
      ]}
    >
      {loading && menuItems.length === 0 ? (
        <MenuSkeleton isDark={isDark} />
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
                style={[
                  styles.menuItem,
                  {
                    paddingHorizontal: screenWidth >= 768 ? 18 : 14,
                    minWidth: screenWidth >= 768 ? 80 : 60,
                    backgroundColor: isActive ? colors.card : colors.card,
                    borderColor: isActive ? colors.primary : colors.border,
                  },
                  isActive && styles.activeItem,
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.menuText,
                    {
                      fontSize: screenWidth >= 768 ? 15 : 11,
                    },
                    {
                      color: isActive ? colors.primary : colors.textSecondary,
                    },
                    isActive && styles.activeText,
                  ]}
                >
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

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    borderBottomWidth: 1,
  },

  container: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  menuItem: {
    paddingVertical: 7,
    marginRight: 10,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
  },

  menuText: {
    fontWeight: '500',
  },

  activeItem: {
    borderWidth: 1.5,
  },

  activeText: {
    fontWeight: '600' as const,
  },

  skeletonItem: {
    width: 80,
    height: 28,
    borderRadius: 18,
    marginRight: 10,
  },
});

// ---------------- SKELETON ----------------
const MenuSkeleton = ({ isDark }: { isDark: boolean }) => {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.skeletonItem,
            { backgroundColor: isDark ? colors.border : '#e5e7eb' },
          ]}
        />
      ))}
    </ScrollView>
  );
};
