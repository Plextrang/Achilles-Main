const { getRequestBody } = require("../../lib/parseBody");
const { sendEmail } = require("../../lib/emailer");
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
    });

    db.connect(err => {
        if (err) {
          console.error('Error connecting to database:', err);
          return;
        }
        console.log('Connected to database');
    });

    orderData = await getRequestBody(req, res);
    console.log('Parsed order data:', orderData);
    
    const { totalPrice, cartItems, datetime, email, num_items, card_number, cardholder_name, billing_address, security_code, billing_city, bill_state, bill_zip } = orderData;

    let user_id = 0;

    const getUserSql = `SELECT user_id FROM USER WHERE email = ?`;
    db.query(getUserSql, [email], (err, userResult) => {
        if (err) {
            console.log('Error finding user');
            console.error('Error retrieving user:', err);
            res.writeHead(500, { 'Content-Type' : 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
            return;
        }

        if (userResult.length === 0) {
            console.log('No user');
            res.statusCode = 401;
            res.end(JSON.stringify({ error: 'User not found' }));
            return;
        }

        const user_id = userResult[0].user_id;

        console.log("Queried User_ID is: ", user_id);

        let method_id = 0;
        let totalCost = totalPrice; // alter this line if discounts r added.
        const checkPaymentMethodSql = `SELECT method_id FROM PAYMENT_METHOD WHERE user_id = ? AND card_number = ?`;
        db.query(checkPaymentMethodSql, [user_id, card_number], (err, paymentCheckResult) => {
            if (err) {
                console.error('Error checking payment method:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
                return;
            }

            if (paymentCheckResult.length > 0) {
                // Payment method already exists, do not insert again
                method_id = paymentCheckResult[0].method_id;
                console.log("Payment method already exists for user");
                // Proceed with the transaction insertion or any other logic
            } else {
                // Payment method does not exist, insert it
                const insertPaymentSql = `INSERT INTO PAYMENT_METHOD (card_number, cardholder_name, billing_address, security_code, billing_city, bill_state, bill_zip, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
                db.query(insertPaymentSql, [card_number, cardholder_name, billing_address, security_code, billing_city, bill_state, bill_zip, user_id], (err, paymentResult) => {
                    if (err) {
                        console.error('Error inserting payment method:', err);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Payment Internal Server Error' }));
                        return;
                    }
                    method_id = paymentResult.insertId;
                    console.log("Inserted new payment method for user");
                    // Proceed with the transaction insertion or any other logic
                });
            }

            console.log("Queried mathod_id is: ", method_id);
            let transactionId = 0;
            const transactionSql = `INSERT INTO TRANSACTIONS (date_time, num_of_items, price_of_cart, total_cost, method_id, user_id) VALUES (?, ?, ?, ?, ?, ?)`;
            db.query(transactionSql, [datetime, num_items, totalPrice, totalCost, method_id, user_id], (err, result) => {
                if (err) {
                    console.error('Error inserting transaction data:', err);
                    res.writeHead(500, { 'Content-Type' : 'application/json' });
                    res.end(JSON.stringify({ error: 'Transaction Internal Server Error' }));
                   
                }
                
                transactionId = result.insertId;
                discount = 0;
                
                console.log("Transaction ID is: ", transactionId);
                
                cartItems.forEach((cartItem, index) => {
                    let { product_id, quantity } = cartItem;
                    console.log("This is the cart item added: ", cartItem);
                    console.log("New product_id: ", product_id);
                    
                    const updateStockSql = `UPDATE shoe_product SET stock = stock - ? WHERE product_id = ?`;
                    db.query(updateStockSql, [quantity, product_id], (err, updateResult) => {
                        if (err) {
                            console.error('Error updating stock:', err);
                            res.writeHead(500, { 'Content-Type' : 'application/json' });
                            res.end(JSON.stringify({ error: 'Stock Internal Server Error' }));
                            return;
                        }
                        const lowStockSql = 'SELECT low_stock_flag, item_name, manager_email FROM shoe_product WHERE product_id = ?';
                        db.query(lowStockSql, [product_id], (err, flagResult) => {
                            if (err) {
                                console.error('Error inserting transaction item:', err);
                                res.writeHead(500, { 'Content-Type' : 'application/json' });
                                res.end(JSON.stringify({ error: 'Flag Internal Server Error' }));
                                return;
                            }
                            console.log("This is the flag result:", flagResult);
                            const flag = flagResult[0].low_stock_flag;
                            console.log("Flag Bool is: ", flag);
                            if(flag === 1){
                                const productName = flagResult[0].item_name;
                                const managerEmail = flagResult[0].manager_email;
                                sendEmail(productName, managerEmail);
                            }
                        
                            let transactionItemSql = `INSERT INTO TRANSACTION_ITEM (transaction_id, product_id, quantity) VALUES (?, ?, ?)`;
                            db.query(transactionItemSql, [transactionId, product_id, quantity], (err, result) => {
                                if (err) {
                                    console.error('Error inserting transaction item:', err);
                                    res.writeHead(500, { 'Content-Type' : 'application/json' });
                                    res.end(JSON.stringify({ error: 'Transaction Item Internal Server Error' }));
                                    return;
                                }
                                
                                console.log("Entered product-id: ", product_id);
                                const discountSql = 'SELECT discount FROM TRANSACTIONS WHERE transaction_id = ?';
                                db.query(discountSql, [transactionId], (err, discountResult) => {
                                    if (err) {
                                        console.error('Error inserting transaction data:', err);
                                        res.writeHead(500, { 'Content-Type' : 'application/json' });
                                        res.end(JSON.stringify({ error: 'Discount Internal Server Error' }));
                                        return;
                                    }
                                    console.log("This is the discount result:", discountResult);
                                    const discount = discountResult[0].discount;
                                    console.log("Discount Bool is: ", discount);
                                    
                                    if (index === cartItems.length - 1) {
                                        if (discount) {
                                            res.writeHead(210, { 'Content-Type' : 'application/json' });
                                            res.end(JSON.stringify({ message: "Transaction was made successfully with discount!" }));
                                        } else {
                                            res.end(JSON.stringify({ message: "Transaction was made successfully" }));
                                        }
                                    }
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    // old way of processing after transactions insert:
    // if (err) {
    //     if (err.code === 'ER_SIGNAL_EXCEPTION') {
    //         // Handle signal exception here
    //         console.error("Signal exception:", err);
    //         res.writeHead(210, { 'Content-Type' : 'application/json' });
    //         res.end(JSON.stringify({ error: 'Discount Applied' }));
    //     } else {
    //     console.error('Error inserting transaction data:', err);
    //     res.writeHead(500, { 'Content-Type' : 'application/json' });
    //     res.end(JSON.stringify({ error: 'Internal Server Error' }));
    //     return;
    //     }
    // }

    // transactionId = result.insertId;

    // console.log("Transaction ID is: ", transactionId);

    // cartItems.forEach((cartItem, index) => { // Attemping index logic cuz nothing else worked
    //     let { product_id, quantity } = cartItem;
    //     console.log("This is the cart item added: ", cartItem);
    //     console.log("New product_id: ", product_id);
        
    //     let transactionItemSql = `INSERT INTO TRANSACTION_ITEM (transaction_id, product_id, quantity) VALUES (?, ?, ?)`;
    //     db.query(transactionItemSql, [transactionId, product_id, quantity], (err, result) => {
    //         if (err) {
    //             console.error('Error inserting transaction item:', err);
    //             res.writeHead(500, { 'Content-Type' : 'application/json' });
    //             res.end(JSON.stringify({ error: 'Internal Server Error' }));
    //             return;
    //         }
    //         console.log("Entered product-id: ", product_id);
    //         if (index === cartItems.length - 1) {
    //             res.end(JSON.stringify({ message: "Transaction was made successfully" }));
    //         }
    //     });
    // });

    // cartItems.forEach(cartItem => {
    //     let { product_id, quantity } = cartItem;
    //     console.log("This is the cart item added: ", cartItem);
    //     console.log("New product_id: ", product_id);
        
    //     let transactionItemSql = `INSERT INTO TRANSACTION_ITEM (transaction_id, product_id, quantity) VALUES (?, ?, ?)`;
    //     db.query(transactionItemSql, [transactionId, product_id, quantity], (err, result) => {
    //         if (err) {
    //             console.error('Error inserting transaction item:', err);
    //             res.writeHead(500, { 'Content-Type' : 'application/json' });
    //             res.end(JSON.stringify({ error: 'Internal Server Error' }));
    //             return;
    //         }
    //         console.log("Entered product-id: ", product_id);
    //     });
    // });
    // res.end(JSON.stringify({ message: "Transaction was made successfully" }));


    // const getUserSql = `SELECT user_id FROM USER WHERE email = ?`;
    // db.query(getUserSql, [email], (err, userResult) => {
    //     if (err) {
    //         console.log('Error finding user');
    //         console.error('Error retrieving user:', err);
    //         res.writeHead(500, { 'Content-Type' : 'application/json' });
    //         res.end(JSON.stringify({ error: 'Internal Server Error' }));
    //         return;
    //     }

    //     if (userResult.length === 0) {
    //         console.log('No user');
    //         res.statusCode = 401;
    //         res.end(JSON.stringify({ error: 'User not found' }));
    //         return;
    //     }

    //     const user_id = userResult[0].user_id;

    //     const insertPaymentSql = `INSERT INTO PAYMENT_METHOD (card_number, cardholder_name, billing_address, security_code, billing_city, bill_state, bill_zip, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    //     db.query(insertPaymentSql, [card_number, cardholder_name, billing_address, security_code, billing_city, bill_state, bill_zip, user_id], (err, paymentResult) => {
    //         if (err) {
    //             console.error('Error inserting payment method:', err);
    //             res.writeHead(500, { 'Content-Type': 'application/json' });
    //             res.end(JSON.stringify({ error: 'Internal Server Error' }));
    //             return;
    //         }
    
    //         const method_id = paymentResult.insertId;
    //         const totalCost = totalPrice; // alter this if totalPrice has discounts

    //         const transactionSql = `INSERT INTO TRANSACTIONS (date_time, num_of_items, price_of_cart, total_cost, method_id, user_id) VALUES (?, ?, ?, ?, ?, ?)`;
    //         db.query(transactionSql, [datetime, num_items, totalPrice, totalCost, method_id, user_id], (err, result) => {
    //             if (err) {
    //                 console.error('Error inserting transaction data:', err);
    //                 res.writeHead(500, { 'Content-Type' : 'application/json' });
    //                 res.end(JSON.stringify({ error: 'Internal Server Error' }));
    //                 return;
    //             }

    //             const transactionId = result.insertId; 

    //             cartItems.forEach(cartItem => {
    //                 let { product_id, quantity } = cartItem;
    //                 console.log("This is the cart item added: ", cartItem);
    //                 console.log("New product_id: ", product_id);
                    
    //                 let transactionItemSql = `INSERT INTO TRANSACTION_ITEM (transaction_id, product_id, quantity) VALUES (?, ?, ?)`;
    //                 db.query(transactionItemSql, [transactionId, product_id, quantity], (err, result) => {
    //                     if (err) {
    //                         console.error('Error inserting transaction item:', err);
    //                         res.writeHead(500, { 'Content-Type' : 'application/json' });
    //                         res.end(JSON.stringify({ error: 'Internal Server Error' }));
    //                         return;
    //                     }
    //                     console.log("Entered product-id: ", product_id);
    //                 });
    //             });
    //             res.end(JSON.stringify({ message: "Transaction was made successfully" }));
    //         });
    //     });
    // });
}