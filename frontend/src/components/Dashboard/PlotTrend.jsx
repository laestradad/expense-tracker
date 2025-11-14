import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { BaseLayoutDark, Greens, Reds } from "./plotlyStyles.js";
import { apiFetch } from "@/api/api";
import "./Dashboard.css";

export default function PlotTrend() {
  const [chartData, setChartData] = useState(null);

  const fetchData = async () => {
    try {
      const data = await apiFetch("/api/plots/trend");
      setChartData(data || []);
    } catch (error) {
      console.error("Error fetching trend data:", error);
    }
  };
    
  useEffect(() => {
    fetchData();
  }, []);

  if (!chartData) return <div>There are no transactions yet to plot...</div>;

  const {
    months,
    balance,
    cumulative,
    pos_months,
    pos_amounts,
    neg_months,
    neg_amounts,
    bardata,
  } = chartData;

  const traces = [];

  // Cumulative cashflow
  traces.push({
    x: months,
    y: cumulative,
    mode: "lines+markers",
    name: "Cashflow cumulative",
    line: { width: 2 },
  });

  // Monthly trend line
  traces.push({
    x: months,
    y: balance,
    mode: "lines",
    name: "Cashflow trend",
    line: { dash: "dot", width: 1 },
  });

  // Positive markers
  traces.push({
    x: pos_months,
    y: pos_amounts,
    mode: "markers",
    name: "Cashflow +",
    marker: {
      symbol: "arrow-bar-up",
      color: "green",
      size: 10,
      line: { color: "DarkSlateGrey", width: 1 },
    },
  });

  // Negative markers
  traces.push({
    x: neg_months,
    y: neg_amounts,
    mode: "markers",
    name: "Cashflow -",
    marker: {
      symbol: "arrow-bar-down",
      color: "red",
      size: 10,
      line: { color: "DarkSlateGrey", width: 1 },
    },
  });

  let i = 0;
  let j = 0;
  // Bar charts per type/category
  bardata.forEach((bar) => {
    let color;
    if (bar.type === "income") {
      color = Greens[i][1];
      i++;
      if (i >= Greens.length) i = 0;
    } else if (bar.type === "expense") {
      color = Reds[j][1];
      j++;
      if (j >= Reds.length) j = 0;
    }

    traces.push({
      type: "bar",
      x: bar.months,
      y: bar.values,
      text: bar.text,
      textposition: "none",
      name: bar.category,
      legendgroup: bar.type,
      legendgrouptitle: { text: bar.type },
      marker: { color },
    });
  });

  const layout = {
    ...BaseLayoutDark,
    barmode: "relative",
    xaxis: { type: 'category' },
    yaxis: { tickprefix: "$" },
    hoverlabel: {
      bgcolor: "rgba(255,255,255,0.75)",
      namelength: -1,
      font: { color: "black", size: 11 },
    },
    legend: { groupclick: "toggleitem" },
    margin: { t: 30 },
    hovermode: "closest",  
  };  

  const config={ 
            displaylogo: false,
            displayModeBar: true,
            scrollZoom: false,
            modeBarButtonsToRemove: [
              "toImage", "sendDataToCloud", "lasso2d", "select2d", "resetScale2d"
            ],
          }

  return (
    <Plot data={traces} layout={layout} config={config} useResizeHandler={true} style={{ width: "100%", height: "100%" }}/>
  );
}