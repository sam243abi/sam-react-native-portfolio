import React, { createContext, useContext, useState, useEffect } from 'react';
import { navigationConfig, getInitialRoute, getAuthRequiredRoutes } from './NavigationConfig';

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {

  const [currentRoute, setCurrentRoute] = useState('Login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState(['Login']);
  const [navigationParams, setNavigationParams] = useState({});

 
  useEffect(() => {
   
    setTimeout(() => {
      setIsAuthenticated(true);
    }, 100);
  }, []);


  const updateCurrentRoute = (route, params = {}) => {
    setCurrentRoute(route);
    setNavigationParams(prev => ({ ...prev, [route]: params }));
    
   
    setNavigationHistory(prev => {
      const newHistory = [...prev];
      if (newHistory[newHistory.length - 1] !== route) {
        newHistory.push(route);
      }
      return newHistory;
    });
  };


  const login = (userInfo = {}) => {
    setIsAuthenticated(true);
    updateCurrentRoute('Dashboard');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setNavigationHistory(['Login']);
    setNavigationParams({});
    updateCurrentRoute('Login');
  };

  const isRouteProtected = (route) => {
    const authRequiredRoutes = getAuthRequiredRoutes();
    return authRequiredRoutes.includes(route);
  };

  const canNavigateToRoute = (route) => {
    if (isRouteProtected(route)) {
      return isAuthenticated;
    }
    return true;
  };

  const getNavigationConfig = (type = 'bottomNavigation') => {
    return navigationConfig[type] || [];
  };

  const getRouteParams = (route) => {
    return navigationParams[route] || {};
  };

  const getPreviousRoute = () => {
    if (navigationHistory.length > 1) {
      return navigationHistory[navigationHistory.length - 2];
    }
    return null;
  };


  const contextValue = {
    
    currentRoute,
    isAuthenticated,
    navigationHistory,
    navigationParams,
    
   
    updateCurrentRoute,
    login,
    logout,
    
    
    isRouteProtected,
    canNavigateToRoute,
    getNavigationConfig,
    getRouteParams,
    getPreviousRoute,
    
   
    navigationConfig,
  };

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
};


export const useNavigationContext = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigationContext must be used within a NavigationProvider');
  }
  return context;
};


export const withNavigation = (Component) => {
  return (props) => {
    const navigationContext = useNavigationContext();
    return <Component {...props} navigationContext={navigationContext} />;
  };
};

export default NavigationContext;