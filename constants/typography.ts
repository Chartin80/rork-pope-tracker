import { Platform } from 'react-native';

export const Fonts = {
  heading: {
    regular: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      web: 'Georgia, "Times New Roman", serif',
    }) as string,
    bold: Platform.select({
      ios: 'Georgia-Bold',
      android: 'serif',
      web: 'Georgia, "Times New Roman", serif',
    }) as string,
  },
  body: {
    regular: Platform.select({
      ios: 'System',
      android: 'System',
      web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }) as string,
    bold: Platform.select({
      ios: 'System',
      android: 'System',
      web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }) as string,
  },
};

export const FontSizes = {
  xs: 10,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
};

export const LineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
};

export const LetterSpacing = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
  wider: 1,
  widest: 2,
};
