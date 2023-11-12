const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const uploadDir = path.join(process.cwd(), '../images');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    callback(null, uploadDir);
  },

  filename: (req, file, callback) => {
    const fileName = `${Date.now()}${path.extname(file.originalname)}`;
    console.log(path.extname(file.originalname));
    callback(null, fileName);
  },
});

module.exports = {
  image: multer({
    storage: storage,

    // add file filter
    fileFilter: (req, file, callback) => {
      if (
        file.mimetype == 'image/png' ||
        file.mimetype == 'image/jpg' ||
        file.mimetype == 'image/jpeg'
      ) {
        // izinkan upload
        callback(null, true);
      } else {
        // return error
        const err = new Error('only png, jpg, and jpeg allowed to upload!');
        callback(err, false);
      }
    },

    onError: (err) => {
      throw err;
    },
  }),
};
