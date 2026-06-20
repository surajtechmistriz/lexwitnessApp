import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Animated,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Config from 'react-native-config';
import { Modal } from 'react-native';
import { useTheme } from '../../redux/hooks/useTheme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Type definitions
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
  useRedBackground?: boolean;
}

/**
 * Banner Component
 * A reusable header banner with optional filter functionality
 * Supports both red background and image background variants
 */
export default function Banner({
  title,
  renderFilter,
  showFilter = true,
  onFilterApply,
  initialFilters = {},
  showBackButton = false,
  onBackPress,
  useRedBackground = true,
}: BannerProps) {
  // Theme and state management
  const { colors } = useTheme();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(initialFilters);
  const [tempFilters, setTempFilters] = useState<FilterState>(initialFilters);

  // Animation references
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Helper functions
  const capitalizeAll = (str: string) => str?.toUpperCase() || '';
  const imageUrl = Config.BANNER_BASE_URL;

  // Check if any filters are active
  const hasActiveFilters = Object.keys(appliedFilters).length > 0;

  //------ Animate the filter button with a spring effect------
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

  //------ Open the filter modal with animations------
  const handleFilterPress = () => {
    animateButton();
    setTempFilters({ ...appliedFilters });
    setIsFilterOpen(true);
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        damping: 30,
        stiffness: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  //------ Close the filter modal with animations------
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



  //------ Reset filters within the modal------
  const handleResetInModal = () => {
    setTempFilters({});
  };

  //------ Handle back button press------
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    }
  };

  //------ Render filter button with active state indicators------
  const renderFilterButton = () => {
    // Only render if showFilter is true
    if (!showFilter) {
      return null;
    }

    return (
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
    );
  };

  //------ Render back button------
  const renderBackButton = () => {
    if (!showBackButton) {
      return null;
    }

    return (
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBackPress}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={22} color="#fff" />
      </TouchableOpacity>
    );
  };

  //------ Render title with active indicator------
  const renderTitle = () => (
    <View style={[
      styles.titleWrapper,
      showBackButton && styles.titleWrapperWithBack
    ]}>
      <Text style={styles.mainTitle} numberOfLines={1}>
        {capitalizeAll(title)}
      </Text>
      {hasActiveFilters && <View style={styles.activeIndicator} />}
    </View>
  );

  // ------ Render main content area------
  const renderContent = () => (
    <View style={styles.content}>
      {renderBackButton()}
      {renderTitle()}
      {renderFilterButton()}
    </View>
  );

//-----  Render banner with either red background or image background ------
  const renderBannerContent = () => {
    if (useRedBackground) {
      return (
        <View style={[styles.bannerContainer, styles.redBackground]}>
          <View style={styles.overlay}>
            {renderContent()}
          </View>
        </View>
      );
    }

    return (
      <ImageBackground
        source={{ uri: imageUrl }}
        style={styles.bannerContainer}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          {renderContent()}
        </View>
      </ImageBackground>
    );
  };

  return (
    <>
      <View style={styles.outerContainer}>
        {renderBannerContent()}
      </View>

      {/* Filter Modal */}
      <Modal
        visible={isFilterOpen}
        transparent={true}
        animationType="none"
        onRequestClose={handleCloseFilter}
        statusBarTranslucent={true}
      >
        <View style={styles.modalContainer}>
          {/* Backdrop */}
          <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
            <TouchableOpacity
              style={styles.backdropTouchable}
              activeOpacity={1}
              onPress={handleCloseFilter}
            />
          </Animated.View>

          {/* Bottom Sheet */}
          <Animated.View
            style={[
              styles.bottomSheet,
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            <SafeAreaView style={styles.safeArea}>
              {/* Drag Handle */}
              <View style={[styles.dragHandleContainer, { backgroundColor: colors.card }]}>
                <View style={[styles.dragHandle, { backgroundColor: colors.border }]} />
              </View>

              {/* Modal Header */}
              <View style={[styles.filterHeader, { 
                backgroundColor: colors.card,
                borderBottomColor: colors.border 
              }]}>
                <Text style={[styles.filterHeaderTitle, { color: colors.text }]}>
                  Filter
                </Text>
                <TouchableOpacity
                  onPress={handleCloseFilter}
                  style={[styles.closeButton, { backgroundColor: colors.background }]}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              {/* Filter Content */}
              <ScrollView
                style={[styles.filterContent, { backgroundColor: colors.card }]}
                showsVerticalScrollIndicator={false}
                bounces={true}
                contentContainerStyle={[styles.filterContentContainer, { backgroundColor: colors.card }]}
              >
                {renderFilter ? (
                  renderFilter(
                    handleCloseFilter,
                    (filters: FilterState) => {
                      setTempFilters(filters);
                    },
                    handleResetInModal,
                  )
                ) : (
                  <View style={styles.defaultFilter}>
                    <Text style={[styles.defaultFilterText, { color: colors.textMuted }]}>
                      No filter options available
                    </Text>
                  </View>
                )}
              </ScrollView>

              {/* Filter Action Buttons - Currently disabled */}
              {renderFilter && (
                <View style={[styles.filterActions, { 
                  backgroundColor: colors.card,
                  borderTopColor: colors.border 
                }]}>
                  {/* Action buttons commented out for future implementation */}
                </View>
              )}
            </SafeAreaView>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  // Container styles
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
  
  // Overlay and content styles
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  
  // Back button styles
  backButton: {
    width: 36,
    height: 36,
    // borderRadius: 18,
    // backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1,
    // borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  
  // Title styles
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
    backgroundColor: '#4caf50',
    marginLeft: 8,
  },
  
  // Filter button styles
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
  
  // Active badge styles
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
  
  // Modal styles
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backdropTouchable: {
    flex: 1,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 25,
    maxHeight: SCREEN_HEIGHT * 0.9,
  },
  
  // Modal content styles
  safeArea: {
    flex: 1,
  },
  dragHandleContainer: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  filterHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
  
  // Filter action buttons (currently disabled)
  filterActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
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
  
  // Default/fallback styles
  defaultFilter: {
    padding: 20,
    alignItems: 'center',
  },
  defaultFilterText: {
    fontSize: 14,
  },
});