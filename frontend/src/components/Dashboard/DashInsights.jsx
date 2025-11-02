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
      <div className="insight-card">
        <h3>Insights</h3>
      </div>
      <div className="insight-card">
        <p>Total Value</p>
        <p>{total.toFixed(2)}</p>
      </div>
      <div className="insight-card">
        <p>Average Value</p>
        <p>{avg.toFixed(2)}</p>
      </div>
      <div className="insight-card">
        <p>Highest Value</p>
        <p>{max.toFixed(2)}</p>
      </div>
      <div className="insight-card">
        <p>Lowest Value</p>
        <p>{min.toFixed(2)}</p>
      </div>
    </div>
  );
}