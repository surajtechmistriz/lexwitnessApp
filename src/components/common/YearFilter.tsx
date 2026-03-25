import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface YearFilterProps {
  years: number[];
  selectedYear: number | null;
  onSelect: (year: number | null) => void;
  onApply: () => void;
  disabled?: boolean;
}

const YearFilter: React.FC<YearFilterProps> = ({
  years,
  selectedYear,
  onSelect,
  onApply,
  disabled = false,
}) => {
  const [yearOpen, setYearOpen] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Arrow rotation animation
  const toggleDropdown = () => {
    setYearOpen(!yearOpen);
    Animated.timing(rotateAnim, {
      toValue: yearOpen ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.container}>
      {/* Dropdown */}
      <View style={styles.dropdownContainer}>
        <TouchableOpacity
          style={[styles.dropdownBtn, disabled && styles.disabledBtn]}
          onPress={toggleDropdown}
          disabled={disabled}
        >
          <Text style={styles.dropdownText}>
            {selectedYear ?? 'Select Year'}
          </Text>
          <Animated.View style={{ transform: [{ rotate }] }}>
            <Ionicons name="chevron-down" size={20} />
          </Animated.View>
        </TouchableOpacity>

        {yearOpen && (
          <ScrollView
            style={styles.dropdownList}
            nestedScrollEnabled
            showsVerticalScrollIndicator={true}
          >
            <TouchableOpacity
              onPress={() => {
                onSelect(null);
                setYearOpen(false);
              }}
              style={styles.dropdownItem}
            >
              <Text>All Years</Text>
            </TouchableOpacity>

            {years.map((year) => (
              <TouchableOpacity
                key={year}
                onPress={() => {
                  onSelect(year);
                  setYearOpen(false);
                }}
                style={styles.dropdownItem}
              >
                <Text>{year}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Filter Button */}
      <TouchableOpacity
        style={[styles.filterBtn, disabled && styles.disabledBtn]}
        onPress={onApply}
        disabled={disabled}
      >
        <Text style={styles.filterText}>Filter</Text>
      </TouchableOpacity>
    </View>
  );
};

export default YearFilter;

const styles = StyleSheet.create({
container: {
  flexDirection: 'column',
  gap: 10,
  marginVertical: 10,
},
dropdownContainer: {
  position: 'relative',
  width: '100%',
   // 🔥 important
},
  dropdownBtn: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    marginLeft: 5,
  },
  dropdownList: {
    position: 'absolute',
    top: 38,
    width: '100%',
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    zIndex: 100,
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
 filterBtn: {
  backgroundColor: '#c9060a',
  paddingVertical: 12,
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%', // 🔥 important
},

  filterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  disabledBtn: {
    opacity: 0.5,
  },
});