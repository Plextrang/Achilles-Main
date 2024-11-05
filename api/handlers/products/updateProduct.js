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
    productData = await getRequestBody(req, res);

    const updateProductSql = `UPDATE SHOE_PRODUCT SET price = ?, stock = ? WHERE product_id = ?`;
    db.query(updateProductSql, [productData.price, productData.stock, productData.product_id], (err, result) => {
        if (err) {
            console.error(err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
            return;
        }

        if (result.affectedRows === 0) {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'Product not found' }));
            return;
        }

        res.statusCode = 200;
        res.end(JSON.stringify({ message: 'Product price updated successfully' }));
    });
}