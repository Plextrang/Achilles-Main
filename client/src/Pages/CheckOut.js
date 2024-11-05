import React, {useEffect, useState,} from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import white_converse from '../images/white_converse.jpg'; 
import nike_air_force_1 from '../images/nike_air_force_1.jpg';
import adidas_gazelle_blue_gold from '../images/adidas_gazelle_blue_gold.jpg';
import doc_martens_jorge from '../images/doc_martens_jorge.jpg';
import hk_crocs_clogs from '../images/hk_crocs_clogs.jpg';
import naruto_crocs_clog from '../images/naruto_crocs_clog.jpg';
import './CheckOut.css';

// Pull all shoes from cart item where the user_id matches
// display the shoes one at a time
// add the totals of all shoes by adding the price*quantity for each product.
const variableMap = {
    'white_converse': white_converse,
    'nike_air_force_1': nike_air_force_1,
    'adidas_gazelle_blue_gold': adidas_gazelle_blue_gold,
    'doc_martens_jorge': doc_martens_jorge,
    'hk_crocs_clogs': hk_crocs_clogs,
    'naruto_crocs_clog': naruto_crocs_clog
  };


export default function CheckOut() {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const email = localStorage.getItem('userEmail');
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [cvv, setcvv] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [userCity, setUserCity] = useState('');
    const [userState, setUserState] = useState('');
    const [userPostalCode, setPostalCode] = useState('');
    const [userCountry, setCountry] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [showDiscountPopup, setShowDiscountPopup] = useState(false);
    const [] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Fetching items");
        const userEmail = localStorage.getItem('userEmail');
        fetch(`https://cosc-3380-6au9.vercel.app/api/handlers/products/getCartItems?email=${encodeURIComponent(userEmail)}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            console.log("Frontend got: ", data);
            setCartItems(data);
            console.log("cartItems is now: ", cartItems);
          })
          .catch(error => {
            console.error('Error fetching cart items:', error);
          });
      }, []);
    useEffect(() => {
        let total = 0;
        cartItems.forEach(item => {total += item.price * item.quantity;});
        setTotalPrice(total);
    }, [cartItems]);

    const handleOrder = () => {
        let discount = 0;
        console.log("Confirming Order");
    
        // Prepare the request body
        const datetime = new Date();
        let formattedDatetimeStr = datetime.toISOString().slice(0, 19).replace('T', ' ');
        //debugging date-time
        console.log(formattedDatetimeStr);
        const requestBody = {
            totalPrice: totalPrice,
            cartItems: cartItems,
            datetime: formattedDatetimeStr,
            email: email,
            num_items: cartItems.length,
            card_number: cardNumber, 
            cardholder_name: cardName, 
            billing_address: streetAddress, 
            security_code: cvv, 
            billing_city: userCity, 
            bill_state: userState, 
            bill_zip: userPostalCode, 
            location: userCountry
        };
    
        fetch('https://cosc-3380-6au9.vercel.app/api/handlers/order/newOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            if(response.status === 210){
                discount = 1;
            }
            return response.json();
        })
        .then(data => {
            console.log('Order confirmed:', data);
            
            clearCartBackend();
            if(discount === 1){
                setShowDiscountPopup(true);
            } else {
                setShowPopup(true);
            }
        })
        .catch(error => {
            console.error('Error confirming order:', error);
        });
    };

    const clearCartBackend = () => {
        fetch('https://cosc-3380-6au9.vercel.app/api/handlers/order/clearCart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email }) 
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Cart cleared successfully:', data);
        })
        .catch(error => {
            console.error('Error clearing cart:', error);
        });
    };
    

    return (
        <div className="checkout-container">
            <h1 className="checkout-title">Checkout</h1>
            {cartItems.length === 0 ? (
                <div className="cart-items"> 
                    <p>Cart is empty.</p>
                </div>
            ) : (
            <div className="cart-items">
                {cartItems.map(item => (
                    <div className="cart-item" key={item.product_id}>
                        <img src={variableMap[item.image_filename]} alt={item.item_name} className="cart-item-image" />
                        <div className="cart-item-details">
                            <h3 className="cart-item-name">{item.item_name}</h3>
                            <p>Quantity: {item.quantity}</p>
                            <span className="cart-item-price">${item.price}</span>
                        </div>
                    </div>
                ))}
            </div>
            
            )}
            <div className="checkout-summary">
                <h2>Order Summary</h2>
                <div className="checkout-subtotal">
                    <span>Discount:</span>
                    <span>Shipping:</span>
                    <div className="total-price">Total: ${totalPrice.toFixed(2)}</div>
                </div>
                {/* <button className="confirm-order-button" onClick={handleOrder}>Confirm Order</button> */}
            </div>
            <div className="payment-section">
                <h2>Payment Method</h2>
                <form onSubmit={handleOrder}>
                    {/* Name on Card */}
                <label htmlFor = "cardName"> Name on Card: </label>
                    <input 
                        type = "text"
                        id = "cardName"
                        value = {cardName}
                        onChange = {(e) => setCardName(e.target.value)}
                    />
                      {/* Card Number */}
                    <label htmlFor = "cardNumber"> Card Number: </label>
                    <input 
                        type = "text"
                        id = "cardNumber"
                        value = {cardNumber}
                        onChange = {(e) => setCardNumber(e.target.value)}
                    />
                    <label htmlFor = "cvv"> CVV: </label>
                    <input 
                        type = "text"
                        id = "cvv"
                        value = {cvv}
                        onChange = {(e) => setcvv(e.target.value)}
                    />
                </form>
            </div>
            <div className = "shipping-address">
                <h2>Shipping Address</h2>
                {/*DO THE SAME HERE AS PAYMENT*/}
                <form onSubmit = {handleOrder}>
                    <label htmlFor = "streetAddress">Street Address: </label>
                    <input
                        type = "text"
                        id = "streetAddress"
                        value = {streetAddress}
                        onChange = {(e) => setStreetAddress(e.target.value)}
                    />
                    <label htmlFor = "userCity">City: </label>
                    <input
                        type = "text"
                        id = "userCity"
                        value = {userCity}
                        onChange = {(e) => setUserCity(e.target.value)}
                    />
                    <label htmlFor = "userState">State: </label>
                    <input
                        type = "text"
                        id = "userState"
                        value = {userState}
                        onChange = {(e) => setUserState(e.target.value)}
                    />
                    <label htmlFor = "userPostalCode">ZIP Code: </label>
                    <input
                        type = "text"
                        id = "userPostalCode"
                        value = {userPostalCode}
                        onChange = {(e) => setPostalCode(e.target.value)}
                    />
                    <label htmlFor = "userCountry">Country: </label>
                    <input
                        type = "text"
                        id = "userCountry"
                        value = {userCountry}
                        onChange = {(e) => setCountry(e.target.value)}
                    />
                </form>
                <button className="confirm-order-button" onClick={handleOrder}>Confirm Order</button>
                {showPopup && (
                    <div className="popup">
                        <p>Thank you for your order!</p>
                        <Link to="/MyProfile" className="go-to-profile">Close</Link>
                    </div>
                )}
                {showDiscountPopup && (
                    <div className="popup">
                        <p>Thank you for your order!</p>
                        <p>You got a 10% discount for spending over $100!</p>
                        <Link to="/MyProfile" className="go-to-profile">Close</Link>
                    </div>
                )}
            </div>
        </div>
    );
}
