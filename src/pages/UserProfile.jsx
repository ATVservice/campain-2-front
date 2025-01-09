import React, { useEffect, useState } from "react";
import { useAuth } from "../components/AuthProvider";
import { getUsers } from "../requests/ApiRequests";
import { MdDelete } from "react-icons/md";
import { register } from "../requests/ApiRequests";
import {
  updateManegerDetails,
  restoreDatabase,
  deleteUserByAdmin,
  validateUserPassword,
} from "../requests/ApiRequests";
import { FaEdit } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import EditManagerForm from "../components/EditManegerForm";
import { GiConfirmed } from "react-icons/gi";
import { IoMdAdd } from "react-icons/io";
import { IoMdRemove } from "react-icons/io";
import { GiRecycle } from "react-icons/gi";

import { toast } from "react-toastify";
import ReactModal from "react-modal";
import ConfirmationModal from "../components/ConfirmationModal ";
import Spinner from "../components/Spinner";
import PasswordConfirmationModal from "../components/PasswordConfirmationModal";

function UserProfile() {
  const { user, loginUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    email: "",
    fullName: "",
    role: "User",
  });
  const [updatedUser, setUpdatedUser] = useState(null);
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const rolesToHebrewMap = {
    User: "משתמש רגיל",
    Admin: "מנהל",
    Guest: "משתמש בסיסי",
  };
  const [showrestorModal, setShowrestorModal] = useState(false);
  const [restorPassword, setRestorPassword] = useState("");

  useEffect(() => {
    // setUpdatedUser(user);
    const fetchData = async () => {
      if (user && user.Role === "Admin") {
        try {
          setLoading(true);
          const res = await getUsers();
          setUsers(res.data.users);
          console.log(res);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, []);
  const handleDelete = async (userId) => {
    try {
      setLoading(true);
      const res = await deleteUserByAdmin(userId);
      console.log(res);
      if (res.status === 200) {
        // Remove deleted user from state
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== userId)
        );
        toast.success("המשתמש נמחק בהצלחה");
      }
      // Refresh users list or update state as needed
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("שגיאה במחיקת המשתמש");
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (e) => {
    e.preventDefault();

    if (
      !newUser.username ||
      !newUser.password ||
      !newUser.role ||
      !newUser.email ||
      !newUser.fullName
    ) {
      toast.error("יש למלא את כל השדות");
      return;
    }
    try {
      setLoading(true);
      const res = await register(newUser);
      console.log(res);
      if (res.status === 201 || res.status === 200) {
        setUsers((prevUsers) => [...prevUsers, res.data.user]);
        setNewUser({
          username: "",
          password: "",
          fullName: "",
          email: "",
          role: "User",
        });
        setShowNewUserForm(false);
        toast.success("המשתמש נוצר בהצלחה");
      }
      console.log(res);
    } catch (error) {
      console.error(error);
      toast.error("המשתמש לא נוצר בהצלחה");
    } finally {
      setLoading(false);
    }
  };

  function handleNewUserInputChange(event) {
    const { name, value } = event.target;

    setNewUser({ ...newUser, [name]: value });
  }

  const handelupdateChange = async (e) => {
    const { name, value } = e.target;

    setUpdatedUser({ ...updatedUser, [name]: value });
  };
  const handelUpdateSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await updateManegerDetails(updatedUser);
      if (res.status === 200) {
        console.log(res);
        if (updatedUser._id === user._id) {
          loginUser(updatedUser);
        } else {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user._id === updatedUser._id ? updatedUser : user
            )
          );
        }
        setUpdatedUser(null);
        toast.success("המשתמש עודכן בהצלחה");
      }
    } catch (error) {
      console.error(error);
      toast.error("המשתמש לא עודכן בהצלחה");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user) => {
    // console.log(user);
    setUpdatedUser({
      ...user,
      Password: "",
    });
  };
  const handelCancel = () => {
    setUpdatedUser(null);
  };
  if (!user) {
    return <Spinner />;
  }

  const handleRestorDb = async () => {
    try {
      setLoading(true);
      const validateRes = await validateUserPassword(restorPassword);

      if (validateRes.status !== 200) {
        toast.error(validateRes.data.message||"סיסמה לא תקינה");
      }
      const res = await restoreDatabase();
      console.log(res);
      if (res.status === 200) {
        toast.success("מצב נתונים שוחזר בהצלחה");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data?.message || " מצב נתונים לא שוחזר בהצלחה  ");
    } finally {
      setRestorPassword("");
      setShowrestorModal(false);
      setLoading(false);
    }
  };
  if(loading){
    return <Spinner />;
  }

  return (
    <div>

{user.Role === "Admin" && (
  <>
    <div className="flex justify-center items-center gap-2 text-center text-md font-bold mb-4 bg-red-100 text-red-800">
      שחזור נתוני מערכת ללפני קובץ אחרון
      <button className="text-black hover:text-red-600"
        onClick={() => setShowrestorModal(true)}
      >
        <GiRecycle />
      </button>
    </div>
    {showrestorModal && (
      <PasswordConfirmationModal
      isOpen={showrestorModal}
      onClose={() => setShowrestorModal(false)}
      onSubmit={handleRestorDb}
      password={restorPassword}
      setPassword={setRestorPassword}
      massage="האם אתה בטוח שברצונך לשחזר את נתוני מערכת?"
      />
    )}
    {showConfirmationModal && (
      <ConfirmationModal
        isVisible={showConfirmationModal}
        onCancel={() => setShowConfirmationModal(false)}
        onConfirm={() => {
          handleDelete(userIdToDelete); // Call the delete function with the user ID
          setShowConfirmationModal(false); // Close the modal after confirming
          setUserIdToDelete(null); // Clear the user ID
        }}
        title="Confirmation"
        message="אתה בטוח שברצונך למחוק את המשתמש?"
      />
    )}
  </>
)}

      

      <div className="flex flex-col p-4 mx-auto bg-white rounded-lg shadow-lg items-center">
        <h2 className="mb-2 border-b border-gray-300">
          {user.Role === "Admin" ? "פרטי מנהל" : "פרטי משתמש"}{" "}
        </h2>
        {updatedUser?._id === user._id ? (
          <EditManagerForm
            handelSubmit={handelUpdateSubmit}
            handleUpdateChange={handelupdateChange}
            handleCancelEdit={handelCancel}
            handleEditClick={handleEditClick}
            updatedUser={updatedUser}
            connectedUser={user}
            bgColor="bg-blue-100"
          />
        ) : (
          <div className="flex justify-between gap-4 p-2 rounded-lg shadow-md  bg-blue-100 w-[90%]">
            <div className="flex flex-col gap-2 flex-1">
              <p className="text-gray-600 font-medium self-start">שם משתמש:</p>
              <span className="text-gray-800 border border-gray-300 rounded-lg p-2 bg-gray-200 ">
                {user.Username}
              </span>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <p className="text-gray-600 font-medium self-start">אימייל:</p>
              <span className="text-gray-800 border border-gray-300 rounded-lg p-2 bg-gray-200 ">
                {user.Email}
              </span>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <p className="text-gray-600 font-medium self-start">שם מלא:</p>
              <span className="text-gray-800 border border-gray-300 rounded-lg p-2 bg-gray-200 ">
                {user.FullName}
              </span>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <p className="text-gray-600 font-medium self-start">
                {" "}
                סיסמה נוכחית:
              </p>
              <span className="text-gray-800 border border-gray-300 rounded-lg p-2  bg-gray-200 ">
                <p className="text-gray-500 italic">סיסמה מוסתרת</p>
              </span>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <p className="text-gray-600 font-medium self-start">
                {" "}
                הרשאת משתמש:
              </p>
              <span className="text-gray-800 border border-gray-300 rounded-lg p-2 bg-gray-200">
                {rolesToHebrewMap[user.Role]}
              </span>
            </div>
            <div className="flex items-end gap-2 flex-1">
              <button
                onClick={() => handleEditClick(user)}
                className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold text-sm shadow-lg flex items-center justify-center gap-2 transition duration-200"
              >
                <FaEdit className="text-base" />
              </button>
            </div>
          </div>
        )}
      </div>

      {user?.Role === "Admin" && (
        <div className="mr-4 mt-4">
          <span className="border-b border-gray-300 pb-1 ">הוסף משתמש</span>
          <br />
          {showNewUserForm ? (
            <button
              className="font bold text-xl"
              onClick={() => setShowNewUserForm(!showNewUserForm)}
            >
              <IoMdRemove className="text-3xl hover:text-blue-500" />
            </button>
          ) : (
            <button
              className="font bold text-xl"
              onClick={() => setShowNewUserForm(!showNewUserForm)}
            >
              <IoMdAdd className="text-3xl hover:text-blue-500" />
            </button>
          )}
        </div>
      )}
      {user?.Role === "Admin" && showNewUserForm && (
        <div className="flex flex-col justify-center mt-4 w-3/4 mx-auto">
          <form
            onSubmit={registerUser}
            className="p-4 bg-white rounded shadow-md	 space-y-4"
          >
            <div className="flex flex-col space-y-1 border rounded p-2">
              <label htmlFor="username" className="text-gray-600 text-sm">
                שם משתמש:
              </label>
              <input
                type="text"
                id="username"
                className="border rounded p-2 text-right text-sm outline-none focus:ring focus:ring-blue-300"
                name="username"
                value={newUser.username}
                onChange={handleNewUserInputChange}
                required
              />
            </div>
            <div className="flex flex-col space-y-1 mt-2">
              <label htmlFor="password" className="text-gray-600 text-sm">
                סיסמה:
              </label>
              <input
                type="password"
                id="password"
                className="border rounded p-2 text-right text-sm outline-none focus:ring focus:ring-blue-300"
                name="password"
                value={newUser.password}
                onChange={handleNewUserInputChange}
                required
              />
            </div>
            <div className="flex flex-col space-y-1 mt-2">
              <label htmlFor="email" className="text-gray-600 text-sm">
                אימייל לשחזור סיסמה:
              </label>
              <input
                type="email"
                id="email"
                className="border rounded p-2 text-right text-sm outline-none focus:ring focus:ring-blue-300"
                name="email"
                value={newUser.email}
                onChange={handleNewUserInputChange}
                required
              />
            </div>
            <div className="flex flex-col space-y-1 mt-2">
              <label htmlFor="fullName" className="text-gray-600 text-sm">
                שם מלא:
              </label>
              <input
                type="text"
                id="fullName"
                className="border rounded p-2 text-right text-sm outline-none focus:ring focus:ring-blue-300"
                name="fullName"
                value={newUser.fullName}
                onChange={handleNewUserInputChange}
                required
              />
            </div>
            <div className="flex flex-col space-y-1 mt-2">
              <label htmlFor="role" className="text-gray-600 text-sm">
                דרגה:
              </label>
              <select
                id="role"
                className="border rounded p-2 text-right text-sm outline-none focus:ring focus:ring-blue-300"
                name="role"
                value={newUser.role}
                onChange={handleNewUserInputChange}
                required
              >
                <option value="User">משתמש רגיל</option>
                <option value="Admin">מנהל</option>
                <option value="Guest">משתמש בסיסי</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-medium text-sm py-2 rounded hover:bg-blue-600 transition duration-150"
            >
              הוסף
            </button>
          </form>
        </div>
      )}
      <div className="flex flex-col p-4 mx-auto bg-white rounded-lg shadow-lg items-center">
        {user?.Role === "Admin" && (
          <>
            <h2 className="mb-2 border-b border-gray-300 pb-1">פרטי משתמשים</h2>
            {users?.length > 0 &&
              users.map((mappedUser) => (
                <div
                  key={mappedUser._id}
                  className="inline-flex gap-4 p-2 rounded-lg shadow-md bg-white max-w-fit mb-4"
                >
                  {updatedUser && updatedUser._id === mappedUser._id ? (
                    <EditManagerForm
                      handelSubmit={handelUpdateSubmit}
                      handleUpdateChange={handelupdateChange}
                      handleCancelEdit={handelCancel}
                      updatedUser={updatedUser}
                      connectedUser={user}
                      bgColor="bg-white"
                    />
                  ) : (
                    <div className="inline-flex gap-4 p-2 rounded-lg shadow-md bg-white max-w-fit">
                      <div className="flex flex-col gap-2">
                        <p className="text-gray-600 font-medium self-start">
                          שם משתמש:
                        </p>
                        <span className="text-gray-800 border border-gray-300 rounded-lg p-2 min-w-[250px] bg-gray-200">
                          {mappedUser.Username}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-gray-600 font-medium self-start">
                          אימייל:
                        </p>
                        <span className="text-gray-800 border border-gray-300 rounded-lg p-2 w-[250px] bg-gray-200">
                          {mappedUser.Email}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-gray-600 font-medium self-start">
                          שם מלא:
                        </p>
                        <span className="text-gray-800 border border-gray-300 rounded-lg p-2 w-[250px] bg-gray-200">
                          {mappedUser.FullName}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-gray-600 font-medium self-start">
                          סיסמה נוכחית:
                        </p>
                        <span className="text-gray-800 border border-gray-300 rounded-lg p-2 w-[250px] bg-gray-200">
                          <p className="text-gray-500 italic">סיסמה מוסתרת</p>
                        </span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-gray-600 font-medium self-start">
                          {" "}
                          הרשאת משתמש:
                        </p>
                        <span className="text-gray-800 border border-gray-300 rounded-lg p-2 w-[250px] bg-gray-200">
                          {rolesToHebrewMap[mappedUser.Role]}
                        </span>
                      </div>

                      <div className="flex items-end gap-2">
                        <button
                          onClick={() => handleEditClick(mappedUser)}
                          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold text-sm shadow-lg flex items-center justify-center gap-2 transition duration-200"
                        >
                          <FaEdit className="text-base" />
                        </button>
                      </div>
                      <div className="flex items-end gap-2">
                        <button
                          onClick={() => {
                            setUserIdToDelete(mappedUser._id);
                            setShowConfirmationModal(true);
                          }}
                          className="p-2 bg-red-500 hover:bg-blue-600 text-white rounded-lg font-semibold text-sm shadow-lg flex items-center justify-center gap-2 transition duration-200"
                        >
                          <MdDelete className="text-base" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
