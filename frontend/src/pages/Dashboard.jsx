import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../component/sidebar";


function Dashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <div className="dashboard-layout">

      {/* SIDEBAR */}
      {/* <aside className={`sidebar ${sidebarOpen ? "active" : ""}`}>
        <div className="sidebar-header">
          <h2 className="logo">DASHBOARD</h2>
          <button className="close-btn" onClick={() => setSidebarOpen(false)}>
            ✖
          </button>
        </div>

        <nav className="menu">
          <button onClick={() => navigate("/dashboard")}>📊 Dashboard</button>
          <button onClick={() => navigate("/scan")}>✋ Add Fingerprint</button>
          <button onClick={() => navigate("/customers")}>👤 View Customer</button>
          <button onClick={() => navigate("/customers")}><i class="fa-solid fa-code-branch"></i> Add Branch </button>
          <button onClick={() => navigate("/customers")}> View Branch </button>
          <button onClick={() => navigate("/customers")}> Add User </button>
          <button onClick={() => navigate("/ViewUser")}> View User </button>
        </nav>
      </aside> */}
      

      {/* MAIN AREA */}
      <div className="dashboard-page">

        {/* HEADER */}
        <header className="dashboard-header">
          <button
            className="menu-toggle"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>

          <h3>
            Welcome, <span>{username}</span>
          </h3>

          <button onClick={logout}>Log Out</button>
        </header>
        
       <Sidebar/>

        {/* MAIN CONTENT */}
        <main className="dashboard-content">

          {/* STATS GRID */}
          <div className="stats-grid">
            <div className="stat-card total">
              <div className="stat-top">
                <h4>Total Fingerprints</h4>
                <span className="icon">🆔</span>
              </div>
              <p className="stat-number">128</p>
            </div>

            <div className="stat-card pending">
              <div className="stat-top">
                <h4>Pending</h4>
                <span className="icon">⏳</span>
              </div>
              <p className="stat-number">12</p>
            </div>

            <div className="stat-card approved">
              <div className="stat-top">
                <h4>Approved</h4>
                <span className="icon">✅</span>
              </div>
              <p className="stat-number">98</p>
            </div>

            <div className="stat-card rejected">
              <div className="stat-top">
                <h4>Rejected</h4>
                <span className="icon">❌</span>
              </div>
              <p className="stat-number">18</p>
            </div>
          </div>

          {/* MAIN ACTION BOX */}
          <div className="scan-box">
            <div className="plus">+</div>
            <h2>Add New Fingerprint</h2>
            <button onClick={() => navigate("/add-fingerprint")}>
              Start Scanning
            </button>
          </div>

        </main>
      </div>
    </div>



  );
}

export default Dashboard;