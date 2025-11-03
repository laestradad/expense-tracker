import { useState } from "react";
import { apiFetch } from "../api";

export default function ChangePsw() {

  const [status, setStatus] = useState("")

  const [formData, setFormData] = useState({
    oldpsw: "",
    newpsw: "",
    confirm: ""
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault(); // prevent page reload
    setStatus("Sending...")
    try {
      const data = await apiFetch("/auth/changepsw", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (data.message) {
        setFormData({ oldpsw: "", newpsw: "", confirm: "" });
        setStatus(data.message);
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
      <h1>Change password</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          name="oldpsw"
          placeholder="Enter current password"
          value={formData.oldpsw}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="newpsw"
          placeholder="Enter new password"
          value={formData.newpsw}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirm"
          placeholder="Confirm new password"
          value={formData.confirm}
          onChange={handleChange}
          required
        />
        <button>Change password</button>
      </form>
      <p>{status}</p>
    </div>
  )
}