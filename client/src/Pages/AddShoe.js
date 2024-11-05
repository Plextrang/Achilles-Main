import React, {useState} from "react";
import Model from "react-modal";
import {Link, redirect} from 'react-router-dom'
import './AddShoe.css';



export default function AddShoe() {
    const [visible, setVisible] = useState(true);
    const [shoeData, setShoeData] = useState({
        name: '',
        size: '',
        quantity: '',
        price: '',
        color: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShoeData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here
        console.log("Submitted data:", shoeData);
        // You can add further processing or API calls here
        setVisible(false); // Close the modal after submission
    };

    return (
        <div className="addshoe-container">
            {visible && (
                <div className="modal-overlay">
                    <Model isOpen={visible} onRequestClose={() => setVisible(false)}>
                        <h1 className="modal-title">Add Shoe</h1>
                        <form className="shoe-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Name:</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={shoeData.name}
                                    onChange={handleChange}                                  
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="size">Size:</label>
                                <input
                                    type="text"
                                    id="size"
                                    name="size"
                                    value={shoeData.size}
                                    onChange={handleChange}                                   
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="quantity">Quantity:</label>
                                <input
                                    type="number"
                                    id="quantity"
                                    name="quantity"
                                    value={shoeData.quantity}
                                    onChange={handleChange}                                   
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="price">Price:</label>
                                <input
                                    type="text"
                                    id="price"
                                    name="price"
                                    value={shoeData.price}
                                    onChange={handleChange}                                   
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="color">Color:</label>
                                <input
                                    type="text"
                                    id="color"
                                    name="color"
                                    value={shoeData.color}
                                    onChange={handleChange}
                                />
                            </div>
                            <button type="submit" className="submit-button">Submit</button>
                        </form>
                        <button className="close-button" onClick={() => setVisible(false)}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </Model>
                </div>
            )}
        </div>
    );
}
