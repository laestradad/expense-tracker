import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import UploadFile from "@/components/upload/UploadFile";

export default function Account() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div>
      <h1>Account</h1>
      <UploadFile />

      <div className="acc-container">
        <button onClick={() => navigate("/changepsw")}>Change Password</button>
        <button onClick={() => navigate("/delete")} style={{ backgroundColor: "#dc3545" }}>Delete Account</button>
        <button onClick={logout}>Logout</button>
      </div>

    </div>
  );
}