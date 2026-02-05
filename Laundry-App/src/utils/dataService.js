// Import all JSON data files
import servicesData from '../data/services.json';
import navigationData from '../data/navigation.json';
import userProfileData from '../data/userProfile.json';
import ordersData from '../data/orders.json';
import appConfigData from '../data/appConfig.json';
import constantsData from '../data/constants.json';

// Icon components mapping
import { Ionicons, MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const iconMap = {
  'Ionicons': Ionicons,
  'MaterialIcons': MaterialIcons,
  'MaterialCommunityIcons': MaterialCommunityIcons,
  'FontAwesome5': FontAwesome5
};

/**
 * Data Service - Centralized data access layer
 */
export const DataService = {
  // App Configuration
  getAppConfig: () => appConfigData,
  getGreeting: () => {
    const hour = new Date().getHours();
    if (hour < 12) return appConfigData.greetings?.morning || 'Good Morning';
    if (hour < 18) return appConfigData.greetings?.afternoon || 'Good Afternoon';
    return appConfigData.greetings?.evening || 'Good Evening';
  },

  // Services
  getServices: () => servicesData.services || [],
  getServiceById: (id) => servicesData.services?.find(service => service.id === id),
  getServiceCategories: () => servicesData.serviceCategories || [],
  getFooterNotes: () => servicesData.footerNotes || [],
  getCurrentService: () => servicesData.currentService,

  // User Profile
  getProfileConfig: () => userProfileData.profileForm,
  getDefaultUser: () => appConfigData.user,

  // Orders
  getOrders: () => ordersData.orders || [],
  getOrderById: (id) => ordersData.orders?.find(order => order.id === id),

  // Constants
  getLoginConstants: () => constantsData.login,
  getServiceConstants: () => constantsData.service,
  getProfileConstants: () => constantsData.profile,

  // Navigation
  getBottomNavigation: () => navigationData.bottomNavigation || [],

  // Utilities
  getIconComponent: (iconFamily) => iconMap[iconFamily] || Ionicons,
};

export default DataService;