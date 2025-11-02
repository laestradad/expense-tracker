import "./Dashboard.css";

export default function DashTable({ data }) {
  if (!data || data.length === 0) return <p>No data available</p>;

  // Assume data = array of objects
  const headers = Object.keys(data.table[0]);

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {headers.map((key) => (
              <th key={key}>{key.toUpperCase()}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.table.map((row, i) => (
            <tr key={i}>
              {headers.map((key) => (
                <td key={key}>{row[key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}