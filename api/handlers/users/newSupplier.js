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
    })
    db.connect(err => {
        if (err) {
          console.error('Error connecting to database:', err);
          return;
        }
        console.log('Connected to database');
    });
    supData = await getRequestBody(req, res);
    const { supplier_name, supplier_email, supplier_phone, supplier_street, supplier_city, supplier_state, supplier_zip } = supData;

    const insertQuery = `INSERT INTO supplier (supplier_company_name, company_email, company_phone_num, street_name, city, state, zip_code) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
    db.query(insertQuery, [supplier_name, supplier_email, supplier_phone, supplier_street, supplier_city, supplier_state, supplier_zip], (err, result) => {
        if (err) {
            console.error('Error inserting supplier data:', err);
            res.writeHead(500, { 'Content-Type' : 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
            return;
        }
        console.log('Supplier data inserted successfully');
        res.writeHead(200, { 'Content-Type' : 'application/json' });
        res.end(JSON.stringify({ message: 'Supplier data inserted successfully' }));
    });
}