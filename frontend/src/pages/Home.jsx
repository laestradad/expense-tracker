import { useEffect, useState } from "react";
import reactLogo from "@/assets/react_white.svg";
import flaskLogo from "@/assets/flask.svg";
import postgresLogo from "@/assets/postgresSQL.svg";
import { API_URL } from "@/api/api.js";

export default function Home() {
  const [healthData, setHealthData] = useState({
    message: "",
    db_status: "",
    db_version: ""
  });

  useEffect(() => {
    fetch(`${API_URL}/api/health`)
      .then((res) => res.json())
      .then((data) => setHealthData(data))
      .catch(() =>
        setHealthData({
          message: "Error fetching API",
          db_status: "unknown",
          db_version: ""
        })
      );
  }, []);

  return (
    <div className="home-container">
      <div className="logos">
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://flask.palletsprojects.com/" target="_blank" rel="noreferrer">
          <img src={flaskLogo} className="logo flask" alt="Flask logo" />
        </a>
        <a href="https://www.postgresql.org/" target="_blank" rel="noreferrer">
          <img src={postgresLogo} className="logo postgres" alt="PostgreSQL logo" />
        </a>
      </div>

      <h1>Expense Tracker</h1>
      <p className="description">
        A full-stack SPA built with React, Flask, and PostgreSQL.
      </p>

      <div className="card">
        <p><strong>Server status:</strong> {healthData.message}</p>
        <p><strong>DB status:</strong> {healthData.db_status}</p>
        {healthData.db_version && <p><strong>DB version:</strong> {healthData.db_version}</p>}
      </div>
    </div>
  );
}