const { setCorsHeaders } = require("../../lib/cors");
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
        console.log('Connected to database, in the function');
    });

    reviewData = await getRequestBody(req, res);
    console.log("Parsed review data: ", reviewData);
    const { product_id, user_id, rating, review } = reviewData;

    const postReviewSql = "INSERT INTO reviews (product_id, review_of_product, review, user_id) VALUES (?, ?, ?, ?)";
    db.query(postReviewSql, [product_id, review, rating, user_id], (err, result) => {
        if (err) {
            console.error('Error inserting review data:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Review Internal Server Error' }));
        }

        console.log('Review data inserted successfully:', result);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Review submitted successfully' }));
    });
}
