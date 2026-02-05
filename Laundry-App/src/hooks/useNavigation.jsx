import { useNavigation as useReactNavigation } from '@react-navigation/native';
import * as NavigationService from '../navigation/NavigationService';

// Custom hook that combines React Navigation's useNavigation with our NavigationService
export const useNavigation = () => {
  const navigation = useReactNavigation();
  
  return {
    ...navigation,
    navigateTo: NavigationService.navigate,
    goBack: NavigationService.goBack,
    resetRoot: NavigationService.reset,
  };
};

export default useNavigation;