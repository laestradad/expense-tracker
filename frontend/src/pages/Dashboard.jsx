import { useState } from "react";
import DashTable from "@/components/dashboard/DashTable.jsx";
import DashPlot from "@/components/dashboard/DashPlot";
import DashInsights from "@/components/dashboard/DashInsights";

export default function Dashboard() {
  const [active, setActive] = useState('tab1');

  return (
    <div className="tabs-container">
        <h1>
            Dashboard
        </h1>
        <div className="tabs">
            <button className={`button-tab ${active === 'tab1' ? 'active' : ''}`} onClick={() => setActive('tab1')}>
            Show all
            </button>
            <button className={`button-tab ${active === 'tab2' ? 'active' : ''}`} onClick={() => setActive('tab2')}>
            Monthly Insights
            </button>
            <button className={`button-tab ${active === 'tab3' ? 'active' : ''}`} onClick={() => setActive('tab3')}>
            Overall Trend
            </button>
        </div>

        {/* Tab content */}
        <div className="tab-content">
            {active === 'tab1' && <DashTable />}
            {active === 'tab2' && <DashPlot />}
            {active === 'tab3' && <DashInsights />}
        </div>
    </div>
  );
}