// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import dollarsBackground from './images/Dollars.jpg';
import Navbar from './features/Navbar';
import AlfonPage from './pages/AlfonPage';
import LoginPage from './pages/LoginPage';
import MenuPage from './pages/MenuPage';

const App = () => {
  return (
    <Router>
      <div 
        style={{
          backgroundImage: `url(${dollarsBackground})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
          height: '100vh', // Set the height of the container
          overflow: 'hidden'
        }}
      >
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              <Route path="/alfon" element={<AlfonPage />} />
              <Route path="/" element={<LoginPage />} />
              <Route path="/menu" element={<MenuPage />} />
              {/* Add other routes here if needed */}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
