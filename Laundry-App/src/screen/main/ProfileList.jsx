import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Modal,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import profileData from '../../data/profile.json';
import BottomNavigation from '../../components/BottomNavigation';

// --- FIREBASE MODULAR IMPORTS ---
import { getAuth, signOut, deleteUser } from '@react-native-firebase/auth';
import { getFirestore, doc, deleteDoc } from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';

const getIconComponent = (iconFamily) => {
  switch (iconFamily) {
    case 'MaterialIcons': return MaterialIcons;
    case 'Ionicons': return Ionicons;
    default: return MaterialIcons;
  }
};

export default function ProfileList() {
  const navigation = useNavigation();
  const { user, sections } = profileData;

  // --- DELETE MODAL STATES ---
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [timer, setTimer] = useState(10);
  const [isChecked, setIsChecked] = useState(false);

  // Handle the 10-second countdown when modal opens
  useEffect(() => {
    let interval = null;
    if (showDeleteModal && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [showDeleteModal, timer]);

  // --- LOGOUT LOGIC ---
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Logout", 
        onPress: async () => {
          try {
            await signOut(getAuth());
          } catch (e) {
            Alert.alert("Error", "Logout failed.");
          }
        } 
      },
    ]);
  };

  // --- DELETE ACCOUNT LOGIC ---
  const performDelete = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      const db = getFirestore(getApp(), 'wash-app-db');

      if (currentUser) {
        // 1. Delete Firestore Data first
        await deleteDoc(doc(db, 'users', currentUser.uid));
        // 2. Delete Auth Account
        await deleteUser(currentUser);
        
        setShowDeleteModal(false);
        Alert.alert("Account Deleted", "Your data has been wiped. You are now a new user.");
      }
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        Alert.alert("Security Check", "For your security, please logout and login again before deleting your account.");
      } else {
        Alert.alert("Error", "Could not delete account. Please try again later.");
      }
    }
  };

  const handleItemPress = (item) => {
    if (item.route) navigation.navigate(item.route);
  };

  const renderSection = (section) => (
    <View key={section.id} style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      {section.items.map((item) => {
        const IconComponent = getIconComponent(item.iconFamily);
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.item}
            onPress={() => handleItemPress(item)}
          >
            <IconComponent name={item.icon} size={24} color="#000" />
            <Text style={styles.itemText}>{item.text}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.profileContainer}>
          <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        {/* Dynamic Sections from JSON */}
        {sections.map(renderSection)}

        {/* --- NEW ACCOUNT ACTIONS SECTION --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Actions</Text>
          
          <TouchableOpacity style={styles.item} onPress={handleLogout}>
            <MaterialIcons name="logout" size={24} color="#000" />
            <Text style={styles.itemText}>Logout</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.item, { borderBottomWidth: 0 }]} 
            onPress={() => {
              setTimer(10);
              setIsChecked(false);
              setShowDeleteModal(true);
            }}
          >
            <MaterialIcons name="delete-forever" size={24} color="red" />
            <Text style={[styles.itemText, { color: 'red' }]}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* --- DELETE CONFIRMATION MODAL --- */}
      <Modal visible={showDeleteModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.deleteBox}>
            <Text style={styles.deleteHeader}>Delete Permanently?</Text>
            <Text style={styles.deleteSub}>This will wipe your profile and history from wash-app-db. This cannot be undone.</Text>
            
            <View style={styles.timerCircle}>
                <Text style={styles.timerText}>{timer > 0 ? timer : "✓"}</Text>
            </View>

            <TouchableOpacity 
                style={styles.checkboxRow} 
                onPress={() => timer === 0 && setIsChecked(!isChecked)}
                disabled={timer > 0}
            >
                <Ionicons 
                    name={isChecked ? "checkbox" : "square-outline"} 
                    size={24} 
                    color={timer > 0 ? "#ccc" : "#000"} 
                />
                <Text style={[styles.checkText, timer > 0 && {color: '#ccc'}]}> I understand all data will be lost.</Text>
            </TouchableOpacity>

            <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowDeleteModal(false)}>
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[styles.deleteBtn, (!isChecked || timer > 0) && {backgroundColor: '#ccc'}]}
                    onPress={performDelete}
                    disabled={!isChecked || timer > 0}
                >
                    <Text style={{color: '#fff', fontWeight: 'bold'}}>Delete Forever</Text>
                </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <BottomNavigation navigation={navigation} currentRoute="ProfileList" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  scrollContent: { padding: 15, paddingBottom: 110 },
  profileContainer: { backgroundColor: '#fff', alignItems: 'center', paddingVertical: 20, borderRadius: 10, marginBottom: 15 },
  profileImage: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
  name: { fontSize: 18, fontWeight: 'bold' },
  email: { fontSize: 14, color: '#777' },
  section: { backgroundColor: '#fff', borderRadius: 10, padding: 10, marginBottom: 15 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: '#ccc' },
  itemText: { marginLeft: 15, fontSize: 14, color: '#000' },
  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  deleteBox: { width: '85%', backgroundColor: '#fff', borderRadius: 20, padding: 25, alignItems: 'center' },
  deleteHeader: { fontSize: 20, fontWeight: 'bold', color: 'red', marginBottom: 10 },
  deleteSub: { textAlign: 'center', color: '#666', marginBottom: 20, fontSize: 14 },
  timerCircle: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: 'red', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  timerText: { fontSize: 22, fontWeight: 'bold', color: 'red' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  checkText: { fontSize: 14, marginLeft: 8 },
  modalButtons: { flexDirection: 'row', width: '100%', justifyContent: 'space-between' },
  cancelBtn: { padding: 15, width: '45%', alignItems: 'center' },
  cancelBtnText: { color: '#333', fontWeight: '600' },
  deleteBtn: { backgroundColor: 'red', padding: 15, width: '45%', borderRadius: 10, alignItems: 'center' }
});
