import React, { useState } from 'react';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  Keyboard,
  Dimensions,
} from 'react-native';
import globalStyles, { COLORS, DIMENSIONS as GLOBAL_DIMS } from '../../styles/globalStyles';
import loginData from '../../data/login.json';

const { height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  

  const loginConfig = loginData.login;
  console.log('Full login data:', loginData);
  console.log('Login config:', loginConfig);

  const isValid = new RegExp(loginConfig.validation.phonePattern).test(phone);

  const handlePhoneChange = (text) => {
    const digitsOnly = text.replace(/[^0-9]/g, '');
    setPhone(digitsOnly);
  };

  const handleContinue = () => {
    if (isValid) {
      navigation.navigate('LoginOtp');
    }
  };

  const handleSignUp = () => {
    navigation.navigate('PhoneVerification');
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View style={styles.topContent}>
              <Image
                source={require('../../assets/images/Welcom.png')}
                style={styles.image}
              />
              <Text style={styles.welcomeText}>{loginConfig.welcomeText}</Text>
              <Text style={styles.brandText}>{loginConfig.brandName}</Text>

              <View style={styles.inputWrapper}>
                <View style={styles.prefixContainer}>
                  <Text style={styles.prefixText}>{loginConfig.phonePrefix}</Text>
                </View>
                <TextInput
                  style={globalStyles.inputFlex}
                  placeholder={loginConfig.placeholders.phone}
                  value={phone}
                  onChangeText={handlePhoneChange}
                  keyboardType="phone-pad"
                  maxLength={loginConfig.validation.maxLength}
                  placeholderTextColor={COLORS.text.placeholder}
                />
              </View>
            </View>

            <View style={styles.bottomContent}>
              <TouchableOpacity
                style={[globalStyles.primaryButton, !isValid && globalStyles.disabledButton, styles.buttonFullWidth]}
                onPress={handleContinue}
                disabled={!isValid}
              >
                <Text style={globalStyles.primaryButtonText}>{loginConfig.buttons.continue}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleSignUp}>
                <Text style={globalStyles.footerText}>
                  {loginConfig.messages.noAccount}{' '}
                  <Text style={globalStyles.linkText}>{loginConfig.buttons.signUp}</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  keyboardAvoiding: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: '5%', 
    paddingVertical: '5%',
  },
  topContent: {
    alignItems: 'center',
    marginTop: '8.75%', 
  },
  welcomeText: {
    fontSize: 27,
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  brandText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: '7.5%', 
    textAlign: 'center',
  },
  image: {
    width: '80%',
    height: height * 0.35,
    resizeMode: 'contain',
    marginBottom: '5%', 
  },
  inputWrapper: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.border.medium,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: '3.75%', 
    paddingVertical: '3.75%', 
    marginBottom: '5%', 
    backgroundColor: COLORS.white,
  },
  prefixContainer: {
    paddingRight: '2.5%', 
  },
  prefixText: {
    fontSize: 18,
    color: COLORS.text.primary,
  },
  bottomContent: {
    width: '100%',
  },
  buttonFullWidth: {
    width: '100%',
  },
});