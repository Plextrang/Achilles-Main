import React, {useEffect} from 'react'
import {Link} from 'react-router-dom'
import "./Profile.css"

export default function Profile() {
    useEffect(() => {
        const validStates = [
          "Alabama", "Alaska", "Arizona", "Arkansas", "California",
          "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
          "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
          "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
          "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri",
          "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
          "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
          "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
          "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
          "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
        ];
    
        const inputElement = document.getElementById("stateInput");
    
        const handleInput = () => {
            const inputValue = inputElement.value.trim().toLowerCase();
            const isValid = validStates.map(state => state.toLowerCase()).includes(inputValue);
            const validationMessage = isValid ? "" : "Invalid state name";
        
            document.getElementById("stateValidationMessage").textContent = validationMessage;
            inputElement.setCustomValidity(validationMessage);
        };
    
        inputElement.addEventListener("input", handleInput);
    
        return () => {
          inputElement.removeEventListener("input", handleInput);
        };
    }, []);

  return (
    <div id="profileForm">
        <form className="form-wrapper">
            <div className="form-container">
            <h1 id="title">Profile Customization</h1>
            <div className="location-container">
                <div className="input-name">
                    <label className="text-label">First Name</label>
                    <input className="text" type="text" name="Fname" placeholder="John" maxLength="20" />
                </div>
            
                <div className="input-mname">
                    <label className="text-label">Middle Initial</label>
                    <input className="text" id="stateInput" type="text" name="Middle Initial" placeholder="P" maxLength="1"/>
                </div>
                <div className="input-name">
                    <label className="text-label">Last Name</label>
                    <input className="text" type="text" name="Last Name" placeholder="Doe" maxLength="20" />
                </div>
            </div>
            <div className="details-container">
                <div className="input">
                    <label className="text-label">Phone Number</label>
                    <input className="text" type="text" name="Pnum" placeholder="000-000-0000" maxLength="20" />
                </div>
                <div className="input-dob">
                    <label className="text-label">Date of Birth </label>
                    <input className="text" type="date" name="Date of Birth" min="1950-01-01" max="2024-3-17"
                        pattern="\d{4}-\d{2}-\d{2}" title="Format is Year-Month-Day" />
                </div>
            </div>
            <div className="input">
                <label className="text-label">Address 1 </label>
                <input className="text" type="text" name="Address 1" placeholder="Street Name/Address" maxLength="50"/>
            </div>
            <div className="input">
                <label className="text-label">Address 2</label>
                <input className="text" type="text" name="Address 2" placeholder="Apt Number" maxLength="50"/>
            </div>
            <div className="location-container">
                <div className="input-city">
                    <label className="text-label">City </label>
                    <input className="text" type="text" name="City" placeholder="City" maxLength="20" />
                </div>
                <div className="input">
                    <label className="text-label">State </label>
                    <input className="text" id="stateInput" type="text" name="State" placeholder="State" maxLength="15" />
                    <span id="stateValidationMessage" style={{ color: 'red' }}></span>
                </div>
                <div className="input">
                    <label className="text-label">Zip Code</label>
                    <input className="text" type="text" name="Zip Code" placeholder="Zip Code (5 digits)" pattern="[0-9]{5}" maxLength="7" />
                </div>
            </div>
            <div className="button-wrapper">
                <button className="entry-button">Confirm Changes</button>
            </div>
            </div>
        </form>
    </div>
  )
}