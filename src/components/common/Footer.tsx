import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        {/* ================= LEFT ================= */}
        <View style={styles.section}>
          <Image
            source={{
              uri: 'https://lexwitness.com/wp-content/themes/lexwitness/images/logo-white.png',
            }}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.heading}>
            ABOUT <Text style={styles.red}>WITNESS</Text>
          </Text>

          <Text style={styles.text}>
            For over 10 years, since its inception in 2009 as a monthly, Lex
            Witness has become India’s most credible platform for the legal
            luminaries to opine, comment and share their views.
          </Text>

          <Text style={styles.connect}>Connect Us:</Text>

          <TouchableOpacity
            style={styles.socialBox}
            onPress={() => Linking.openURL('https://www.linkedin.com')}
          >
            <Text style={styles.socialText}>in</Text>
          </TouchableOpacity>
        </View>

        {/* ================= MIDDLE ================= */}
        <View style={styles.section}>
          <Text style={styles.heading}>
            THE LEX WITNESS SUMMITS LEGACY
          </Text>

          {[
            [
              'The Grand Masters – A Corporate Counsel Legal Best Practices Summit Series',
              'www.grandmasters.in',
            ],
            ['The Real Estate & Construction Legal Summit', 'www.rcls.in'],
            ['The Information Technology Legal Summit', 'www.itlegalsummit.com'],
            ['The Banking & Finance Legal Summit', 'www.bfls.in'],
            [
              'The Media, Advertising and Entertainment Legal Summit',
              'www.maels.in',
            ],
            ['The Pharma Legal & Compliance Summit', 'www.plcs.co.in'],
          ].map(([title, link], index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.text}>{title}</Text>
              <Text style={styles.link}>
                {link}{' '}
                <Text style={styles.smallText}>| 8 Years & Counting</Text>
              </Text>
            </View>
          ))}
        </View>

        {/* ================= RIGHT ================= */}
        <View style={styles.section}>
          <Text style={styles.heading}>EXPLORE FURTHER!</Text>

          <Text style={styles.text}>
            We at Lex Witness strategically assist firms in reaching out to the
            relevant audience sets through various knowledge sharing
            initiatives.
          </Text>
        </View>
      </View>

      {/* ================= BOTTOM ================= */}
      <View style={styles.bottom}>
        <Text style={styles.bottomText}>
          Copyright © {year} Lex Witness – India’s 1st Magazine On Legal &
          Corporate Affairs
        </Text>
        <Text style={styles.bottomText}>
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
    backgroundColor: '#2f2f2f',
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
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },

  red: {
    color: '#c9060a',
  },

  text: {
    color: '#E2E2E2',
    fontSize: 13,
    lineHeight: 18,
  },

  connect: {
    marginTop: 10,
    color: '#E2E2E2',
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
    color: '#c9060a',
    fontSize: 12,
  },

  smallText: {
    color: '#E2E2E2',
  },

  bottom: {
    borderTopWidth: 1,
    borderColor: '#555',
    paddingVertical: 15,
    paddingHorizontal: 10,
    alignItems: 'center',
  },

  bottomText: {
    color: '#E2E2E2',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
});