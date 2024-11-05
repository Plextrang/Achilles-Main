const { setCorsHeaders } = require("../../lib/cors");
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

    const urlParts = req.url.split('?');
    const queryString = urlParts.length > 1 ? urlParts[1] : '';
    const queryParams = querystring.parse(queryString);
    const email = queryParams.email;
    const productId = queryParams.productId;

    console.log('Removing product from cart for user:', email, 'Product ID:', productId);

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

        const userId = userResult[0].user_id;
        console.log("UserID is: ", userId);

        const removeProductSql = `DELETE FROM CART_ITEM WHERE user_id = ? AND product_id = ?`;
        db.query(removeProductSql, [userId, productId], (err, result) => {
            if (err) {
                console.error('Error removing product from cart:', err);
                res.writeHead(500, { 'Content-Type' : 'application/json' });
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
                return;
            }

            if (result.affectedRows === 0) {
                res.writeHead(404, { 'Content-Type' : 'application/json' });
                res.end(JSON.stringify({ error: 'Product not found in cart' }));
                return;
            }
            console.log("Affected Rows: ", result.affectedRows);
            res.writeHead(200, { 'Content-Type' : 'application/json' });
            res.end(JSON.stringify({ message: 'Product removed from cart successfully' }));
        });
        
        res.writeHead(200, { 'Content-Type' : 'application/json' });
        res.end(JSON.stringify({ message: 'Product removed from cart successfully' }));
    });
};
