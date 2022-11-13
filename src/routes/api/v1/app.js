const { Router } = require("express");
const router = Router();

//* Controllers
const userController = require("../../../http/controllers/v1/userController");

//* Middlewares
const userAuthenticate = require("../../../http/middlewares/userAuthenticate");

//* Validations
const validation = require("../../../http/validations/v1");

router.get(
  "/user/profile",
  userAuthenticate.handle,
  userController.getUserProfile
);

router.post(
  "/edit/user/profile",
  userAuthenticate.handle,
  validation.user.editProfile,
  userController.editProfile
);

module.exports = router;
