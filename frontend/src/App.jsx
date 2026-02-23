import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Pages
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import FingerprintForm from './pages/FingerprintForm'
import FingerprintScan from './pages/FingerprintScan'
import ViewUsers from './pages/ViewUser'
import AddUser from './pages/AddUser'
import AddBranch from './pages/AddBranch'
import ViewBranch from './pages/ViewBranch'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-fingerprint" element={<FingerprintForm />} />
        <Route path="/scan" element={<FingerprintScan />} />
        <Route path="/ViewUser" element={<ViewUsers />} />
        <Route path="/AddUser" element={<AddUser />} />
        <Route path="/AddBranch" element={<AddBranch />} />
        <Route path="/ViewBranch" element={<ViewBranch />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
