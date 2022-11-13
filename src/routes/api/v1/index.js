const { Router } = require("express");
const router = Router();

const appRoutes = require("./app");
const authRoutes = require("./auth");

router.use(appRoutes);
router.use("/auth", authRoutes);

//* Error handler
router.use((req, res, next) => {
  return res.status(404).json({
    status: 404,
    success: false,
    message: "صفحه یا آدرس موردنظر یافت نشد",
  });
});

router.use((error, req, res, next) => {
  const statusCode = error?.status || 500;
  const errorMessage =
    error?.message || "مشکلی پیش آمده است-لطفا با پشتیبانی تماس بگیرید";

  return res.status(statusCode).json({
    status: statusCode,
    success: false,
    message: errorMessage,
  });
});

module.exports = router;
