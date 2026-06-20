import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Pressable,
} from 'react-native';

import { latesteEdition } from '../services/api/latestedition';
import Config from 'react-native-config';
import PopupSkeleton from '../skeleton/PopupSkeleton';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../redux/hooks/useTheme';

// --- Types ---
type Magazine = {
  slug: string;
  id: number;
  title: string;
  image: string;
  magazine_name?: string;
};

type EditionResponse = {
  magazine: Magazine;
};

const { width } = Dimensions.get('window');
const MagimgUrl = Config.MAGAZINES_BASE_URL;

const Popup = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const navigation = useNavigation<any>();
  const { colors, isDark } = useTheme();
  const [data, setData] = useState<EditionResponse | null>(null);
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    if (!visible) return;

    setLoading(true);
    const fetchData = async () => {
      try {
        const res = await latesteEdition();
        setData(res.data);
      } catch (err) {
        console.log('Popup fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [visible]);

  const handleClose = () => {
    setData(null);
    onClose();
  };

  // ============================================================
  //  FIXED NAVIGATION FUNCTIONS
  // ============================================================

  // 1. Go to Subscription
  const goToSubscription = () => {
    handleClose();
    navigation.navigate('Subscription');
  };

  // 2. Go to Magazine Detail
  const goToMagazine = () => {
    if (!data?.magazine) return;

    handleClose();
    navigation.navigate('MagazineDetail', {
      slug: data.magazine.slug || String(data.magazine.id),
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.75)' }]}>
        <View style={[
          styles.card, 
          { 
            backgroundColor: colors.card,
            shadowColor: isDark ? '#000' : '#000',
          }
        ]}>

          {/* CLOSE BUTTON */}
          <Pressable 
            onPress={handleClose} 
            style={[styles.closeBtn, { backgroundColor: colors.background }]}
          >
            <Text style={[styles.closeBtnTxt, { color: colors.text }]}>✕</Text>
          </Pressable>

          {loading ? (
            <PopupSkeleton />
          ) : (
            <>
              {/* IMAGE */}
              <TouchableOpacity
                onPress={goToMagazine}
                style={styles.imageContainer}
                activeOpacity={0.9}
              >
                <Image
                  source={{
                    uri: `${MagimgUrl}/${data?.magazine?.image}`,
                  }}
                  style={styles.bigImg}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              {/* CONTENT */}
              <View>
                <Text style={[styles.label, { color: colors.primary }]}>
                  LATEST ISSUE
                </Text>

                <Text style={[styles.headline, { color: colors.text }]}>
                  {data?.magazine?.magazine_name || 'Magazine'}
                </Text>

                <Text style={[styles.promoText, { color: colors.text }]}>
                  Start Your <Text style={[styles.redText, { color: colors.primary }]}>Free Month Now</Text>
                </Text>  
                <Text style={[styles.credit, { color: colors.textSecondary }]}>
                  No credit card required
                </Text>

                <TouchableOpacity
                  style={[styles.subscribeBtn, { backgroundColor: colors.primary }]}
                  onPress={goToSubscription}
                >
                  <Text style={styles.subscribeBtnTxt}>
                    Subscribe Now
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default Popup;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: width * 0.88,
    borderRadius: 16,
    paddingTop: 45,
    paddingBottom: 30,
    paddingHorizontal: 22,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  closeBtn: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeBtnTxt: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageContainer: {
    height: 250,
    marginBottom: 20,
    alignItems: 'center',
  },
  bigImg: {
    width: '100%',
    height: '100%',
  },
  contentSection: {},
  label: {
    fontWeight: '800',
    fontSize: 12,
    marginBottom: 5,
  },
  headline: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 15,
  },
  promoText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  }, 
  credit: {
    fontSize: 12,
    fontWeight: '500',
    fontStyle: 'italic',
    marginBottom: 15,
  },
  redText: {
    // Color applied dynamically
  },
  subscribeBtn: {
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  subscribeBtnTxt: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});