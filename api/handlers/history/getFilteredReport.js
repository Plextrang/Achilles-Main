const mysql = require('mysql');

module.exports = async (req, res) => {
    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    const { start, end } = req.query;

    const db = mysql.createConnection({
        host: "cosc3380-team7.mysql.database.azure.com",
        user: "achilles_admin",
        password: "iFTq^U^!efry3L",
        database: "cosc3380"
    });

    db.connect(err => {
        if (err) {
            console.error('Error connecting to database:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
            return;
        }
        console.log('Connected to database');

        const query = `
            SELECT 
                t.transaction_id,
                t.date_time,
                t.num_of_items,
                t.total_cost,
                u.user_id,
                CONCAT_WS(' ', u.first_name, u.middle_initial, u.last_name) AS full_name,
                u.phone_number
            FROM 
                transactions t
            JOIN 
                user u ON t.user_id = u.user_id
            WHERE 
                DATE(t.date_time) BETWEEN ? AND ?;
        `;
        
        db.query(query, [start, end], (err, result) => {
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
    });
};
