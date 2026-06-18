import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Animated,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Config from 'react-native-config';
import { Modal } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface FilterState {
  [key: string]: any;
}

interface BannerProps {
  title: string;
  renderFilter?: (
    close: () => void,
    onApply: (filters: FilterState) => void,
    onReset: () => void,
  ) => React.ReactNode;
  onToggleFilter?: (open: boolean) => void;
  showFilter?: boolean;
  onFilterApply?: (filters: FilterState) => void;
  initialFilters?: FilterState;
  showBackButton?: boolean;
  onBackPress?: () => void;
  useRedBackground?: boolean; // NEW: Option to use red background
}

export default function Banner({
  title,
  renderFilter,
  showFilter = true,
  onFilterApply,
  initialFilters = {},
  showBackButton = false,
  onBackPress,
  useRedBackground = true, // Default to true for red background
}: BannerProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterActive, setFilterActive] = useState(false);
  const [appliedFilters, setAppliedFilters] =
    useState<FilterState>(initialFilters);
  const [tempFilters, setTempFilters] = useState<FilterState>(initialFilters);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const capitalizeAll = (str: string) => str?.toUpperCase() || '';
  const imageUrl = Config.BANNER_BASE_URL;

  // Check if any filters are active
  const hasActiveFilters = Object.keys(appliedFilters).length > 0;

  const animateButton = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleFilterPress = () => {
    animateButton();
    setTempFilters({ ...appliedFilters });
    setIsFilterOpen(true);
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        damping: 20,
        stiffness: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleCloseFilter = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsFilterOpen(false);
    });
  };

  const handleApplyFilters = () => {
    setAppliedFilters(tempFilters);
    setFilterActive(Object.keys(tempFilters).length > 0);
    onFilterApply?.(tempFilters);
    handleCloseFilter();
  };

  const handleResetFilters = () => {
    setTempFilters({});
    setAppliedFilters({});
    setFilterActive(false);
    onFilterApply?.({});
  };

  const handleResetInModal = () => {
    setTempFilters({});
  };

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    }
  };

  // Render content with red background or image background
  const renderBannerContent = () => {
    if (useRedBackground) {
      return (
        <View style={[styles.bannerContainer, styles.redBackground]}>
          <View style={styles.overlay}>
            <View style={styles.content}>
              {/* Back Button - Conditionally rendered */}
              {showBackButton && (
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={handleBackPress}
                  activeOpacity={0.7}
                >
                  <Ionicons name="arrow-back" size={22} color="#fff" />
                </TouchableOpacity>
              )}

              <View style={[
                styles.titleWrapper,
                showBackButton && styles.titleWrapperWithBack
              ]}>
                <Text style={styles.mainTitle} numberOfLines={1}>
                  {capitalizeAll(title)}
                </Text>
                {hasActiveFilters && <View style={styles.activeIndicator} />}
              </View>

              {showFilter && (
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                  <TouchableOpacity
                    style={[
                      styles.filterIconButton,
                      isFilterOpen && styles.filterIconButtonActive,
                      hasActiveFilters && styles.filterIconButtonWithActive,
                    ]}
                    onPress={handleFilterPress}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={isFilterOpen ? 'close' : 'options-outline'}
                      size={18}
                      color="#fff"
                    />
                    <Text style={styles.filterLabel}>
                      {isFilterOpen ? 'Close' : 'Filter'}
                    </Text>
                    {hasActiveFilters && !isFilterOpen && (
                      <View style={styles.activeBadge}>
                        <Text style={styles.activeBadgeText}>
                          {Object.keys(appliedFilters).length}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              )}
            </View>
          </View>
        </View>
      );
    }

    // Original image background
    return (
      <ImageBackground
        source={{ uri: imageUrl }}
        style={styles.bannerContainer}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
            {/* Back Button - Conditionally rendered */}
            {showBackButton && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBackPress}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={22} color="#fff" />
              </TouchableOpacity>
            )}

            <View style={[
              styles.titleWrapper,
              showBackButton && styles.titleWrapperWithBack
            ]}>
              <Text style={styles.mainTitle} numberOfLines={1}>
                {capitalizeAll(title)}
              </Text>
              {hasActiveFilters && <View style={styles.activeIndicator} />}
            </View>

            {showFilter && (
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <TouchableOpacity
                  style={[
                    styles.filterIconButton,
                    isFilterOpen && styles.filterIconButtonActive,
                    hasActiveFilters && styles.filterIconButtonWithActive,
                  ]}
                  onPress={handleFilterPress}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={isFilterOpen ? 'close' : 'options-outline'}
                    size={18}
                    color="#fff"
                  />
                  <Text style={styles.filterLabel}>
                    {isFilterOpen ? 'Close' : 'Filter'}
                  </Text>
                  {hasActiveFilters && !isFilterOpen && (
                    <View style={styles.activeBadge}>
                      <Text style={styles.activeBadgeText}>
                        {Object.keys(appliedFilters).length}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
        </View>
      </ImageBackground>
    );
  };

  return (
    <>
      <View style={styles.outerContainer}>
        {renderBannerContent()}
      </View>

      <Modal
        visible={isFilterOpen}
        transparent={true}
        animationType="none"
        onRequestClose={handleCloseFilter}
        statusBarTranslucent={true}
      >
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
            <TouchableOpacity
              style={styles.backdropTouchable}
              activeOpacity={1}
              onPress={handleCloseFilter}
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.bottomSheet,
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            <SafeAreaView style={styles.safeArea}>
              <View style={styles.dragHandleContainer}>
                <View style={styles.dragHandle} />
              </View>

              <View style={styles.filterHeader}>
                <Text style={styles.filterHeaderTitle}>Filter</Text>
                <TouchableOpacity
                  onPress={handleCloseFilter}
                  style={styles.closeButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.filterContent}
                showsVerticalScrollIndicator={false}
                bounces={true}
                contentContainerStyle={styles.filterContentContainer}
              >
                {renderFilter ? (
                  renderFilter(
                    handleCloseFilter,
                    (filters: FilterState) => {
                      setTempFilters(filters);
                    },
                    () => {
                      setTempFilters({});
                    },
                  )
                ) : (
                  <View style={styles.defaultFilter}>
                    <Text style={styles.defaultFilterText}>
                      No filter options available
                    </Text>
                  </View>
                )}
              </ScrollView>

              {/* Action buttons */}
              {/* {renderFilter && (
                <View style={styles.filterActions}>
                  <TouchableOpacity 
                    style={styles.resetButton}
                    onPress={handleResetInModal}
                  >
                    <Text style={styles.resetButtonText}>Reset All</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.applyButton}
                    onPress={handleApplyFilters}
                  >
                    <Text style={styles.applyButtonText}>Apply Filters</Text>
                  </TouchableOpacity>
                </View>
              )} */}
            </SafeAreaView>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    zIndex: 1000,
    elevation: 10,
  },
  bannerContainer: {
    width: '100%',
    height: 65,
  },
  redBackground: {
    backgroundColor: '#c9060a',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Lighter overlay for red background
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  titleWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  titleWrapperWithBack: {
    marginLeft: 0,
  },
  mainTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  activeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#c9060a',
    marginLeft: 8,
  },
  filterIconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  filterIconButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  filterIconButtonWithActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  filterLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  activeBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#c9060a',
    borderRadius: 12,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    paddingHorizontal: 4,
  },
  activeBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backdropTouchable: {
    flex: 1,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 25,
    maxHeight: SCREEN_HEIGHT * 0.9,
  },
  safeArea: {
    flex: 1,
  },
  dragHandleContainer: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  filterHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContent: {
    flex: 1,
  },
  filterContentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
  },
  filterActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#fff',
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#c9060a',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#c9060a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  defaultFilter: {
    padding: 20,
    alignItems: 'center',
  },
  defaultFilterText: {
    fontSize: 14,
    color: '#999',
  },
});