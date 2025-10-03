import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#6389f1ec', // Modern indigo - vibrant and professional
  primaryLight: '#818CF8', // Lighter shade for accents
  primaryDark: '#4F46E5', // Darker shade for depth
  secondary: '#14B8A6', // Teal - fresh and modern
  secondaryLight: '#5EEAD4', // Light teal for backgrounds
  accent: '#F59E0B', // Warm amber for highlights
  danger: '#EF4444', // Modern red - bold but not harsh
  dangerLight: '#FCA5A5', // Soft red for backgrounds
  success: '#10B981', // Vibrant emerald green
  successLight: '#6EE7B7', // Light green for success states
  warning: '#F59E0B', // Amber for warnings
  warningLight: '#FDE68A', // Light amber background

  // Backgrounds with depth
  background: '#F8FAFC', // Subtle blue-gray for modern feel
  cardBackground: '#FFFFFF',
  surfaceLight: '#F1F5F9', // Light surface for subtle sections
  surfaceDark: '#E2E8F0', // Darker surface for contrast

  // Text colors with better hierarchy
  textPrimary: '#1E293B', // Deep slate for primary text
  textSecondary: '#475569', // Medium slate for secondary text
  textLight: '#64748B', // Light slate for subtle text
  textMuted: '#94A3B8', // Very light for disabled states

  // Border and divider colors
  border: '#E2E8F0', // Subtle border
  borderLight: '#F1F5F9', // Very light border
  divider: '#CBD5E1', // Clear dividers

  // Pure colors
  white: '#FFFFFF',
  black: '#000000',

  // Gradient colors for modern effects
  gradientStart: '#6366F1',
  gradientEnd: '#14B8A6',

  // Status colors with personality
  info: '#0EA5E9', // Sky blue for information
  infoLight: '#BAE6FD', // Light blue background
};

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 15,
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  screenContent: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
