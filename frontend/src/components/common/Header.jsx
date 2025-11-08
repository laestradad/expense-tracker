import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const { loggedIn, logout } = useAuth();
  
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">MyApp</Link>
        <button className="menu-toggle" onClick={toggleMenu}>
          ☰
        </button>
        <div className={`nav-links ${menuOpen ? "active" : ""}`} onClick={toggleMenu}>
          {loggedIn ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/changepsw">Change Password</Link>
              <Link to="/delete">Delete Account</Link>
              <Link to="/login" onClick={logout}>Logout</Link>
            </>
            ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
            )
          } 
        </div>
      </div>      
    </nav>
  )
}