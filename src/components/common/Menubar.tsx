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
import { useNavigation, useRoute } from '@react-navigation/native';
import { getMenu } from '../../services/api/category';

type MenuItem = {
  id: number;
  name: string;
  slug: string;
};

const screenWidth = Dimensions.get('window').width;

const TopMenu = ({
  activeSlug,
  activeRoute,
}: {
  activeSlug?: string;
  activeRoute?: string;
}) => {
  const navigation = useNavigation<any>();
  // const route = useRoute<any>();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // Ref for ScrollView
  const scrollRef = useRef<ScrollView>(null);

  // Store layout (x position + width) of each item
  const itemLayouts = useRef<{
    [key: string]: { x: number; width: number };
  }>({});

  // Get current active slug (priority: prop > route)
 const currentSlug = activeSlug || '';

  /**
   * Fetch menu data
   */
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

  /**
   * Scroll to active item (runs on load + slug change)
   * Added delay to ensure layout is measured
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToCenter(currentSlug);
    }, 100); // small delay fixes layout timing issue

    return () => clearTimeout(timer);
  }, [currentSlug, menuItems]);

  /**
   * Save layout of each menu item
   */
  const handleLayout = (slug: string, event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    itemLayouts.current[slug] = { x, width };
  };

  /**
   * Scroll selected item to center
   */
  const scrollToCenter = (slug: string) => {
    const layout = itemLayouts.current[slug];

    if (!layout) return;

    const scrollX = layout.x - screenWidth / 2 + layout.width / 2;

    scrollRef.current?.scrollTo({
      x: scrollX,
      animated: true,
    });
  };

  /**
   * Handle menu click
   */
  const handlePress = (slug: string) => {
    navigation.navigate('CategoryScreen', { slug });

    // Scroll immediately on click (better UX)
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
        {menuItems.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={() => handlePress(item.slug)}
            onLayout={(e) => handleLayout(item.slug, e)} // track position
          >
            <Text
              style={[
                styles.menuText,
                currentSlug === item.slug && styles.activeText,
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