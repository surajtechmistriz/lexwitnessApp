import React from 'react';
import { View, StyleSheet } from 'react-native';
import HeroCard from '../components/HeroCard';
import { Article } from '../types/types'; // adjust path

/**
 * =========================
 * PROPS TYPE
 * =========================
 * Defines expected data structure for HeroSection
 */
type HeroSectionProps = {
  firstCard: Article | null;
  nextTwoCards: Article[];
  formatDate: (item: Article) => string;
  getImage: (img: string) => string;
};

/**
 * =========================
 * HERO SECTION COMPONENT
 * =========================
 * - Renders main hero card
 * - Renders secondary stacked cards
 */
const HeroSection: React.FC<HeroSectionProps> = ({
  firstCard,
  nextTwoCards,
  formatDate,
  getImage,
}) => {
  /**
   * Guard clause
   * Prevent rendering if no primary data
   */
  if (!firstCard) return null;

  return (
    <>
      {/* ================= MAIN HERO CARD ================= */}
      <HeroCard
        category={firstCard.category?.name}
        title={firstCard.title}
        date={formatDate(firstCard)}
        image={getImage(firstCard.image)}
        height={450}
      />

      {/* ================= SECONDARY HERO CARDS ================= */}
      <View style={styles.secondaryContainer}>
        {nextTwoCards.map((item) => (
          <HeroCard
            key={item.id}
            category={item.category?.name}
            title={item.title}
            date={formatDate(item)}
            image={getImage(item.image)}
            height={220}
            style={styles.fullWidthCard}
          />
        ))}
      </View>
    </>
  );
};

export default HeroSection;

/**
 * =========================
 * STYLES
 * =========================
 */
const styles = StyleSheet.create({
  secondaryContainer: {
    marginVertical: 10,
    gap: 10,
  },

  fullWidthCard: {
    width: '100%',
  },
});