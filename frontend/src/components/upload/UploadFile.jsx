import { useState } from "react";
import { apiFetch, downloadFile } from "@/api/api.js";

export default function UploadFile() {   

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState(""); 

  const handleDownload = async () => {
    try {
      await downloadFile("/api/download");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("Sending...");

    if (!file) return alert("Please select a CSV");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const data = await apiFetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      // SUCCESS
      alert(data.message);
      setMessage("Success");

    } catch (err) {

      // Backend validation errors (CSV errors)
      if (err.data?.errors) {
        const formatted = err.data.errors
          .map((e) => `Line ${e.line}: ${e.error}`)
          .join("\n");

        alert(formatted);
      } else {
        alert(err.message);
      }

      setMessage("Error during upload");
    }
  };

  return(
    <div style={{ marginBottom: '2rem' }}>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} required/> Import a .csv file with your transactions
        <button>Upload</button>
      </form>
      <p>{message}</p>
      <button onClick={handleDownload}>Download Template</button>
    </div>
  )
}