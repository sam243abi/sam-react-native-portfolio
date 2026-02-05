import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomNavigation from '../../components/BottomNavigation';
import { shouldShowNavigation } from '../../navigation/NavigationConfig';
import globalStyles, { COLORS } from '../../styles/globalStyles';

const Layout = ({ children, navigation, currentRoute, forceShowNavigation = false, forceHideNavigation = false }) => {
  const insets = useSafeAreaInsets();
  
  const activeRoute = currentRoute;
  

  const showNavigation = forceHideNavigation 
    ? false 
    : (forceShowNavigation || shouldShowNavigation(activeRoute));
  
  console.log('Layout - Current Route:', activeRoute);
  console.log('Layout - Show Navigation:', showNavigation);

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={[styles.content, showNavigation && styles.contentWithNavigation]}>
        {children}
      </View>
      
      {/* Conditionally render BottomNavigation based on current route */}
      {showNavigation && (
        <BottomNavigation 
          navigation={navigation} 
          currentRoute={activeRoute} 
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background?.primary || COLORS.white,
  },
  content: {
    flex: 1,
  },
  contentWithNavigation: {
   
    paddingBottom: 80, 
  },
});

export default Layout;