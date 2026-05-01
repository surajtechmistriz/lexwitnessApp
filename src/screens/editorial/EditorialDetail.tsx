import React from 'react';
import { ScrollView, View, Text, Image, StyleSheet } from 'react-native';
import Config from 'react-native-config';

const EditorialDetail = ({ route }: any) => {
  // Grab the data passed through navigation
  const { editorialData } = route.params;
  const imgUrl = Config.EDITORIAL_IMAGE_URL;

  return (
    <ScrollView style={styles.fullScreen}>
      <Image
        source={{ uri: `${imgUrl}/${editorialData.image}` }}
        style={styles.largeImage}
      />
      <View style={styles.content}>
        <Text style={styles.name}>{editorialData.name}</Text>
        <Text style={styles.company}>{editorialData.company_name}</Text>
        <Text style={styles.role}>{editorialData.designation} | {editorialData.place}</Text>
        
        <View style={styles.divider} />
        
        <Text style={styles.fullDescription}>
          {editorialData.description.replace(/<[^>]*>?/gm, '')}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  fullScreen: { flex: 1, backgroundColor: '#fff'  },
  largeImage: { width: 330, height: 300, backgroundColor: '#f0f0f0', alignSelf:'center', marginTop:20 },
  content: { padding: 20 },
  name: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  company: { fontSize: 18, color: '#C41E3A', fontWeight: '700', marginTop: 5 },
  role: { fontSize: 16, color: '#666', marginTop: 5 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 20 },
  fullDescription: { fontSize: 16, lineHeight: 26, color: '#444' }
});

export default EditorialDetail;