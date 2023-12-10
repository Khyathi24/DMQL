const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3001;

// Configure the PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Bank',
  password: '123',
  port: 5432,
});

// Use CORS and JSON middleware
app.use(cors());
app.use(express.json());


// Endpoint to fetch paginated data
app.get('/test-db', async (req, res) => {
    try {
      const queryText = `SELECT * FROM "Orders"`;
      const result = await pool.query(queryText);
  
      res.json({
        data: result.rows,
        total: result.rowCount,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        details: error.message,
        stack: error.stack,
      });
    }
  });

  // Endpoint to insert new data
app.post('/insertOrder', async (req, res) => {
    const { OrderID, CustomerID, TotalAmount, OrderDate, Status } = req.body;
  
    try {
      const queryText = `
      INSERT INTO "Orders" ("OrderID", "CustomerID", "TotalAmount", "OrderDate", "Status")
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
      
      `;
  
      const result = await pool.query(queryText, [OrderID, CustomerID, TotalAmount, OrderDate, Status]);
  
      res.status(201).json({
        success: true,
        data: result.rows[0],
      });
    } catch (error) {
      console.error('Error inserting data:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        details: error.message,
        stack: error.stack,
      });
    }
  });
  
  app.delete('/deleteOrder/:orderId', async (req, res) => {
    const orderId = req.params.orderId;
  
    try {
      const queryText = `
        DELETE FROM "Orders"
        WHERE "OrderID" = $1
        RETURNING *
      `;
  
      const result = await pool.query(queryText, [orderId]);
  
      res.json({
        success: true,
        data: result.rows[0],
      });
    } catch (error) {
      console.error('Error deleting data:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        details: error.message,
        stack: error.stack,
      });
    }
  });

  app.put('/updateOrder/:orderId', async (req, res) => {
    const orderId = req.params.orderId;
    const { CustomerID, TotalAmount, Status } = req.body;
  
    try {
      const queryText = `
        UPDATE "Orders"
        SET "CustomerID" = $1, "TotalAmount" = $2, "Status" = $3
        WHERE "OrderID" = $4
        RETURNING *
      `;
  
      const result = await pool.query(queryText, [CustomerID, TotalAmount, Status, orderId]);
  
      res.status(200).json({
        success: true,
        data: result.rows[0],
      });
    } catch (error) {
      console.error('Error updating data:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        details: error.message,
        stack: error.stack,
      });
    }
  });
  
// Products APIs

  app.get('/products', async (req, res) => {
    try {
      const queryText = `SELECT * FROM "Products"`;
      const result = await pool.query(queryText);
  
      res.json({
        data: result.rows,
        total: result.rowCount,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        details: error.message,
        stack: error.stack,
      });
    }
  });

  // Endpoint to insert new data
app.post('/insertProduct', async (req, res) => {
    const { ID, ProductID, SupplierID, ProductName, ProductPrice, StockLevel } = req.body;
  
    try {
      const queryText = `
      INSERT INTO "Products" ("ID", "ProductID", "SupplierID", "ProductName", "ProductPrice", "StockLevel" )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
      
      `;
  
      const result = await pool.query(queryText, [ID, ProductID, SupplierID, ProductName, ProductPrice, StockLevel ]);
  
      res.status(201).json({
        success: true,
        data: result.rows[0],
      });
    } catch (error) {
      console.error('Error inserting data:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        details: error.message,
        stack: error.stack,
      });
    }
  });
  
  app.delete('/deleteProduct/:ID', async (req, res) => {
    const Id = req.params.ID;
  
    try {
      const queryText = `
        DELETE FROM "Products"
        WHERE "ID" = $1
        RETURNING *
      `;
  
      const result = await pool.query(queryText, [Id]);
  
      res.json({
        success: true,
        data: result.rows[0],
      });
    } catch (error) {
      console.error('Error deleting data:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        details: error.message,
        stack: error.stack,
      });
    }
  });

  app.put('/updateProduct/:ID', async (req, res) => {
    const Id = req.params.ID;
    const { ID, ProductID, SupplierID, ProductName, ProductPrice, StockLevel } = req.body;
  
    try {
      const queryText = `
        UPDATE "Products"
        SET "ID" = $1, "ProductID" = $2, "SupplierID" = $3, "ProductName" = $4, "ProductPrice" = $5, "StockLevel" = $6
        WHERE "ID" = $1
        RETURNING *
      `;
  
      const result = await pool.query(queryText, [ ID, ProductID, SupplierID, ProductName, ProductPrice, StockLevel]);
  
      res.status(200).json({
        success: true,
        data: result.rows[0],
      });
    } catch (error) {
      console.error('Error updating data:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        details: error.message,
        stack: error.stack,
      });
    }
  });

  // Customer APIs

  app.get('/customers', async (req, res) => {
    try {
      const queryText = `SELECT * FROM "Customers"`;
      const result = await pool.query(queryText);
  
      res.json({
        data: result.rows,
        total: result.rowCount,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        details: error.message,
        stack: error.stack,
      });
    }
  });

  // Endpoint to insert new data
app.post('/insertCustomer', async (req, res) => {
    const { CustomerID, FirstName, LastName, EmailId, Location, Phone,Sex, DateOfBirth, SignUpDate, LoyalPoints } = req.body;
  
    try {
      const queryText = `
      INSERT INTO "Customers" ("CustomerID", "FirstName", "LastName", "EmailId", "Location", "Phone", "Sex","DateOfBirth","SignUpDate","LoyalPoints" )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
      
      `;
     
  
      const result = await pool.query(queryText, [CustomerID, FirstName, LastName, EmailId, Location, Phone,Sex, DateOfBirth, SignUpDate, LoyalPoints  ]);
  
      res.status(201).json({
        success: true,
        data: result.rows[0],
      });
    } catch (error) {
      console.error('Error inserting data:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        details: error.message,
        stack: error.stack,
      });
    }
  });

  app.delete('/deleteCustomer/:ID', async (req, res) => {
    const Id = req.params.ID;
  
    try {
      const queryText = `
        DELETE FROM "Customers"
        WHERE "CustomerID" = $1
        RETURNING *
      `;
  
      const result = await pool.query(queryText, [Id]);
  
      res.json({
        success: true,
        data: result.rows[0],
      });
    } catch (error) {
      console.error('Error deleting data:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        details: error.message,
        stack: error.stack,
      });
    }
  });
  app.put('/updateCustomer/:ID', async (req, res) => {
    const Id = req.params.ID;
    const { CustomerID, FirstName, LastName, EmailId, Location, Phone,Sex, LoyalPoints } = req.body;
  
    try {
      const queryText = `
        UPDATE "Customers"
        SET "CustomerID" = $1, "FirstName" = $2, "LastName" = $3, "EmailId" = $4, "Location" = $5, "Phone" = $6, "Sex" = $7, "LoyalPoints"=$8
        WHERE "CustomerID" = $1
        RETURNING *
      `;
  
      const result = await pool.query(queryText, [ CustomerID, FirstName, LastName, EmailId, Location, Phone,Sex, LoyalPoints]);
  
      res.status(200).json({
        success: true,
        data: result.rows[0],
      });
    } catch (error) {
      console.error('Error updating data:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        details: error.message,
        stack: error.stack,
      });
    }
  });
// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
