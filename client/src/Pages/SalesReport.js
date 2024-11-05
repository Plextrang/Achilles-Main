import React, { useState, useEffect } from 'react';
import './SalesReport.css';
export default function SalesReport(){
    const [salesData, setSalesData] = useState([]);
    const [custData, setCustData] = useState([]);
    const [dailyData, setDailyData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [active, setActive] = useState(true);
    const [notActive, setNotActive] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('Daily');

    useEffect(() => {

      async function fetchDailyData() {
        try {
          const dailyResponse = await fetch('https://cosc-3380-6au9.vercel.app/api/handlers/history/getDailyReport/');
          if (!dailyResponse.ok) {
              throw new Error('Failed to fetch customer data');
          }
          const dailyData = await dailyResponse.json();
          setDailyData(dailyData);
        } catch (error) {
          console.error('Error fetching customer data:', error);
        }
      }

      fetchSalesData('unitsSold');
      fetchCustomerData();
      fetchDailyData();
      fetchFilteredData();
    }, []);

    async function fetchCustomerData() {
      try {
        let url = 'https://cosc-3380-6au9.vercel.app/api/handlers/history/';
        if (active && notActive) {
            url += 'getCustomerReport/';
        } else if (active) {
            url += 'getActiveCustomerReport/';
        } else {
            url += 'getInactiveCustomerReport/';
        }
        const custResponse = await fetch(url);
        if (!custResponse.ok) {
            throw new Error('Failed to fetch customer data');
        }
        const custData = await custResponse.json();
        setCustData(custData);
      } catch (error) {
        console.error('Error fetching customer data:', error);
      }
    }

    async function fetchFilteredData() {
      const defaultStartDate = new Date('2024-04-16');
      const start = startDate ? new Date(startDate) : defaultStartDate;
      const end = endDate ? new Date(endDate) : new Date();
      const startParam = start.toISOString();
      const endParam = end.toISOString();
      try {
        const filteredResponse = await fetch(`https://cosc-3380-6au9.vercel.app/api/handlers/history/getFilteredReport/?start=${startParam}&end=${endParam}`);
        if (!filteredResponse.ok) {
            throw new Error('Failed to fetch customer data');
        }
        const filteredData = await filteredResponse.json();
        setFilteredData(filteredData);
      } catch (error) {
        console.error('Error fetching customer data:', error);
      }
    }

    async function fetchSalesData(method) {
      try {
        const salesResponse = await fetch(`https://cosc-3380-6au9.vercel.app/api/handlers/history/getShoeReport/?method=${method}`);
        if (!salesResponse.ok) {
            throw new Error('Failed to fetch sales data');
        }
        const salesData = await salesResponse.json();
        setSalesData(salesData);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    }

    function formatDate(dateTime) {
      let date = new Date(dateTime);
      const options = {
        timeZone: 'UTC', 
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      };
      return date.toLocaleDateString('en-US', options);
    }

    const handleEndDateChange = (e) => {
      const selectedEndDate = new Date(e.target.value);
      if (selectedEndDate < new Date(startDate)) {
        setEndDate(startDate);
      } else {
        setEndDate(e.target.value);
      }
    };
  
    function formatTime(dateTime) {
      let date = new Date(dateTime);
      const options = {
        timeZone: 'America/Chicago',
        hour12: true,
        hour: 'numeric',
        minute: '2-digit'
      };
      return new Intl.DateTimeFormat('en-US', options).format(date);
    }

    function formatPhoneNumber(phoneNumber) {
      const formattedNumber = phoneNumber.toString().replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
      return formattedNumber;
    }
  
    return (
      <div className="sales-report-container">
        <div className="report-header-container">
          <h1 className="report-heading">Sales Report</h1>
          <nav className="filters">
          <a href="#" className={selectedCategory === 'Daily' ? 'active' : ''} onClick={() => setSelectedCategory('Daily')}>Transactions</a>
          <a href="#" className={selectedCategory === 'Customer' ? 'active' : ''} onClick={() => setSelectedCategory('Customer')}>Customer Report</a>
          <a href="#" className={selectedCategory === 'All' ? 'active' : ''} onClick={() => setSelectedCategory('All')}>Total Shoe Sales</a>
          </nav>
        </div>

        {selectedCategory === 'Daily' && (
          <div>
            <div className="data-table">
              <h2>Daily Transactions</h2>
              <table>
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Time</th>
                    <th># of Items</th>
                    <th>Total Cost</th>
                    <th>User ID</th>
                    <th>Customer Name</th>
                    <th>Phone Number</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyData.map(daily => (
                    <tr key={daily.transaction_id}>
                      <td>{daily.transaction_id}</td>
                      <td>{formatTime(daily.date_time)}</td>
                      <td>{daily.num_of_items}</td>
                      <td>${daily.total_cost}</td>
                      <td>{daily.user_id}</td>
                      <td>{daily.full_name}</td>
                      <td>{formatPhoneNumber(daily.phone_number)}</td>
                    </tr>
                  ))}
              </tbody>
              </table>
            </div>

            <div className="data-table">
            <h2>Filtered Transactions</h2>
            <div className="filtered-button-row">
              <div className='filtered-button-section'>
                <label>Start Date:</label>
                <input type="date" value={startDate} max={new Date().toISOString().split('T')[0]} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className='filtered-button-section'>
                <label>End Date:</label>
                <input type="date" value={endDate} min={startDate} max={new Date().toISOString().split('T')[0]} onChange={(e) => handleEndDateChange(e)} disabled={!startDate} />
              </div>
              <div className='filtered-button-section'>
                <button onClick={() => fetchFilteredData()}>Adjust Time Period</button>
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Date of Purchase</th>
                  <th>Time</th>
                  <th># of Items</th>
                  <th>Total Cost</th>
                  <th>User ID</th>
                  <th>Customer Name</th>
                  <th>Phone Number</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map(filtered => (
                  <tr key={filtered.transaction_id}>
                    <td>{filtered.transaction_id}</td>
                    <td>{formatDate(filtered.date_time)}</td>
                    <td>{formatTime(filtered.date_time)}</td>
                    <td>{filtered.num_of_items}</td>
                    <td>${filtered.total_cost}</td>
                    <td>{filtered.user_id}</td>
                    <td>{filtered.full_name}</td>
                    <td>{formatPhoneNumber(filtered.phone_number)}</td>
                  </tr>
                ))}
            </tbody>
            </table>
            </div>
          </div>
        )}

        {selectedCategory === 'Customer' && (
        <div className="data-table">
          <h2>Customer Details</h2>
          <div className="filtered-button-row">
            <label>
                <input
                    type="checkbox"
                    checked={active}
                    onChange={() => setActive(!active)}
                />
                Active
            </label>
            <label>
                <input
                    type="checkbox"
                    checked={notActive}
                    onChange={() => setNotActive(!notActive)}
                />
                Not Active
            </label>
            <div className='filtered-button-section'>
              <button onClick={() => fetchCustomerData()} disabled={!active && !notActive}>Update</button>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Customer Name</th>
                <th># of Transactions</th>
                <th>Units Bought</th>
                <th>Total Expenditure</th>
                <th>Still Active</th>
              </tr>
            </thead>
            <tbody>
              {custData.map(customer => (
                <tr key={customer.user_id}>
                  <td>{customer.user_id}</td>
                  <td>{customer.full_name}</td>
                  <td>{customer.total_transactions ? customer.total_transactions : 0}</td>
                  <td>{customer.units_bought ? customer.units_bought : 0}</td>
                  <td>${customer.total_cost_of_purchases ? customer.total_cost_of_purchases.toFixed(2) : 'N/A'}</td>
                  <td>{customer.inactive === 0 ? "Yes" : "No"}</td>
                </tr>
              ))}
          </tbody>
          </table>
        </div>
        )}

        {selectedCategory === 'All' && (
          <div className="data-table">
            <h2>Sales Data</h2>
            <div className="sales-button-row">
              <button type="button" onClick={() => {
                fetchSalesData('unitsSold');
              }}>
                Sort by Units
              </button>
              <button type="button" onClick={() => {
                fetchSalesData('totalSales');
              }}>
                Sort by Total Sales
              </button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Shoe Name</th>
                  <th>Shoe ID</th>
                  <th>Units Sold</th>
                  <th>Total Sales</th>
                  <th>Stock Remaining</th>
                  {/* <th>Amount</th> */}
                </tr>
              </thead>
              <tbody>
                {salesData.map(report => (
                  <tr key={report.product_id}>
                    <td>{report.item_name}</td>
                    <td>{report.product_id}</td>
                    <td>{report.units_sold}</td>
                    <td>${report.total_sales.toFixed(2)}</td>
                    <td>{report.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    );
    //todo: create a export to pdf button 
}