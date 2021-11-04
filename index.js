const express = require('express');
const app = express()
require('dotenv').config()
const port = process.env.port || 5005
const cors = require('cors');
const bearer = require('express-bearer-token');
const morgan = require('morgan');
const { mysqldb } = require('./src/connections');
const { authRoutes } = require('./src/routes');

morgan.token("date", (req, res) => {
    return new Date()
})

app.use(
    morgan(":method :url :status :res[content-length] - :response-time ms :date")
)

app.use(express.json());
// klo corsnya "cors()" artinya allow semua ip
app.use(
    cors({
        exposedHeaders: ["x-token-access", "x-token-refresh", "x-total-count"],
    })
);
app.use(bearer())
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.send("<h1>WELCOME TO API ECOMMERCE</h1>");
});
// contoh penggunakan mysql pooling
app.get("/role", async (req, res) => {
    try {
        const conn = await mysqldb.promise();
        const [result] = await conn.query("select * from role");
        // conn.release(); //jika menggunakan getconncetion
        res.send(result);
    } catch (error) {
        console.log(error);
        conn.release();
        res.status(500).send(result);
    }
});

app.use("/auth", authRoutes);

app.listen(port, () => console.log(`API JALAN DI port ${PORT}`));