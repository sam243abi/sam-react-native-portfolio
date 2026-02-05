import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { ActivityIndicator, View, LogBox } from 'react-native';

// Firebase Modular Imports
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { getApp } from '@react-native-firebase/app';
import { getFirestore, doc, onSnapshot } from '@react-native-firebase/firestore'; // Changed getDoc to onSnapshot

// Screens
import PhoneVerification from './src/screen/auth/PhoneVerification';
import OtpVerification from "./src/screen/auth/OtpVerification";
import Profile from "./src/screen/main/Profile";
import Login from './src/screen/auth/Login';
import LoginOtp from './src/screen/auth/LoginOtp';
import Dashboard from './src/screen/main/Dashboard';
import OrderList from './src/screen/main/OrderList';
import ProfileList from './src/screen/main/ProfileList';
import AddressBook from './src/screen/main/AddressBook';
import Schedule from './src/screen/main/Schedule';
import ContactUs from './src/screen/main/ContactUs';
import Map from './src/screen/main/Map';
import EnterCompleteAddress from './src/screen/main/EnterCompleteAddress';

// Ignore the non-serializable warning for the Firebase confirmation object
LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);

const Stack = createNativeStackNavigator();

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore(getApp(), 'wash-app-db');
    let unsubscribeDoc = null;

    // Listener for Auth state
    const subscriber = onAuthStateChanged(auth, (authenticatedUser) => {
      setUser(authenticatedUser);

      // Clean up previous document listener if user changes
      if (unsubscribeDoc) {
        unsubscribeDoc();
        unsubscribeDoc = null;
      }

      if (authenticatedUser) {
        // REAL-TIME LISTENER: Detects when profile is created or deleted
        const userRef = doc(db, 'users', authenticatedUser.uid);
        
        unsubscribeDoc = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            console.log("Profile detected in wash-app-db!");
            setHasProfile(true);
          } else {
            console.log("No profile found for this user.");
            setHasProfile(false);
          }
          
          if (initializing) setInitializing(false);
        }, (error) => {
          console.error("Firestore Listener Error:", error);
          if (initializing) setInitializing(false);
        });
      } else {
        // User is logged out
        setHasProfile(false);
        if (initializing) setInitializing(false);
      }
    });

    return () => {
      subscriber(); // Cleanup Auth listener
      if (unsubscribeDoc) unsubscribeDoc(); // Cleanup Firestore listener
    };
  }, []);

  // Show a loading spinner while checking Firebase
  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* ADD THIS LINE HERE - This makes the icons black */}
      <StatusBar style="dark" />
      
      <Provider store={store}>
        <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              {!user ? (
                // FLOW A: Not logged in
                <>
                  <Stack.Screen name="PhoneVerification" component={PhoneVerification} />
                  <Stack.Screen name="OTP" component={OtpVerification} />
                  <Stack.Screen name="Login" component={Login} />
                  <Stack.Screen name="LoginOtp" component={LoginOtp} />
                </>
              ) : !hasProfile ? (
                // FLOW B: Logged in, but needs to finish Profile
                <Stack.Screen name="Profile" component={Profile} />
              ) : (
                // FLOW C: Fully authorized, show the App
                <>
                  <Stack.Screen name="Dashboard" component={Dashboard} />
                  <Stack.Screen name="OrderList" component={OrderList} />
                  <Stack.Screen name="ProfileList" component={ProfileList} />
                  <Stack.Screen name="AddressBook" component={AddressBook} />
                  <Stack.Screen name="Schedule" component={Schedule} />
                  <Stack.Screen name="ContactUs" component={ContactUs} />
                  <Stack.Screen name="Map" component={Map} />
                  <Stack.Screen name="EnterCompleteAddress" component={EnterCompleteAddress} />
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  );

};

export default App;
