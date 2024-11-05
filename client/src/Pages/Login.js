import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom'
import './Login.css';

export default function Login() {
	const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const userData = {
            email: email,
            password: password
        };

        try {
            const response = await fetch('https://cosc-3380-6au9.vercel.app/api/handlers/users/returningUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            localStorage.setItem('userEmail', email);
            console.log(email);
            if (data.redirectUrl) {
                if(data.userType) {
                    const userTypeValue = data.userType[0].user_type; 
                    localStorage.setItem('userType', userTypeValue);
                }
                navigate(data.redirectUrl);
                window.location.reload();
            }
        } catch (error) {
            console.error('There was a problem with your fetch operation:', error);
            alert("Invalid email or password");
        }
    };

	return (
		<div className="login-container">
			<form onSubmit={handleLogin} className="login-form">
				<center><h2 id="login-header">ACHILLES | Sign In</h2></center>
				<div className="input-group">
					<label htmlFor="email">Email:</label>
					<input type="text" id="email" placeholder='example@domain.com'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>
				<div className="input-group">
					<label htmlFor="password">Password:</label>
					<input
						type="password" id="password" placeholder='Required (8 characters minimum)'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
					{/* TODO: MAKE FORGOT email/PASSWORD FORM AND LINK */}
				</div>
				<button type="submit">Login</button>
				<Link id="no-account" to="/Register">Don't have an account?</Link>
			</form>
		</div>
	);
}
