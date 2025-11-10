import { useState, useEffect } from "react";
import { FaArrowAltCircleUp , FaArrowAltCircleDown  } from "react-icons/fa";
import PlotRadial from "./PlotRadial";
import { apiFetch } from "@/api/api";

export default function DashMonth() {                  
  // Months options
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);

  const fetchMonths = async () => {
    try {
      const result = await apiFetch("/api/monthslist");
      setMonths(result || []);
      setSelectedMonth(result[0]?.date || "")
    } catch (error) {
      console.error("Error fetching months:", error);
    }
  };

  useEffect(() => {
    fetchMonths();
  }, []);

  // Fetch monthly totals
  const [totals, setTotals] = useState(null);
  
  const fetchTotals = async (selectedMonth) => {
    try {
      const result = await apiFetch(`/api/insights/categories?date=${selectedMonth}`);
      setTotals(result || []);
    } catch (error) {
      console.error("Error fetching totals:", error);
    }
  };

  const handleChange = (e) => {
    setSelectedMonth(e.target.value);
  };
  
  // Fetch monthly balances
  const [balances, setBalances] = useState(null);

  const fetchBalance = async (selectedMonth) => {
    try {
      const result = await apiFetch(`/api/insights/inout?date=${selectedMonth}`);
      setBalances(result || []);
    } catch (error) {
      console.error("Error fetching inout:", error);
    }
  };
  
  // Fetch plot data
  const [plotData, setplotData] = useState(null);
  
  useEffect(() => {
    if (selectedMonth) {
      fetchTotals(selectedMonth);
      fetchBalance(selectedMonth);
    }
  }, [selectedMonth]);

  return (
    <main style={{marginBottom : '60px'}}>
      {months && months.length > 0 ? (
        <div className="controls">
          <label>Select Month: </label>
          <select value={selectedMonth.date} onChange={handleChange}>
            {months.map(
              (month) => (<option key={month.date} value={month.date} label={month.value}/>)
            )}
          </select>
        </div>) : (<p>No data available</p>)}
      
      <div className="dashboard-item plot"><PlotRadial selectedMonth={selectedMonth}/></div>

      {totals && totals.length > 0 ? (
        <div className="table-wrapper totals">
          <table className="data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {totals.map((row, idx) => (
                <tr key={row.category_name || idx}>
                  <td>
                    {row.category_type === "income" ? (
                      <FaArrowAltCircleUp color="#17b117" />
                    ) : (
                      <FaArrowAltCircleDown color="#ce4646ff" />
                    )}{" "}{row.category_name}
                  </td>
                  <td>${" "}{row.total_amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>) : (<p>No data available</p>)}
        
      {balances? (
        <div className="insights-container">
          <div className="insight-card pos">
            <h3>Total In</h3>
            <p>+${balances.income}</p>
          </div>
          <div className="insight-card neg">
            <h3>Total Out</h3>
            <p>-${balances.outcome}</p>
          </div>
          <div className={`insight-card two-col ${balances.isPositive ? "pos" : "neg"}`}>
            <h3>Balance</h3>
            <p>${balances.balance}</p>
          </div>
        </div>) : (<p>No data available</p>)}
    </main>
  );
}