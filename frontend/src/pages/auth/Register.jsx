import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "@/api/api";

export default function Register() {
  const navigate = useNavigate();

  const [status, setStatus] = useState("")

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmation: ""
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault(); // prevent page reload
    setStatus("Sending...")
    try {
      const data = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (data.message) {
        setFormData({ username: "", password: "", confirmation: "" });
        alert(data.message);
        navigate("/login");
      }

      if (data.error) {
        setStatus(data.error);
      }

    } catch (err) {
      alert(err.message);
    }
  };
  
  return (
    <div>
      <h1>Register Page</h1>
      <p>Registered already? <a onClick={() => navigate("/login")}>Log in here.</a></p>
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
        <input
          type="password"
          name="confirmation"
          placeholder="Enter password"
          value={formData.confirmation}
          onChange={handleChange}
          required
        />
        <button>Sign up</button>
      </form>
      <p>{status}</p>
    </div>
  )
}