import Plot from "react-plotly.js";
import { BaseLayoutDark } from "./plotlyStyles.js";
import "./Dashboard.css";

export default function DashPlot({ data }) {
  if (!data || data.length === 0) return <p>No data for plotting</p>;

  const dates = data.table.map((d) => d.date);
  const values = data.table.map((d) => d.value);
  const names = data.table.map((d) => d.name);

  return (
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
          width: null,      // let parent control width
          title: data.title || "Value by Date",
          xaxis: { title: "Date" },
          yaxis: { title: "Value" },
          dragmode: false, // disables box zoom drag
        }}
        config={{ 
          displayModeBar: true,
          scrollZoom: false, // disables mouse wheel zoom
          modeBarButtonsToRemove: [
            "toImage", "sendDataToCloud", "lasso2d", "select2d"
          ],
        }}
        useResizeHandler={true}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}