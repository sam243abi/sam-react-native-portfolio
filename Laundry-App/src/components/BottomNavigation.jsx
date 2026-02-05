import React from 'react';
import { View, TouchableOpacity, StyleSheet,Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../styles/globalStyles';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const BottomNavigation = ({ navigation, currentRoute = 'Dashboard' }) => {
  const navItems = [
    { key: 'Dashboard', icon: 'home', route: 'Dashboard' },
    { key: 'OrderList', icon: 'reader', route: 'OrderList' },
    { key: 'Notifications', icon: 'notifications', route: 'Notifications' },
    { key: 'ProfileList', icon: 'person', route: 'ProfileList' },
  ];

  return (
    <View style={styles.container}>
      {navItems.map((item) => {
        const isSelected = currentRoute === item.route;
        return (
          <TouchableOpacity
            key={item.key}
            style={styles.navItem}
            onPress={() => navigation.navigate(item.route)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, isSelected && styles.selectedIconContainer]}>
              <Ionicons
                name={isSelected ? item.icon : `${item.icon}-outline`}
               size={screenWidth * 0.065}
                color={isSelected ? '#00B2AC' : COLORS.gray[700]}
              />
            </View>
            {isSelected && <View style={styles.underline} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80, 
    backgroundColor: '#fff',
    flexDirection: 'row',
    paddingHorizontal: '8%',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 8,
    top:-5
  },
  iconContainer: {
    width: 44, 
    height: 44, 
    borderRadius: 22,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIconContainer: {
    backgroundColor: 'transparent',
  },
  underline: {
    position: 'absolute',
    bottom: 8,
    width: '35%', 
    height: 3,
    backgroundColor: '#00B2AC',
    borderRadius: 2,
  },
});

export default BottomNavigation;
