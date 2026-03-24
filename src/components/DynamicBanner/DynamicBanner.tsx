import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ImageBackground, 
  TouchableOpacity 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Config from 'react-native-config';

interface BannerProps {
  title: string;
  backgroundImage?: string; // URL string
}


export default function Banner({ title }: BannerProps) {
  const navigation = useNavigation();

  // Helper functions matching your Next.js logic
  const capitalizeFirst = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const capitalizeAll = (str: string) => str.toUpperCase();

  // Fallback image if backgroundImage is not provided
const imageUrl = Config.BANNER_BASE_URL; // string from env   
console.log('Banner URL:', imageUrl);
  return (
 <ImageBackground 
  source={{ uri: imageUrl }} 
  style={styles.bannerContainer}
  resizeMode="cover"
>
      {/* This View acts as your linear-gradient / overlay */}
      <View style={styles.overlay}>
        <View style={styles.content}>
          
          <Text style={styles.mainTitle}>
            {capitalizeAll(title)}
          </Text>

          <View style={styles.breadcrumbContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Home' as never)}>
              <Text style={styles.homeLink}>Home</Text>
            </TouchableOpacity>
            
            <Text style={styles.breadcrumbText}>
               | {capitalizeFirst(title)}
            </Text>
          </View>

        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    width: '100%',
    height: 100, // Matches your py-12 (~80-100px)
  },
  overlay: {
    flex: 1,
    // This matches your rgb(70 70 70 / 60%) overlay
    backgroundColor: 'rgba(70, 70, 70, 0.6)', 
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    maxWidth: 1152, // Roughly matches max-w-6xl
    alignSelf: 'center',
    width: '100%',
  },
  mainTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  breadcrumbContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  homeLink: {
    color: '#c9060a', // Your specific red
    fontSize: 14,
    fontWeight: '500',
  },
  breadcrumbText: {
    color: '#e5e7eb', // Matches text-gray-200
    fontSize: 14,
    fontWeight: '500',
  },
});