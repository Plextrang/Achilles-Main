const { getRequestBody } = require("../../lib/parseBody");
const http = require('http');
const mysql = require('mysql');
const cors = require('cors');
const querystring = require('querystring');
const { userInfo } = require("os");

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
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
            return;
        }
        console.log('Connected to database');
    });

    const { email } = req.query;
    console.log('Received email:', email);

    const getUserSql = `SELECT user_id, first_name, last_name, address, city, state, zip_code, phone_number FROM \`USER\` WHERE email = ?`;
    db.query(getUserSql, [email], (err, userResult) => {
        if (err) {
            console.log('Error finding user');
            console.error('Error retrieving user:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
            return;
        }
    
        if (userResult.length === 0) {
            console.log('No user');
            res.statusCode = 401;
            res.end(JSON.stringify({ error: 'User not found' }));
            return;
        }
    
        console.log('User found:', userResult[0]);

        // Now, let's fetch the user's transaction history
        const getUserHistorySql = `
            SELECT 
                t.transaction_id,
                t.date_time,
                ti.product_id,
                sp.item_name,
                sp.price,
                sp.image_filename
            FROM 
                TRANSACTIONS t
            JOIN 
                TRANSACTION_ITEM ti ON t.transaction_id = ti.transaction_id
            JOIN 
                SHOE_PRODUCT sp ON ti.product_id = sp.product_id
            WHERE 
                t.user_id = ?
            ORDER BY t.transaction_id desc;
        `;
        
        db.query(getUserHistorySql, [userResult[0].user_id], (err, transactionResults) => {
            if (err) {
                console.error('Error retrieving user history:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
                return;
            }

            console.log(transactionResults);
            // Combine user information and transaction history
            const userDataWithHistory = {
                ...userResult[0],
                transactions: transactionResults
            };

            // Send the combined data as the response
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(userDataWithHistory));

            // Close the database connection
            db.end();
        });
    });
};