import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function FingerprintForm() {
    const navigate = useNavigate()

    const [data, setData] = useState({
        name: '',
        father_name: '',
        surname: '', // Input commented hai, isliye ye khali rahega
        mother_name: '',
        school_name: '',
        medium: '',      // Match with select name="medium"
        gender: '',
        birthdate: '',
        occupation: '',
        contact: '',     // Match with input name="contact"
        email: '',
        address: '',     // Match with textarea name="address"
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

        // Validation: Sirf un fields ko check karein jo UI mein hain
        if (!data.name || !data.father_name || !data.contact) {
            alert('Please fill all required fields (Name, Father Name, and Contact) *')
            return
        }

        try {
            const response = await axios.post('https://fingerscan-4.onrender.com/fingerprint_users', data)
            console.log("Form Saved:", response.data)
            navigate('/scan')  
        } catch (err) {
            alert('Failed to save user data')
            console.error(err.response ? err.response.data : err.message)
        }
    }

    return (
        <div className="fingerprint-page">
            <div className="auth-card">
                <h2>Fingerprint Registration</h2>

                <form onSubmit={submitForm}>
                    <h4 className="form-section">Personal Information</h4>

                    <div className="row mb-3">
                        {/* Surname check hata diya hai kyunki input commented hai */}
                        <input name="name" placeholder="Your Full Name *" onChange={handleChange} />
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

                    <h4 className="form-section">Education</h4>

                    <div className="form-row">
                        <input name="school_name" placeholder="School Name" onChange={handleChange} />
                        <select name="medium" onChange={handleChange}>
                            <option value="">Medium</option>
                            <option value="English">English</option>
                            <option value="Hindi">Hindi</option>
                            <option value="Gujarati">Gujarati</option>
                        </select>
                    </div>

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
