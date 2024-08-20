// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import dollarsBackground from './images/Dollars.jpg';
import Navbar from './features/Navbar';
import AlfonPage from './pages/AlfonPage';
import LoginPage from './pages/LoginPage';
import MenuPage from './pages/MenuPage';
import CommitmentPage from './pages/commitmentPage';
import UserDetailsPage from './pages/UserDetailsPage';
<<<<<<< HEAD
import CommitmentDetailsPage from './pages/CommitmentDetailsPage';
=======
import CampainsPage from './pages/CampainsPage';
import MemorialBoard from './pages/MemorialBoard';
import CampainPage from './pages/CampainPage';
>>>>>>> 7621bbd44f6c0f41a27ab30a5e4a4e6e5efb578b

const App = () => {
  return (
    <Router>
      <div 
  
      >
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              <Route path="/alfon" element={<AlfonPage />} />
              <Route path="/" element={<LoginPage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/commitment" element={<CommitmentPage />} />
              <Route path="/user-details/:anashIdentifier" element={<UserDetailsPage />} />
<<<<<<< HEAD
              <Route path="/commitment-details/:commitmentId" element={<CommitmentDetailsPage />} />
=======
              <Route path="/campains" element={<CampainsPage />} />
              <Route path="/memorial-Board" element={<MemorialBoard />} />
              <Route path="/campain/:campainId" element={<CampainPage />} />
>>>>>>> 7621bbd44f6c0f41a27ab30a5e4a4e6e5efb578b
              {/* Add other routes here if needed */}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
