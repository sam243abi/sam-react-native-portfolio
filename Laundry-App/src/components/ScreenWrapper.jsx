import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Layout from '../screen/main/Layout';
import { shouldShowNavigation } from '../navigation/NavigationConfig';


const ScreenWrapper = ({ 
  children, 
  navigation, 
  route, 
  forceShowNavigation = false,
  forceHideNavigation = false 
}) => {
  const routeName = route?.name || 'Unknown';
  const insets = useSafeAreaInsets();
  
  const showNavigation = forceHideNavigation 
    ? false 
    : (forceShowNavigation || shouldShowNavigation(routeName));

  console.log('ScreenWrapper - Route:', routeName, 'Show Nav:', showNavigation);

  if (!showNavigation) {
   
    return (
      <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
        {children}
      </View>
    );
  }


  return (
    <Layout 
      navigation={navigation} 
      currentRoute={routeName}
      forceShowNavigation={forceShowNavigation}
      forceHideNavigation={forceHideNavigation}
    >
      {children}
    </Layout>
  );
};

export default ScreenWrapper;