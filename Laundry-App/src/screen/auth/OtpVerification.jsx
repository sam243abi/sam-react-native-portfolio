import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native'; // Added useRoute
import globalStyles, { COLORS, DIMENSIONS } from '../../styles/globalStyles';
import otpVerificationData from '../../data/otpVerification.json';

const OtpVerification = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Get the confirm object and phone number from navigation params
  const { confirm, phoneNumber } = route.params || {};

  // Updated to 6 digits for Firebase 2026 standards
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  
  const config = otpVerificationData.otpVerification;
  const [timer, setTimer] = useState(config.timer.initialSeconds);
  const inputs = useRef([]);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer]);

  const handleChange = (text, index) => {
    // Standard digit entry
    if (/^[0-9]$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      // Auto focus next box if not at the end
      if (index < 5) {
        inputs.current[index + 1].focus();
      }
    } 
    // Handle backspace
    else if (text === '') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      // Auto focus previous box on delete
      if (index > 0) {
        inputs.current[index - 1].focus();
      }
    }
  };

  // MODULAR FIREBASE LOGIN LOGIC
  const handleContinue = async () => {
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      Alert.alert('Error', config.messages.incompleteOtp || "Please enter all 6 digits");
      return;
    }

    if (!confirm) {
      Alert.alert('Error', 'Session expired. Please go back and try again.');
      return;
    }

    setLoading(true);
    try {
      console.log('Verifying OTP code...');
      // confirm is the object returned from signInWithPhoneNumber in the previous screen
      const userCredential = await confirm.confirm(otpCode);
      
      console.log('SUCCESS: User signed in:', userCredential.user.uid);
      
      // Navigate to Profile or Dashboard
      navigation.navigate('Profile'); 
    } catch (error) {
      console.error('OTP Error:', error.code, error.message);
      let errorMsg = 'Invalid OTP code. Please try again.';
      if (error.code === 'auth/invalid-verification-code') errorMsg = 'The code you entered is incorrect.';
      if (error.code === 'auth/session-expired') errorMsg = 'The session has expired. Please resend the code.';
      
      Alert.alert('Verification Failed', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = () => {
    // In a real app, you would call navigation.goBack() 
    // to trigger the phone number screen again for a fresh SMS
    setTimer(config.timer.initialSeconds);
    Alert.alert("Resend", "Please go back to re-trigger the SMS if the timer expired.");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={globalStyles.container}
      >
        <View style={globalStyles.backgroundWrapper}>
          <View style={globalStyles.blueCurve} />
        </View>

        <View style={globalStyles.contentWrapper}>
          <View style={styles.headerContent}>
            <Text style={globalStyles.headerText1}>{config.titles.header1}</Text>
            <Text style={globalStyles.headerText2}>
              Sent to {phoneNumber || 'your number'}
            </Text>
          </View>

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
                  onKeyPress={({ nativeEvent }) => {
                    // Specific fix for Android backspace detection
                    if (nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
                      inputs.current[index - 1].focus();
                    }
                  }}
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

          <View style={styles.bottomContainer}>
            <TouchableOpacity
              style={[globalStyles.primaryButton, loading && { opacity: 0.7 }]}
              onPress={handleContinue}
              disabled={loading}
            >
              <Text style={globalStyles.primaryButtonText}>
                {loading ? 'Verifying...' : config.buttons.continue}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={globalStyles.goBackText}>{config.buttons.goBack}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  headerContent: {
    alignItems: 'center',
    marginBottom: DIMENSIONS.spacing.xxl,
    top: 80
  },
  bodySection: {
    alignItems: 'center',
    marginTop: DIMENSIONS.spacing.lg,
  },
  otpBoxCustom: {
    top: 250,
    marginHorizontal: 4, // Added a little space for the 6 boxes
    width: 45, // Slightly narrower to fit 6 in a row
  },
  timerCustom: {
    top: 250,
  },
  bottomContainer: {
    width: '100%',
    paddingBottom: DIMENSIONS.spacing.xl,
    top: 450,
  },
});

export default OtpVerification;
