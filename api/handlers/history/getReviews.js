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
        console.log('Connected to database');
    });

    const urlParts = req.url.split('?');
    const queryString = urlParts.length > 1 ? urlParts[1] : '';
    const queryParams = querystring.parse(queryString);
    const product_id = queryParams.product_id;
    console.log('Querying for product_id', product_id);

    const query = `
        SELECT 
            r.review_id,
            r.review_of_product,
            r.review,
            CONCAT_WS(' ', u.first_name, u.last_name) AS full_name
        FROM 
            reviews r
        LEFT JOIN 
            user u ON r.user_id = u.user_id
        WHERE
            r.product_id = ?;
    `;

    db.query(query, [product_id], (err, result) => {
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