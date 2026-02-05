import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import globalStyles, { COLORS, DIMENSIONS } from '../styles/globalStyles';

const GlobalButton = ({ 
  title, 
  onPress, 
  style, 
  textStyle, 
  disabled = false,
  variant = 'primary' 
}) => {
  return (
    <TouchableOpacity
      style={[
        globalStyles.primaryButton,
        variant === 'secondary' && styles.secondaryButton,
        disabled && globalStyles.disabledButton,
        style
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={[
        globalStyles.primaryButtonText,
        variant === 'secondary' && styles.secondaryButtonText,
        disabled && styles.disabledButtonText,
        textStyle
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  secondaryButtonText: {
    color: COLORS.primary,
  },
  disabledButtonText: {
    color: '#999',
  },
});

export default GlobalButton;
