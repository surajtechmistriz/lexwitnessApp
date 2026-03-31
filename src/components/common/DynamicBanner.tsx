import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Config from 'react-native-config';
import { Modal } from 'react-native';

interface BannerProps {
  title: string;
 renderFilter?: (close: () => void) => React.ReactNode;
  onToggleFilter?: (open: boolean) => void;
  showFilter?: boolean;
}

export default function Banner({ title, renderFilter, showFilter = true }: BannerProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const capitalizeAll = (str: string) => str?.toUpperCase() || '';
  const imageUrl = Config.BANNER_BASE_URL;

  return (
    <View style={styles.outerContainer}>
      <ImageBackground
        source={{ uri: imageUrl }}
        style={styles.bannerContainer}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
            {/* TITLE: Kept on the Left */}
            <Text style={styles.mainTitle} numberOfLines={1}>
              {capitalizeAll(title)}
            </Text>

            {/* FILTER ICON: Moved to the Right */}
           {showFilter && (
              <TouchableOpacity
                style={styles.filterIconButton}
                onPress={() => setIsFilterOpen(true)}
              >
                <Text style={styles.filterLabel}>Filter</Text>
                <Ionicons
                  name={isFilterOpen ? 'close' : 'filter-outline'}
                  size={20}
                  color="#fff"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ImageBackground>

      {/* Dropdown Overlay */}
      <Modal
        visible={isFilterOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsFilterOpen(false)}
      >
        <View style={styles.modalContainer}>
          {/* Backdrop (click outside to close) */}
        <View style={styles.backdrop} pointerEvents="box-none">
  <TouchableOpacity
    style={styles.backdropTouchable}
    activeOpacity={1}
    onPress={() => setIsFilterOpen(false)}
  />
</View>

          {/* Dropdown content */}
          <View style={styles.dropdownOverlay}>
  {renderFilter?.(() => setIsFilterOpen(false))}
</View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    zIndex: 1000,
    elevation: 5,
  },
  bannerContainer: {
    width: '100%',
    height: 70,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 70,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
  pointerEvents: 'box-none', // ✅ allow touches to pass
  },

  backdropTouchable: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.2)',
},

  // dropdownOverlay: {
  //   marginTop: 80, // same as banner height
  //   backgroundColor: '#fff',
  //   padding: 15,
  //   borderBottomWidth: 1,
  //   borderBottomColor: '#eee',

  //   elevation: 20,
  //   shadowColor: "#000",
  //   shadowOffset: { width: 0, height: 4 },
  //   shadowOpacity: 0.2,
  //   shadowRadius: 4,
  // },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Push title left and filter right
    paddingHorizontal: 20,
  },
  mainTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1, // Takes up remaining space on the left
    marginRight: 10,
  },
  filterIconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 6,
  },
  filterLabel: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    zIndex: 5000,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
     pointerEvents: 'auto',
  },
});
