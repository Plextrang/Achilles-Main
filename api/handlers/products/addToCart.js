const { setCorsHeaders } = require("../../lib/cors");
const { getRequestBody } = require("../../lib/parseBody");
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
        console.log('Connected to database, in the function');
    });

    console.log('Attempting to get request body');
    const productData = await getRequestBody(req, res);
    console.log('Parsed product data:', productData);

    const { email, ...productInfo } = productData;

    console.log('Querying for user_id', email);

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

        // Check if the user_id and product_id combination exists in CART_ITEM
        const checkCartItemSql = `SELECT * FROM CART_ITEM WHERE user_id = ? AND product_id = ?`;
        db.query(checkCartItemSql, [user_id, productInfo.product_id], (err, cartItemResult) => {
            if (err) {
                console.error('Error checking cart item:', err);
                res.writeHead(500, { 'Content-Type' : 'application/json' });
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
                return;
            }

            if (cartItemResult.length > 0) {
                // If the combination exists, update the quantity
                const existingQuantity = cartItemResult[0].quantity;
                const newQuantity = existingQuantity + productInfo.quantity;
                const updateCartItemSql = `UPDATE CART_ITEM SET quantity = ? WHERE user_id = ? AND product_id = ?`;
                db.query(updateCartItemSql, [newQuantity, user_id, productInfo.product_id], (err, updateResult) => {
                    if (err) {
                        console.error('Error updating cart item:', err);
                        res.writeHead(500, { 'Content-Type' : 'application/json' });
                        res.end(JSON.stringify({ error: 'Internal Server Error' }));
                        return;
                    }
                    res.writeHead(200, { 'Content-Type' : 'application/json' });
                    res.end(JSON.stringify({ message: 'Quantity updated successfully' }));
                });
            } else {
                // If the combination doesn't exist, insert a new record
                const insertCartItemSql = `INSERT INTO CART_ITEM (user_id, quantity, product_id) VALUES (?, ?, ?)`;
                db.query(insertCartItemSql, [user_id, productInfo.quantity, productInfo.product_id], (err, insertResult) => {
                    if (err) {
                        console.error('Error inserting cart item:', err);
                        res.writeHead(500, { 'Content-Type' : 'application/json' });
                        res.end(JSON.stringify({ error: 'Internal Server Error' }));
                        return;
                    }
                    res.writeHead(200, { 'Content-Type' : 'application/json' });
                    res.end(JSON.stringify({ message: 'Product added to cart successfully' }));
                });
            }
        });
    });
};