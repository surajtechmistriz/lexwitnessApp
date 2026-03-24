import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type HeroCardProps = {
  category: string;
  title: string;
  date?: string;
  image?: string;
  height?: number;
};

const HeroCard = ({ category, title, date, image, height = 350 }) => {
  return (
    <TouchableOpacity activeOpacity={0.9} style={[styles.container, { height }]}>
      <ImageBackground 
        source={{ uri: image }} 
        style={styles.image}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        >
          {/* Badge pinned to top-left */}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{category}</Text>
          </View>

          {/* Bottom Content with its own padding */}
          <View style={styles.bottomContent}>
            <Text style={styles.title} numberOfLines={3}>
              {title}
            </Text>
            {date && <Text style={styles.dateText}>{date}</Text>}
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 10,
    backgroundColor: '#000',
  },
  image: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    // Removed general padding here to let badge hit the edges
    justifyContent: 'space-between',
  },
  badge: {
    backgroundColor: '#C9060a', 
    alignSelf: 'flex-start',
    // These ensure it sticks to the very top-left
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 16, // Slightly larger to match the reference
    fontWeight: 'bold',
    textTransform: 'uppercase', // Matches "ACADEMIA" in screenshot
  },
  bottomContent: {
    padding: 20, // Keep padding only for the text at the bottom
  },
  title: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '400',
    lineHeight: 29,
    marginBottom: 8,
  },
  dateText: {
    color: '#E0E0E0',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default HeroCard;