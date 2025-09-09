import React from "react";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";

function EditManagerForm({
  handelSubmit,
  handleUpdateChange,
  handleCancelEdit,
  updatedUser,
  connectedUser,
  bgColor = "bg-white",
}) {
  const [showPassword, setShowPassword] = useState(false);
  // console.log(updatedUser);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const rolesToHebrewMap = { User: "משתמש רגיל", Admin: "מנהל",Guest:"משתמש בסיסי" };

  return (
    <form
      onSubmit={handelSubmit}
      className={`inline-flex items-end gap-4 rounded-lg shadow p-4 max-w-fit ${bgColor}`}
    >
      <div className="flex flex-col">
        <label htmlFor="Username" className="text-gray-600 text-sm font-medium">
          שם משתמש:
        </label>
        <input
          name="Username"
          type="text"
          id="updateUsername"
          className="border border-gray-300 rounded-lg p-3 text-right text-gray-700 text-sm outline-none focus:border-blue-400 focus:ring focus:ring-blue-200 min-w-[250px]"
          value={updatedUser.Username}
          onChange={handleUpdateChange}
          placeholder="הזן שם משתמש"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="Email" className="text-gray-600 text-sm font-medium">
          אימייל:
        </label>
        <input
          name="Email"
          type="email"
          id="updateEmail"
          className="border border-gray-300 rounded-lg p-3 text-right text-gray-700 text-sm outline-none focus:border-blue-400 focus:ring focus:ring-blue-200 min-w-[250px]"
          value={updatedUser.Email}
          onChange={handleUpdateChange}
          placeholder="הזן כתובת אימייל"
          required
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="FullName" className="text-gray-600 text-sm font-medium">
          שם מלא:
        </label>
        <input
          name="FullName"
          type="text"
          id="updateFullName"
          className="border border-gray-300 rounded-lg p-3 text-right text-gray-700 text-sm outline-none focus:border-blue-400 focus:ring focus:ring-blue-200 min-w-[250px]"
          value={updatedUser.FullName}
          onChange={handleUpdateChange}
          placeholder="הזן שם מלא"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="Password" className="">
          סיסמה חדשה:
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="updatePassword"
            name="Password"
            className="border border-gray-300 rounded-lg p-3 text-right text-gray-700 text-sm outline-none focus:border-blue-400 focus:ring focus:ring-blue-200 min-w-[250px] w-full bg-white" // Ensure bg-white is added
            value={updatedUser.Password}
            onChange={handleUpdateChange}
            placeholder="שנה סיסמה"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute left-0 top-0 h-full px-3 text-white bg-blue-600 hover:bg-blue-700 rounded-l-lg text-sm"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>
{     
updatedUser.Role !== "Admin" &&connectedUser.Role === "Admin" &&
 <div className="flex flex-col ">
        <label htmlFor="Role" className="text-gray-600 text-sm">
          דרגה:
        </label>
        <select
          id="Role"
          className="border border-gray-300 rounded-lg p-3 text-right text-gray-700 text-sm outline-none focus:border-blue-400 focus:ring focus:ring-blue-200 min-w-[250px] w-full bg-white" // Ensure bg-white is added
          name="Role"
          value={updatedUser.Role}
          onChange={handleUpdateChange}
          required
        >

                <option value="User">משתמש רגיל</option>
                <option value="Admin">מנהל</option>
                <option value="Guest">משתמש בסיסי</option>

        </select>
      </div>
}
      <div className="flex items-end gap-2">
        <button
          type="submit"
          className="flex items-end gap-2 p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold text-md shadow-lg transition duration-200 "
        >
          <GiConfirmed />
        </button>
        <button
          type="button"
          onClick={handleCancelEdit}
          className="flex items-end gap-2 p-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-semibold text-md shadow-lg transition duration-200"
        >
          <MdOutlineCancel />
        </button>
      </div>
    </form>
  );
}

export default EditManagerForm;
