import { useState } from "react";
import { apiFetch } from "../api";

export default function UploadFile({ onDataLoaded }) {   

  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState(""); 

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
      // show data retrieved
      alert(JSON.stringify(data))
      setMessage("Success")

      // Pass the data back up to Dashboard
      onDataLoaded(data);

    } catch (err) {
      alert(err.message); // debug
      setStatus("Login failed");
    }
  }

  return(
    <div>
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