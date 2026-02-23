import React from "react";
import "./Style2.css";
import Sidebar from "../component/sidebar";

const ViewUsers = () => {
  const users = [
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul@gmail.com",
      mobile: "9876543210",
      role: "Admin",
      status: "Active",
    },
    {
      id: 2,
      name: "Amit Patel",
      email: "amit@gmail.com",
      mobile: "9123456780",
      role: "Staff",
      status: "Inactive",
    },
    {
      id: 3,
      name: "Neeraj Verma",
      email: "neeraj@gmail.com",
      mobile: "9988776655",
      role: "Customer",
      status: "Active",
    },
    
  ];

  return (
    <div className="layout">
      <Sidebar />
      <div className="dashboard-page">
         <div className="table-container">
          <h2 className="page-title">View Users</h2>
            <table className="user-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Mobile Number</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr> 
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.mobile}</td>
                    <td className={`role ${user.role.toLowerCase()}`}>
                      {user.role}
                    </td>
                    <td>
                      <span
                        className={`status ${
                          user.status === "Active"
                            ? "status-active"
                            : "status-inactive"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {users.length === 0 && (
              <p className="no-data">No users found</p>
            )}
          </div>
      </div>
       
    </div>
  );
};

export default ViewUsers;
