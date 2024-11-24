import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import dollarsBackground from "../images/Dollars.jpg";
import { login } from "../requests/ApiRequests";
import { useAuth } from '../components/AuthProvider';
import Spinner from "../components/Spinner";

const Login = () => {
  const { user, loginUser, logoutUser } = useAuth();
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // מצב הצגת סיסמה
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "User",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      
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
    finally {
      setLoading(false);
    }
  };

  // פונקציה לטיפול בהצגה או הסתרת הסיסמה
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  if(loading) {
    return <Spinner />;
  }

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
          <div style={{ position: 'relative' }}>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              סיסמה
            </label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onChange={handelChange}
            />
            <span
              onClick={togglePasswordVisibility}
              style={{
                position: 'absolute',
                top: '70%',       // משנה את המיקום האנכי למטה יותר
                left: '0.5rem',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                fontSize: 'large', // גודל גדול יותר לאייקון
                color: '#4A5568'    // צבע מותאם לאייקון (אופציונלי)
              }}
            >
              {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
            </span>
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
        <button
          type="button"
          className="text-blue-500 hover:text-blue-700"
          onClick={() => navigate("/forgot-password")}
        >
          שכחת סיסמה?
        </button>
      </div>
    </div>
  );
};

export default Login;
