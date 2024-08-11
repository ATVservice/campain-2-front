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
              {/* Add other routes here if needed */}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
