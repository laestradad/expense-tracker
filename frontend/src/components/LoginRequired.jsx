import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function LoginRequired({ children }) {
  const { loggedIn } = useAuth();

  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}