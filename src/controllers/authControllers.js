const { mysqldb } = require("../connections");
const { hash, createToken, transporter } = require("../helpers");
const { createTokenEmailVerified, createTokenAccess } = require("../helpers/createToken");
const handlebars = require('handlebars');
const path = require('path');
const fs = require('fs');

module.exports = {
    register: async (req, res) => {
        const { username, password, email } = req.body;
        const conn = await mysqldb.promise().getConnection();
        try {
            // cek username yang sama
            let sql = "select id from users where username = ?";
            const [dataUser] = await conn.query(sql, [username]);
            if (dataUser.length) {
                // username ada yang sama
                throw { message: "username sudah terdaftar" };
            }
            //   username belum terdaftar
            console.log(username, "username belum terdaftar");
            //   insert data to table users
            sql = "insert into users set ?";
            let dataInsert = {
                username,
                password: hash(password),
                email,
            };
            const [result] = await conn.query(sql, [dataInsert]);
            //   get data user terdaftar
            sql = `select id,username,email,isVerified,role_id,user_status from users where id = ?`;
            const [userData] = await conn.query(sql, [result.insertId]);
            //   buat token
            const dataToken = {
                id: userData[0].id,
                username: userData[0].username,
                role_id: userData[0].role_id,
            };
            // relesea connection melepaskan koneksi dari pool
            conn.release();
            const emailToken = createTokenEmailVerified(dataToken);
            const accessToken = createTokenAccess(dataToken);
            //?kirim email verifikasi
            let filepath = path.resolve(__dirname, "../template/emailVerif.html");
            // console.log(filepath);
            // ubah html jadi string pake fs.readfile
            let htmlString = fs.readFileSync(filepath, "utf-8");
            const template = handlebars.compile(htmlString);
            const htmlToEmail = template({
                nama: username,
                token: emailToken,
            });
            console.log(htmlToEmail);
            // email with tamplate html
            // tanpa await jika tidak mau ditunggu kirim emailnya
            transporter.sendMail({
                from: "Naruto <dinotestes12@gmail.com>",
                to: email,
                subject: "Email verifikasi dari hokage Ecommerce",
                html: htmlToEmail,
            });
            // taro token di headers
            res.set("x-token-access", accessToken);
            //   berhasil kirim email baru kasih response
            return res.status(200).send({ ...userData[0], cart: [] });
        } catch (error) {
            conn.release();
            console.log(error);
            return res.status(500).send({ message: error.message || "server error" });
        }
    },
    login: async (req, res) => {
        const { username, password, email } = req.body;
        const conn = await mysqldb.promise().getConnection();
        try {
            let sql = `select id,username,email,isVerified,role_id,user_status from users where username = ? and password`;
            const [userData] = await conn.query(sql, [username, hash(password)]);
            if (!userData.length) {
                // kalo lengthnya 0 maka masuk sini
                throw { message: "username tidak ditemukan" };
            }
            //   buat token
            const dataToken = {
                id: userData[0].id,
                username: userData[0].username,
                role_id: userData[0].role_id,
            };
            const accessToken = createTokenAccess(dataToken);
            //? get Cart tolong cari list cart PR

            //
            conn.release();
            res.set("x-token-access", accessToken);
            //   berhasil kirim email baru kasih response
            return res.status(200).send({ ...userData[0] });
        } catch (error) {
            conn.release();
            console.log(error);
            return res.status(500).send({ message: error.message || "server error" });
        }
    },
    keeplogin: async (req, res) => { },
};