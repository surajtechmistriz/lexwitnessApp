import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import EditorPicks from '../components/EditorPicks';
import { useTheme } from '../../../store/hooks/useTheme';
import { EditorPicksSectionProps } from '../../../types/home.types';
const EditorPicksSection: React.FC<EditorPicksSectionProps> = ({
  data,
  getImage,
  onPressItem,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.heading, { color: colors.text }]}>
        Editor's Picks
      </Text>
      <View style={[styles.accentBar, { backgroundColor: colors.primary }]} />

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
            onPress={() => onPressItem(item)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default EditorPicksSection;

const styles = StyleSheet.create({
  container: { marginTop: 20 },
  heading: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  accentBar: {
    width: 30,
    height: 3,
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 12,
  },
  scroll: { paddingRight: 6 },
});