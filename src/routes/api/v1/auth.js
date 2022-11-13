const { Router } = require("express");
const router = Router();

//* Controllers
const authController = require("../../../http/controllers/v1/authController");

//* Validations
const validator = require("../../../http/validations/v1");

router.post(
  "/register",
  validator.auth.registerValidation,
  authController.registerUser
);

router.post("/login", validator.auth.loginValidation, authController.loginUser);

module.exports = router;
