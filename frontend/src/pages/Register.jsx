import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [phonenumber, setPhonenumber] = useState('')
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const register = () => {
    if (!username || !password || !email) {
      setError('Please fill required fields')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setError('')

    axios.post('http://localhost:5000/register', {
      username,
      password,
      email,
      phonenumber,
      address
    })
      .then(() => {
        alert('Account created successfully')
        navigate('/')
      })
      .catch(() => setError('User already exists'))
  }

  return (
    <div className="container auth-card dark">
      <h2>Create Account</h2>

      {error && <p className="error">{error}</p>}

      <input placeholder="Username" onChange={e => setUsername(e.target.value)} />
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <input placeholder="Phone Number" onChange={e => setPhonenumber(e.target.value)} />
      <input placeholder="Address" onChange={e => setAddress(e.target.value)} />

      <button onClick={register}>Create Account</button>

      <p className="switch-text" onClick={() => navigate('/')}>
        Already have an account? <span>Login</span>
      </p>
    </div>
  )
}

export default Register
