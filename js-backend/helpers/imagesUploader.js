const multer = require('multer');
const path = require('path');
const fs = require('fs');
const logger = require('../helpers/logger');

// Check File Type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif|doc|docx|pdf/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb({ message: 'Only Files of type (jpg/jpeg/png/gif/doc/docx/pdf) are accepted' });
  }
}

function upload(folder = '') {
  const filePath = `./public/media/images${folder}`;
  if (!fs.existsSync(filePath)) {
    fs.mkdir(filePath, { recursive: true }, (err) => {
      if (err) logger.error(err);
    });
  }

  // Set The Storage Engine
  const storage = multer.diskStorage({
    destination: function (req, _, cb) {
      cb(null, filePath);
    },
    filename: function (_, file, cb) {
      fs.stat(`${filePath}/${file.originalname}`, (err) => {
        if (err && err.code === 'ENOENT') {
          cb(null, file.originalname);
        } else {
          const fileExt = path.extname(file.originalname);
          const fileNameWithoutExt = file.originalname.replace(fileExt, '');

          const now = Date.now().toString();
          const slicedNow = now.slice(now.length - 4);
          console.log({ slicedNow });
          cb(null, fileNameWithoutExt + '-copy-' + slicedNow + fileExt);
        }
      });
    },
  });

  // Init Upload
  return multer({
    storage: storage,
    limits: { fileSize: 6300000 },
    fileFilter: function (_, file, cb) {
      checkFileType(file, cb);
    },
  });
}

module.exports = upload;
