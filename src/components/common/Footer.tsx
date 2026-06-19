import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useTheme } from '../../redux/useTheme';

const Footer = () => {
  const year = new Date().getFullYear();
  const { colors, isDark } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? '#1a1a1a' : '#2f2f2f' },
      ]}
    >
      <View style={styles.inner}>
        {/* ------ LEFT ------ */}
        <View style={styles.section}>
          <Image
            source={{
              uri: 'https://lexwitness.com/wp-content/themes/lexwitness/images/logo-white.png',
            }}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={[styles.heading, { color: colors.text }]}>
            ABOUT{' '}
            <Text style={[styles.red, { color: colors.primary }]}>WITNESS</Text>
          </Text>

          <Text style={[styles.text, { color: colors.textSecondary }]}>
            For over 10 years, since its inception in 2009 as a monthly, Lex
            Witness has become India’s most credible platform for the legal
            luminaries to opine, comment and share their views.
          </Text>

          <Text style={[styles.connect, { color: colors.textSecondary }]}>
            Connect Us:
          </Text>

          <TouchableOpacity
            style={styles.socialBox}
            onPress={() => Linking.openURL('https://www.linkedin.com')}
          >
            <Text style={styles.socialText}>in</Text>
          </TouchableOpacity>
        </View>

        {/* ------ MIDDLE ------ */}
        <View style={styles.section}>
          <Text style={[styles.heading, { color: colors.text }]}>
            THE LEX WITNESS SUMMITS LEGACY
          </Text>

          {[
            [
              'The Grand Masters – A Corporate Counsel Legal Best Practices Summit Series',
              'www.grandmasters.in',
            ],
            ['The Real Estate & Construction Legal Summit', 'www.rcls.in'],
            [
              'The Information Technology Legal Summit',
              'www.itlegalsummit.com',
            ],
            ['The Banking & Finance Legal Summit', 'www.bfls.in'],
            [
              'The Media, Advertising and Entertainment Legal Summit',
              'www.maels.in',
            ],
            ['The Pharma Legal & Compliance Summit', 'www.plcs.co.in'],
          ].map(([title, link], index) => (
            <View key={index} style={styles.listItem}>
              <Text style={[styles.text, { color: colors.textSecondary }]}>
                {title}
              </Text>
              <Text style={[styles.link, { color: colors.primary }]}>
                {link}{' '}
                <Text style={[styles.smallText, { color: colors.textMuted }]}>
                  | 8 Years & Counting
                </Text>
              </Text>
            </View>
          ))}
        </View>

        {/* ------ RIGHT ------ */}
        <View style={styles.section}>
          <Text style={[styles.heading, { color: colors.text }]}>
            EXPLORE FURTHER!
          </Text>

          <Text style={[styles.text, { color: colors.textSecondary }]}>
            We at Lex Witness strategically assist firms in reaching out to the
            relevant audience sets through various knowledge sharing
            initiatives.
          </Text>
        </View>
      </View>

      {/* ------ BOTTOM ------ */}
      <View style={[styles.bottom, { borderColor: isDark ? '#333' : '#555' }]}>
        <Text style={[styles.bottomText, { color: colors.textMuted }]}>
          Copyright © {year} Lex Witness – India's 1st Magazine On Legal &
          Corporate Affairs
        </Text>
        <Text style={[styles.bottomText, { color: colors.textMuted }]}>
          Rights Of Admission Reserved
        </Text>
      </View>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  inner: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },

  section: {
    marginBottom: 25,
  },

  logo: {
    width: 150,
    height: 50,
    marginBottom: 10,
  },

  heading: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },

  red: {
    // Color will be applied dynamically
  },

  text: {
    fontSize: 13,
    lineHeight: 18,
  },

  connect: {
    marginTop: 10,
    fontSize: 13,
  },

  socialBox: {
    marginTop: 8,
    width: 40,
    height: 25,
    backgroundColor: '#0A66C2',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
  },

  socialText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  listItem: {
    marginBottom: 10,
  },

  link: {
    fontSize: 12,
  },

  smallText: {
    // Color will be applied dynamically
  },

  bottom: {
    borderTopWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
    alignItems: 'center',
  },

  bottomText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
});
