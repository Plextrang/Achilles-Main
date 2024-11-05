const { getRequestBody } = require("../../lib/parseBody")
const http = require('http');
const mysql = require('mysql');
const cors = require('cors');
const querystring = require('querystring');

module.exports = async (req, res) => {
    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }
    const db = mysql.createConnection({
      host: "cosc3380-team7.mysql.database.azure.com",
      user: "achilles_admin",
      password: "iFTq^U^!efry3L",
      database: "cosc3380"
    })
    db.connect(err => {
      if (err) {
        console.error('Error connecting to database:', err);
        return;
      }
      console.log('Connected to database');
    });
    // query string to select specific columns from the SHOE_PRODUCT table
    const sql = 'SELECT price_of_cart FROM TRANSACTIONS';
  
    // executes the SQL query using the 'db' connection
    // sql -> sql that specifies the operation you want to perform on the database
    // err -> any errors that the database driver gets will be passed to 'err'
    // results -> results of the query will be held in results
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching products:', err);
        // Logs error to the console (500)
        res.writeHead(404, { 'Content-Type' : 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
      } else {
        console.log('Fetched products: ', results);
        res.writeHead(200, { 'Content-Type' : 'application/json' });
        //console.log("../images/${results.image_filename}.jpg")
        // 200 means data is successfully being sent back
        // json(results) serializes the retrieved data (results) into JSON format before sending it back to the client
        res.end(JSON.stringify(results));
      }
    });
  }