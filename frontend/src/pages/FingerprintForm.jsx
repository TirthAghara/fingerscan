import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function FingerprintForm() {
    const navigate = useNavigate()

    const [data, setData] = useState({
        name: '',
        father_name: '',
        surname: '',
        mother_name: '',
        school_name: '',
        medium_of_study: '',
        gender: '',
        birthdate: '',
        occupation: '',
        contact_no: '',
        email: '',
        home_address: '',
        city: '',
        district: '',
        state: '',
        remarks: ''
    })

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }

    const submitForm = async (e) => {
        e.preventDefault()

        if (!data.name || !data.father_name || !data.surname || !data.contact) {
            alert('Please fill all required fields')
            return
        }

        try {
            await axios.post('https://fingerscan-4.onrender.com/fingerprint_users', data)
            navigate('/scan')  
        } catch (err) {
            alert('Failed to save user data')
            console.error(err.response ? err.response.data : err.message)
        }
    }

    return (
        <div className="fingerprint-page">
            <div className="auth-card" >
                <h2>Fingerprint Registration</h2>

                <form onSubmit={submitForm}>
                    {/* PERSONAL INFO */}
                    <h4 className="form-section">Personal Information</h4>

                    <div className="row mb-3">
                        <input name="name" placeholder="Your Full Name *" onChange={handleChange} />
                        {/* <input name="surname" placeholder="Surname *" onChange={handleChange} /> */}
                    </div>

                    <div className="form-row">
                        <input name="father_name" placeholder="Father Name *" onChange={handleChange} />
                        <input name="mother_name" placeholder="Mother Name" onChange={handleChange} />
                    </div>

                    <div className="form-row">
                        <input type="date" name="birthdate" onChange={handleChange} />
                        <input name="occupation" placeholder="Occupation(Self/Parent)" onChange={handleChange} />
                    </div>

                    <div className="gender-row">
                        <strong>Gender:</strong>
                        <label><input type="radio" name="gender" value="Male" onChange={handleChange} /> Male</label>
                        <label><input type="radio" name="gender" value="Female" onChange={handleChange} /> Female</label>
                        <label><input type="radio" name="gender" value="Other" onChange={handleChange} /> Other</label>
                    </div>

                    {/* EDUCATION */}
                    <h4 className="form-section">Education</h4>

                    <div className="form-row">
                        <input name="school_name" placeholder="School Name" onChange={handleChange} />
                        <select name="medium" onChange={handleChange}>
                            <option value="">Medium</option>
                            <option>English</option>
                            <option>Hindi</option>
                            <option>Gujarati</option>
                        </select>
                    </div>

                    {/* CONTACT */}
                    <h4 className="form-section">Contact Details</h4>

                    <div className="form-row">
                        <input name="contact" placeholder="Contact No *" onChange={handleChange} />
                        <input name="email" placeholder="Email" onChange={handleChange} />
                    </div>

                    <textarea name="address" placeholder="Address" onChange={handleChange}></textarea>

                    <div className="form-row">
                        <input name="city" placeholder="City" onChange={handleChange} />
                        <input name="district" placeholder="District" onChange={handleChange} />
                        <input name="state" placeholder="State" onChange={handleChange} />
                    </div>

                    {/* REMARKS */}
                    <h4 className="form-section">Remarks</h4>
                    <textarea
                        name="remarks"
                        placeholder="Additional remarks"
                        onChange={handleChange}
                    />

                    <button type="submit">Save & Continue</button>
                </form>
            </div>
        </div>
    )
}

export default FingerprintForm
