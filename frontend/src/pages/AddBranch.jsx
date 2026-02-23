import React, { useState } from "react";
import axios from "axios";
import "./Style2.css";
import Sidebar from "../component/sidebar";

function AddBranch() {
  const [branchData, setBranchData] = useState({
    branchName: "",
    branchCode: "",
    address: "",
    city: "",
    contact: "",
    status: "",
  });

  const handleChange = (e) => {
    setBranchData({
      ...branchData,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(
      "http://localhost:5000/add-branch",
      branchData
    );

    alert(response.data.message || "Branch Added Successfully!");

    // Clear form after submit
    setBranchData({
      branchName: "",
      branchCode: "",
      address: "",
      city: "",
      contact: "",
      status: "",
    });

  } catch (error) {
    console.error(error);
    alert("Error adding branch");
  }
};
  return (
    <div className="main-layout">
      <Sidebar />

      <div className="content-area">

        <div className="form-container">
        <h2 className="page-title">Add Branch</h2>
          <form className="user-form" onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Branch Name</label>
              <input type="text" name="branchName" value={branchData.branchName} onChange={handleChange} placeholder="Enter Branch Name" required/>
            </div>

            <div className="form-group">
              <label>Branch Code</label>
              <input type="text" name="branchCode" value={branchData.branchCode} onChange={handleChange} placeholder="Enter Branch Code" required/>
            </div>

            <div className="form-group">
              <label>Address</label>
              <input type="text" name="address" value={branchData.address} onChange={handleChange} placeholder="Enter Address" required/>
            </div>

            <div className="form-group">
              <label>City</label>
              <input type="text" name="city" value={branchData.city} onChange={handleChange} placeholder="Enter City" required />
            </div>

            <div className="form-group">
              <label>Contact Number</label>
              <input type="tel" name="contact" value={branchData.contact} onChange={handleChange} placeholder="Enter Contact Number" required/>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select name="status" value={branchData.status} onChange={handleChange} required>
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <button type="submit" className="submit-btn">
              Add Branch
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default AddBranch;
