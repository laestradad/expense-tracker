import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import { useState } from 'react';
import Header from './components/Header'
import Footer from './components/Footer'
import LoginRequired from './components/LoginRequired.jsx'
import Home from './pages/Home'
import Login from './pages/Login'
import About from './pages/About'
import Dashboard from './pages/Dashboard'
import './App.css'

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));

  const handleLogin = () => setLoggedIn(true);
  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <Header loggedIn={loggedIn} onLogout={handleLogout} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/login"
          element={
            loggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            <LoginRequired loggedIn={loggedIn}>
              <Dashboard onLogout={handleLogout}/>
            </LoginRequired>
          }
        />
      </Routes>

      <Footer />
    </BrowserRouter>
  )
}

export default App