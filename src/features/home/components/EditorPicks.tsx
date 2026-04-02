import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const EditorPicks = ({ image, title, author, slug, category }) => {
  const navigation = useNavigation<any>();

  const categorySlug = category?.slug ?? 'general';
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate('ArticleDetail', {
          slug: slug,
          category: categorySlug,
        })
      }
      style={styles.cardContainer}
    >
      <Image
        source={{ uri: image }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.textContainer}>
        <Text style={styles.titleText} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.authorText}>{author}</Text>
      </View>
    </TouchableOpacity>
  );
};
export default EditorPicks;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ebebeb', // Light gray border
    borderRadius: 2, // Sharp corners as per image
    overflow: 'hidden', // Keeps image corners within border
    width: '100%',
    marginBottom: 16,
  },
  cardImage: {
    width: '100%',
    height: 180, // Adjust based on your preferred aspect ratio
  },
  textContainer: {
    padding: 12,
  },
  titleText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
    lineHeight: 22,
    marginBottom: 6,
  },
  authorText: {
    fontSize: 14,
    color: '#b70000', // Red author name
    fontWeight: '500',
  },
  container: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 22,
    fontWeight: 600,
  },
});

// const styles = StyleSheet.create({
//     container:{
//         height:100,
//         justifyContent:'center',
//         alignItems:'center'
//     },
//     text:{
//  fontSize:22,
//  fontWeight:600
//     }
// })
