import { useState, useEffect } from "react";
import DashTable from "@/components/dashboard/DashTable.jsx";
import EditModal from "@/components/dashboard/Modal.jsx";
import DashMonth from "@/components/dashboard/DashMonth";
import PlotTrend from "@/components/dashboard/PlotTrend";
import { apiFetch } from "@/api/api";

export default function Dashboard() {
  // Tab visible
  const [active, setActive] = useState('tab1'); 
  
  // Categories fetch, used for Modal
  const [categories, setCategories] = useState([]); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiFetch("/api/categories");
        const dropdownOptions = result.map(c => ({
          id: c.id,
          name: c.name
        }));
        setCategories(dropdownOptions || []);

      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchData();
  }, []);

  // Modal Management
  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  
  const handleOpen = (idx) => {
    setEditIndex(idx);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditIndex(null);
  };

 const handleSubmitModal = (formData) => {
    console.log("Form data to backend:", formData);
    handleCloseModal();
  };

  

  {/* TEST DATA */}
  const testData = [
    { id: 1, transaction_date: "2025-01-05", category_name: "Salary", amount: 2000, category_type: "income", comment: "Paycheck" },
    { id: 2, transaction_date: "2025-01-12", category_name: "Food", amount: 150, category_type: "expense", comment: "Groceries" },
    { id: 3, transaction_date: "2025-02-01", category_name: "Salary", amount: 2200, category_type: "income", comment: "Salary" },
    { id: 4, transaction_date: "2025-02-10", category_name: "Food", amount: 300, category_type: "expense", comment: "Restaurant" },
    { id: 5, transaction_date: "2025-03-03", category_name: "Salary", amount: 1800, category_type: "income", comment: "Freelance" },
    { id: 6, transaction_date: "2025-03-08", category_name: "Utilities", amount: 400, category_type: "expense", comment: "Bills" },
  ];





  return (
    <div className="tabs-container">
        <h1> Dashboard </h1>
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
          {active === 'tab1' && 
            <>
              <DashTable
                openModal={handleOpen}
              />
              <EditModal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmitModal}
                categories={categories}
                initialData={testData[editIndex] || {}}
              />
            </>
          }
            {active === 'tab2' && <DashMonth />}
            {active === 'tab3' && <PlotTrend />}
        </div>
    </div>
  );
}