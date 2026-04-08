import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import EditorPicks from '../components/EditorPicks';
import { EditorPicksSectionProps } from '../types/types';

const EditorPicksSection: React.FC<EditorPicksSectionProps> = ({
  data,
  getImage,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Editor’s Picks</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {data.map(item => (
          <EditorPicks
            key={item.id}
            image={getImage(item.image)}
            title={item.title}
            author={item.author?.name}
            category={item.category}
            slug={item.slug}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default EditorPicksSection;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },

  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 12,
    paddingHorizontal: 12,
  },

  scroll: {
    paddingLeft: 12,
    paddingRight: 6,
  },
});