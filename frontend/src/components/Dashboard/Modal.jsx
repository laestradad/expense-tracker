import React, { useState, useEffect } from "react";

export default function EditModal({
  isOpen,
  onClose,
  onSubmit,
  categories = [],
  initialData = {},
}) {
  const [formData, setFormData] = useState({
    transaction_date: "",
    amount: "",
    comment: "",
    category_id: "",
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        transaction_date: initialData.transaction_date || "",
        amount: initialData.amount || "",
        comment: initialData.comment || "",
        category_id: initialData.category_id || "",
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Transaction</h2>

        <form className="form-modal" onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Transaction Date: </label>
            <input
              type="date"
              name="transaction_date"
              value={formData.transaction_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Category: </label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Amount: </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Comment: </label>
            <input
              type="text"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
            />
          </div>

          <div className="modal-actions">
            <button type="submit">Submit</button>
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="button" onClick={onClose}>Delete</button>
          </div>
        </form>
      </div>
    </div>
  );
}
