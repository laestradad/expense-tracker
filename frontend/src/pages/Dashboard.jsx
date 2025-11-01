import { useState, useEffect } from "react";
import { apiFetch } from "../api";

export default function Dashboard() {   

  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState(""); 
  
  // Test API request when authenticated
  useEffect(() => {
  const fetchData = async () => {
    const data = await apiFetch("/api/dashboard");
    if (data) setMessage(data.message || data.error);
  };
  fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("Sending...")
    
    if (!file) return alert("Please select a CSV");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);

    try {
      const data = await apiFetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      alert(JSON.stringify(data))
      setMessage("Success")
    } catch (err) {
      alert(err.message); // debug
      setStatus("Login failed");
    }
  }

  return(
    <div>
      <h1>Dashboard</h1>
      <form onSubmit={handleSubmit}>
        <input
          autoComplete="off"
          type="text"
          name="title"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} required/>
        <button>Upload</button>
      </form>
      <p>{message}</p>
    </div>
  )
}