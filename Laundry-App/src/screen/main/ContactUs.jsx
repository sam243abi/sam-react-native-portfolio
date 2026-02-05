import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, ScrollView } from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import contactData from '../../data/contactUs.json';
import Illustration from '../../assets/images/Illustration.png';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function ContactUs({ navigation, route }) {
  const handleRate = async () => {
    const url = contactData.cta?.url;
    if (!url) return;
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.log('Error opening URL:', error);
    }
  };

  const handlePhonePress = async () => {
    const phoneNumber = contactData.phone;
    const phoneUrl = `tel:${phoneNumber}`;
    try {
      await Linking.openURL(phoneUrl);
    } catch (error) {
      console.log('Error opening dialer:', error);
    }
  };

  const handleEmailPress = async () => {
    const email = contactData.email;
    const emailUrl = `mailto:${email}`;
    try {
      await Linking.openURL(emailUrl);
    } catch (error) {
      console.log('Error opening email:', error);
    }
  };

  return (
    <ScreenWrapper navigation={navigation} route={route}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.hero}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.title}>{contactData.title}</Text>
            <Image source={Illustration} style={styles.illustration} resizeMode="contain" />
          </View>

          <View style={styles.card}>
            <Text style={styles.brand}>{contactData.brand}</Text>

            <TouchableOpacity style={styles.row} onPress={handlePhonePress} activeOpacity={0.7}>
              <View style={styles.iconBox}>
                <MaterialIcons name="call" size={22} color="#00B2AC" />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.label}>{contactData.phoneLabel}</Text>
                <Text style={styles.value}>{contactData.phone}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.row} onPress={handleEmailPress} activeOpacity={0.7}>
              <View style={styles.iconBox}>
                <MaterialIcons name="mail-outline" size={22} color="#FF8A65" />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.label}>{contactData.emailLabel}</Text>
                <Text style={styles.value}>{contactData.email}</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.about}>
            <Text style={styles.aboutTitle}>{contactData.aboutTitle}</Text>
            <Text style={styles.aboutText}>{contactData.about}</Text>
          </View>

          <TouchableOpacity style={styles.cta} activeOpacity={0.8} onPress={handleRate}>
            <Ionicons name={contactData.cta?.icon || 'star-outline'} size={20} color="#FF8A65" />
            <Text style={styles.ctaText}>{contactData.cta?.text}</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EFEFEF' },
  scrollContent: { paddingBottom: '6%' },
  hero: {
    backgroundColor: '#EA895E',
    paddingTop: '10%',
    paddingBottom: '16%',
    alignItems: 'center',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  backButton: {
    position: 'absolute',
    left: 12,
    top: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { color: '#fff', fontSize: 18, fontWeight: '600', marginBottom: '4%' },
  illustration: { width: '60%', height: undefined, aspectRatio: 240 / 179 },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: '6%',
    marginTop: -40,
    borderRadius: 16,
    padding: '5%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  brand: { fontSize: 16, fontWeight: '600', marginBottom: '4%', color: '#222' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: '3%',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F2F6F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '4%',
  },
  rowText: { flex: 1 },
  label: { color: '#7A7A7A', fontSize: 13 },
  value: { color: '#222', fontSize: 14, fontWeight: '600', marginTop: 2 },

  about: { marginHorizontal: '6%', marginTop: '6%' },
  aboutTitle: { fontSize: 16, fontWeight: '700', color: '#222', marginBottom: 8 },
  aboutText: { color: '#666', lineHeight: 20 },

  cta: {
    marginHorizontal: '6%',
    marginTop: '8%',
    marginBottom: '4%',
    borderWidth: 2,
    borderColor: '#00B2AC',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
  },
  ctaText: { color: '#1D1D1D', fontWeight: '600' },
});