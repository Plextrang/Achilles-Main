import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import achillesLogo from '../images/achillesicon.png';
import { CgProfile } from "react-icons/cg";
import { CiShop } from "react-icons/ci";
import { IoIosNotifications } from "react-icons/io";
import './Navbar.css';

export default function Navbar() {
    const navigate = useNavigate();
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [userType, setType] = useState("");
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [isLoaded, setLoaded] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('userEmail')) {
            setLoggedIn(true)
        } 
        else {
            setLoggedIn(false)
        }
        if(localStorage.getItem('userType') !== undefined)
            setType(localStorage.getItem('userType'));
        getNotifications();
    }, []);

    const handleLogin = () => {
        navigate('/Login');
    };
    const continueShopping = () =>{
        navigate('/Products')
    };
    const getNotifications = () =>{
        const userEmail = localStorage.getItem('userEmail');
        if (!showNotifications) {
            // Fetch notifications only if container is not already shown
            fetch(`https://cosc-3380-6au9.vercel.app/api/handlers/users/getNotifications?email=${userEmail}`)
                .then(response => response.json())
                .then(data => {
                    setNotifications(data);
                    if(!isLoaded)
                    {
                        setLoaded(true);
                        setShowNotifications(false);
                    }
                    else
                    {    
                        setShowNotifications(true); 
                    }
                })
                .catch(error => {
                    console.error('Network response was not ok', error);
                });
        } else {
            // Hide the container if already shown
            setShowNotifications(false);
        }
    }

    const handleLogout = () => {
        const userEmail = localStorage.getItem('userEmail');

        fetch('https://cosc-3380-6au9.vercel.app/api/handlers/users/logoutUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: userEmail })
        }).then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Logout successful:', data);
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userType');
                setLoggedIn(false); 
                navigate('/Login');
            })
            .catch(error => {
                console.error('Error logging out:', error);
            });
    };
    const markAsRead = async (notification) =>{
        console.log(notification);
        const userEmail = localStorage.getItem('userEmail')
        try {
            const response = await fetch('https://cosc-3380-6au9.vercel.app/api/handlers/users/markAsRead', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: userEmail, notif_id: notification.notification_id })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            if(data) {
                console.log("Notif was deleted successfully", data);
                setShowNotifications(false);
                getNotifications();
            }
        } catch (error) {
            console.error('There was a problem with your fetch operation:', error);
        }
        
    }

    return (
        <div className="nav-container">
            <div className="left-side">
                <div id="logo-space">
                    <Link to="/Home">
                        <button id="logo-button">
                            <img src={achillesLogo} alt="Achilles Logo" />
                        </button>
                    </Link>
                </div>
            </div>
            <div className="right-side">
                {isLoggedIn ? (
                    <>
                        {(userType === 'Manager' || userType === 'Administrator') && (
                            <Link to="/Admin" className="nav-link">Manager Portal</Link>
                        )}
                        {userType === 'Employee' && (
                           <Link to="#" className="nav-link" id="emplo-link">Employee Button</Link>
                        )}
                        {userType === 'Customer' && (
                            <Link to="/Cart" className="nav-link" id="cart-link">My Cart</Link>
                        )}
                        <Link to="/Logout" className="nav-link" id="logout-link" onClick={handleLogout}>Logout</Link>
                        <Link to="/MyProfile" className="nav-link" id="profile-link">
                            <CgProfile />
                        </Link>
                        <Link to="/Products" className="nav-link" id="continue-shopping">
                            <CiShop />
                        </Link>
                        <Link to="#" className="nav-link" id="notifications" onClick={getNotifications}>
                        <IoIosNotifications /> <span>{notifications.length}</span>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link to="/Login" className="nav-link" id="login-link">Login</Link>
                        <Link to="/Register" className="nav-link" id="register-link">Register</Link>             
                    </>
                    
                )}
                {/* <Link to="/Products" className="nav-link" id="continue-shopping">
                    <CiShop />
                </Link> */}
                {/* <div className="nav-link" id="notifications" onClick={getNotifications}>
                    <IoIosNotifications />
                </div> */}
                {/* Render notifications */}
                {notifications.length > 0 && showNotifications && (
                    <div className="notifications-container show">
                        <h3>Notifications</h3>
                            <ul>
                                {notifications.map((notification, index) => (
                                    <li key={index}>
                                        <input
                                            type="checkbox"
                                            id={`notification-${notification.check}`}
                                            onChange={() => markAsRead(notification)} 
                                        />
                                        <label htmlFor={`notification-${notification.check}`} className = "checkbox-label">
                                            {notification.message}</label>
                                    </li>
                                ))}
                    </ul>
                </div>
                )}

                {notifications.length === 0 && showNotifications && (
                    <div className="notifications-container show">
                        <h3>Notifications</h3>
                        <ul>
                            <li>No Notifications at this time.</li>
                        </ul>
                    </div>
                )}

            </div>
        </div>
    );
    
}

// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import achillesLogo from '../images/companyLogo.png';
// import { CgProfile } from "react-icons/cg";
// import { CiShop } from "react-icons/ci";
// import { IoIosNotifications } from "react-icons/io";
// import './Navbar.css';

// export default function Navbar() {
//     const navigate = useNavigate();
//     const [isLoggedIn, setLoggedIn] = useState(false);
//     const [userType, setType] = useState("");
//     const [notifications, setNotifications] = useState([]);
//     const [showNotifications, setShowNotifications] = useState(false);

//     useEffect(() => {
//         if (localStorage.getItem('userEmail')) {
//             setLoggedIn(true)
//         } 
//         else {
//             setLoggedIn(false)
//         }
//         if(localStorage.getItem('userType') !== undefined)
//             setType(localStorage.getItem('userType'));
//     }, []);

//     const handleLogin = () => {
//         navigate('/Login');
//     };
//     const coninueShopping = () =>{
//         navigate('/Products')
//     };
//     const getNotifications = () =>{
//         const userEmail = localStorage.getItem('userEmail');
//         if (showNotifications) {
//             // Clear notifications if already shown
//             setNotifications([]);
//             setShowNotifications(false);
//         } else {
//             // Fetch notifications
//             fetch(`https://cosc-3380-6au9.vercel.app/api/handlers/users/getNotifications?email=${userEmail}`)
//                 .then(response => response.json())
//                 .then(data => {
//                     setNotifications(data);
//                     setShowNotifications(true);
//                 })
//                 .catch(error => {
//                     console.error('Network response was not ok', error);
//                 });
//         }
//     }

//     const handleLogout = () => {
//         const userEmail = localStorage.getItem('userEmail');

//         fetch('https://cosc-3380-6au9.vercel.app/api/handlers/users/logoutUser', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ email: userEmail })
//         }).then(response => {
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 console.log('Logout successful:', data);
//                 localStorage.removeItem('userEmail');
//                 localStorage.removeItem('userType');
//                 setLoggedIn(false); 
//                 navigate('/Login');
//             })
//             .catch(error => {
//                 console.error('Error logging out:', error);
//             });
//     };

//     return (
//         <div className="nav-container">
//             <div className="left-side">
//                 <div id="logo-space">
//                     <Link to="/Home">
//                         <button id="logo-button">
//                             <img src={achillesLogo} alt="Achilles Logo" />
//                         </button>
//                     </Link>
//                 </div>
//             </div>
//             <div className="right-side">
//                 {isLoggedIn ? (
//                     <>
//                         {(userType === 'Manager' || userType === 'Administrator') && (
//                             <button className="nav-button" id="admin-button" onClick={() => navigate('/Admin')}>Manager Portal</button>
//                         )}
//                         {userType === 'Employee' && (
//                             <button className="nav-button" id="emplo-button" >Employee Button</button>
//                         )}
//                         {userType === 'Customer' && (
//                             <button className="nav-button" id="cart-button" onClick={() => navigate('/Cart')}>My Cart</button>
//                         )}
//                         <button className="nav-button" id="logout-button" onClick={handleLogout}>Logout</button>
//                         <div className="nav-button" id="profile-button" onClick={() => navigate('/MyProfile')}>
//                                 <CgProfile />
//                         </div>
//                     </>
//                 ) : (
//                     <>
//                         <button className="nav-button" id="login-button" onClick={handleLogin}>Login</button>
//                         <button className="nav-button" id="register-button" onClick={() => navigate('/Register')}>Register</button>
//                     </>
//                 )}
//             <div className="nav-button" id="continue-shopping" onClick={() => navigate('/Products')}>
//                 <CiShop />
//             </div>
//             <div className="nav-button" id="notifications" onClick={getNotifications}>
//                 <IoIosNotifications />
//             </div>
//             {/* Render notifications */}
//             {notifications.length > 0 && (
//                 <div className="notifications-container">
//                     <h3>Notifications</h3>
//                     <ul>
//                         {notifications.map((notification, index) => (
//                             <li key={index}>{notification.message}</li>
//                         ))}
//                     </ul>
//                 </div>
//             )}
//         </div>
//         </div>

//     );
// }