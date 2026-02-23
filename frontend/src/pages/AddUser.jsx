import React, { useState } from "react";
import "./Style2.css";
import Sidebar from "../component/sidebar";

function AddUser() {
  const [formData, setFormData] = useState({
    userId: "",
    fullName: "",
    email: "",
    mobile: "",
    role: "",
  });

  const handleChange = (e) => {
    setFormData({...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("User Added Successfully!");
  };

  return (
    <div className="main-layout">
      <Sidebar />

      <div className="content-area">

        <div className="form-container">
        <h2 className="page-title">Add User</h2>
          <form onSubmit={handleSubmit} className="user-form">

            <div className="form-group">
              <label>User ID</label>
              <input type="text" name="userId" value={formData.userId} onChange={handleChange} placeholder="Enter User ID" required/>
            </div>

            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter Full Name" required/>
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter Email" required/>
            </div>

            <div className="form-group">
              <label>Mobile Number</label>
              <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Enter Mobile Number" required/>
            </div>

            <div className="form-group">
              <label>Role</label>
              <select name="role" value={formData.role} onChange={handleChange} required>
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Staff">Staff</option>
                <option value="Customer">Customer</option>
              </select>
            </div>

            <button type="submit" className="submit-btn">
              Add User
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default AddUser;
