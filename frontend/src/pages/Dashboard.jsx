import { useState, useEffect } from "react";
import { apiFetch, downloadFile } from "../api";
import UploadFile from "../components/UploadFile";
import DashTable from "../components/Dashboard/DashTable.jsx";
import DashPlot from "../components/Dashboard/DashPlot";
import DashInsights from "../components/Dashboard/DashInsights";

export default function Dashboard() {   
  const [data, setData] = useState(null); // parent owns data

  // Test API request when authenticated
  useEffect(() => {
  const fetchData = async () => {
    const data = await apiFetch("/api/dashboard");
    if (data) setMessage(data.message || data.error);
  };
  fetchData();
  }, []);

  const handleDataLoaded = (newData) => {
    setData(newData); // update state when upload completes
  };

  const handleDownload = async () => {
    try {
      await downloadFile("/api/download");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>

      {!data || data.length === 0 ? (
        <div>
          <p>No data yet. Add a .csv file with your transactions below.</p>
          <UploadFile onDataLoaded={handleDataLoaded} />
          <button onClick={handleDownload}>Download Template</button>
        </div>
      ) : (
        <div className="dashboard-container">
          <div className="dashboard-item table">
            <DashTable data={data} />
          </div>
          
          <div className="dashboard-item plot">
            <DashPlot data={data} />
          </div>

          <div className="dashboard-item insights">
            <DashInsights data={data} />
          </div>
        </div>
      )}
    </div>
  );
}