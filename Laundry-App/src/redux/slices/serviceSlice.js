import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  services: [],
  selectedServices: [],
  loading: false,
  error: null,
};

const serviceSlice = createSlice({
  name: 'service',
  initialState,
  reducers: {
    fetchServicesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchServicesSuccess: (state, action) => {
      state.loading = false;
      state.services = action.payload;
      state.error = null;
    },
    fetchServicesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    selectService: (state, action) => {
      const serviceId = action.payload.id;
      const quantity = action.payload.quantity || 1;
      
      const existingIndex = state.selectedServices.findIndex(
        item => item.id === serviceId
      );
      
      if (existingIndex !== -1) {
        state.selectedServices[existingIndex].quantity = quantity;
      } else {
        const service = state.services.find(s => s.id === serviceId);
        if (service) {
          state.selectedServices.push({
            ...service,
            quantity
          });
        }
      }
    },
    removeService: (state, action) => {
      state.selectedServices = state.selectedServices.filter(
        service => service.id !== action.payload
      );
    },
    updateServiceQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const serviceIndex = state.selectedServices.findIndex(s => s.id === id);
      
      if (serviceIndex !== -1) {
        state.selectedServices[serviceIndex].quantity = quantity;
      }
    },
    clearSelectedServices: (state) => {
      state.selectedServices = [];
    },
    clearServiceError: (state) => {
      state.error = null;
    },
  },
});

export const { 
  fetchServicesStart, 
  fetchServicesSuccess, 
  fetchServicesFailure, 
  selectService,
  removeService,
  updateServiceQuantity,
  clearSelectedServices,
  clearServiceError
} = serviceSlice.actions;

export default serviceSlice.reducer;