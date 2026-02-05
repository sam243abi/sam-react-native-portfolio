import React from 'react';
import { NavigationContainer as RNNavigationContainer } from '@react-navigation/native';
import Route from './Route';
import { navigationRef } from './NavigationService';

const NavigationContainer = () => {
  return (
    <RNNavigationContainer ref={navigationRef}>
      <Route />
    </RNNavigationContainer>
  );
};

export default NavigationContainer;