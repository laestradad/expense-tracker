import { useState, useEffect } from "react";
import DashTable from "@/components/dashboard/DashTable.jsx";
import EditModal from "@/components/dashboard/Modal.jsx";
import DashMonth from "@/components/dashboard/DashMonth.jsx";
import PlotTrend from "@/components/dashboard/PlotTrend.jsx";
import { apiFetch } from "@/api/api";

export default function Dashboard() {
  // Tab visible
  const [active, setActive] = useState('tab1'); 
  
  // Categories and Transactions fetch
  const [categories, setCategories] = useState([]); 
  const [transactions, setTransactions] = useState([]);

  const fetchData = async () => {
          try {
            const result = await apiFetch("/api/transactions");
            setTransactions(result || []);
          } catch (error) {
            console.error("Error fetching transactions:", error);
          }
        };

  useEffect(() => {
    const fetchCategories = async () => {
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
    
    fetchCategories();
    fetchData();
  }, []);

  // Modal Management
  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [trans_id, setTransId] = useState(null);
  
  const handleOpen = (idx = null, id = null) => {
    setEditIndex(idx);
    setTransId(id);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditIndex(null);
    setTransId(null);
  };

 const handleSubmitModal = async (formData) => {
    if (editIndex === null) {
      // Create Transaction
      try {
          const data = await apiFetch("/api/transactions", {
            method: "POST",
            body: JSON.stringify(formData),
          });
          console.log(data);
          alert("Transaction created!")
      } catch (err) {
        alert(err.message);
      }
      fetchData();
      handleCloseModal();
    } else {
      // Update Transaction
      try {
        const data = await apiFetch(`/api/transactions/${trans_id}`, {
          method: "PUT",
          body: JSON.stringify(formData),
        });
        alert("Transaction updated!")
      } catch (err) {
        alert(err.message);
      }
      fetchData();
      handleCloseModal();
    }
  }
  
  const handleDeleteModal = async () => {
    // Delete Transaction
    if (confirm("Are you sure  do you want to delete this entry?") == true) {
      try {
        const data = await apiFetch(`/api/transactions/${trans_id}`, {
          method: "DELETE",
        });
        console.log(data);
      } catch (err) {
        alert(err.message);
      }
      fetchData();
      handleCloseModal();
    }
  };

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
                data={transactions}
                openModal={handleOpen}
              />
              <EditModal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmitModal}
                onDelete={handleDeleteModal}
                categories={categories}
                initialData={editIndex !== null ? transactions[editIndex] : {}}
                canDelete={editIndex !== null} 
              />
            </>
          }
            {active === 'tab2' && <DashMonth />}
            {active === 'tab3' && <PlotTrend />}
        </div>
    </div>
  );
}