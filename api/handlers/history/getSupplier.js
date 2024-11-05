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

    //const requestBody = await getRequestBody(req, res);

    const query = `
    SELECT 
        supplier_id, 
        supplier_company_name AS company_name, 
        company_email, 
        company_phone_num AS phone_num, 
        CONCAT(
            street_name, 
            IF(apt_num IS NOT NULL, CONCAT(', Apt. ', apt_num), ''), 
            CASE WHEN apt_num IS NOT NULL THEN ', ' ELSE '. ' END, 
            city, 
            ', ', 
            state, 
            ' ', 
            zip_code
        ) AS full_address
    FROM 
        supplier
    WHERE
        inactive = 0
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
            return;
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(results));
    });
};