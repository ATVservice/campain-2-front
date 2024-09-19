// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import dollarsBackground from './images/Dollars.jpg';
import Navbar from './features/Navbar';
import AlfonPage from './pages/AlfonPage';
import LoginPage from './pages/LoginPage';
import MenuPage from './pages/MenuPage';
import CommitmentPage from './pages/commitmentPage';
import UserDetailsPage from './pages/UserDetailsPage';
import CommitmentDetailsPage from './pages/CommitmentDetailsPage';
import CampainsPage from './pages/CampainsPage';
import MemorialBoard from './pages/MemorialBoard';
import CampainPage from './pages/CampainPage';
import PeopleInCampain from './pages/peopleInCampain';
import CampaignCommitments from './pages/CampaignCommitments';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddPersonPage from './pages/AddPersonPage';
import MemorialDay2 from './pages/MemorialDay2';
import Modal from 'react-modal';
// import AlfonChangesPage from './pages/AlfonChangesPage';

Modal.setAppElement('#root');

// Custom component to handle showing Navbar conditionally
const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbarRoutes = ["/", "/login"]; // Define routes where you want to hide the navbar

  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      {children}
    </div>
  );
};

const App = () => {
  return (
    <Router>     
      <div>
        <ToastContainer />
        <Layout>
          <div className="flex-grow">
            <Routes>
              <Route path="/alfon" element={<AlfonPage />} />
              <Route path="/" element={<LoginPage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/commitment" element={<CommitmentPage />} />
              <Route path="/user-details/:AnashIdentifier" element={<UserDetailsPage />} />
              <Route path="/commitment-details/:commitmentId" element={<CommitmentDetailsPage />} />
              <Route path="/campains" element={<CampainsPage />} />
              <Route path="/memorial-Board" element={<MemorialBoard />} />
              <Route path="/campain/:campainId" element={<CampainPage />} />
              <Route path="/PeopleInCampain/:campainName" element={<PeopleInCampain />} />
              <Route path="/campaign-commitments/:campainName" element={<CampaignCommitments />} />
              <Route path="/add-person" element={<AddPersonPage />} />
              <Route path="/memorial-day-2" element={<MemorialDay2 />} />
              {/* <Route path="/alfon-changes" element={<AlfonChangesPage />} /> */}
              {/* Add other routes here if needed */}
            </Routes>
          </div>
        </Layout>
      </div>
    </Router>
  );
};

export default App;
