

import axios from 'axios';
import { useNavigate ,useLocation} from 'react-router-dom';

// Create an axios instance with default configurations 
const apiConfig = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true // Set this globally if you need it for all requests
  });
  
  apiConfig.interceptors.request.use(
    (config) =>  {
      const token = sessionStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    }
    ,
    (error) => {
      return Promise.reject(error);
    }
    
  )
export const uploadPeople = async (data) => {
  try {
    const response = await apiConfig.post('/api/alfon/upload', data);
   
    return response;
  } catch (error) {
    throw error
    console.log(error);
  }
};

export const getPeople = async (isActive) => {
  console.log(isActive);
  try {
    const response = await apiConfig.get(`/api/alfon?isActive=${isActive}`);
    return response;
  } catch (error) {
    console.log(error);
    throw error
  }
};
export const reviewUploadedPeople = async (data) => {
  try {
    const response = await apiConfig.post('/api/alfon/review-uploaded-people', data);
    return response;
  } catch (error) {
    throw error
    console.log(error);
  }
};

export const uploadCommitment = async (data) => {
  try {
    console.log(data);
    
    const response = await apiConfig.post('/api/commitment/upload', data);
    return response;
  } catch (error) {
    throw error
    console.log('Error uploading commitment:', error);
  }
};


export const getCommitment = async (isActive=null) => {
  try {
    const response = await apiConfig.get(`/api/commitment?isActive=${isActive}`); 
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getCommitmentsByCampaign = async (campainName, isActive=null) => { // Fixed "campainName" typo
  try {
    console.log(campainName);
    const response = await apiConfig.get(`/api/commitment/getCommitmentsByCampaign?campainName=${encodeURIComponent(campainName)}&isActive=${encodeURIComponent(isActive)}`);
    return response.data; // It's common to return `response.data`, not the full response object
  } catch (error) {
    console.error("Error fetching commitments:", error); // Improved error logging
    throw error; // Rethrow the error to handle it where the function is called
  }
};

export const uploadPayment = async (paymentData) => {
  try {
    console.log('eeee');
    
    const response = await apiConfig.post('/api/payments/uploadPayment', paymentData);
    console.log(response);
    
    return response;
  } catch (error) {
    console.error('Error uploading payment:', error);
    throw error; // Optional: re-throw the error if you want to handle it outside the function
  }
};

export const deletePayment = async (paymentId) => {
  try {
    console.log(paymentId);
    const response = await apiConfig.delete(`/api/payments/delete-payment/${paymentId}`);
    return response;
  } catch (error) {
    console.error('Error deleting payment:', error);
    throw error;
  }
};


export const getUserDetails = async (AnashIdentifier) => {
  try {
    console.log(AnashIdentifier);
    const response = await apiConfig.get(`/api/alfon/get-user-details/${AnashIdentifier}`);

    return response;
  } catch (error) {
    throw error
    console.log(error);
  }
};

export const getCommitmentDetails = async (_id) => {
  try {
    const response = await apiConfig.get(`/api/commitment/get-commitment/${_id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


export const deleteCommitment = async (commitmentId) => {
  try {
    console.log(commitmentId);
    const response = await apiConfig.delete(`/api/commitment/delete-commitment/${commitmentId}`);
    return response;
  } catch (error) {
    throw error
    console.log(error);
  }
};

export const updateCommitmentDetails = async (commitment) => {
  try {
    const response = await apiConfig.post(`/api/commitment/update-commitment-details`, commitment);
    return response;
  } catch (error) {
    console.error('Error updating commitment:', error);
    throw error;
  }
};
export const uploadCommitmentPayment = async (payment) => {
  try {
    const response = await apiConfig.post(`/api/payments/upload-commitment-payment`, payment);
    return response;
  } catch (error) {
    console.error(error);
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
    throw error
    console.log(error);
  }
}
export const deleteUser= async (AnashIdentifier) => {
  try {
    console.log(AnashIdentifier);
    const response = await apiConfig.delete(`/api/alfon/delete-user/${AnashIdentifier}`);
    return response;
  } catch (error) {
    throw error
  }
}
export const addCampain= async (data) => {
  try {    
    const response = await apiConfig.post(`/api/campain/add-campain`,data);
    return response;
  } catch (error) {
    throw error
  }
}

export const getCampains= async () => {
  try {
    const response = await apiConfig.get(`/api/campain/get-campains`);
    return response;
  } catch (error) {
      throw error
    console.log(error);
  }
}
export const getCampainPeople= async (campainName) => {
  try {
    const response = await apiConfig.get(`/api/campain/get-campain-people/${campainName}`);
    return response;
  } catch (error) {

    console.log(error);
    throw error
  }
}
export const getPeopleNotInCampain= async (campainName) => {
  try {
    const response = await apiConfig.get(`/api/campain/get-people-not-in-campain/${campainName}`);
    return response;
  } catch (error) {
    console.log(error);
    throw error
  }
}
export const addPersonToCampain= async (data) => {
  try {
    console.log(data);
    
    const response = await apiConfig.post(`/api/campain/add-person-to-campain`,data);
    return response;
  } catch (error) {
    throw error
  }
}

export const deletePersonFromCampain= async (AnashIdentifier, campainName) => {
  try {
    const response = await apiConfig.delete(`/api/campain/delete-person-from-campain/${AnashIdentifier}/${campainName}`);
    return response;
  } catch (error) {
throw error
  }
}

export const getCommitmentInCampain= async (campainName,isActive=null) => {
  try {
    const response = await apiConfig.get(`/api/campain/get-commitment-in-campain/${campainName}?isActive=${isActive}`);
    return response;
  } catch (error) {
    throw error
    console.log(error);
  }
  
}


export const addPerson= async (data) => {
  try {
    const response = await apiConfig.post(`/api/alfon/add-user`,data);
    return response;
  } catch (error) {
    throw error
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
export const reviewCommitmentsPayments = async (data,campainName) => {
  try {
    const response = await apiConfig.post(`/api/payments/review-commitment-payments`,{data,campainName});
    return response;
  } catch (error) {
    throw error
  }
}
export const uploadCommitmentsPayments = async (data) => {
  try {
    const response = await apiConfig.post(`/api/payments/upload-commitment-payments`,data);
    return response;
  } catch (error) {
    throw error
  }
}
export const AddMemorialDay = async (data) => {
  try {
    const response = await apiConfig.post(`/api/commitment/add-memorial-day`,data);
    return response;
  } catch (error) {
    throw error
  }
}
export const GetEligblePeopleToMemmorialDay = async (campainName) => {
  try {
    const response = await apiConfig.get(`/api/commitment/get-eligible-people/${campainName}`);
    return response;
  } catch (error) {
    throw error
  }
}
export const DeleteMemorialDay = async (campainName,AnashIdentifier,date) => {
  try {
    const response = await apiConfig.delete(`/api/commitment/delete-memorial-day?AnashIdentifier=${AnashIdentifier}&CampainName=${campainName}&date=${date}`);
    return response;
  } catch (error) {
    throw error
  }
}
export const getCampainByName = async (campainName) => {
  try {
    const response = await apiConfig.get(`/api/campain/get-campain-by-name/${campainName}`);
    return response;
  } catch (error) {
    throw error
  }
}
export const getAllMemorialDates = async (campainName) => {
  try {
    const response = await apiConfig.get(`/api/campain/get-all-memorial-dates/${campainName}`);
    return response;
  } catch (error) {
    throw error
  }
}

export const getTransactions = async () => {
  try {
    const response = await apiConfig.get('/api/transaction'); 
    return response;
  } catch (error) { 
    throw error
    console.log(error);
  }
}

export const deleteTransaction = async (transactionId) => {
  try {   
    const response = await apiConfig.delete(`/api/transaction/delete-transaction?transactionId=${transactionId}`); 
    return response;
  } catch (error) {
    throw error
    console.log(error);
  }
}

export const addExpense = async (newExpense) => {
  try {
    console.log(newExpense);  
    const response = await apiConfig.post('/api/transaction/create-expense', newExpense); 
    return response;
  } catch (error) {
    throw error
    console.log(error);
  }
}

export const login = async (data) => {
  console.log(import.meta.env.VITE_API_BASE_URL)
  // console.log(import.meta.env.ABC)
  try {
    const response = await apiConfig.post('/api/auth/login', data); 
    return response;
  } catch (error) {
    throw error
  }
}
export const logOut = async () => {
  try {
    const response = await apiConfig.get('/api/auth/logout'); 
    return response;
  } catch (error) {
    throw error
  }
}
export const getUsers = async () => {
  try {
    const response = await apiConfig.get('/api/auth/users'); 
    return response;
  } catch (error) {
    throw error
  }
}

export const deleteUserByAdmin = async (id) => {
  try {
    const response = await apiConfig.delete(`/api/auth/delete-user/${id}`); 
    return response;
  } catch (error) {
    throw error
  }

}
export const register = async (data) => {
  try {
    const response = await apiConfig.post(`/api/auth/register`, data); 
    return response;
  } catch (error) {
    throw error
  }

}

export const forgotPassword = async (data) => {

  try {
    const response = await apiConfig.post(`/api/auth/forgot-password`, data); 
    return response;
  } catch (error) {
    throw error
  }
}

export const resetPassword = async (resetToken, newPassword) => {
  console.log(resetToken)
  try {
    const response = await apiConfig.post(`/api/auth/reset-password/${resetToken}`, {password: newPassword}); 
    return response;
  } catch (error) {
    throw error
  }
}
export const updateManegerDetails = async (data) => {
  try {
    const response = await apiConfig.post(`/api/auth/update-maneger-details`, data); 
    return response;
  } catch (error) {
    throw error
  }
}
export const reviewCommitments = async (data,campainName=null) => {
  console.log('e');
  try {
    const response = await apiConfig.post(`/api/commitment/review-commitments?campainName=${encodeURIComponent(campainName)}`, data);
    return response;
  } catch (error) {
    throw error
  }
}
export const uploadCommitments = async (data) => {
  try {
    const response = await apiConfig.post(`/api/commitment/upload-commitments`, data); 
    return response;
  } catch (error) {
    throw error
  }
}
export const validateUserPassword = async (manegerPassword) => {
  try {
    console.log(manegerPassword);
    const response = await apiConfig.post(`/api/auth/validate-password`, {manegerPassword}); 
    return response;
  } catch (error) {
    throw error
  }
}
export const editCampainDetails = async (updatedCampain,deletedMemorialDays,campainId) => {
  try {
    const response = await apiConfig.post(`/api/campain/edit-campain-details/${campainId}`, {updatedCampain,deletedMemorialDays}); 
    return response;
  } catch (error) {
    throw error
  }
}
export const reviewDeletedMemorialDays = async (updatedCampain,campainId) => {
  console.log(updatedCampain);
  try {
    const response = await apiConfig.post(`/api/campain/review-deleted-memorial-dates/${campainId}`, updatedCampain); 
    return response;
  } catch (error) {
    console.log(error);
    throw error
  }
}
export const reviewBefourAddPeopleToCampain = async (campainName,people) => {
  try {
    const response = await apiConfig.post(`/api/campain/review-befour-add-people-to-campain`, {campainName,people}); 
    return response;
  } catch (error) {
    console.log(error);
    throw error
  }
}
export const addPeopleToCampain= async (campainName,people) => {
  try {
    const response = await apiConfig.post(`/api/campain/add-people-to-campain`,{campainName,people});
    return response;
  } catch (error) {
    throw error
  }
}
export const recoverUserActivity= async (AnashIdentifier) => {
  try {
    const response = await apiConfig.put(`/api/alfon/recover-user-activity/${AnashIdentifier}`);
    return response;
  } catch (error) {
    throw error
  }
}
export const getPaymentsWithoutCommitment= async () => {
  try {
    const response = await apiConfig.get(`/api/payments/get-payments-without-commitment`);
    return response;
  } catch (error) {
    throw error
  }
}
export const transferPayment= async (paymentId,campainName) => {
  try {
    const response = await apiConfig.put(`/api/payments/transfer-payment`,{paymentId,campainName});
    return response;
  } catch (error) {
    throw error
  }
}
export const processCommitmentReport= async (reportData) => {
  try {
    const response = await apiConfig.post(`/api/reports/commitments-report`,reportData);
    return response;
  } catch (error) {
    throw error
  }
}
export const processCampainReport= async (reportData) => {
  try {
    const response = await apiConfig.post(`/api/reports/campain-report`,reportData);
    return response;
  } catch (error) {
    throw error
  }
}
export const campainPaymentsReport= async (reportData) => {
  try {
    const response = await apiConfig.post(`/api/reports/campain-payments-report`,reportData);
    return response;
  } catch (error) {
    throw error
  }
}
export const dateRangePaymentsReport= async (reportData) => {
  try {
    const response = await apiConfig.post(`/api/reports/date-range-payments-report`,reportData);
    return response;
  } catch (error) {
    throw error
  }
}
export const getCampainIncomSummeryByPaymentMethod= async (campainName) => {
  try {
    const response = await apiConfig.get(`/api/commitment/get-campain-incom-by-payment-method/${campainName}`);
    return response;
  } catch (error) {
    throw error
  }
}
export const restoreDatabase = async () => {
  try {
    const response = await apiConfig.get(`/api/auth/restore-database`);
    return response;
  } catch (error) {
    throw error
  }
}
export const getMemorialDayByDate = async (date) => {
  try {
    const response = await apiConfig.get(`/api/commitment/get-memorial-day-by-date/${date}`);
    return response;
  } catch (error) {
    throw error
  }
}
export const getPeopleWithCommitment = async () => {
  try {
    const response = await apiConfig.get(`/api/commitment/get-people-with-commitment`);
    return response;
  } catch (error) {
    throw error
  }
}
export const updateMemorialDay = async (memorialDay) => {
  try {
    const response = await apiConfig.post(`/api/commitment/update-memorial-day`, memorialDay);
    return response;
  } catch (error) {
    throw error
  }
}
export const getMemorialDaysByRangeDates = async (startDate,endDate) => {
  try {
    const response = await apiConfig.get(`/api/commitment/get-memorial-days-by-range-dates?startDate=${startDate}&endDate=${endDate}`);
    return response;
  } catch (error) {
    throw error
  }
}
export const getMemorialDaysByCommitment = async (AnashIdentifier,CampainName) => {
  try {
    const response = await apiConfig.get(`/api/commitment/get-memorial-days-by-commitment?AnashIdentifier=${AnashIdentifier}&CampainName=${CampainName}`);
    return response;
  } catch (error) {
    throw error
  }
}

export const deleteCampain = async (campainId) => {
  try {
    const response = await apiConfig.delete(`/api/campain/delete-campain/${campainId}`);
    return response;
  } catch (error) {
    throw error
  }
}





 


  
  

