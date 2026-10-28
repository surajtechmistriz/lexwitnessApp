import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
  Animated,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../store/hooks/useTheme';

// ---------- Types ----------

export interface YearFilterProps {
  years: number[];
  selectedYear: number | null;
  onSelect: (year: number | null) => void;
  onApply: () => void;
  /** When true, renders without outer card spacing so it fits inside a modal */
  inModal?: boolean;
  /** Disables all interactions */
  disabled?: boolean;
}

// ---------- Component ----------

const YearFilter: React.FC<YearFilterProps> = ({
  years,
  selectedYear,
  onSelect,
  onApply,
  inModal = false,
  disabled = false,
}) => {
  const { colors, isDark } = useTheme();
  const [open, setOpen] = useState(false);

  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Dedupe + sort descending (newest year first)
  const sortedYears = useMemo(
    () => Array.from(new Set(years)).sort((a, b) => b - a),
    [years],
  );

  const closeDropdown = useCallback(() => {
    Animated.timing(rotateAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setOpen(false);
  }, [rotateAnim]);

  const toggleDropdown = useCallback(() => {
    if (disabled) return;
    const toValue = open ? 0 : 1;

    Animated.timing(rotateAnim, {
      toValue,
      duration: 200,
      useNativeDriver: true,
    }).start();

    setOpen(prev => !prev);
  }, [disabled, open, rotateAnim]);

  const handleSelect = useCallback(
    (year: number | null) => {
      onSelect(year);
      closeDropdown();
    },
    [onSelect, closeDropdown],
  );

  const handleApply = useCallback(() => {
    if (disabled) return;
    onApply();
    closeDropdown();
  }, [disabled, onApply, closeDropdown]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={[styles.container, inModal && styles.containerInModal]}>
      {/* Row layout */}
      <View style={styles.row}>
        {/* Dropdown button */}
        <TouchableOpacity
          style={[
            styles.dropdownBtn,
            {
              borderColor: colors.border,
              backgroundColor: colors.card,
              opacity: disabled ? 0.5 : 1,
            },
          ]}
          onPress={toggleDropdown}
          disabled={disabled}
          activeOpacity={0.8}
        >
          <Text style={{ color: colors.text }}>
            {selectedYear ?? 'Select Year'}
          </Text>
          <Animated.View style={{ transform: [{ rotate }] }}>
            <Ionicons name="chevron-down" size={20} color={colors.text} />
          </Animated.View>
        </TouchableOpacity>

        {/* Apply button */}
        <TouchableOpacity
          style={[
            styles.filterBtn,
            {
              backgroundColor: colors.primary,
              opacity: disabled ? 0.5 : 1,
            },
          ]}
          onPress={handleApply}
          disabled={disabled}
          activeOpacity={0.8}
        >
          <Text style={styles.filterText}>Apply</Text>
        </TouchableOpacity>
      </View>

      {/* Dropdown modal */}
      <Modal
        visible={open}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={closeDropdown}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={closeDropdown}
        >
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
              {[null, ...sortedYears].map((item, index) => {
                const isSelected = selectedYear === item;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.item,
                      { borderBottomColor: colors.border },
                      isSelected && {
                        backgroundColor: colors.background,
                      },
                    ]}
                    onPress={() => handleSelect(item)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={{
                        color: isSelected ? colors.primary : colors.text,
                        fontWeight: isSelected ? '700' : '400',
                      }}
                    >
                      {item === null ? 'All Years' : item}
                    </Text>
                    {isSelected && (
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color={colors.primary}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default YearFilter;

// ---------- Styles ----------

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  containerInModal: {
    // Extra padding so the dropdown isn't flush against modal edges
    paddingHorizontal: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  dropdownBtn: {
    flex: 1,
    height: 46,
    borderWidth: 1,
    paddingHorizontal: 14,
    minHeight: 46,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 14,
  },
  filterBtn: {
    height: 46,
    paddingHorizontal: 18,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  dropdownBox: {
    width: '100%',
    maxWidth: 360,
    maxHeight: '60%',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  item: {
    height: 46,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
