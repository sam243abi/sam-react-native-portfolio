import axios from 'axios';
import { BASE_URL } from './urls';
import requestInterceptor from './requestInterceptor';
import responseInterceptor from './responseInterceptor';


const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, 
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(
  requestInterceptor.onRequest,
  requestInterceptor.onRequestError
);

apiClient.interceptors.response.use(
  responseInterceptor.onResponse,
  responseInterceptor.onResponseError
);

export default apiClient;