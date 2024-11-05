import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Navbar from "./components/Navbar";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import DataEntry from "./Pages/DataEntry";
import Products from "./Pages/Products";
import Profile from "./Pages/Profile";
import Cart from "./Pages/Cart";
import Admin from "./Pages/Admin";
import AddShoe from "./Pages/AddShoe";
import AddEmployee from "./Pages/AddEmployee";
import AddSupplier from "./Pages/AddSupplier";
import SalesReport from "./Pages/SalesReport";
import CheckOut from "./Pages/CheckOut";
import ProductInfo from "./Pages/ProductInfo";
import MyProfile from "./Pages/MyProfile";
import Modal from "react-modal"; // Import the Modal component

import "./App.css";

// Set the app element for React Modal
Modal.setAppElement("#root");

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/MyProfile" element={<MyProfile />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/EntryForm" element={<DataEntry />} />
        <Route path="/Products" element={<Products />} />
        <Route path="/GetProduct" element={<ProductInfo />} />
        <Route path="/ProfileForm" element={<Profile />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/AddShoe" element={<AddShoe />} />
        <Route path="/AddEmployee" element={<AddEmployee />} />
        <Route path="/AddSupplier" element={<AddSupplier />} />
        <Route path="/SalesReport" element={<SalesReport />} />
        <Route path="/Checkout" element={<CheckOut />} />
      </Routes>
    </div>
  );
}

export default App;
