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
    userData = await getRequestBody(req, res);
        console.log('Parsed user data:', userData);
        const { email, password, first_name, middle_initial, last_name, phone_number, date_of_birth, address, apt_num, city, state, zip_code, salary, e_ssn } = userData;
        const type = 'Manager'

        const insertCredentialsSql = `INSERT INTO LOGIN (email, password) VALUES (?, ?)`;
        db.query(insertCredentialsSql, [email, password], (err, loginResult) => {
            if (err) {
                console.error(err);
                res.writeHead(404, { 'Content-Type' : 'application/json' });
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
                return;
            }

            const insertUserSql = `INSERT INTO USER (email, first_name, middle_initial, last_name, phone_number, date_of_birth, address, apt_num, city, state, zip_code, user_type, salary, e_ssn) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            db.query(insertUserSql, [email, first_name, middle_initial, last_name, phone_number, date_of_birth, address, apt_num, city, state, zip_code, type, salary, e_ssn], (err, userResult) => {
                if (err) {
                    console.error(err);
                    res.writeHead(404, { 'Content-Type' : 'application/json' });
                    res.end(JSON.stringify({ error: 'Internal Server Error' }));
                    return;
                }
                res.writeHead(200, { 'Content-Type' : 'application/json' });
                res.end(JSON.stringify({ message: 'User added successfully' }));
            });
        });
}