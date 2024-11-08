import React from "react";
import { Link,useNavigate } from "react-router-dom";
import dollarsBackground from "../images/Dollars.jpg";
import { useState } from "react";
import {login} from "../requests/ApiRequests";
import { useAuth } from '../components/AuthProvider';


const Login = () => {
  const { user, loginUser, logoutUser } = useAuth();
  const [message, setMessage] = useState("");//
  // console.log(user);
  // console.log(loginUser);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "User",
  });
  const navigate = useNavigate();

  const handelChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await login(formData);
      if(res.status === 201||res.status === 200){
        loginUser( res.data.token, res.data.user);
        navigate("/menu");
          
      }
      console.log(res);
    } catch (error) {
      setMessage('שם משתמש או סיסמא אינם תקינים');
      console.error(error);
    }
    
  };
  return (
    <div
      className="flex h-screen items-start justify-center bg-gray-100"
      style={{
        backgroundImage: `url(${dollarsBackground})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-md rounded-lg mt-16">
        <h2 className="text-2xl font-bold text-center">התחברות</h2>
        <form className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              שם משתמש
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onChange={handelChange}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              סיסמה</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onChange={handelChange}
            />
          </div>
          <div className="text-center">
            <button
            onClick={handleSubmit}
              type="submit"
              className="w-full py-3 px-6 border border-transparent text-lg font-medium rounded-lg text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              התחבר
            </button>
          </div>
          {message && <p className="text-red-500">{message}</p>}
        </form>
            <button type="button" className="text-blue-500 hover:text-blue-700" onClick={() => {
              navigate("/forgot-password")
              }}> שחכת סיסמה?</button>
      </div>
    </div>
  );
};

export default Login;
