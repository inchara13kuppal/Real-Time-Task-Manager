import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const { username, email, password } = formData;

    const onChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/auth/register', formData);
            login(res.data.token);
            navigate('/board');
        } catch (err) {
            console.error(err.response ? err.response.data : err.message);
            alert('Registration failed. Check console for details.'); 
        }
    };

    return (
        // Main container for the page
        <div style={{ 
            backgroundImage: `url('/Busines-Meeting.jpg')`, // <-- Background image
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh', 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: 'Arial, sans-serif'
        }}>
            {/* Authentication Box (Form Container) */}
            <div style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                padding: '40px 50px', 
                borderRadius: '10px',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', 
                textAlign: 'center',
                maxWidth: '450px', 
                width: '90%'
            }}>
                <h2 style={{ color: '#333', marginBottom: '30px' }}>Register for Collaborative Task Manager</h2>
                <form onSubmit={onSubmit}>
                    <input 
                        type="text" 
                        placeholder="Username" 
                        name="username" 
                        value={username} 
                        onChange={onChange} 
                        required 
                        style={{ 
                            width: 'calc(100% - 20px)', 
                            padding: '12px 10px', 
                            margin: '10px 0', 
                            border: '1px solid #ccc', 
                            borderRadius: '5px', 
                            fontSize: '1em' 
                        }}
                    />
                    <br />
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        name="email" 
                        value={email} 
                        onChange={onChange} 
                        required 
                        style={{ 
                            width: 'calc(100% - 20px)', 
                            padding: '12px 10px', 
                            margin: '10px 0', 
                            border: '1px solid #ccc', 
                            borderRadius: '5px', 
                            fontSize: '1em' 
                        }}
                    />
                    <br />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        name="password" 
                        value={password} 
                        onChange={onChange} 
                        required 
                        minLength="6" 
                        style={{ 
                            width: 'calc(100% - 20px)', 
                            padding: '12px 10px', 
                            margin: '10px 0 20px 0', 
                            border: '1px solid #ccc', 
                            borderRadius: '5px', 
                            fontSize: '1em' 
                        }}
                    />
                    <br />
                    <button 
                        type="submit"
                        style={{ 
                            width: '100%', 
                            padding: '12px', 
                            backgroundColor: '#28a745', // A nice green for register
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '5px', 
                            fontSize: '1.1em', 
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#218838'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
                    >
                        Register
                    </button>
                </form>
                <p style={{ marginTop: '20px', color: '#555' }}>
                    Already have an account? 
                    <Link to="/" style={{ color: '#28a745', textDecoration: 'none', marginLeft: '5px' }}>
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;