import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert, // Added Alert for errors
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import globalStyles, { COLORS, DIMENSIONS } from '../../styles/globalStyles';
import phoneVerificationData from '../../data/phoneVerification.json';

// MODULAR FIREBASE IMPORTS FOR 2026
import { getAuth, signInWithPhoneNumber } from '@react-native-firebase/auth';

const PhoneVerification = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [agree, setAgree] = useState(true);
  const [loading, setLoading] = useState(false); // Added loading state

  const config = phoneVerificationData.phoneVerification;
  const pattern = config.validation.phonePattern;
  const maxLen = config.validation.maxLength;
  const isValid = new RegExp(pattern).test(phoneNumber) && agree;

  const handleChange = (text) => {
    const digitsOnly = text.replace(/[^0-9]/g, '');
    setPhoneNumber(digitsOnly);
  };
  const inputRef = useRef(null);

  // NEW: Firebase Phone Auth Logic
  const handleContinue = async () => {
    if (!isValid) {
      alert(config.messages.invalid);
      return;
    }

    setLoading(true);
    try {
      const auth = getAuth();
      // Combine country code + phone number
      const fullNumber = `+91${phoneNumber}`; 
      
      console.log('Requesting OTP for:', fullNumber);
      
      // Trigger Firebase Phone Auth
      const confirmation = await signInWithPhoneNumber(auth, fullNumber);
      
      // Pass the 'confirmation' object to the OTP screen
      navigation.navigate('OTP', { 
        phoneNumber: fullNumber, 
        confirm: confirmation 
      });
    } catch (error) {
      console.error('Firebase Auth Error:', error.code, error.message);
      Alert.alert('Error', 'Failed to send SMS. Please check your internet or phone number.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={globalStyles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true}
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
      >
        <View style={globalStyles.backgroundWrapper}>
          <View style={globalStyles.blueCurve} />
        </View>

        <View style={globalStyles.contentWrapper}>
          <View style={styles.headerContent}>
            <Text style={globalStyles.headerText1}>{config.titles.header1}</Text>
            <Text style={globalStyles.headerText2}>{config.titles.header2}</Text>
          </View>

          <View style={styles.bodyContainer}>
            <Image
              source={require('../../assets/images/Phone Verification.png')}
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={styles.brandText}>{config.brandName}</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.countryCode}>+91</Text>
              <TextInput
                ref={inputRef}
                style={globalStyles.inputFlex}
                placeholder={config.placeholders.phone}
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={handleChange}
                maxLength={maxLen}
                placeholderTextColor={COLORS.text.placeholder}
              />
            </View>
          </View>

          <View style={styles.bottomContainer}>
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setAgree(!agree)}
              >
                <Ionicons
                  name={agree ? 'checkbox' : 'square-outline'}
                  size={24}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
              <Text style={styles.checkboxText}>
                {config.messages.terms}
              </Text>
            </View>

            <TouchableOpacity 
              style={[
                globalStyles.primaryButton, 
                (!isValid || loading) && globalStyles.disabledButton
              ]} 
              onPress={handleContinue}
              disabled={!isValid || loading}
            >
              <Text style={globalStyles.primaryButtonText}>
                {loading ? 'Sending...' : config.buttons.continue}
              </Text>
            </TouchableOpacity>

            <Text style={globalStyles.footerText}>
              Already have an account?{' '}
              <Text style={globalStyles.linkText} onPress={handleLogin}>
                {config.buttons.login}
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

// Styles remain exactly as you provided
const styles = StyleSheet.create({
  headerContent: { alignItems: 'center', marginVertical: DIMENSIONS.spacing.lg, top: 70 },
  bodyContainer: { alignItems: 'center', justifyContent: 'center' },
  image: { width: 353, height: 256, marginBottom: DIMENSIONS.spacing.xl, top: 180 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border.light,
    borderRadius: DIMENSIONS.borderRadius.medium,
    paddingHorizontal: DIMENSIONS.spacing.lg,
    height: 48,
    backgroundColor: COLORS.white,
    width: DIMENSIONS.buttonWidth,
    top: 160,
  },
  countryCode: { fontSize: 16, color: COLORS.text.secondary, marginRight: 10, fontWeight: '500' },
  bottomContainer: { marginTop: DIMENSIONS.spacing.xl, paddingBottom: DIMENSIONS.spacing.xl, top: 160 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: DIMENSIONS.spacing.lg, right: -15 },
  brandText: { fontSize: 40, fontWeight: 'bold', color: COLORS.primary, marginBottom: 30, width:'100%', textAlign: 'center', top:130 },
  checkbox: { marginRight: 10 },
  checkboxText: { fontSize: 14, color: COLORS.text.muted, flex: 1 },
});

export default PhoneVerification;
