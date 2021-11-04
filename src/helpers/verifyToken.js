const jwt = require('jsonwebtoken');

module.exports.verifyTokenAccess = (req, res, next) => {
    const token = req.token
    const key = "kiara"
    jwt.verify(token, key, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "user unauthorized" });
        }
        req.user = decoded
        next()
    })
}

module.exports.verifyEmailToken = (req, res, next) => {
    console.log(req.token);
    const token = req.token
    const key = "condong"
    jwt.verify(token, key, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "user unauthorized" });
        }
        req.user = decoded
        next()
    })
}

module.exports.verifyTokenFP = (req, res, next) => {
    const token = req.token
    const key = "khalid"
    jwt.verify(token, key, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "user unauthorized" })
        }
        req.user = decoded
        next()
    })
}

