
export const navigationConfig = {

  bottomNavigation: [
    {
      key: 'Dashboard',
      icon: 'home',
      route: 'Dashboard',
      label: 'Home',
      requiresAuth: true,
    },
    {
      key: 'OrderList',
      icon: 'reader',
      route: 'OrderList',
      label: 'Orders',
      requiresAuth: true,
    },
    {
      key: 'Service',
      icon: 'shirt',
      route: 'Service',
      label: 'Services',
      requiresAuth: true,
    },
    {
      key: 'ProfileList',
      icon: 'person',
      route: 'ProfileList',
      label: 'Profile',
      requiresAuth: true,
    },
  ],

  screensWithNavigation: [
    'Dashboard',
    'Service', 
    'OrderList',
    'ProfileList',
    'Profile',
    'CollectionDelivery',
    'Delivery',
    'AddressBook'
  ],

  screensWithoutNavigation: [
    'Login',
    'LoginOtp',
    'PhoneVerification',
    'OTP',
    'OtpVerification'
  ],

  authNavigation: [
    {
      key: 'Login',
      route: 'Login',
      label: 'Login',
      isInitial: true,
    },
    {
      key: 'PhoneVerification',
      route: 'PhoneVerification',
      label: 'Phone Verification',
    },
    {
      key: 'OTP',
      route: 'OTP',
      label: 'OTP Verification',
    },
    {
      key: 'LoginOtp',
      route: 'LoginOtp',
      label: 'Login OTP',
    },
  ],

  mainNavigation: [
    {
      key: 'Dashboard',
      route: 'Dashboard',
      label: 'Dashboard',
      isInitial: true,
    },
    {
      key: 'Service',
      route: 'Service',
      label: 'Service',
    },
    {
      key: 'CollectionDelivery',
      route: 'CollectionDelivery',
      label: 'Collection & Delivery',
    },
    {
      key: 'Profile',
      route: 'Profile',
      label: 'Profile',
    },
    {
      key: 'Delivery',
      route: 'Delivery',
      label: 'Delivery',
    },
    {
      key: 'OrderList',
      route: 'OrderList',
      label: 'Orders',
    },
    {
      key: 'ProfileList',
      route: 'ProfileList',
      label: 'Profile Menu',
    },
    {
      key: 'AddressBook',
      route: 'AddressBook',
      label: 'Address book',
    },
  ],


  styles: {
    bottomNavigation: {
      height: 70,
      backgroundColor: '#fff',
      borderTopColor: '#eee',
      borderTopWidth: 1,
    },
    activeColor: '#00B2AC',
    inactiveColor: '#9CA3AF',
    fontSize: 12,
    iconSize: 22,
  },


  screenOptions: {
    headerShown: false,
    gestureEnabled: true,
    animationTypeForReplace: 'push',
  },
};


export const getNavigationItemByRoute = (route, navigationType = 'bottomNavigation') => {
  return navigationConfig[navigationType]?.find(item => item.route === route);
};

export const getAuthRequiredRoutes = () => {
  return navigationConfig.bottomNavigation
    .filter(item => item.requiresAuth)
    .map(item => item.route);
};

export const getInitialRoute = (navigationType = 'authNavigation') => {
  const initialItem = navigationConfig[navigationType]?.find(item => item.isInitial);
  return initialItem?.route || navigationConfig[navigationType]?.[0]?.route;
};


export const shouldShowNavigation = (routeName) => {
  return navigationConfig.screensWithNavigation.includes(routeName);
};

export const shouldHideNavigation = (routeName) => {
  return navigationConfig.screensWithoutNavigation.includes(routeName);
};

export default navigationConfig;