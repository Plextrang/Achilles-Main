import React, { useEffect, useState, } from 'react';
import { Link } from 'react-router-dom';
import white_converse from '../images/white_converse.jpg';
import nike_air_force_1 from '../images/nike_air_force_1.jpg';
import adidas_gazelle_blue_gold from '../images/adidas_gazelle_blue_gold.jpg';
import doc_martens_jorge from '../images/doc_martens_jorge.jpg';
import hk_crocs_clogs from '../images/hk_crocs_clogs.jpg';
import naruto_crocs_clog from '../images/naruto_crocs_clog.jpg';
import './Cart.css';

const variableMap = {
    'white_converse': white_converse,
    'nike_air_force_1': nike_air_force_1,
    'adidas_gazelle_blue_gold': adidas_gazelle_blue_gold,
    'doc_martens_jorge': doc_martens_jorge,
    'hk_crocs_clogs': hk_crocs_clogs,
    'naruto_crocs_clog': naruto_crocs_clog
  };

  const removeProductFromCart = async (productId) => {
    try {
        const userEmail = localStorage.getItem('userEmail');
        console.log("Sending this id: ", productId);
        const url = `https://cosc-3380-6au9.vercel.app/api/handlers/products/removeProductFromCart?email=${encodeURIComponent(userEmail)}&productId=${encodeURIComponent(productId)}`;
        const response = await fetch(url, {
            method: 'DELETE', 
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Failed to remove product from cart');
        }
        console.log('Product removed from cart successfully');
    } catch (error) {
        console.error('Error removing product from cart:', error);
    }
};
export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
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
    const handleRemoveProduct = (productId) => {
        console.log(productId);
        removeProductFromCart(productId);
        setCartItems(prevCartItems => prevCartItems.filter(item => item.product_id !== productId));
    };
    const handleCheckout = () => {
        console.log('Checkout button clicked');
    };
    return (
        <div className="cart-container">
            <h1 className="cart-title">Shopping Cart</h1>
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
                        <button className="cart-item-remove" onClick={() => handleRemoveProduct(item.product_id)}>Remove</button>
                    </div>
                ))}
                {/* <div className="total-price"> Total : ${totalPrice.toFixed(2)}</div> */}
            </div>
            
            )}
            <div className="cart-summary">
            <div className="total-price">Total: ${totalPrice.toFixed(2)}</div>
            {/* <div className='promo-text'> $15 off purchases $150 or more</div> */} 
            {cartItems.length === 0 ? (
                <button className="checkout-button" disabled>Checkout</button>
            ) : (
                <Link to={{ pathname: "/CheckOut", state: { cartItems: cartItems } }} className="checkout-button">Checkout</Link>
            )}
            <Link to="/products" className="return-button">Return to Shopping</Link>
            </div>
        </div>
    );
}