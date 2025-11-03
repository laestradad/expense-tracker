import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const { loggedIn, logout } = useAuth();

  return (
    <nav>
      <Link to="/">Home</Link> |{ " " }
      {loggedIn ? (
        <>
          <Link to="/dashboard">Dashboard</Link> |{ " " }
          <Link to="/changepsw">Change Password</Link> |{ " " }
          <Link to="/delete">Delete Account</Link> |{ " " }
          <Link to="/login" onClick={logout}>Logout</Link>
        </>
        ) : (
        <>
          <Link to="/login">Login</Link> |{ " " }
          <Link to="/register">Register</Link>
        </>
        )
      } 
    </nav>
  )
}