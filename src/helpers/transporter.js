const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "hilmawanzaky57@gmail.com", // generated ethereal user
        pass: "xulqgkepfnoeafbh", // generated ethereal password
    },
    tls: {
        rejectUnauthorized: false
    }
});

module.exports = transporter