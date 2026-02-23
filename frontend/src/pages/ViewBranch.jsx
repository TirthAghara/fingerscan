import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Style2.css";
import Sidebar from "../component/sidebar";

function ViewBranch() {
  const [branches, setBranches] = useState([]);

  // Fetch data from backend
  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await axios.get("http://localhost:5000/branches");
      setBranches(response.data);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="dashboard-page">
        <div className="table-container">
          <h2 className="page-title">View Branches</h2>

          <table className="user-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Branch Name</th>
                <th>Branch Code</th>
                <th>Address</th>
                <th>City</th>
                <th>Contact</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {branches.map((branch, index) => (
                <tr key={branch._id}>
                  <td>{index + 1}</td>
                  <td>{branch.branchName}</td>
                  <td>{branch.branchCode}</td>
                  <td>{branch.address}</td>
                  <td>{branch.city}</td>
                  <td>{branch.contact}</td>
                  <td>
                    <span
                      className={`status ${
                        branch.status === "Active"
                          ? "status-active"
                          : "status-inactive"
                      }`}
                    >
                      {branch.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {branches.length === 0 && (
            <p className="no-data">No branches found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewBranch;