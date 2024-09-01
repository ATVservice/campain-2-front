

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
    const response = await apiConfig.post('/api/alfon/upload', data);
   
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getPeople = async () => {
  try {
    const response = await apiConfig.get('/api/alfon');
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const uploadCommitment = async (data) => {
  try {
    // לוג של הנתונים שנשלחים לשרת
    console.log('Data being sent to server:', data);

    const response = await apiConfig.post('/api/commitment/upload', data);
    
    // לוג לרספונס שהתקבל
    console.log('Upload Commitment Response:', response);

    return response;

  } catch (error) {
    console.log('Error uploading commitment:', error);
  }
};


export const getCommitment = async () => {
  try {
    const response = await apiConfig.get('/api/commitment'); 
    return response;
  } catch (error) {
    console.log(error);
  }
}

export const uploadPayment = async (paymentData) => {
  try {
    const response = await apiConfig.post('/api/payment/uploadPayment', paymentData);
    console.log(response);
    
    return response;
  } catch (error) {
    console.error('Error uploading payment:', error);
    throw error; // Optional: re-throw the error if you want to handle it outside the function
  }
};

export const getUserDetails = async (anashIdentifier) => {
  try {
    console.log(anashIdentifier);
    const response = await apiConfig.get(`/api/alfon/get-user-details/${anashIdentifier}`);

    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getCommitmentDetails = async (_id) => {
  try {
    const response = await apiConfig.get(`/api/commitment/get-commitment/${_id}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteCommitment = async (commitmentId) => {
  try {
    console.log(commitmentId);
    const response = await apiConfig.delete(`/api/commitment/delete-commitment/${commitmentId}`);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const updateCommitmentDetails = async (commitmentId, updatedData) => {
  try {
    const response = await apiConfig.post(`/api/commitment/update-commitment-details/${commitmentId}`, updatedData);
    return response;
  } catch (error) {
    console.error('Error updating commitment:', error);
    throw error;
  }
};


export const upadateUserDetails = async (data) => {
  try {
    console.log('e',data);
    const response = await apiConfig.post(`/api/alfon/update-user-details`,data);

    return response;
  } 
  catch (error) {
    console.log(error);
  }
}
export const deleteUser= async (anashIdentifier) => {
  try {
    console.log(anashIdentifier);
    const response = await apiConfig.delete(`/api/alfon/delete-user/${anashIdentifier}`);
    return response;
  } catch (error) {
    console.log(error);
  }
}
export const addCampain= async (data) => {
  try {
    const response = await apiConfig.post(`/api/campain/add-campain`,data);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export const getCampains= async () => {
  try {
    const response = await apiConfig.get(`/api/campain/get-campains`);
    return response;
  } catch (error) {
    console.log(error);
  }
}
export const getCampainPeople= async (campainId) => {
  try {
    const response = await apiConfig.get(`/api/campain/get-campain-people/${campainId}`);
    return response;
  } catch (error) {
    console.log(error);
  }
}
export const addPersonToCampain= async (data) => {
  try {
    const response = await apiConfig.post(`/api/campain/add-person-to-campain`,data);
    return response;
  } catch (error) {
    console.log(error);
  }
}
  

