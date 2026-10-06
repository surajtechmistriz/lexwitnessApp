import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Animated,
  ScrollView,
  Dimensions,
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Config from 'react-native-config';
import { useTheme } from '../../store/hooks/useTheme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ---------- Types ----------

export interface FilterState {
  [key: string]: any;
}

export interface BannerProps {
  title: string;
  showFilter?: boolean;
  showBackButton?: boolean;
  onBackPress?: () => void;
  /** Called when user taps the filter button. If provided, Banner will NOT open its own modal — the parent handles it. */
  onFilterPress?: () => void;
  /** Optional: override the internal modal entirely */
  renderFilter?: (
    close: () => void,
    onApply: (filters: FilterState) => void,
    onReset: () => void,
  ) => React.ReactNode;
  onFilterApply?: (filters: FilterState) => void;
  initialFilters?: FilterState;
  useRedBackground?: boolean;
}

// ---------- Component ----------

export default function Banner({
  title,
  showFilter = true,
  showBackButton = false,
  onBackPress,
  onFilterPress,
  renderFilter,
  onFilterApply,
  initialFilters = {},
  useRedBackground = true,
}: BannerProps) {
  const { colors } = useTheme();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(initialFilters);
  const [tempFilters, setTempFilters] = useState<FilterState>(initialFilters);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const imageUrl = Config.BANNER_BASE_URL;

  const hasActiveFilters = useMemo(
    () => Object.keys(appliedFilters).length > 0,
    [appliedFilters],
  );

  // ---------- Animations ----------

  const animateButton = useCallback(() => {
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
  }, [scaleAnim]);

  const openModal = useCallback(() => {
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
  }, [appliedFilters, fadeAnim, slideAnim]);

  const closeModal = useCallback(() => {
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
    ]).start(() => setIsFilterOpen(false));
  }, [fadeAnim, slideAnim]);

  // ---------- Handlers ----------

  const handleFilterPress = useCallback(() => {
    animateButton();
    // If parent controls filtering, delegate and bail out.
    if (onFilterPress) {
      onFilterPress();
      return;
    }
    // Otherwise use built-in modal (only if renderFilter was supplied).
    if (renderFilter) {
      openModal();
    }
  }, [animateButton, onFilterPress, openModal, renderFilter]);

  const handleReset = useCallback(() => {
    setTempFilters({});
  }, []);

  const handleApply = useCallback(
    (filters: FilterState) => {
      setAppliedFilters(filters);
      onFilterApply?.(filters);
    },
    [onFilterApply],
  );

  const handleBackPress = useCallback(() => {
    onBackPress?.();
  }, [onBackPress]);

  // ---------- Render helpers ----------

  const renderBackButton = () =>
    showBackButton ? (
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBackPress}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="arrow-back" size={22} color="#fff" />
      </TouchableOpacity>
    ) : null;

  const renderTitle = () => (
    <View style={[styles.titleWrapper, showBackButton && styles.titleWrapperWithBack]}>
      <Text
        style={[styles.mainTitle, title === 'Magazines' && styles.magazineTitle]}
        numberOfLines={1}
      >
        {title?.toUpperCase() || ''}
      </Text>
      {hasActiveFilters && <View style={styles.activeIndicator} />}
    </View>
  );

  const renderFilterButton = () => {
    if (!showFilter) return null;

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

  const renderContent = () => (
    <View style={styles.content}>
      {renderBackButton()}
      {renderTitle()}
      {renderFilterButton()}
    </View>
  );

  const renderBannerContent = () => {
    if (useRedBackground) {
      return (
        <View style={[styles.bannerContainer, styles.redBackground]}>
          <View style={styles.overlay}>{renderContent()}</View>
        </View>
      );
    }
    return (
      <ImageBackground
        source={{ uri: imageUrl }}
        style={styles.bannerContainer}
        resizeMode="cover"
      >
        <View style={styles.overlay}>{renderContent()}</View>
      </ImageBackground>
    );
  };

  // ---------- Main render ----------

  return (
    <>
      <View style={styles.outerContainer}>{renderBannerContent()}</View>

      {/* Built-in modal — only used when parent does NOT pass onFilterPress */}
      {renderFilter && (
        <Modal
          visible={isFilterOpen}
          transparent
          animationType="none"
          onRequestClose={closeModal}
          statusBarTranslucent
        >
          <View style={styles.modalContainer}>
            <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
              <TouchableOpacity
                style={styles.backdropTouchable}
                activeOpacity={1}
                onPress={closeModal}
              />
            </Animated.View>

            <Animated.View
              style={[styles.bottomSheet, { transform: [{ translateY: slideAnim }] }]}
            >
              <SafeAreaView style={styles.safeArea}>
                <View
                  style={[styles.dragHandleContainer, { backgroundColor: colors.card }]}
                >
                  <View
                    style={[styles.dragHandle, { backgroundColor: colors.border }]}
                  />
                </View>

                <View
                  style={[
                    styles.filterHeader,
                    { backgroundColor: colors.card, borderBottomColor: colors.border },
                  ]}
                >
                  <Text style={[styles.filterHeaderTitle, { color: colors.text }]}>
                    Filter
                  </Text>
                  <TouchableOpacity
                    onPress={closeModal}
                    style={[styles.closeButton, { backgroundColor: colors.background }]}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="close" size={24} color={colors.text} />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  style={[styles.filterContent, { backgroundColor: colors.card }]}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={[
                    styles.filterContentContainer,
                    { backgroundColor: colors.card },
                  ]}
                >
                  {renderFilter(
                    closeModal,
                    (filters: FilterState) => {
                      setTempFilters(filters);
                      handleApply(filters);
                    },
                    handleReset,
                  )}
                </ScrollView>
              </SafeAreaView>
            </Animated.View>
          </View>
        </Modal>
      )}
    </>
  );
}

// ---------- Styles ----------

const styles = StyleSheet.create({
  outerContainer: {
    zIndex: 1000,
    elevation: 10,
  },
  bannerContainer: {
    width: '100%',
    height: Math.max(65, SCREEN_HEIGHT * 0.08),
  },
  redBackground: {
    backgroundColor: '#c9060a',
  },
  overlay: {
    flex: 1,
    backgroundColor: '#c9060a',
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
    alignItems: 'center',
    justifyContent: 'center',
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
    color: '#fff',
    fontSize: Math.min(20, SCREEN_WIDTH * 0.045),
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  magazineTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
    marginLeft: 10,
  },
  activeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4caf50',
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
    fontSize: 12,
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
    ...StyleSheet.absoluteFillObject,
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
    maxHeight: SCREEN_HEIGHT * 0.25,
  },
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
    fontSize: 18,
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
});