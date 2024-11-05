const { setCorsHeaders } = require("../../lib/cors");
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
        console.log('Connected to database, in the function');
    });

    const urlParts = req.url.split('?');
    const queryString = urlParts.length > 1 ? urlParts[1] : '';
    const queryParams = querystring.parse(queryString);
    const email = queryParams.email;
    console.log('Querying for user_id', email);

    const getNotifSql = `SELECT notification_id, message FROM NOTIFICATION WHERE email = ? AND mark_as_read = 0`;
    db.query(getNotifSql, [email], (err, notifResult) => {
        if (err) {
            console.log('Error finding user');
            console.error('Error retrieving user:', err);
            // res.writeHead(500, { 'Content-Type' : 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
            return;
        }
        console.log(notifResult);
        res.writeHead(200, { 'Content-Type' : 'application/json' });
        res.end(JSON.stringify(notifResult));
    });
};