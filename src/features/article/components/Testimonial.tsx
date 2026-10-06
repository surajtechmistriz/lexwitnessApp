import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../../store/hooks/useTheme';

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
    alignment === 'left' ? 'left' : alignment === 'right' ? 'right' : 'center';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDark ? colors.card : '#f3f4f6',
          shadowColor: isDark ? '#000' : '#000',
        },
      ]}
    >
      {/* Left Quote */}
      <View style={styles.leftQuote}>
        <Image
          source={require('../../../assets/icons/quote-left.png')}
          style={styles.quoteIcon}
          resizeMode="contain"
        />
      </View>

      {/* Right Quote */}
      <View style={styles.rightQuote}>
        <Image
          source={require('../../../assets/icons/quote-right.png')}
          style={[styles.quoteIcon, { transform: [{ rotate: '180deg' }] }]}
          resizeMode="contain"
        />
      </View>

      {/* Feedback */}
      <View style={[styles.contentWrapper, { alignItems: textAlignStyle }]}>
        <Text
          style={[
            styles.feedbackText,
            {
              textAlign: textAlignText,
              color: colors.textSecondary,
            },
          ]}
        >
          {data.reader_feedback || ''}
        </Text>

        {/* Author */}
        <View
          style={{
            alignItems: textAlignStyle,
            marginTop: 8,
          }}
        >
          <Text
            style={[
              styles.name,
              {
                textAlign: textAlignText,
                color: colors.text,
              },
            ]}
          >
            {data.reader_name || ''}
          </Text>

          {data.reader_designation ? (
            <Text
              style={[
                styles.designation,
                {
                  textAlign: textAlignText,
                  color: colors.textMuted,
                },
              ]}
            >
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
    width: '100%',
    alignSelf: 'center',

    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 20,

    marginTop: 0,
    marginBottom: 8,
    marginHorizontal: 0,

    position: 'relative',

    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },

  leftQuote: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 22,
    height: 22,
    // opacity: 0.18,
  },

  rightQuote: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 22,
    height: 22,
    // opacity: 0.18,
  },

  quoteIcon: {
    width: '100%',
    height: '100%',
  },

  contentWrapper: {
    paddingHorizontal: 18,
  },

  feedbackText: {
    fontSize: 15,
    lineHeight: 25,
    fontStyle: 'italic',
    marginBottom: 18,
    marginLeft: 2,
  },

  name: {
    fontSize: 16,
    fontWeight: '600',
  },

  designation: {
    fontSize: 13,
    marginTop: 4,
    opacity: 0.75,
  },
});
