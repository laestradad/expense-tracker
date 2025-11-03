import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginRequired from "./components/LoginRequired";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ChangePsw from "./pages/ChangePsw";
import "./App.css";

function AppRoutes() {
  const { loggedIn, login, logout } = useAuth();

  return (
    <>
      <Header loggedIn={loggedIn} onLogout={logout} />

      <Routes>
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
        <Route
          path="/dashboard"
          element={
            <LoginRequired>
              <Dashboard />
            </LoginRequired>
          }
        /><Route
          path="/changepsw"
          element={
            <LoginRequired>
              <ChangePsw />
            </LoginRequired>
          }
        />
      </Routes>

      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}