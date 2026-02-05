
const onResponse = (response) => {
  return response;
};

const onResponseError = (error) => {
 
  if (error.response) {
   
    switch (error.response.status) {
      case 401:
       
        break;
      case 403:
        
        break;
      case 404:
       
        break;
      case 500:
        
        break;
      default:
        
        break;
    }
  } else if (error.request) {

  } else {
   
  }

  return Promise.reject(error);
};

export default {
  onResponse,
  onResponseError,
};