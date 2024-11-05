const { setCorsHeaders } = require("../../lib/cors");
const { getRequestBody } = require("../../lib/parseBody")
const http = require('http');
const mysql = require('mysql');
const cors = require('cors');
const querystring = require('querystring');

module.exports = async (req, res) => {
    // console.log("this is the req \n", req);
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
    
    const productData = await getRequestBody(req, res);
    console.log("this is the product data \n", productData);
    const { product_id } = productData;
    const inactiveProductSql = 'UPDATE shoe_product SET inactive = 1 WHERE product_id = ?';
    db.query(inactiveProductSql, [product_id], (err, productResult) => {
        if(err){
            console.error('Error making login inactive:', err);
            res.writeHead(500, { 'Content-Type' : 'application/json' });
            res.end(JSON.stringify({ error: 'Stock Internal Server Error' }));
            return;
        }
        res.writeHead(200, { 'Content-Type' : 'application/json' });
        res.end(JSON.stringify({ message: "Product is now inactive" }));
    })
}