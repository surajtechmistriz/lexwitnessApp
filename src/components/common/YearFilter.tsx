import React, { useState, useRef } from 'react';
import { Animated, ScrollView } from 'react-native';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../redux/hooks/useTheme';

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
  const { colors, isDark } = useTheme();
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
        <TouchableOpacity
          style={[
            styles.dropdownBtn,
            {
              borderColor: colors.border,
              backgroundColor: colors.card,
            },
          ]}
          onPress={toggleDropdown}
        >
          <Text style={{ color: colors.text }}>
            {selectedYear ?? 'Select Year'}
          </Text>
          <Animated.View
            style={{
              transform: [{ rotate }],
            }}
          >
            <Ionicons name="chevron-down" size={20} color={colors.text} />
          </Animated.View>
        </TouchableOpacity>

        {/* filter button */}
        <TouchableOpacity
          style={[styles.filterBtn, { backgroundColor: colors.primary }]}
          onPress={() => {
            onApply();
            setOpen(false);
          }}
        >
          <Text style={styles.filterText}>Apply</Text>
        </TouchableOpacity>
      </View>

      {/* modal dropdown */}
      <Modal visible={open} transparent animationType="fade">
        {/* overlay close */}
        <TouchableOpacity
          style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.4)' }]}
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
          <View
            style={[
              styles.dropdownBox,
              {
                backgroundColor: colors.card,
                shadowColor: isDark ? '#000' : '#000',
              },
            ]}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
            >
              {[null, ...years].map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.item, { borderBottomColor: colors.border }]}
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
                  <Text style={{ color: colors.text }}>
                    {item === null ? 'All Years' : item}
                  </Text>
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
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 50,
  },

  // filter button
  filterBtn: {
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
    justifyContent: 'center',
    paddingLeft: 15,
    paddingRight: 91,
    paddingBottom: 40,
    marginTop: -37,
  },

  // dropdown box
  dropdownBox: {
    maxHeight: 300,
    maxWidth: 240,
    marginTop: 350,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },

  // item
  item: {
    padding: 12,
    borderBottomWidth: 1,
  },
});
