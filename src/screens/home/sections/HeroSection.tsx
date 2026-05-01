import React from 'react';
import { View, StyleSheet } from 'react-native';
import HeroCard from '../components/HeroCard';
import { Article } from '../types/types';

type HeroSectionProps = {
  firstCard: Article | null;
  nextTwoCards: Article[];
  formatDate: (item: Article) => string;
  getImage: (img: string) => string;
};

const HeroSection: React.FC<HeroSectionProps> = ({
  firstCard,
  nextTwoCards,
  formatDate,
  getImage,
}) => {
  if (!firstCard) return null;

  return (
    <View style={styles.container}>
      
      {/*  Main Hero (Top Layer) */}
      <View style={styles.mainCard}>
        <HeroCard
          category={firstCard.category}
          title={firstCard.title}
          slug={firstCard.slug}
          date={formatDate(firstCard)}
          image={getImage(firstCard.image)}
        />
      </View>

      {/*  Secondary Cards (Stacked / layered feel) */}
      <View style={styles.secondaryContainer}>
        {nextTwoCards.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.secondaryCardWrapper,
              {
                transform: [{ scale: 0.96 + index * 0.02 }], // slight depth scale
                marginTop: index === 0 ? -20 : -10, // overlap effect
                zIndex: 10 - index,
              },
            ]}
          >
            <HeroCard
              category={item.category}
              title={item.title}
              date={formatDate(item)}
              image={getImage(item.image)}
              slug={item.slug}
            />
          </View>
        ))}
      </View>

    </View>
  );
};

export default HeroSection;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
  },

  mainCard: {
    zIndex: 20, // always on top
  },

  secondaryContainer: {
    marginTop: 10,
  },

  secondaryCardWrapper: {
    borderRadius: 16,
    overflow: 'hidden',

    //  Shadow for depth
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
}); 