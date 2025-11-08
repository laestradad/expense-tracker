import { Routes, Route, Navigate} from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// Layouts
import MainLayout from "@/layouts/MainLayout";
import LoginReqLayout from "@/layouts/LoginReqLayout";

// Pages
import Home from "@/pages/Home";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ChangePsw from "@/pages/auth/ChangePsw";
import DeleteAccount from "@/pages/auth/DeleteAccount";
import Dashboard from "@/pages/Dashboard";

export default function AppRoutes() {
  const { loggedIn, login } = useAuth();

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/login"
          element={
            loggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login onLogin={login} />
            )
          }
        />
      </Route>

      <Route element={<LoginReqLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/changepsw" element={<ChangePsw />} />
        <Route path="/delete" element={<DeleteAccount />} />
      </Route>
    </Routes>
  )
}