import React from 'react';
import { View, StyleSheet } from 'react-native';
import HeroCard from '../components/HeroCard';
import { Article } from '../types/types'; // adjust path

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
    <View style={{ flex: 1 }}> 
      {/* Reduced Main Hero Height to 200 */}
      <HeroCard
        category={firstCard.category}
        title={firstCard.title}
        slug={firstCard.slug}
        date={formatDate(firstCard)}
        image={getImage(firstCard.image)}
        height={200} 
      />

      <View style={styles.secondaryContainer}>
        {nextTwoCards.map((item) => (
          <View key={item.id} style={styles.secondaryCardWrapper}>
            {/* Reduced Secondary Card Height to 100 */}
            <HeroCard
              category={item.category}
              title={item.title}
              date={formatDate(item)}
              image={getImage(item.image)}
              height={100}
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
  secondaryContainer: {
    marginVertical: 10,
    gap: 10,
  },

  fullWidthCard: {
    width: '100%',
  },
  
  secondaryCardWrapper: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
  },
});