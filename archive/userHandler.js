// const http = require('http');
// const mysql = require('mysql');
// const cors = require('cors');
// const querystring = require('querystring');

// // function newUser(req, db, res){
// //     body = ""
// //     req.on('data', chunk => {
// //         body += chunk.toString(); // convert Buffer to string
// //     });
    
// //     req.on('end', () => {
// //         console.log('Received data:', body);
// //         const userData = JSON.parse(body);
// //         console.log('Parsed user data:', userData);
// //         const { email, password, first_name, middle_initial, last_name, phone_number, date_of_birth, address, apt_num, city, state, zip_code } = userData;
// //         const type = 'Customer'

// //         const insertCredentialsSql = `INSERT INTO LOGIN (email, password) VALUES (?, ?)`;
// //         db.query(insertCredentialsSql, [email, password], (err, loginResult) => {
// //             if (err) {
// //                 console.error(err);
// //                 res.end(JSON.stringify({ error: 'Internal Server Error' }));
// //                 return;
// //             }

// //             const insertUserSql = `INSERT INTO USER (email, first_name, middle_initial, last_name, phone_number, date_of_birth, address, apt_num, city, state, zip_code, user_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
// //             db.query(insertUserSql, [email, first_name, middle_initial, last_name, phone_number, date_of_birth, address, apt_num, city, state, zip_code, type], (err, userResult) => {
// //                 if (err) {
// //                     console.error(err);
// //                     res.end(JSON.stringify({ error: 'Internal Server Error' }));
// //                     return;
// //                 }
// //                 res.end(JSON.stringify({ message: 'User added successfully', redirectUrl: '/Login' }));
// //             });
// //         });
// //     });
// // }

// // TODO: Figure out token baloney :P
// function returningUser(req, db, res) {
//     let body = "";

//     console.log("In function")
//     req.on('data', chunk => {
//         body += chunk.toString(); 
//     });

//     req.on('end', () => {
//         console.log('Received login data:', body);
//         const loginData = JSON.parse(body);
//         console.log('Parsed login data:', loginData);
//         const { email, password } = loginData;

//         // Query the database 
//         const sql = "SELECT * FROM LOGIN WHERE email = ? AND password = ?";
//         db.query(sql, [email, password], (err, result) => {
//             if (err) {
//                 console.error(err);
//                 res.statusCode = 500;
//                 res.end(JSON.stringify({ error: 'Internal Server Error' }));
//                 return;
//             }

//             if (result.length === 0) {
//                 // No user found 
//                 res.statusCode = 401;
//                 res.end(JSON.stringify({ error: 'Invalid email or password' }));
//                 return;
//             }

//             // User authenticated 
//             const updateSql = "UPDATE LOGIN SET is_active = 1 WHERE email = ?";
//             db.query(updateSql, [email], (err, updateResult) => {
//                 if (err) {
//                     console.error(err);
//                     res.statusCode = 500;
//                     res.end(JSON.stringify({ error: 'Internal Server Error' }));
//                     return;
//                 }

//                 // Set is_active to 1
//                 res.statusCode = 200;
//                 res.end(JSON.stringify({ message: 'Login successful', redirectUrl: '/Products' }));
//             });
//         });
//     });
// }

// function logoutUser(req, db, res) {
//     let body = '';

//     req.on('data', (chunk) => {
//         body += chunk.toString();
//     });

//     req.on('end', () => {
//         const loginData = JSON.parse(body);
//         console.log('Parsed logout data:', loginData);
//         const { email } = loginData;

//         const updateSql = `UPDATE LOGIN SET is_active = 0 WHERE email = ?`;
//         db.query(updateSql, [email], (err, result) => {
//             if (err) {
//                 console.error(err);
//                 res.statusCode = 500;
//                 res.end(JSON.stringify({ error: 'Internal Server Error' }));
//                 return;
//             }

//             res.statusCode = 200;
//             res.end(JSON.stringify({ message: 'Logout successful' }));
//         });
//     });
// }

// function newEmployee(req, db, res){
//     body = ""
//     req.on('data', chunk => {
//         body += chunk.toString(); // convert Buffer to string
//     });
    
//     req.on('end', () => {
//         console.log('Received data:', body);
//         const userData = JSON.parse(body);
//         console.log('Parsed user data:', userData);
//         const { email, password, first_name, middle_initial, last_name, phone_number, date_of_birth, address, apt_num, city, state, zip_code } = userData;
//         const type = 'Employee'

//         const insertCredentialsSql = `INSERT INTO LOGIN (email, password) VALUES (?, ?)`;
//         db.query(insertCredentialsSql, [email, password], (err, loginResult) => {
//             if (err) {
//                 console.error(err);
//                 res.end(JSON.stringify({ error: 'Internal Server Error' }));
//                 return;
//             }

//             const insertUserSql = `INSERT INTO USER (email, first_name, middle_initial, last_name, phone_number, date_of_birth, address, apt_num, city, state, zip_code, user_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
//             db.query(insertUserSql, [email, first_name, middle_initial, last_name, phone_number, date_of_birth, address, apt_num, city, state, zip_code, type], (err, userResult) => {
//                 if (err) {
//                     console.error(err);
//                     res.end(JSON.stringify({ error: 'Internal Server Error' }));
//                     return;
//                 }
//                 res.end(JSON.stringify({ message: 'User added successfully' }));
//             });
//         });
//     });
// }

// function newManager(req, db, res){
//     body = ""
//     req.on('data', chunk => {
//         body += chunk.toString(); // convert Buffer to string
//     });
    
//     req.on('end', () => {
//         console.log('Received data:', body);
//         const userData = JSON.parse(body);
//         console.log('Parsed user data:', userData);
//         const { email, password, first_name, middle_initial, last_name, phone_number, date_of_birth, address, apt_num, city, state, zip_code } = userData;
//         const type = 'Manager'

//         const insertCredentialsSql = `INSERT INTO LOGIN (email, password) VALUES (?, ?)`;
//         db.query(insertCredentialsSql, [email, password], (err, loginResult) => {
//             if (err) {
//                 console.error(err);
//                 res.end(JSON.stringify({ error: 'Internal Server Error' }));
//                 return;
//             }

//             const insertUserSql = `INSERT INTO USER (email, first_name, middle_initial, last_name, phone_number, date_of_birth, address, apt_num, city, state, zip_code, user_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
//             db.query(insertUserSql, [email, first_name, middle_initial, last_name, phone_number, date_of_birth, address, apt_num, city, state, zip_code, type], (err, userResult) => {
//                 if (err) {
//                     console.error(err);
//                     res.end(JSON.stringify({ error: 'Internal Server Error' }));
//                     return;
//                 }
//                 res.end(JSON.stringify({ message: 'User added successfully' }));
//             });
//         });
//     });
// }

// module.exports = {
//     newUser, 
//     returningUser,
//     newEmployee,
//     newManager,
//     logoutUser,}