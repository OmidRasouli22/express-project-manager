const multer = require("multer");
const mkdirp = require("mkdirp");

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = getDir();
    mkdirp(dest)
      .then((made) => {
        cb(null, dest);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  filename: (req, file, cb) => {
    const name = Math.floor(Math.random() * 10000) + "-" + file.originalname;
    cb(null, name);
  },
});

const imageLimits = {
  fieldSize: 1024 * 1024,
};

const fileFilter = (req, file, cb) => {
  // console.log(file);
  const acceptedMimetypes = [
    "image/jpg",
    "image/jpeg",
    "image/png",
    "image/svg",
  ];
  if (acceptedMimetypes.includes(file.mimetype)) {
    return cb(null, true);
  } else {
    return cb(
      null,
      false,
      req.flash("errors", "فایل با پسوند وارد شده پشتیبانی نمی شود")
    );
  }
};

const getDir = () => {
  const date = new Date();
  return `./public/uploads/${date.getFullYear()}/${
    date.getMonth() + 1
  }/${date.getDate()}`;
};

const upload = multer({
  storage: imageStorage,
  limits: imageLimits,
  fileFilter: fileFilter,
});

module.exports = upload;
