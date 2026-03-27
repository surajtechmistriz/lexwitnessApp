import React from 'react';
import { View, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';

type Props = {
  title: string;
  url: string;
};

const SocialShare = ({ title, url }: Props) => {
  const shareUrl = url;

  const openLink = (link: string) => {
    Linking.openURL(link);
  };

  return (
    <View style={styles.container}>
      {/* LinkedIn */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.btn, styles.linkedin]}
        onPress={() =>
          openLink(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              shareUrl,
            )}`,
          )
        }
      >
        <Icon name="linkedin-in" size={12} color="#fff" />
      </TouchableOpacity>

      {/* Facebook */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.btn, styles.facebook]}
        onPress={() =>
          openLink(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              shareUrl,
            )}`,
          )
        }
      >
        <Icon name="facebook-f" size={12} color="#fff" />
      </TouchableOpacity>

      {/* X (Twitter) */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.btn, styles.twitter]}
        onPress={() =>
          openLink(
            `https://twitter.com/intent/tweet?url=${encodeURIComponent(
              shareUrl,
            )}&text=${encodeURIComponent(title)}`,
          )
        }
      >
        <Icon name="x-twitter" size={12} color="#fff" />
      </TouchableOpacity>

      {/* WhatsApp */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.btn, styles.whatsapp]}
        onPress={() =>
          openLink(
            `https://wa.me/?text=${encodeURIComponent(
              `${title} - ${shareUrl}`,
            )}`,
          )
        }
      >
        <Icon name="whatsapp" size={12} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default SocialShare;


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 4,
    marginBottom:6
  },

  btn: {
    width: 40,
    height: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  linkedin: {
    backgroundColor: '#0A66C2',
    borderColor: '#0A66C2',
  },

  facebook: {
    backgroundColor: '#1877F2',
    borderColor: '#1877F2',
  },

  twitter: {
    backgroundColor: '#000',
    borderColor: '#000',
  },

  whatsapp: {
    backgroundColor: '#25D366',
    borderColor: '#25D366',
  },
});