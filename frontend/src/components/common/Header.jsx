import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/assets/react.svg";

export default function Header() {
  const { loggedIn } = useAuth();
  
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <img src={Logo} alt="Logo" />
          Expense Tracker
        </Link>
        <button className="menu-toggle" onClick={toggleMenu}>
          ☰
        </button>
        <div className={`nav-links ${menuOpen ? "active" : ""}`} onClick={toggleMenu}>
          {loggedIn ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/account">Account</Link>
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