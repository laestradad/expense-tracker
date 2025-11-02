import Plot from "react-plotly.js";

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
          title: data.title || "Value by Date",
          xaxis: { title: "Date" },
          yaxis: { title: "Value" },
          margin: { t: 40, r: 20, b: 40, l: 50 },
          autosize: true,
        }}
        config={{ displayModeBar: false }}
        useResizeHandler={true}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}