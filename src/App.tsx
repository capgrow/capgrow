import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LanguageSwitcher from './components/LanguageSwitcher';
import WhatsAppButton from './components/WhatsAppButton';
import './App.css';

function App() {
  const [user, setUser] = useState<{ name: string; email: string; isAdmin: boolean } | null>(null);

  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem('winstrike_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData: { name: string; email: string; isAdmin: boolean }) => {
    setUser(userData);
    localStorage.setItem('winstrike_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('winstrike_user');
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage user={user} onLogout={handleLogout} />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignupPage onLogin={handleLogin} />} />
        <Route 
          path="/dashboard" 
          element={
            user ? (
              <UserDashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        <Route 
          path="/admin" 
          element={
            user?.isAdmin ? (
              <AdminDashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
      </Routes>
      <LanguageSwitcher />
      <WhatsAppButton />
    </Router>
  );
}

export default App;
