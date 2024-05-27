const multer = require("multer");
const uploadController = require("express").Router();
const fs = require("fs");
const path = require('path')




const upload = multer({
    dest: 'public/project/files/', limits: {
        fileSize: 15 * 1024 * 1024, // 5MB in bytes
    },
});

// upload single image it should contain req.body
uploadController.post("/project/file/:id", upload.array('files'), async (req, res) => {
    try {
        let files = req.files;
        console.log(files);

        files = files.map(file => {
            if (file.originalname) {
                const filename = file.originalname
                const filepath = path.join(__dirname, '../', file.path)
                const destinationPath = path.join(__dirname, '../public/project/files/', filename);
                console.log(JSON.stringify({
                    filepath,
                    destinationPath
                }, null, 4))

                fs.renameSync(filepath, destinationPath, err => {
                    if (err) {
                        console.log(err);
                    }
                });
                return {
                    filename,
                    filepath: 'project/files/' + filename,
                    size: file.size,
                    mimetype: file.mimetype
                }
            }
        });
        return res.status(200)
            .json({
                msg: "File uploaded successfully",
                status: true,
                files
            });
    } catch (error) {
        return res.status(200)
            .json({
                msg: "File upload Failed",
                error: error.message,
                status: false,

            });
    }
});
module.exports = uploadController