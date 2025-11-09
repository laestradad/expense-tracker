import Plot from "react-plotly.js";
import { BaseLayoutDark } from "./plotlyStyles.js";
import "./Dashboard.css";

export default function PlotRadial({ data }) {
  if (!data || data.length === 0) return <p>No data for plotting</p>;

  const dates = data.table.map((d) => d.date);
  const values = data.table.map((d) => d.value);
  const names = data.table.map((d) => d.name);

  return (
    <>
      <h2>Plot example</h2>
      <div className="plot-container">
        <Plot
          data={[
            {
              x: dates,
              y: values,
              type: "bar",
              text: names,
              hoverinfo: "x+y+text",
              marker: { color: "#3b82f6" },
            },
          ]}
          layout={{
            ...BaseLayoutDark,
            width: null,
            title: data.title || "Value by Date",
            xaxis: { title: "Date" },
            yaxis: { title: "Value" },
          }}
          config={{ 
            displaylogo: false,
            displayModeBar: true,
            scrollZoom: false,
            modeBarButtonsToRemove: [
              "toImage", "sendDataToCloud", "lasso2d", "select2d"
            ],
          }}
          useResizeHandler={true}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </>
  );
}