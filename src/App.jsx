import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import AlfonPage from './pages/AlfonPage';
// import axios from 'axios';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <Link to="/alfon">אלפון</Link>
        </nav>
        <Routes>
          <Route path="/alfon" element={<AlfonPage />} />
          {/* Add other routes here if needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App
