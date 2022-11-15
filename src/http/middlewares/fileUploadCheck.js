const fs = require("fs");

exports.handle = (req, res, next) => {
  try {
    const { size: fileSize, mimeTypes } = req.tunnel;
    const { size, mimetype } = req.file;

    if (size >= fileSize)
      throw new Error("حجم فایل آپلودی بیشتر از حجم مجاز است");

    if (!mimeTypes.includes(mimetype))
      throw new Error("فرمت فایل آپلودی قابل قبول نیست");

    next();
  } catch (error) {
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.log(err);
        console.log("file deleted successfully!");
      });
    }
    return res.status(401).json({
      status: 401,
      success: false,
      message: error.message || "مشکل در آپلودفایل",
    });
  }
};
