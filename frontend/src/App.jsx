
import React from 'react'
import Signup from './acc/Signup';
import Login from './acc/Login';
import LandingPage from './LandingPage';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
    </Router>
    </div>
  );
};

export default App