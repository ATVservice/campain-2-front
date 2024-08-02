

import axios from 'axios';
import { useNavigate ,useLocation} from 'react-router-dom';

// Create an axios instance with default configurations
const apiConfig = axios.create({
    baseURL: 'http://localhost:4000',
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true // Set this globally if you need it for all requests
  });
  
export const uploadPeople = async (data) => {
  try {
    const response = await apiConfig.post('/api/alfon', data);
   
    return response;
  } catch (error) {
    console.log(error);
    
  }
};
