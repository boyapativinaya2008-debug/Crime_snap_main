const multer = require("multer");

/* STORAGE */

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() +
      "-" +
      file.originalname
    );
  },
});

/* FILE FILTER */

const fileFilter = (req, file, cb) => {

  console.log(file.mimetype);

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
  ];

  if (
    allowedTypes.includes(file.mimetype)
  ) {

    cb(null, true);

  } else {

    cb(
      new Error(
        `File type ${file.mimetype} not allowed`
      ),
      false
    );
  }
};

/* UPLOAD */

const upload = multer({

  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter,
});

/* EXPORT */

module.exports = upload;