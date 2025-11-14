import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { apiFetch } from "@/api/api";

export default function Login({ onLogin }) {
  const navigate = useNavigate();

  const [status, setStatus] = useState("")

  const [formData, setFormData] = useState({
    username: "",
    password: ""
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = async (event) => {
    event.preventDefault(); // prevent page reload
    setStatus("Sending...")
    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (data.token) {
        setFormData({ username: "", password: "" });
        onLogin(data.token);
        alert(data.message);
      }

    } catch (err) {
      alert(err.message); // debug
      setStatus("Login failed");
    }
  }

  return (
    <div>
      <h1>Login Page</h1>
      <p>First time? <a onClick={() => navigate("/register")}>Sign up here.</a></p>
      <form onSubmit={handleSubmit}>
        <input
          autoComplete="off"
          type="text"
          name="username"
          placeholder="Enter username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button>Log in</button>
      </form>
      <p>{status}</p>
    </div>
  )
}