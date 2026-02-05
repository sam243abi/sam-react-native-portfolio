

const onRequest = (config) => {

  const token = '';
  
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  
  return config;
};

const onRequestError = (error) => {
  return Promise.reject(error);
};

export default {
  onRequest,
  onRequestError,
};