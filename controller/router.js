var express = require("express");
var router = express.Router();
var authLogin = require("./routes/authLogin");
var images = require("./routes/images");

router.use("/authLogin", authLogin);
router.use("/images", images);

module.exports = router;
