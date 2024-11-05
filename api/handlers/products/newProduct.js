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
        console.log('Parsed product data:', productData);
        const { item_name, description, price, color_option, size, stock, category_name, image_filename, email } = productData;

        // Generate a random product ID
        const generateRandomProductId = () => {
            return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000; // four digits for now
        };

        // check if a product ID already exists 
        const isProductIdExists = async (db, productId) => {
            return new Promise((resolve, reject) => {
                const sql = "SELECT COUNT(*) AS count FROM SHOE_PRODUCT WHERE product_id = ?";
                db.query(sql, [productId], (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(result[0].count > 0);
                });
            });
        };

        // Generate a unique product_id
        let productId = generateRandomProductId();
        while (await isProductIdExists(db, productId)) {
            productId = generateRandomProductId();
        }

        const getRandomInventoryId = async () => {
            return new Promise((resolve, reject) => {
                const sql = "SELECT inventory_id FROM INVENTORY ORDER BY RAND() LIMIT 1";
                db.query(sql, (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(result[0].inventory_id);
                });
            });
        };

        // Insert the new product with the generated product_id and a random inventory_id
        const inventoryId = await getRandomInventoryId();
        const insertProductSql = `INSERT INTO SHOE_PRODUCT (product_id, item_name, description, price, color_option, size, stock, inventory_id, category_name, image_filename, manager_email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        db.query(insertProductSql, [productId, item_name, description, price, color_option, size, stock, inventoryId, category_name, image_filename, email], (err, result) => {
            if (err) {
                console.error(err);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
                return;
            }

            res.statusCode = 200;
            res.end(JSON.stringify({ message: 'Product added successfully' }));
        });
}