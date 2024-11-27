// App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import dollarsBackground from "./images/Dollars.jpg";
import Navbar from "./features/Navbar";
// import AlfonPage from "./pages/AlfonPage";
import LoginPage from "./pages/LoginPage";
import MenuPage from "./pages/MenuPage";
// import CommitmentPage from "./pages/commitmentPage";
import UserDetailsPage from "./pages/UserDetailsPage";
// import CommitmentDetailsPage from "./pages/CommitmentDetailsPage";
import CampainsPage from "./pages/CampainsPage";
import MemorialBoard from "./pages/MemorialBoard";
import CampainPage from "./pages/CampainPage";
// import PeopleInCampain from "./pages/peopleInCampain";
// import CampaignCommitments from "./pages/CampaignCommitments";
import { ToastContainer } from "react-toastify";
import DynamicTitle from "./components/DynamicTitle";
import "react-toastify/dist/ReactToastify.css";
import AddPersonPage from "./pages/AddPersonPage";
import MemorialDay2 from "./pages/MemorialDay2";
import Modal from "react-modal";
import MemorialDayDetails from "./pages/MemorialDayDetails";
import AddMemorialDayToPerson from "./pages/AddMemorialDayToPerson";
import EditCampaignPage from "./pages/EditCampaignPage";
import PettyCash from "./pages/PettyCash";
import { AuthProvider } from "./components/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import UserProfile from "./pages/UserProfile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import CommitmentPage2 from "./pages/CommitmentPage2";
import CommitmentDetailsPage2 from "./pages/CommitmentDetailsPage2";
import PeopleInCampain2 from "./pages/PeopleInCampain2";
import AlfonPage2 from "./pages/AlfonPage2";
Modal.setAppElement("#root");

// Custom component to handle showing Navbar conditionally
const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbarRoutes = ["/", "/login", "/forgot-password", "/reset-password"]; // Define routes where you want to hide the navbar

  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      {children}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <ToastContainer />
          <DynamicTitle />
          <Layout>
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
              
                


                <Route element={<ProtectedRoute />}>
                  {/* <Route path="/alfon" element={<AlfonPage />} /> */}
                  <Route path="/alfon" element={<AlfonPage2 />} />
                  <Route path="/menu" element={<MenuPage />} />
                  <Route path="/commitments/:campainName?" element={<CommitmentPage2 />} />
                  <Route
                    path="/user-details/:AnashIdentifier"
                    element={<UserDetailsPage />}
                  />
                  <Route
                    path="/commitment-details/:commitmentId"
                    element={<CommitmentDetailsPage2 />}
                  />
                  <Route path="/campains" element={<CampainsPage />} />
                  <Route path="/memorial-Board" element={<MemorialBoard />} />
                  <Route path="/campain/:campainId" element={<CampainPage />} />
                  <Route
                    path="/PeopleInCampain/:campainName"
                    element={<PeopleInCampain2 />}
                  />
                  <Route path="/add-person" element={<AddPersonPage />} />
                  <Route path="/memorial-day-2" element={<MemorialDay2 />} />
                  <Route
                    path="/memorial-day-details"
                    element={<MemorialDayDetails />}
                  />
                  <Route
                    path="/add-memorial-day-to-person"
                    element={<AddMemorialDayToPerson />}
                  />
                  <Route
                    path="/edit-campaign/:campainName"
                    element={<EditCampaignPage />}
                  />
                  <Route path="/petty-cash" element={<PettyCash />} />

                  <Route path="/user-profile" element={<UserProfile />} />
                  <Route path="edit-campain/:campainName" element={<EditCampaignPage />} />
                </Route>
              </Routes>
            </div>
          </Layout>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
