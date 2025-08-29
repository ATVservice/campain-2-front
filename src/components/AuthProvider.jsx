import { createContext, useContext, useEffect, useState } from 'react';
import { login, logOut, protect } from '../requests/ApiRequests';

import Spinner from './Spinner';

// 1. Create a context to hold our auth data.
const AuthContext = createContext(null);

// 2. Define a provider component that holds and provides auth state to the app.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true until we check with backend
 
 
 
  useEffect(() => {
    
    const checkLogin = async () => {
      if(user) 
      {
        setLoading(false);
        return
      }
      try {
        console.log('e');
        setLoading(true);
        const res = await protect();
        console.log(res.data.user);
        setUser(res.data.user);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

    const loginUser = async (credentials) => {
      // console.log(credentials);

     try
     {
      const res = await login(credentials);
      console.log(res);
      setUser(res.data.user);
      return res;
     }
     catch(err)
     {
      setUser(null);
      throw err
     }
  };



  // ✅ Secure logout: backend clears cookie
  const logoutUser = async () => {
    try {
     const res =  await logOut();
     console.log(res);
    } catch (error) {
      throw error
    }
    setUser(null);


  };

  if (loading) return <Spinner />;

  // 3. Return the provider component, sharing user, token, and login/logout functions.
  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser,loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
