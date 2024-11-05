// const http = require('http');
// const mysql = require('mysql');
// const cors = require('cors');
// const querystring = require('querystring');

// function getSales(req, res, db) {
//     // query string to select specific columns from the SHOE_PRODUCT table
//     const sql = 'SELECT price_of_cart FROM TRANSACTIONS';
  
//     // executes the SQL query using the 'db' connection
//     // sql -> sql that specifies the operation you want to perform on the database
//     // err -> any errors that the database driver gets will be passed to 'err'
//     // results -> results of the query will be held in results
//     db.query(sql, (err, results) => {
//       if (err) {
//         console.error('Error fetching products:', err);
//         // Logs error to the console (500)
//         res.end(JSON.stringify({ error: 'Internal Server Error' }));
//       } else {
//         console.log('Fetched products: ', results);
//         //console.log("../images/${results.image_filename}.jpg")
//         // 200 means data is successfully being sent back
//         // json(results) serializes the retrieved data (results) into JSON format before sending it back to the client
//         res.end(JSON.stringify(results));
//       }
//     });
//   }

// module.exports = {
//     getSales,
// }