import { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import { BaseLayoutDark } from "./plotlyStyles.js";
import { apiFetch } from "@/api/api";
import "./Dashboard.css";

export default function PlotRadial({ selectedMonth }) {
  const [data, setData] = useState({ labels: [], parents: [], values: [] });

  const fetchData = async () => {
      try {
        const result = await apiFetch(`/api/plots/sunburst?date=${selectedMonth}`);
        setData(result || []);
      } catch (error) {
        console.error("Error fetching sunburst data:", error);
      }
    };
    
  useEffect(() => {
    if (selectedMonth) {
      fetchData();
    }
  }, [selectedMonth]);

  
  const parentColorMap = {
    "Expenses": "#ef4444",
    "Income": "#22c55e",
  };

  // Map each label to a color
  const colors = data.labels.map((label, i) => {
    const parent = data.parents[i];
    
    if (!parent) {
      // If no parent, this is a top-level parent, use its own color
      return parentColorMap[label];
    } else {
      // Child: inherit parent color
      return parentColorMap[parent];
    }
  })

  const PlotData = [
    {
      type: "sunburst",
      labels: data?.labels,
      parents: data?.parents,
      values: data?.values,
      branchvalues: "total",
      leaf: { opacity: 0.6 },
      marker: { line: { width: 2 }, colors: colors},
      hovertemplate: "%{label}: $%{value:,}<extra></extra>",
      insidetextfont: { color: "#e2e8f0" },
    },
  ];

  const layout={
            ...BaseLayoutDark,
            width: null,
            font: {
              family: "Inter, sans-serif",
              size: 14,
              color: "#e2e8f0",
            },
          }

  const config={ 
            displaylogo: false,
            displayModeBar: true,
            scrollZoom: false,
            modeBarButtonsToRemove: [
              "toImage", "sendDataToCloud", "lasso2d", "select2d"
            ],
          }

  return (
    <div className="plot-container">
      <Plot data={PlotData} layout={layout} config={config} useResizeHandler={true} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}