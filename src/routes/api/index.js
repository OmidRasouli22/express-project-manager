const { Router } = require("express");
const router = Router();

const v1Routes = require("./v1");

//* V1 Routes
router.use("/v1", v1Routes);

module.exports = router;
