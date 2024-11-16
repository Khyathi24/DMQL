import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Orders from './Orders'; // Import your Orders component
import Products from './Products'; // Import your Products component
import './App.css'; // Import the CSS file
import Customers from './Customers';



const App = () => {
  return (
    <Router>
      <nav className="navbar">
        <ul>
          <li>
            <Link to="/orders">Orders</Link>
          </li>
          <li>
            <Link to="/customers">Customers</Link>
          </li>
          <li>
            <Link to="/products">Products</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/orders" element={<Orders />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/products" element={<Products />} />
      </Routes>
    </Router>
  );
};

export default App;
