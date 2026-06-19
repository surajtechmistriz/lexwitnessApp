// constants/globalStyles.ts
import { StyleSheet } from 'react-native';
import Colors from './colors';

export const GlobalStyles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  containerWhite: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  containerCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  
  // Text Styles
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  body: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  caption: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  
  // Button Styles
  buttonPrimary: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonPrimaryText: {
    color: Colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSecondary: {
    backgroundColor: Colors.white,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  buttonSecondaryText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Spacing
  padding: {
    small: 8,
    medium: 16,
    large: 24,
    xlarge: 32,
  },
  margin: {
    small: 8,
    medium: 16,
    large: 24,
    xlarge: 32,
  },
  
  // Layout
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GlobalStyles;