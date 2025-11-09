import "./Dashboard.css";
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";
import { FaArrowAltCircleUp , FaArrowAltCircleDown  } from "react-icons/fa";

export default function DashTable({ rows, deleteRow, editRow }) {
  

  return (
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
          {rows.map((row, idx) => {
            
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
                    <BsFillTrashFill 
                      onClick={() => deleteRow(idx)}
                    />
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
    </div>
  );
}