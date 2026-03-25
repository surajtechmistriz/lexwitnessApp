import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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

      {data.map((item) => (
        <EditorPicks
          key={item.id}
          image={getImage(item.image)}
          title={item.title}
          author={item.author?.name}
        />
      ))}
    </View>
  );
};

export default EditorPicksSection;

const styles = StyleSheet.create({
  wrapper: { marginVertical: 10 },
  header: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 2,
  },
  line: {
    height: 5,
    width: 60,
    marginTop: 5,
    backgroundColor: '#e60000',
  },
});