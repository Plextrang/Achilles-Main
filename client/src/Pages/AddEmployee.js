import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Model from "react-modal";
import './AddEmployee.css';

export default function AddEmployee() {
    const navigate = useNavigate();
    const [visible, setVisible] = useState(true);
    const [emp_fname, setEmp_fname] = useState('');
    const [emp_mname, setEmp_mname] = useState('');
    const [emp_lname, setEmp_lname] = useState('');
    const [emp_pnum, setEmp_pnum] = useState('');
    //const [emp_DOB, setEmp_DOB] = useState('');
    const [emp_address, setEmp_address] = useState('');
    const [emp_city, setEmp_city] = useState('');
    const [emp_state, setEmp_state] = useState('');
    const [emp_ZIP, setEmp_ZIP] = useState('');
    const [emp_email, setEmp_email] = useState('');
    const [emp_password, setEmp_password] = useState('');
    const [emp_SSN, setEmp_SSN] = useState('');
    const [emp_salary, setEmp_salary] = useState('');
    const [isManager, setIsManager] = useState(false);

    const close = () =>{
        navigate('/Admin');
    };

    const handleSubmit = async(e) =>{
        const userEmail = localStorage.getItem('userEmail');
        e.preventDefault();
        const employeeData = {
            first_name: emp_fname,
            middle_initial: emp_mname,
            last_name: emp_lname, 
            phone_number: emp_pnum, 
            date_of_birth: document.getElementById('dob-box').value, 
            address: emp_address, 
            city: emp_city, 
            state: emp_state, 
            zip_code: emp_ZIP, 
            email: emp_email, 
            password: emp_password,
            e_ssn: emp_SSN, 
            salary: emp_salary
        };

        console.log(JSON.stringify(employeeData))
        try {
			const endpoint = isManager ? 'newManager' : 'newEmployee'; 
            const response = await fetch(`https://cosc-3380-6au9.vercel.app/api/handlers/users/${endpoint}`, {
				// mode: 'no-cors',
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(employeeData)
			});
			console.log(response.ok)
			if (!response.ok) {
				throw new Error('Network response was not ok', response);
			}
	
			const data = await response.json();
            console.log(data);

            close();
		} catch (error) {
			console.error('There was a problem with your fetch operation:', error);
			// Handle error, maybe show an error message to the user
		}
    };


    return (
        <div className="employee-entry-container">
            { visible && (
                <div className="modal-overlay">
                    <Model isOpen={visible} onRequestClose={() => setVisible(false)}>
                        <div id="form-space">
                
                        <form className="form-wrapper" onSubmit={handleSubmit}>
                            <div className="form-container">
                                <h1 id="title">New Employee</h1>
                                <div className="input">
                                    <label className="text-label">Employee First Name <span className="required">&#42;</span></label>
                                    <input className="text" type="text" value={emp_fname} onChange={(e) => setEmp_fname(e.target.value)} placeholder="John" maxLength="50" required />
                                </div>
                                <div className="input">
                                    <label className="text-label">Employee Middle Initial  <span className="required">&#42;</span></label>
                                    <input className="text" type="text" value={emp_mname} onChange={(e) => setEmp_mname(e.target.value)} placeholder="B" maxLength="1" required />
                                </div>
                                <div className="input">
                                    <label className="text-label">Employee Last Name <span className="required">&#42;</span></label>
                                    <input className="text" type="text" value={emp_lname} onChange={(e) => setEmp_lname(e.target.value)} placeholder="Doe" maxLength="50" required />
                                </div>
                                <div className="input">
                                    <label className="text-label">Employee Phone Number <span className="required">&#42;</span></label>
                                    <input className="text" type="text" value={emp_pnum} onChange={(e) => setEmp_pnum(e.target.value)} placeholder="123-456-7890" maxLength="10" required />
                                </div>
                                <div className="input">
                                    <label className="text-label">Employee D.O.B <span className="required">&#42;</span></label>
                                    <input className="text-box" id="dob-box" type="date" name="Date of Birth" min="1950-01-01" max="2024-3-17" pattern="\d{4}-\d{2}-\d{2}" title="Format is Year-Month-Day" />
                                </div>
                                <div className="input">
                                    <label className="text-label">Employee Address <span className="required">&#42;</span></label>
                                    <input className="text" type="text" value={emp_address} onChange={(e) => setEmp_address(e.target.value)} placeholder="123 Matcha Ln" maxLength="50" required />
                                </div>
                                <div className="input">
                                    <label className="text-label">Employee City <span className="required">&#42;</span></label>
                                    <input className="text" type="text" value={emp_city} onChange={(e) => setEmp_city(e.target.value)} placeholder="Houston" maxLength="20" required />
                                </div>
                                <div className="input">
                                    <label className="text-label">Employee State <span className="required">&#42;</span></label>
                                    <input className="text" type="text" value={emp_state} onChange={(e) => setEmp_state(e.target.value)} placeholder="Texas" maxLength="20" required />
                                </div>
                                <div className="input">
                                    <label className="text-label">Employee ZIP <span className="required">&#42;</span></label>
                                    <input className="text" type="text" value={emp_ZIP} onChange={(e) => setEmp_ZIP(e.target.value)} placeholder="10101" maxLength="5" required />
                                </div>
                                <div className="input">
                                    <label className="text-label">Employee E-mail  <span className="required">&#42;</span></label>
                                    <input className="text" type="text" value={emp_email} onChange={(e) => setEmp_email(e.target.value)} placeholder="employee@achilles.com" maxLength="50" required />
                                </div>
                                <div className="input">
                                    <label className="text-label">Employee Password  <span className="required">&#42;</span></label>
                                    <input className="text" type="text" value={emp_password} onChange={(e) => setEmp_password(e.target.value)} placeholder="Password1!" maxLength="50" required />
                                </div>
                                <div className="input">
                                    <label className="text-label">Employee SSN <span className="required">&#42;</span></label>
                                    <input className="text" type="text" value={emp_SSN} onChange={(e) => setEmp_SSN(e.target.value)} placeholder="123456789" maxLength="9" required />
                                </div>
                                <div className="input">
                                    <label className="text-label">Employee Salary <span className="required">&#42;</span></label>
                                    <input className="text" type="text" value={emp_salary} onChange={(e) => setEmp_salary(e.target.value)} placeholder="USD ($###.##)" maxLength="8" required />
                                </div>
                                <div className="input">
                                    <center><label className="text-label">Is this Employee a Manager?</label></center>
                                    <input className="checkbox-alignment" type="checkbox" checked={isManager} onChange={() => setIsManager(!isManager)}></input>
                                </div>
                                <div className="button-wrapper">
                                    <button className="entry-button" type="submit">Add Employee</button>
                                </div>
                                {/* {errorMessage && <p className="error-message">{errorMessage}</p>} */}

                                <button className="close-button" onClick={close}>X</button>                           {/* <button className="exit-button-wrapper">
                            <Link to="/Admin" className="close-button">Close</Link>
                            </button> */}
                            </div>
                            {/* <button className="exit-button-wrapper">
                            <Link to="/Admin" className="close-button">Close</Link>
                            </button> */}
                        </form>
                    </div>
                </Model>
            </div>
            )}
        </div>
    );
}
