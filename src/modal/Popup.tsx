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
import { navigate } from '../utils/helper/navigationHelper';

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

  /* ---------------- NAVIGATION ---------------- */

  const goToSubscription = () => {
    handleClose();
    navigate('Subscription');
  };

  const goToMagazine = () => {
    if (!data?.magazine) return;

    handleClose();

    navigate('Magazines', {
      screen: 'MagazineDetail',
      params: {
        slug: data.magazine.slug || String(data.magazine.id),
      },
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
      <View style={styles.overlay}>
        <View style={styles.card}>

          {/* CLOSE BUTTON */}
          <Pressable onPress={handleClose} style={styles.closeBtn}>
            <Text style={styles.closeBtnTxt}>✕</Text>
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
                <Text style={styles.label}>LATEST ISSUE</Text>

                <Text style={styles.headline}>
                  {data?.magazine?.magazine_name || 'Magazine'}
                </Text>

                <Text style={styles.promoText}>
                  Start Your <Text style={styles.redText}>Free Month Now</Text>
                </Text>  
                <Text style={styles.credit}>
                 No credit card required
                </Text>

                <TouchableOpacity
                  style={styles.subscribeBtn}
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
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    width: width * 0.88,
    borderRadius: 16,
    paddingTop: 45,
    paddingBottom: 30,
    paddingHorizontal: 22,
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    right: 12,
    top: 12,
    backgroundColor: '#eee',
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
    color: '#c9060a',
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
    color: '#c9060a',
  },
  subscribeBtn: {
    backgroundColor: '#c9060a',
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