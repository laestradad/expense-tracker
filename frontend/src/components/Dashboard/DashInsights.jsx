import { useMemo } from "react";
import "./Dashboard.css";

export default function DashInsights({ data }) {
  const { total, avg, max, min } = useMemo(() => {
    const values = data.table.map((d) => d.value);
    const total = values.reduce((a, b) => a + b, 0);
    const avg = total / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    return { total, avg, max, min };
  }, [data]);

  return (
    <div className="insights-container">
      <div className="insight-card two-col">
        <h2>Insights</h2>
      </div>
      <div className="insight-card">
        <h3>Total Value</h3>
        <p>{total.toFixed(2)}</p>
      </div>
      <div className="insight-card">
        <h3>Average Value</h3>
        <p>{avg.toFixed(2)}</p>
      </div>
      <div className="insight-card">
        <h3>Highest Value</h3>
        <p>{max.toFixed(2)}</p>
      </div>
      <div className="insight-card">
        <h3>Lowest Value</h3>
        <p>{min.toFixed(2)}</p>
      </div>
    </div>
  );
}