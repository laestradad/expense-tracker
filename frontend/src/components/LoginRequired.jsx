import { Navigate } from "react-router-dom";

export default function LoginRequired({ loggedIn, children }) {
  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
}