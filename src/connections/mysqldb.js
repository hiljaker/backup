const mysql = require("mysql2");

const connection = mysql.createPool({
    port: 3306,
    connectionLimit: 10,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: "ecomjc18",
});

connection.getConnection((err, conn) => {
    if (err) {
        conn.release();
        console.error("error connecting: " + err.stack);
        return;
    }
    console.log("connected as id " + conn.threadId);
    conn.release();
});

module.exports = connection;