

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
export const getAlfonChanges = async (data) => {
  try {
    const response = await apiConfig.post('/api/alfon/get-alfon-changes', data);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const uploadCommitment = async (data) => {
  try {
    console.log(data);
    
    const response = await apiConfig.post('/api/commitment/upload', data);
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
    console.log(paymentData);
    
    const response = await apiConfig.post('/api/payment/uploadPayment', paymentData);
    console.log(response);
    
    return response;
  } catch (error) {
    console.error('Error uploading payment:', error);
    throw error; // Optional: re-throw the error if you want to handle it outside the function
  }
};

// export const uploadCommitmentPayment = async (paymentData) => {
//   try {
//     console.log(paymentData);
    
//     const response = await apiConfig.post('/api/payment/uploadCommitmentPayment', paymentData);
//     console.log(response);
    
//     return response;
//   } catch (error) {
//     console.error('Error uploading payment:', error);
//     throw error; // Optional: re-throw the error if you want to handle it outside the function
//   }
// };

export const getUserDetails = async (AnashIdentifier) => {
  try {
    console.log(AnashIdentifier);
    const response = await apiConfig.get(`/api/alfon/get-user-details/${AnashIdentifier}`);

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
export const deleteUser= async (AnashIdentifier) => {
  try {
    console.log(AnashIdentifier);
    const response = await apiConfig.delete(`/api/alfon/delete-user/${AnashIdentifier}`);
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
export const getPeopleNotInCampain= async (campainId) => {
  try {
    const response = await apiConfig.get(`/api/campain/get-people-not-in-campain/${campainId}`);
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
export const addPeopleToCampain= async (data) => {
  try {
    const response = await apiConfig.post(`/api/campain/add-people-to-campain`,data);
    return response;
  } catch (error) {
    console.log(error);
  }
}
export const addPerson= async (data) => {
  try {
    const response = await apiConfig.post(`/api/alfon/add-user`,data);
    return response;
  } catch (error) {
    console.log(error);
  }
}
export const getCommitmentByAnashAndCampain= async (AnashIdentifier, CampainName) => {
  try {
    const response = await apiConfig.get(`api/commitment/get-commitment-by-anash-and-campain?AnashIdentifier=${AnashIdentifier}&CampainName=${CampainName}`);
    return response;
  } catch (error) {
    throw error
  }
}
export const uploadCommitmentPayment = async (data) => {
  console.log(data)
  try {
    const response = await apiConfig.post(`/api/commitment/upload-commitment-payment`,data);
    return response;
  } catch (error) {
    throw error
  }
}



  
  

