import { useState, useEffect } from "react";
import { apiFetch } from "../api";

export default function Dashboard() {
  const [message, setMessage] = useState("");

  useEffect(() => {
  const fetchData = async () => {
    const data = await apiFetch("/api/dashboard");
    if (data) setMessage(data.message || data.error);
  };
  fetchData();
  }, []);

  return <h2>{message}</h2>;
}