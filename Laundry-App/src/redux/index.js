import store from './store';

export { default as userReducer } from './slices/userSlice';
export { default as orderReducer } from './slices/orderSlice';
export { default as serviceReducer } from './slices/serviceSlice';

export * from './slices/userSlice';
export * from './slices/orderSlice';
export * from './slices/serviceSlice';

export { store };
export default store;