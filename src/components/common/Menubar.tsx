import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { getMenu } from '../../services/api/menubar';
type MenuItem = {
  id: number;
  name: string;
};
const TopMenu = () => {
  const [active, setActive] = React.useState(0);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await getMenu();
        setMenuItems(data); // store API data
      } catch (error) {
        console.log(error);
      } finally {
        // setLoading(false);
      }
    };

    fetchMenu();
  }, []);


  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.container}
      >
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={() => setActive(index)}
          >
            <Text
              style={[styles.menuText, active === index && styles.activeText]}
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
  // full bar container
  wrapper: {
    height: 50,
    backgroundColor: '#f0efeff0',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderTopWidth: 2,
    borderTopColor: '#ddd',
    borderBottomColor: '#ddd',
  },
  activeText: {
    color: 'red',
    //   borderBottomWidth: 2,
    //   borderBottomColor: "blue",
  },

  // scroll container
  container: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  // menu item (flat style, not pill)
  menuItem: {
    marginRight: 20,
  },

  // text like tab bar
  menuText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
});
