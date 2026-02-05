import { useSelector, useDispatch } from 'react-redux';

// Custom hook for accessing user state
export const useUser = () => {
  const user = useSelector((state) => state.user);
  return user;
};

// Custom hook for accessing order state
export const useOrders = () => {
  const orders = useSelector((state) => state.order);
  return orders;
};

// Custom hook for accessing service state
export const useServices = () => {
  const services = useSelector((state) => state.service);
  return services;
};

// Custom hook for accessing auth state
export const useAuth = () => {
  const { isAuthenticated, user, token } = useSelector((state) => state.user);
  return { isAuthenticated, user, token };
};