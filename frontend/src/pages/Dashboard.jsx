import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const navigate = useNavigate()
  const username = localStorage.getItem('username')

  const logout = () => {
    localStorage.removeItem('username')
    navigate('/')
  }

  return (
    <div className="dashboard-page">
      {/* HEADER */}
      <header className="dashboard-header">
        <h3>Welcome, <span>{username}</span></h3>
        <button onClick={logout}>Log Out</button>
      </header>

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
          <button onClick={() => navigate('/add-fingerprint')}>Start Scanning</button>
        </div>

      </main>
    </div>
  )
}

export default Dashboard
