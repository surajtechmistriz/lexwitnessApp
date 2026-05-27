import React, { useState, useRef } from 'react';
import { Animated, ScrollView } from 'react-native';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface YearFilterProps {
  years: number[];
  selectedYear: number | null;
  onSelect: (year: number | null) => void;
  onApply: () => void;
}

const YearFilter: React.FC<YearFilterProps> = ({
  years,
  selectedYear,
  onSelect,
  onApply,
}) => {
  const [open, setOpen] = useState(false);

  const rotateAnim = useRef(new Animated.Value(0)).current;

  const toggleDropdown = () => {
    const toValue = open ? 0 : 1;

    Animated.timing(rotateAnim, {
      toValue,
      duration: 200,
      useNativeDriver: true,
    }).start();

    setOpen(!open);
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.container}>
      {/* row layout */}
      <View style={styles.row}>
        {/* dropdown button */}
        <TouchableOpacity style={styles.dropdownBtn} onPress={toggleDropdown}>
          <Text>{selectedYear ?? 'Select Year'}</Text>
          <Animated.View
            style={{
              transform: [{ rotate }],
            }}
          >
            <Ionicons name="chevron-down" size={20} />
          </Animated.View>
        </TouchableOpacity>

        {/* filter button */}
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => {
            onApply(); // apply filter
            setOpen(false); //  close dropdown
          }}
        >
          <Text style={styles.filterText}>Apply</Text>
        </TouchableOpacity>
      </View>

      {/* modal dropdown */}
      <Modal visible={open} transparent animationType="fade">
        {/* overlay close */}
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => {
            Animated.timing(rotateAnim, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }).start();

            setOpen(false);
          }}
        >
          {/* dropdown box */}
          <View style={styles.dropdownBox}>
           <ScrollView
  showsVerticalScrollIndicator={false}
  nestedScrollEnabled
>
  {[null, ...years].map((item, index) => (
    <TouchableOpacity
      key={index}
      style={styles.item}
      onPress={() => {
        onSelect(item);

        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();

        setOpen(false);
      }}
    >
      <Text>{item === null ? 'All Years' : item}</Text>
    </TouchableOpacity>
  ))}
</ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default YearFilter;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  // row layout
  row: {
    flexDirection: 'row',
    gap: 10,
  },

  // dropdown button
  dropdownBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 50,
    borderBlockColor: 'red',
  },

  // filter button
  filterBtn: {
    backgroundColor: '#c9060a',
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },

  filterText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },

  // modal overlay
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    paddingLeft: 15,
    paddingRight: 91,
    paddingBottom: 40,
    marginTop: -37,
  },

  // dropdown box
  dropdownBox: {
    backgroundColor: '#fff',
    // borderRadius: 6,
    maxHeight: 300,
    maxWidth: 240,
    marginTop: 350,
    borderRadius: 20,
  },

  // item
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});
