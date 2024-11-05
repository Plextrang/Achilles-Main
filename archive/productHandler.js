// const http = require('http');
// const mysql = require('mysql');
// const cors = require('cors');
// const querystring = require('querystring');

// function newProduct(req, db, res) {
//     let body = "";

//     req.on('data', chunk => {
//         body += chunk.toString(); 
//     });

//     req.on('end', async () => {
//         console.log('Received product data:', body);
//         const productData = JSON.parse(body);
//         console.log('Parsed product data:', productData);
//         const { item_name, description, price, color_option, size, stock, category_name, image_filename } = productData;

//         // Generate a random product ID
//         const generateRandomProductId = () => {
//             return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000; // four digits for now
//         };

//         // check if a product ID already exists 
//         const isProductIdExists = async (db, productId) => {
//             return new Promise((resolve, reject) => {
//                 const sql = "SELECT COUNT(*) AS count FROM SHOE_PRODUCT WHERE product_id = ?";
//                 db.query(sql, [productId], (err, result) => {
//                     if (err) {
//                         reject(err);
//                         return;
//                     }
//                     resolve(result[0].count > 0);
//                 });
//             });
//         };

//         // Generate a unique product_id
//         let productId = generateRandomProductId();
//         while (await isProductIdExists(db, productId)) {
//             productId = generateRandomProductId();
//         }

//         const getRandomInventoryId = async () => {
//             return new Promise((resolve, reject) => {
//                 const sql = "SELECT inventory_id FROM INVENTORY ORDER BY RAND() LIMIT 1";
//                 db.query(sql, (err, result) => {
//                     if (err) {
//                         reject(err);
//                         return;
//                     }
//                     resolve(result[0].inventory_id);
//                 });
//             });
//         };

//         // Insert the new product with the generated product_id and a random inventory_id
//         const inventoryId = await getRandomInventoryId();
//         const insertProductSql = `INSERT INTO SHOE_PRODUCT (product_id, item_name, description, price, color_option, size, stock, inventory_id, category_name, image_filename) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
//         db.query(insertProductSql, [productId, item_name, description, price, color_option, size, stock, inventoryId, category_name, image_filename], (err, result) => {
//             if (err) {
//                 console.error(err);
//                 res.statusCode = 500;
//                 res.end(JSON.stringify({ error: 'Internal Server Error' }));
//                 return;
//             }

//             res.statusCode = 200;
//             res.end(JSON.stringify({ message: 'Product added successfully' }));
//         });
//     });
// }

// // Function to handle GET request for fetching product data
// // req = request
// // res = response
// function getProducts(req, res, db) {
//     // query string to select specific columns from the SHOE_PRODUCT table
//     const sql = 'SELECT product_id, item_name, price, description, color_option, size, image_filename FROM SHOE_PRODUCT';
  
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

// module.exports = {getProducts, newProduct,}