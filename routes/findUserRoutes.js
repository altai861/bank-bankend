const express = require("express");
const router = express.Router()
const findUserControllers = require("../controllers/findUserControllers.js");
const verifyJWT = require("../middleware/verifyJWT.js");

router.use(verifyJWT);

router.route("/")
    .post(findUserControllers.findUser)

module.exports = router