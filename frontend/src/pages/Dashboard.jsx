import { useState, useEffect } from "react";

export default function Dashboard({ onLogout }) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      console.log("Token:", token);
      const res = await fetch("/api/dashboard", {
        headers: { "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"}
      });
      
      const data = await res.json();
      setMessage(data.message || data.error);
      
      if (res.status === 401) {
        onLogout();
        window.location.href = "/login";
        return;
      }

    };

    fetchData();
  }, []); //[] means: run this effect once

  return <h2>{message}</h2>;
}