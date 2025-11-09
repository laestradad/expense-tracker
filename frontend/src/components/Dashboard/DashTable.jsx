import { useEffect, useState } from "react";
import { FaArrowAltCircleUp , FaArrowAltCircleDown  } from "react-icons/fa";
import { BsFillPencilFill } from "react-icons/bs";
import { apiFetch } from "@/api/api";
import "./Dashboard.css";

export default function DashTable({ rows, editRow }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiFetch("/api/transactions");
        setData(result || []);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <>
    {data && data.length > 0 ? (
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Amount</th>
              <th className="hide-on-small">Comment</th>
              <th>Actions</th>
            </tr>
          </thead>
          
          <tbody>
            {data.map((row, idx) => {
              return (
                <tr key={row.id}>
                  <td>{row.transaction_date}</td>
                  <td>
                    {row.category_type === "income" ? <FaArrowAltCircleUp color="#17b117"/> : <FaArrowAltCircleDown color="#ce4646ff"/>}
                    {" "}{row.category_name}
                  </td>
                  <td>${" "}{row.amount}</td>
                  <td className="hide-on-small">{row.comment}</td>
                  <td>
                    <span className="actions">
                      <BsFillPencilFill
                        onClick={() => editRow(idx)}
                      />
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>) : (<p>No data available</p>)}
    </>
  );
}