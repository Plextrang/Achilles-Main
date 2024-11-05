// TODO: Figure out token baloney :P
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
    loginData = await getRequestBody(req, res);
        const { email, password } = loginData;

        // Query the database 
        const sql = "SELECT * FROM LOGIN WHERE email = ? AND password = ?  AND inactive = 0";
        db.query(sql, [email, password], (err, result) => {
            if (err) {
                console.error(err);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
                return;
            }

            if (result.length === 0) {
                // No user found 
                res.statusCode = 401;
                res.end(JSON.stringify({ error: 'Invalid email or password' }));
                return;
            }

            // User authenticated 
            const updateSql = "UPDATE LOGIN SET is_active = 1 WHERE email = ?";
            db.query(updateSql, [email], (err, updateResult) => {
                if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    res.end(JSON.stringify({ error: 'Internal Server Error' }));
                    return;
                }

                const querysql = "SELECT user_type FROM USER WHERE email = ?"
                db.query(querysql, [email], (err, queryRes) => {
                    if (err) {
                        console.error(err);
                        res.statusCode = 500;
                        res.end(JSON.stringify({ error: 'Internal Server Error' }));
                        return;
                    }

                    if(queryRes.length === 0) {
                        res.statusCode = 401;
                        res.end(JSON.stringify({ error: 'User Type does not exist' }));
                        return;
                    }
                    // Set is_active to 1
                    res.statusCode = 200;
                    console.log(queryRes);
                    res.end(JSON.stringify({ message: 'Login successful', redirectUrl: '/Products', userType: queryRes }));
                });
            });
        });
}