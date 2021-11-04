const multer = require('multer');
const fs = require('fs');

const uploader = (destination, filenamePrefix) => {
    let defaultPath = "./public"
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            console.log("line 8 isinya", file);
            const dir = defaultPath + destination
            console.log(dir);
            if (fs.existsSync(dir)) {
                console.log("ada");
                cb(null, dir)
            } else {
                fs.mkdir(dir, { recursive: true }, (err) => cb(err, dir))
                console.log(dir, "make");
            }
        },
        filename: (req, file, cb) => {
            let ogName = file.originalname
            let ext = ogName.split(".")
            let filename = filenamePrefix + Date.now() + "." + ext[ext.length - 1]
            cb(null, filename)
        }
    })

    const imgFilter = (req, file, callback) => {
        const ext = /\.(jpg|jpeg|png|gif|pdf|doc|docx|xlsx)$/
        if (!file.originalname.match(ext)) {
            return callback(new Error("only selected file type are allowed"))
        }
        callback(null, true)
    }

    return multer({
        storage: storage,
        fileFilter: imgFilter,
        limits: {
            fileSize: 2 * 1024 * 1024
        }
    })
}

module.exports = uploader