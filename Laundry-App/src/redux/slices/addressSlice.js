import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  addresses: [],
  loading: false,
  error: null,
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    // Load addresses from storage
    loadAddressesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loadAddressesSuccess: (state, action) => {
      state.loading = false;
      state.addresses = action.payload;
      state.error = null;
    },
    loadAddressesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Add new address
    addAddress: (state, action) => {
      state.addresses.push(action.payload);
    },
    
    // Update existing address
    updateAddress: (state, action) => {
      const index = state.addresses.findIndex(addr => addr.id === action.payload.id);
      if (index !== -1) {
        state.addresses[index] = action.payload;
      }
    },
    
    // Delete address
    deleteAddress: (state, action) => {
      state.addresses = state.addresses.filter(addr => addr.id !== action.payload);
    },
    
    // Set current address
    setCurrentAddress: (state, action) => {
      state.addresses = state.addresses.map(addr => ({
        ...addr,
        isCurrent: addr.id === action.payload
      }));
    },
    
    // Update collection method
    updateCollectionMethod: (state, action) => {
      const { addressId, methodId } = action.payload;
      const index = state.addresses.findIndex(addr => addr.id === addressId);
      if (index !== -1) {
        state.addresses[index].collectionMethod = methodId;
      }
    },
    
    // Update delivery method
    updateDeliveryMethod: (state, action) => {
      const { addressId, methodId } = action.payload;
      const index = state.addresses.findIndex(addr => addr.id === addressId);
      if (index !== -1) {
        state.addresses[index].deliveryMethod = methodId;
      }
    },
    
    // Clear all addresses
    clearAddresses: (state) => {
      state.addresses = [];
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loadAddressesStart,
  loadAddressesSuccess,
  loadAddressesFailure,
  addAddress,
  updateAddress,
  deleteAddress,
  setCurrentAddress,
  updateCollectionMethod,
  updateDeliveryMethod,
  clearAddresses,
  clearError,
} = addressSlice.actions;

export default addressSlice.reducer;
