import { useState, useEffect } from "react";
import { FaArrowAltCircleUp , FaArrowAltCircleDown  } from "react-icons/fa";
import PlotRadial from "./PlotRadial";
import { apiFetch } from "@/api/api";

export default function DashMonth() {                  
  // Months options
  const [months, setMonths] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiFetch("/api/monthslist");
        setMonths(result || []);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchData();
  }, []);

  // Selected months
  const [selectedMonth, setSelectedMonth] = useState(months[0] || "");

  const handleChange = (e) => {
    setSelectedMonth(e.target.value);
  };
  
  // Fetch monthly totals
  const [data, setData] = useState([]);

  const isPositive = true;

  return (
    <main style={{marginBottom : '60px'}}>
      {/* Month Selector */}
      <div className="controls">
        <label>Select Month: </label>
        <select value={selectedMonth} onChange={handleChange}>
          <option value="">Select a month</option>
          {months.map((month) => (
            <option key={month.date} value={month.date}>
              {month.value}
            </option>
          ))}
        </select>
      </div>

      {data && data.length > 0 ? (
      <>
        {/* Plot Placeholder */}
        <div className="dashboard-item plot"><PlotRadial /></div>

        {/* Totals Table */}
        <div className="table-wrapper totals">
          <table className="data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
              
                return (
                  <tr>
                    <td>
                      {row.category_type === "income" ? <FaArrowAltCircleUp color="#17b117"/> : <FaArrowAltCircleDown color="#ce4646ff"/>}
                      {" "}{row.category_name}
                    </td>
                    <td>${" "}{row.amount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        
        {/* Summary Boxes */}
        <div className="insights-container">
          <div className="insight-card pos">
            <h3>Total In</h3>
            <p>200.000</p>
          </div>
          <div className="insight-card neg">
            <h3>Total Out</h3>
            <p>300.000</p>
          </div>
          <div className={`insight-card two-col ${isPositive ? "pos" : "neg"}`}>
            <h3>Balance</h3>
            <p>-100.000</p>
          </div>
        </div>
      </>) : (<p>No data available</p>)}

    </main>
  );
}