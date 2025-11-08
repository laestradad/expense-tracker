import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function Account() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [initialBalance, setBalance] = useState("");
  const [timestamp, setUpdDate] = useState("");

  const handleUpdate = (e) => {
    e.preventDefault();
    const now = new Date();
    setUpdDate(now.toLocaleString());
    console.log("Updated balance:", initialBalance);
  };

  return (
    <div>
      <h1>Account</h1>
      <form onSubmit={handleUpdate}>
        <label htmlFor="balance">Initial Balance:</label>
        <input
          id="balance"
          type="number"
          step="50.00"
          min="0"
          value={initialBalance}
          onChange={(e) => setBalance(e.target.value)}
          placeholder="Enter amount"
          required
        />
        <button type="submit">Update</button>
      </form>
      <div>
        <p>Initial balance: {initialBalance}</p>
        <p>Set timestamp: {timestamp}</p>
      </div>

      <div className="acc-container">
        <button onClick={() => navigate("/changepsw")}>Change Password</button>
        <button onClick={() => navigate("/delete")} style={{ backgroundColor: "#dc3545" }}>Delete Account</button>
        <button onClick={logout}>Logout</button>
      </div>

    </div>
  );
}