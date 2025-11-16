import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();
    const { login, isAuthenticated } = useContext(AuthContext);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/board');
        }
    }, [isAuthenticated, navigate]);

    const { email, password } = formData;

    const onChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/auth/login', formData);
            login(res.data.token);
            navigate('/board');
        } catch (err) {
            console.error(err.response ? err.response.data : err.message);
            alert('Login failed. Invalid Credentials.'); 
        }
    };

    return (
        // Main container for the page
        <div style={{ 
            backgroundImage: `url('/Busines-Meeting.jpg')`, // <-- Background image
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh', // Ensures it covers the whole viewport
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: 'Arial, sans-serif'
        }}>
            {/* Authentication Box (Form Container) */}
            <div style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent white background
                padding: '40px 50px', // Increased padding
                borderRadius: '10px',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', // More prominent shadow
                textAlign: 'center',
                maxWidth: '450px', // Increased max width
                width: '90%' // Responsive width
            }}>
                <h2 style={{ color: '#333', marginBottom: '30px' }}>Login to Collaborative Task Manager</h2>
                <form onSubmit={onSubmit}>
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        name="email" 
                        value={email} 
                        onChange={onChange} 
                        required 
                        style={{ 
                            width: 'calc(100% - 20px)', // Adjust for padding
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
                        style={{ 
                            width: 'calc(100% - 20px)', 
                            padding: '12px 10px', 
                            margin: '10px 0 20px 0', // More space below password
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
                            backgroundColor: '#007bff', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '5px', 
                            fontSize: '1.1em', 
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
                    >
                        Login
                    </button>
                </form>
                <p style={{ marginTop: '20px', color: '#555' }}>
                    Don't have an account? 
                    <Link to="/register" style={{ color: '#007bff', textDecoration: 'none', marginLeft: '5px' }}>
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;