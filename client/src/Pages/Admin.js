import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Admin.css';
import white_converse from '../images/white_converse.jpg';
import { FaShoePrints, FaShoppingBasket, FaStar } from 'react-icons/fa';
import { FaShoppingBag } from 'react-icons/fa';
import { MdOutlineProductionQuantityLimits } from "react-icons/md";

export default function Admin() {
  const [product, setProducts] = useState([]);
  const [images, setImages] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('Inventory'); // Default to display all products
  const [employees, setEmployees] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const userType = localStorage.getItem('userType');
  const navigate = useNavigate();

  const openProduct = (product) => {
    let stringProduct = JSON.stringify(product)
    localStorage.setItem('ProductInfo', stringProduct);
    console.log(localStorage.getItem('ProductInfo'));
    navigate('/GetProduct');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await fetch('https://cosc-3380-6au9.vercel.app/api/handlers/products/getProducts');
        if (!productsResponse.ok) {
          throw new Error('Network response was not ok');
        }
        const productsData = await productsResponse.json();
        setProducts(productsData);
  
        const imagesToLoad = {};
        await Promise.all(productsData.map(async (product) => {
          const image = await import(`../images/${product.image_filename}.jpg`);
          imagesToLoad[product.image_filename] = image.default;
        }));
        setImages(imagesToLoad);
  
        const employeesResponse = await fetch('https://cosc-3380-6au9.vercel.app/api/handlers/history/getEmployees');
        if (!employeesResponse.ok) {
          throw new Error('Network response was not ok');
        }
        const employeesData = await employeesResponse.json();
        setEmployees(employeesData);
  
        const suppliersResponse = await fetch('https://cosc-3380-6au9.vercel.app/api/handlers/history/getSupplier');
        if (!suppliersResponse.ok) {
          throw new Error('Network response was not ok');
        }
        const suppliersData = await suppliersResponse.json();
        setSuppliers(suppliersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);

  const handleDeleteEmployee = async () => { 
    console.log(selectedEmployee); // use selectedEmployee to get employee to fire info. it contains email & e_ssn alongside other attributes.
    try {
      const response = await fetch('https://cosc-3380-6au9.vercel.app/api/handlers/users/inactiveUser', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: selectedEmployee.email,
        })
      })
      if (!response.ok) {
        throw new Error('Failed to update user information');
      }
      let data = await response.json();
				console.log(data);
    } 
    catch (error) {
        console.error('Error firing employee:', error);
    }
  };

  const handleDeleteSupplier = async () => { 
    console.log(selectedSupplier);
    try {
      // similar to deleteEmployee, theres a var 'selectedSupplier' with supplier_id and email that you can send to the backend.
      const response = await fetch('https://cosc-3380-6au9.vercel.app/api/handlers/users/inactiveSupplier', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          supplier_id: selectedSupplier.supplier_id
        })
      })
      if (!response.ok) {
        throw new Error('Failed to update supplier information');
      }
      let data = await response.json();
				console.log(data);
    } 
    catch (error) {
        console.error('Error removing supplier:', error);
    }
  };

  const renderProducts = () => (
    <div className="card-container">
      {product.length === 0 ? (
        <div className="empty-products-message">
          {/* Display a dummy page if products array is empty */}
          {/* Dummy product cards */}
        </div>
      ) : (
        product.map(product => (
          <div key={product.product_id} className="card" onClick={() => openProduct(product)}>
            <img className="card-img" src={images[product.image_filename]} alt={product.item_name} />
            <div className="card-details">
              <h3 className="card-title">{product.item_name}</h3>
              <section className="card-reviews">
                      <FaStar />
                      <span className="total-reviews">
                          {product.stars == null ? (
                              "No Reviews"
                          ) : (
                              `${product.stars} Stars`
                          )}
                      </span>
                  </section>
              <div className="bag">
                <FaShoppingBag />
                <div className="price">${product.price}</div>
                <div className='edit-container'>
                  <button className='edit'>Manage</button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const renderEmployees = () => (
    <div className="employee-container">
      {employees.map(employee => (
        <div key={employee.email} className="employee-row">
          <div className="employee-info">
            <div className="line-admin">
              <p><strong>Name:</strong> {employee.full_name}</p>
              <p><strong>Email:</strong> {employee.email}</p>
              <p><strong>Role:</strong> {employee.user_type}</p>
            </div>
            <div className="line-admin">
              <p><strong>Phone:</strong> {String(employee.phone_number).replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}</p>
              <p><strong>Date of Birth:</strong> {new Date(employee.date_of_birth).toLocaleDateString()}</p>
              <p><strong>Address:</strong> {employee.full_address}</p>
            </div>
            <div className="line-admin">
              <p><strong>Salary:</strong> {employee.salary.toLocaleString()}</p>
              {userType === 'Administrator' ? (
                <p><strong>SSN:</strong> {employee.e_ssn ? String(employee.e_ssn).replace(/(\d{3})(\d{2})(\d{3})/, '$1-$2-$3') : 'No SSN found'}</p>
              ) : (
                <p><strong>SSN:</strong> {employee.e_ssn ? 'XXX-XX-' + employee.e_ssn.slice(-4) : 'No SSN found'}</p>
              )}
            </div>
          </div>
          <div className="employee-actions">
            {((employee.user_type === 'Employee' || (employee.user_type === 'Manager' && userType === 'Administrator')) ? (
              <button
                className="manage-employee-button"
                onClick={() => {
                  setSelectedEmployee(employee);
                  setShowPopup(true);
                }}
              >
                Fire
              </button>
            ) : (
              <p className="manage-employee-button">Must be admin to fire</p>
            ))}
            {showPopup && selectedEmployee && (
              <div className="pop-up-admin">
                <p>Do you want to fire {selectedEmployee.full_name}?</p>
                <button className="go-back-admin" onClick={() => setShowPopup(false)}>
                  Go Back
                </button>
                <button className="confirm-delete-admin" onClick={() => handleDeleteEmployee(employee)}>
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
  
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const renderSuppliers = () => (
    <div className="supplier-container">
      {suppliers.map(supplier => (
        <div key={supplier.supplier_id} className="supplier-row">
          <div className="supplier-info">
            <div className="line-admin">
              <p><strong>Company Name:</strong> {supplier.company_name}</p>
              <p><strong>Email:</strong> {supplier.company_email}</p>
            </div>
            <div className="line-admin">
              <p><strong>Phone:</strong> {String(supplier.phone_num).replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}</p>
              <p><strong>Address:</strong> {supplier.full_address}</p>
            </div>
          </div>
          <div className="supplier-actions">
            <button className="manage-supplier-button" onClick={() => { setSelectedSupplier(supplier); setShowPopup(true);}}>
              Remove
            </button>
            {showPopup && selectedSupplier && (
              <div className="pop-up-admin">
                <p>Do you want to remove {selectedSupplier.company_name}?</p>
                <button className="go-back-admin" onClick={() => setShowPopup(false)}>
                  Go Back
                </button>
                <button className="confirm-delete-admin" onClick={() => handleDeleteSupplier(supplier)}>
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="admin-container">
      <header className="title">
        <h1 className="shop-now-container">Manager Portal</h1>
        <div className="add-new">
          <Link to="/EntryForm">
            <button>Add Shoe</button>
          </Link>
        </div>
        <div className="add-new">
          <Link to="/AddEmployee">
            <button>Add Employee</button>
          </Link>
        </div>
        <div className="add-new">
          <Link to="/AddSupplier">
            <button>Add Supplier</button>
          </Link>
        </div>
        <div className="add-new">
          <Link to="/SalesReport">
            <button>Sales Report</button>
          </Link>
        </div>
        {/* <div className="search-bar">
          <input type="text" placeholder="Search..." />
          <button>Search</button>
        </div> */}
        <nav className="filters">
          <a href="#" className={selectedCategory === 'Inventory' ? 'active' : ''} onClick={() => setSelectedCategory('Inventory')}>
            Inventory
          </a>
          <a href="#" className={selectedCategory === 'Employees' ? 'active' : ''} onClick={() => setSelectedCategory('Employees')}>
            Employees
          </a>
          <a href="#" className={selectedCategory === 'Suppliers' ? 'active' : ''} onClick={() => setSelectedCategory('Suppliers')}>
            Suppliers
          </a>
        </nav>
      </header>

      {selectedCategory === 'Inventory' && renderProducts()}
      {selectedCategory === 'Employees' && renderEmployees()}
      {selectedCategory === 'Suppliers' && renderSuppliers()}
    </div>
  );
}


        /* <div className="card">
          <img src={white_converse} alt="White Converse" />
          <div className="card-details">
            <h3 className="card-title">Kid's Converse</h3>
            <section className="card-reviews">
              <FaStar />
              <span className="total-reviews">4 Reviews</span>
            </section>
            <div className="bag">
              <FaShoppingBag /> 
              <div className="price">$80</div>
            </div>
            <div className="stock">
              <MdOutlineProductionQuantityLimits />
              <div className="quantity">Stock: 85</div>
            </div>
            <div className = "edit-container">
          <button className = "edit"> Manage </button>
          </div>
          </div>
        </div>


        <div className="card">
          <img src={white_converse} alt="White Converse" />
          <div className="card-details">
            <h3 className="card-title">100% Real Converse</h3>
            <section className="card-reviews">
              <FaStar />
              <span className="total-reviews">4 Reviews</span>
            </section>
            <div className="bag">
              <FaShoppingBag /> 
              <div className="price">$80</div>
            </div>
            <div className = "stock">
            <MdOutlineProductionQuantityLimits />
            <div className = "quantity"> Stock: 15</div>
            </div>
            <div className = "edit-container">
          <button className = "edit"> Manage </button>
          </div>
          </div>
        </div>

        <div className="card">
          <img src={white_converse} alt="White Converse" />
          <div className="card-details">
            <h3 className="card-title">Not Fake Converse</h3>
            <section className="card-reviews">
              <FaStar />
              <span className="total-reviews">4 Reviews</span>
            </section>
            <div className="bag">
              <FaShoppingBag /> 
              <div className="price">$80</div>
            </div>
            <div className = "stock">
            <MdOutlineProductionQuantityLimits />
            <div className = "quantity"> Stock: 35</div>
            </div>
            <div className = "edit-container">
          <button className = "edit"> Manage </button>
          </div>
          </div>
        </div>

        <div className="card">
          <img src={white_converse} alt="White Converse" />
          <div className="card-details">
            <h3 className="card-title">It's Surprisingly Converse</h3>
            <section className="card-reviews">
              <FaStar />
              <span className="total-reviews">4 Reviews</span>
            </section>
            <div className="bag">
              <FaShoppingBag /> 
              <div className="price">$80</div>
            </div>
            <div className = "stock">
            <MdOutlineProductionQuantityLimits />
            <div className = "quantity"> Stock: 55</div>
            </div>
            <div className = "edit-container">
          <button className = "edit"> Manage </button>
          </div>
          </div>
</div> */