import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../../redux/hooks/useTheme';

type TextAlignment = 'left' | 'right' | 'center';

interface TestimonialProps {
  data: {
    reader_feedback?: string;
    reader_name?: string;
    reader_designation?: string;
    text_alignment?: TextAlignment;
  };
}

export default function TestimonialCard({ data }: TestimonialProps) {
  const { colors, isDark } = useTheme();
  
  if (!data) return null;

  const alignment = data.text_alignment ?? 'left';

  const textAlignStyle =
    alignment === 'left'
      ? 'flex-start'
      : alignment === 'right'
      ? 'flex-end'
      : 'center';

  const textAlignText =
    alignment === 'left'
      ? 'left'
      : alignment === 'right'
      ? 'right'
      : 'center';

  return (
    <View style={[styles.card, { 
      backgroundColor: isDark ? colors.card : '#f3f4f6',
      shadowColor: isDark ? '#000' : '#000',
    }]}>
      
      {/* Left Quote */}
      <View style={styles.leftQuote}>
        <Image
          source={require('../../../assets/quote-left.png')}
          style={styles.quoteIcon}
          resizeMode="contain"
        />
      </View>

      {/* Right Quote */}
      <View style={styles.rightQuote}>
        <Image
          source={require('../../../assets/quote-right.png')}
          style={[styles.quoteIcon, { transform: [{ rotate: '180deg' }] }]}
          resizeMode="contain"
        />
      </View>

      {/* Feedback */}
      <View style={[styles.contentWrapper, { alignItems: textAlignStyle }]}>
        <Text style={[styles.feedbackText, { 
          textAlign: textAlignText,
          color: colors.textSecondary,
        }]}>
          {data.reader_feedback || ''}
        </Text>

        {/* Author */}
        <View style={{ alignItems: textAlignStyle }}>
          <Text style={[styles.name, { 
            textAlign: textAlignText,
            color: colors.text,
          }]}>
            {data.reader_name || ''}
          </Text>

          {data.reader_designation ? (
            <Text style={[styles.designation, { 
              textAlign: textAlignText,
              color: colors.textMuted,
            }]}>
              {data.reader_designation}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 20,
    width: '100%',
    alignSelf: 'center',
    marginHorizontal: 16,
    position: 'relative',
    marginTop: -20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  leftQuote: {
    position: 'absolute',
    top: 16,
    left: 6,
    width: 24,
    height: 24,
  },

  rightQuote: {
    position: 'absolute',
    top: 16,
    right: 6,
    width: 24,
    height: 24,
  },

  quoteIcon: {
    width: '100%',
    height: '100%',
  },

  contentWrapper: {
    marginHorizontal: 18,
  },

  feedbackText: {
    fontStyle: 'italic',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },

  name: {
    fontWeight: '600',
    fontSize: 15,
  },

  designation: {
    fontSize: 12,
    marginTop: 2,
  },
});