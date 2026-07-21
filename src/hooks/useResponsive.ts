// src/hooks/useResponsive.ts
import { useWindowDimensions, PixelRatio, Platform } from 'react-native';

export const useResponsive = () => {
  const { width, height } = useWindowDimensions();
  
  // Device detection
  const isTablet = width >= 768;
  const isSmallDevice = width < 375;
  const isLargeDevice = width > 428;
  const isLandscape = width > height;

  // Pixel density for fine-tuning
  const pixelRatio = PixelRatio.get();
  const fontScale = PixelRatio.getFontScale();

  // Percentage functions
  const wp = (percent: number) => (width * percent) / 100;
  const hp = (percent: number) => (height * percent) / 100;

  // Moderate scaling (less aggressive)
  const moderateScale = (size: number, factor = 0.5) => {
    const baseWidth = 375;
    const scale = width / baseWidth;
    return size + (scale * size - size) * factor;
  };

  // Font scaling with constraints
  const scaleFont = (size: number) => {
    const baseWidth = 375;
    const scale = Math.min(width / baseWidth, 1.5); // Max 1.5x
    return size * scale;
  };

  return {
    width,
    height,
    isTablet,
    isSmallDevice,
    isLargeDevice,
    isLandscape,
    pixelRatio,
    fontScale,

    // Percentage functions
    wp,
    hp,

    // Scaling functions
    moderateScale,
    scaleFont,

    // Spacing system
    spacing: {
      xs: isSmallDevice ? 3 : isTablet ? 6 : 4,
      sm: isSmallDevice ? 6 : isTablet ? 12 : 8,
      md: isSmallDevice ? 10 : isTablet ? 18 : 12,
      lg: isSmallDevice ? 16 : isTablet ? 24 : 20,
      xl: isSmallDevice ? 24 : isTablet ? 36 : 30,
      xxl: isSmallDevice ? 32 : isTablet ? 48 : 40,
    },

    // Font system
    font: {
      xs: isSmallDevice ? 9 : isTablet ? 12 : 10,
      sm: isSmallDevice ? 11 : isTablet ? 14 : 12,
      md: isSmallDevice ? 13 : isTablet ? 16 : 14,
      lg: isSmallDevice ? 16 : isTablet ? 20 : 18,
      xl: isSmallDevice ? 20 : isTablet ? 26 : 22,
      xxl: isSmallDevice ? 24 : isTablet ? 32 : 28,
    },

    // Common component sizes
    sizes: {
      buttonHeight: isTablet ? hp(6) : hp(5.5),
      inputHeight: isTablet ? hp(5.5) : hp(5),
      borderRadius: isSmallDevice ? 8 : isTablet ? 14 : 10,
      iconSize: isSmallDevice ? 20 : isTablet ? 28 : 24,
      avatarSize: isSmallDevice ? 36 : isTablet ? 56 : 44,
    },

    // Layout helpers
    getResponsiveValue: (mobile: any, tablet: any) => {
      return isTablet ? tablet : mobile;
    },

    getColumnCount: () => {
      if (isTablet) return 4;
      if (isSmallDevice) return 2;
      return 3;
    },

    getGridItemSize: (columns: number) => {
      const gap = isSmallDevice ? 8 : isTablet ? 20 : 12;
      return (width - (gap * (columns + 1))) / columns;
    },
  };
};