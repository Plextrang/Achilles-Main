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
    clearData = await getRequestBody(req, res);
    console.log('Parsed order data:', clearData);
    
    const { email } = clearData;

    const getUserSql = `SELECT user_id FROM USER WHERE email = ?`;
    db.query(getUserSql, [email], (err, userResult) => {
        if (err) {
            console.log('Error finding user');
            console.error('Error retrieving user:', err);
            res.writeHead(500, { 'Content-Type' : 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
            return;
        }

        if (userResult.length === 0) {
            console.log('No user');
            res.statusCode = 401;
            res.end(JSON.stringify({ error: 'User not found' }));
            return;
        }

        const user_id = userResult[0].user_id;

        const deleteCartItemsSql = `DELETE FROM CART_ITEM WHERE user_id = ?`;
        db.query(deleteCartItemsSql, [user_id], (err, deleteResult) => {
            if (err) {
                console.log('Error deleting cart items');
                console.error('Error deleting cart items:', err);
                res.writeHead(500, { 'Content-Type' : 'application/json' });
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
                return;
            }
            console.log(`Deleted ${deleteResult.affectedRows} cart items for user with user_id ${user_id}`);
            res.statusCode = 200;
            res.end(JSON.stringify({ message: 'Cart items deleted successfully' }));
        });
    });
}
