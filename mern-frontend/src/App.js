// mern-frontend/src/App.js (MODIFIED)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; 
import { SocketProvider } from './context/SocketContext'; // <-- NEW IMPORT

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BoardPage from './pages/BoardPage';
import PrivateRoute from './components/PrivateRoute'; // <-- NEW IMPORT for security

function App() {
  return (
    <AuthProvider>
      {/* Wrap router in SocketProvider ONLY IF authenticated */}
      <SocketProvider> 
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Protected Route (Feature #1) */}
              <Route path="/board" element={<PrivateRoute element={BoardPage} />} /> 
            </Routes>
          </div>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;