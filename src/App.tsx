import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import { api } from './services/api';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/auth/check', {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => {
        setIsAuthenticated(res.ok);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleSignup = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await api.logout();
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Home page - Redirect to Login if not authenticated */}
        <Route
          path="/"
          element={
            isAuthenticated ? <Home onLogout={handleLogout} /> : <Navigate to="/login" replace />
          }
        />
        {/* Login page - Redirect to Home if authenticated */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} onSwitchToSignup={() => {}} />
          }
        />
        {/* Signup page - Redirect to Home if authenticated */}
        <Route
          path="/signup"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <Signup onSignup={handleSignup} onSwitchToLogin={() => {}} />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;