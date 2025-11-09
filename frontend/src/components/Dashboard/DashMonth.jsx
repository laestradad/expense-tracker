import { useState } from "react";
import { FaArrowAltCircleUp , FaArrowAltCircleDown  } from "react-icons/fa";
import PlotRadial from "./PlotRadial";

export default function DashMonth({ rows }) {
  const months = {'01-01-2025':'Jan2025',
                  '01-02-2025':'Feb2025'};
                  
  const [selectedMonth, setSelectedMonth] = useState(months[0] || "");

  const isPositive = true;

  return (
    <main style={{marginBottom : '60px'}}>
      {/* Month Selector */}
      <div className="controls">
        <label>Select Month: </label>
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} >
          <option value="">-- Choose a month --</option>
          {Object.entries(months).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
      </div>

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

    </main>
  );
}