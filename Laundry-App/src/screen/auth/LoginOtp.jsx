

import React, { useRef, useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import globalStyles, { COLORS, DIMENSIONS } from '../../styles/globalStyles';
import loginOtpData from '../../data/loginOtp.json';

export default function LoginOtp({ navigation }) {
  const [otp, setOtp] = useState(['', '', '', '']);
  const config = loginOtpData.loginOtp;
  const [timer, setTimer] = useState(config.timer.initialSeconds);
  const inputs = useRef([]);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer]);

  const handleChange = (text, index) => {
    if (/^[0-9]$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      if (index < 3) {
        inputs.current[index + 1].focus();
      }
    } else if (text === '') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
    }
  };

  const resendOtp = () => {
    setTimer(config.timer.initialSeconds);

  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={globalStyles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>{config.titles.header}</Text>
            <Text style={globalStyles.subtitle}>
              {config.subtitle}
            </Text>
          </View>

          {/* Body Section */}
          <View style={styles.bodySection}>
            <View style={globalStyles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputs.current[index] = ref)}
                  style={[globalStyles.otpBox, styles.otpBoxCustom]}
                  keyboardType="numeric"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleChange(text, index)}
                />
              ))}
            </View>

            <Text style={[globalStyles.timerText, styles.timerCustom]}>
              Wait for 00:{timer < 10 ? `0${timer}` : timer}{' '}
              {timer === 0 && (
                <Text style={globalStyles.resendText} onPress={resendOtp}>
                  {config.messages.resend}
                </Text>
              )}
            </Text>
          </View>

          {/* Footer Section */}
          <View style={styles.footerSection}>
            <TouchableOpacity 
              style={globalStyles.primaryButton}
              onPress={() => navigation.navigate('Dashboard')}
            >
              <Text style={globalStyles.primaryButtonText}>{config.buttons.login}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={globalStyles.goBackText}>{config.buttons.goBack}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  headerSection: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 16,
    textAlign: 'center',
    top: 10
  },
  bodySection: {
    alignItems: 'center',
    marginTop: 20,
  },
  otpBoxCustom: {
    top: 50
  },
  timerCustom: {
    top: 70
  },
  footerSection: {
    width: '100%',
    paddingVertical: 300,
    position: 'absolute',
    bottom: 20,
    paddingHorizontal: 4,
    top:400,
  },
});
