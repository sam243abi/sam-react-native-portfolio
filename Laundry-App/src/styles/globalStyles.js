import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const BLUE_SIZE = width * 2.2;

// Color constants
export const COLORS = {
  primary: '#08A6B0',
  primaryDark: '#3B82F6',
  secondary: '#4884f4',
  white: '#fff',
  black: '#000',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  background: {
    primary: '#f1f1f1',
    secondary: '#f0f0f0',
    white: '#fff',
    light: '#fcfafaff',
  },
  border: {
    light: '#E8E8E8',
    medium: '#ccc',
    dark: '#ddd',
  },
  text: {
    primary: '#000',
    secondary: '#333',
    tertiary: '#555',
    muted: '#666',
    light: '#777',
    placeholder: '#666',
  },
  success: '#5cb85c',
  warning: '#f0ad4e',
  danger: '#d9534f',
  info: '#5bc0de',
};

// Common dimensions
export const DIMENSIONS = {
  buttonHeight: 60,
  buttonWidth: 361,
  inputHeight: 55,
  headerHeight: 100,
  bottomNavHeight: 90,
  borderRadius: {
    small: 8,
    medium: 12,
    large: 20,
    full: 50,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 15,
    lg: 20,
    xl: 30,
    xxl: 40,
  },
  blueCurveSize: BLUE_SIZE,
};

export const globalStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  containerGray: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  containerLight: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  safeArea: { 
    flex: 1,
    backgroundColor: COLORS.white,
  },

  // Background elements
  backgroundWrapper: {
    height: 120,
    position: 'absolute',
    width: '100%',
  },
  blueCurve: {
    width: DIMENSIONS.blueCurveSize,
    height: DIMENSIONS.blueCurveSize,
    borderRadius: DIMENSIONS.blueCurveSize / 2,
    backgroundColor: COLORS.primary,
    alignSelf: 'center',
    position: 'absolute',
    top: -660,
    zIndex: 1,
  },
  contentWrapper: {
    flex: 1,
    marginTop: 50,
    paddingHorizontal: DIMENSIONS.spacing.lg,
    zIndex: 2,
  },

  // Header styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: DIMENSIONS.spacing.md,
    paddingVertical: DIMENSIONS.spacing.xxl,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  headerWithHeight: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: DIMENSIONS.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.dark,
    justifyContent: 'space-between',
    height: DIMENSIONS.headerHeight,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  headerTitleLarge: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },

  // Button styles
  primaryButton: {
    backgroundColor: COLORS.primary,
    height: DIMENSIONS.buttonHeight,
    width: DIMENSIONS.buttonWidth,
    borderRadius: DIMENSIONS.borderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: DIMENSIONS.spacing.lg,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary,
    margin: DIMENSIONS.spacing.md,
    paddingVertical: 14,
    borderRadius: DIMENSIONS.borderRadius.small,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
  },
  disabledButton: {
    backgroundColor: '#82D3D8',
  },

  // Input styles
  input: {
    height: DIMENSIONS.inputHeight,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    borderRadius: DIMENSIONS.borderRadius.medium,
    paddingHorizontal: 24,
    fontSize: 16,
    color: COLORS.text.secondary,
    marginBottom: DIMENSIONS.spacing.md,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border.light,
    borderRadius: DIMENSIONS.borderRadius.medium,
    marginBottom: DIMENSIONS.spacing.lg,
    paddingHorizontal: DIMENSIONS.spacing.lg,
    height: DIMENSIONS.inputHeight,
    backgroundColor: COLORS.white,
    width: DIMENSIONS.buttonWidth,
  },
  inputFlex: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text.secondary,
    height: '100%',
  },
  halfInput: {
    width: '48%',
  },

  // OTP styles
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 32,
    gap: 16,
  },
  otpBox: {
    width: 60,
    height: 60,
    borderRadius: DIMENSIONS.borderRadius.medium,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    textAlign: 'center',
    fontSize: 24,
    backgroundColor: '#F8F8F8',
  },

  // Text styles
  headerText1: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '2.5%', 
  },
  headerText2: {
    color: COLORS.white,
    fontSize: 18,
    textAlign: 'center',
    opacity: 0.9,
    paddingHorizontal: DIMENSIONS.spacing.lg,
  },
   sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: '2.5%',
    color: COLORS.text.primary,
  },
  brandText: {
    fontSize: 35,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: '7.5%', 
    textAlign: 'center',
  },
   goBackText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: '3.75%',
    marginBottom: '8.5%', 
  },
 timerText: {
    fontSize: 16,
    color: '#222',
    marginBottom: '10%',
  },
  resendText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  footerText: {
    fontSize: 14,
    color: COLORS.text.muted,
    textAlign: 'center',
  },
  linkText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
   welcomeText: {
    fontSize: 24,
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    paddingHorizontal: DIMENSIONS.spacing.lg,
    lineHeight: 24,
  },

  // Bottom Navigation
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '22.5%', 
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
    shadowColor: COLORS.black,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },

 // Section and Card styles
  section: {
    padding: DIMENSIONS.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  sectionWhite: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: '2.5%',
    marginBottom: DIMENSIONS.spacing.md,
  },
 card: {
    backgroundColor: COLORS.white,
    marginHorizontal: DIMENSIONS.spacing.md,
    marginVertical: '2%',
    borderRadius: DIMENSIONS.borderRadius.medium,
    padding: DIMENSIONS.spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: COLORS.black,
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

  // Row styles
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: '2%', 
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowText: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },

  // Common layout styles
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  paddingHorizontal: {
    paddingHorizontal: DIMENSIONS.spacing.lg,
  },
  marginBottom: {
    marginBottom: DIMENSIONS.spacing.lg,
  },
  flexRow: {
    flexDirection: 'row',
  },
  flex1: {
    flex: 1,
  },

  // Modal styles
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: DIMENSIONS.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalItem: {
    padding: DIMENSIONS.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  modalText: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },

  // Helper text
  helperText: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },

  // Scroll content
  scrollContent: {
    padding: DIMENSIONS.spacing.md,
    paddingBottom: 80,
  },
  scrollContentLarge: {
    paddingBottom: 90,
  },
});

export default globalStyles;