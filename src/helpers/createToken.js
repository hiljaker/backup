const jwt = require('jsonwebtoken');

module.exports = {
    createTokenAccess: (data) => {
        const key = "kiara"
        const token = jwt.sign(data, key, { expiresIn: "12h" })
        return token
    },
    createTokenEmailVerified: (data) => {
        const key = "condong"
        const token = jwt.sign(data, key, { expiresIn: "10m" })
        return token
    },
    createTokenFP: (data) => {
        const key = "khalid"
        const token = jwt.sign(data, key, { expiresIn: "600s" })
        return token
    }
};
