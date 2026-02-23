// import React from "react";
// import { useNavigate } from "react-router-dom";

// const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
//   const navigate = useNavigate();

//   return (

//     <div className="">
//       <aside className={`sidebar ${sidebarOpen ? "active" : ""}`}>
//         <div className="sidebar-header">
//           <h2 className="logo">DASHBOARD</h2>
//           <button className="close-btn" onClick={() => setSidebarOpen(false)}>
//             ✖
//           </button>
//         </div>

//         <nav className="menu">
//           <button onClick={() => navigate("/dashboard")}><i className="fa1 fa-etch fa-solid fa-gauge"></i>  Dashboard</button>
//           <button onClick={() => navigate("/scan")}><i className="fa1 fa-solid fa-plus"></i>  Add Fingerprint</button>
//           <button onClick={() => navigate("/customers")}><i className="fa1 fa-jelly fa-regular fa-eye"></i>   View Customer</button>
//           <button onClick={() => navigate("/AddBranch")}><i className="fa1 fa-solid fa-code-branch"></i>  Add Branch </button>
//           <button onClick={() => navigate("/ViewBranch")}><i className="fa1 fa-jelly fa-regular fa-eye"></i> View Branch </button>
//           <button onClick={() => navigate("/AddUser")}><i className="fa1 fa-solid fa-plus"></i> Add User </button>
//           <button onClick={() => navigate("/ViewUser")}><i className="fa1 fa-jelly fa-regular fa-eye"></i> View User </button>
//         </nav>
//       </aside> 
//     </div>
//   );
// };

// export default Sidebar;


import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();   // 👈 get current route

  const handleNavigation = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <aside className={`sidebar ${sidebarOpen ? "active" : ""}`}>
      <div className="sidebar-header">
        <h2 className="logo">DASHBOARD</h2>
        <button className="close-btn" onClick={() => setSidebarOpen(false)}>
          ✖
        </button>
      </div>

      <nav className="menu">
        <button
          className={location.pathname === "/dashboard" ? "active" : ""}
          onClick={() => handleNavigation("/dashboard")}> <i className="fa1 fa-solid fa-gauge"></i> Dashboard</button>

        <button
          className={location.pathname === "/scan" ? "active" : ""}
          onClick={() => handleNavigation("/scan")}> <i className="fa1 fa-solid fa-plus"></i> Add Fingerprint</button>

        <button
          className={location.pathname === "/customers" ? "active" : ""}
          onClick={() => handleNavigation("/customers")}> <i className="fa1 fa-jelly fa-regular fa-eye"></i>  View Customer</button>

        <button
          className={location.pathname === "/AddUser" ? "active" : ""}
          onClick={() => handleNavigation("/AddUser")}><i className="fa1 fa-solid fa-plus"></i> Add User</button>

        <button
          className={location.pathname === "/ViewUser" ? "active" : ""}
          onClick={() => handleNavigation("/ViewUser")}><i className="fa1 fa-regular fa-eye"></i> View User</button>

        <button
          className={location.pathname === "/AddBranch" ? "active" : ""}
          onClick={() => handleNavigation("/AddBranch")}><i className="fa1 fa-solid fa-code-branch"></i> Add Branch</button>

        <button
          className={location.pathname === "/ViewBranch" ? "active" : ""}
          onClick={() => handleNavigation("/ViewBranch")}><i className="fa1 fa-regular fa-eye"></i> View Branch</button>
      </nav>
    </aside>
  );
};

export default Sidebar;