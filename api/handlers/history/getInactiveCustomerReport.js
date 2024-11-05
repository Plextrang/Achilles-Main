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
    });

    db.connect(err => {
        if (err) {
            console.error('Error connecting to database:', err);
            return;
        }
        console.log('Connected to database');
    });

    // fill out this query
    const custQuery = `
    SELECT 
        u.user_id,
        CONCAT_WS(' ', u.first_name, u.middle_initial, u.last_name) AS full_name,
        COUNT(distinct t.transaction_id) AS total_transactions,
        SUM(t.total_cost) AS total_cost_of_purchases,
        SUM(ti.quantity) AS units_bought,
        u.inactive
    FROM 
        user u
    LEFT JOIN 
        transactions t ON u.user_id = t.user_id
    LEFT JOIN 
        transaction_item ti ON t.transaction_id = ti.transaction_id
    WHERE
        u.user_type = 'customer' AND u.inactive = 1
    GROUP BY 
        u.user_id;`;

    db.query(custQuery, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
            return;
        }
        console.log('Query result:', result);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
    });
};
