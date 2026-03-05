import { useState } from 'react' 
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const login = () => {
    if (!username || !password) {
      setError('All fields are required')
      return
    }

    
    
    setError('')
    axios.post('https://fingerscan-4.onrender.com/login', { username, password })
    .then((res) => {
    console.log("LOGIN RESPONSE:", res.data);

    // If backend returns full user object
    const userData = res.data.user || res.data;

    if (!userData || !userData._id) {
      setError("Invalid server response");
      return;
    }

    localStorage.setItem("user", JSON.stringify(userData));

    navigate('https://fingerscan-4.onrender.com/fingerprint_users');
   })
      .catch(() => setError('Invalid credentials'))
  }

  return (
    
    <div className="container auth-card dark">
      <h2>Welcome Back</h2>

      {error && <p className="error">{error}</p>}

      <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)}/>

      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}/>

      <button onClick={login}>Login</button>

      {/* 🔹 Create Account / Register link */}
      <p className="switch-text" onClick={() => navigate('/register')}>
        New user? <span>Create Account</span>
      </p>
    </div>
  )
}

export default Login
