import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import orderReducer from './slices/orderSlice';
import serviceReducer from './slices/serviceSlice';
import addressReducer from './slices/addressSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    order: orderReducer,
    service: serviceReducer,
    address: addressReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;