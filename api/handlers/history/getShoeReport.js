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

    const sortMethod = req.query.method === 'unitsSold' ? 'units_sold' : 'total_sales';

    let salesQuery = ``;

    if(sortMethod === 'units_sold') {
        salesQuery = `SELECT 
                        sp.item_name,
                        sp.product_id,
                        SUM(ti.quantity) AS units_sold,
                        SUM(ti.quantity * sp.price) AS total_sales,
                        sp.stock
                    FROM 
                        shoe_product sp
                    LEFT JOIN 
                        transaction_item ti ON sp.product_id = ti.product_id
                    WHERE 
                        sp.inactive = 0
                    GROUP BY 
                        sp.product_id
                    ORDER BY 
                        units_sold DESC;
                    `;
    }
    else {
        salesQuery = `SELECT 
                        sp.item_name,
                        sp.product_id,
                        SUM(ti.quantity) AS units_sold,
                        SUM(ti.quantity * sp.price) AS total_sales,
                        sp.stock
                    FROM 
                        shoe_product sp
                    LEFT JOIN 
                        transaction_item ti ON sp.product_id = ti.product_id
                    WHERE 
                        sp.inactive = 0
                    GROUP BY 
                        sp.product_id
                    ORDER BY 
                        total_sales DESC;
                    `;
    }

    db.query(salesQuery, (err, result) => {
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