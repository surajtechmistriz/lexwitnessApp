import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import EditorPicks from '../components/EditorPicks';
import { EditorPicksSectionProps } from '../types/types';

const EditorPicksSection: React.FC<EditorPicksSectionProps> = ({
  data,
  getImage,
}) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.title}>EDITOR PICKS</Text>
        <View style={styles.line} />
      </View>

      {/* Horizontal Scroll logic starts here */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
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
  wrapper: { 
    marginVertical: 10,
    backgroundColor: '#fff' 
  },
  header: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#1a1a1a',
  },
  line: {
    height: 4, // Slightly thinner for a cleaner look
    width: 45,
    marginTop: 5,
    backgroundColor: '#e60000',
  },
  scrollContent: {
    paddingHorizontal: 15, // Adds space at the very start and end of the scroll
    paddingBottom: 10,     // Room for shadows if your card has them
  }
});